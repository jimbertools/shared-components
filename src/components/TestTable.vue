<template>
  <table class='min-w-full bg-white dark:bg-gray-800'>
    <thead class='sticky top-0'>
      <tr class='w-full h-16 border-gray-300 border-b py-8'>
        <th
          class='text-gray-600 dark:text-gray-400 font-normal pr-6 text-left text-sm tracking-normal leading-4 cursor-pointer hover:text-gray-400'
          :class='{ width: header.width }'
          v-for='header in headers'
          @click='sortData(String(header.key))'
          :key='header.key'>
          <slot :name='`header-${header}`' :header='header'>
          {{ header.displayName }}
          </slot>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for='data in dataList' :key='data'
          class='h-12 border-gray-300 border-t cursor-pointer'
          :class='{
            "hover:bg-gray-100" : !isDragging ,
            "bg-blue-100 hover:bg-blue-50" : selectedDatas.includes(data),
            "border-t-2 border-b-2 border-yellow-400": data.isFolder
                && draggingOverData == data
                && !selectedDatas.includes(data)}'
          @click.ctrl='(e)=>addItemToSelect(data)' @click.exact='(e)=>selectItem(data)'
          @click.shift='(e)=>selectRange(data)'
          @dblclick='(e)=>openItem'
          draggable='true' @drop.prevent='(e)=>dragDrop(data)'
          @dragstart='(e)=>dragStart(data)' @dragover.prevent='(e)=>dragOver(data)'>
          <td v-for='header in headers' :data-name='`data-${header.key}`' :key='data[header.key]'
              class='text-sm pr-6 whitespace-no-wrap text-gray-800 dark:text-gray-100 tracking-normal leading-4'>
            <slot :name='`data-${header.key}`' :data='data[header.key]' :row='data'>
            {{ header.formatter ? header.formatter(data) : data[header.key] }}
            </slot>
          </td>
      </tr>
    </tbody>
  </table>

  <div class="block" v-if="withPagination">
    <el-pagination
      :page-sizes="[10, 20, 50, 100]"
      :page-size="currentPageSize"
      :current-page="currentPage"
      :total="!total && data ? data.length : total"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChanged"
      @current-change="handlePageChanged"
      >
    </el-pagination>
  </div>
</template>

<script lang="ts">

  import { computed, defineComponent, PropType, ref } from 'vue';
  import { IHeader, ISort, TEntry, IMoveItems } from '../types/FileManagerTypes';
  import { orderBy } from '../infrastructure/utils/SortUtil';
  import { ElPagination } from 'element-plus';

  export enum Emits {
    RowClicked = 'clickedRow',
    SortChanged = 'sort-changed',
    PageChanged = 'page-changed',
    PageSizeChanged = 'page-size-changed',
    MoveItems = 'move-items',
    SelectedItems = 'selected-items',
    OpenItem = 'open-item',
  }

  export default defineComponent({
    name: 'TestTable',
    props: {
      data: { type: Array as () => any[], required: true },
      headers: { type: Object as () => IHeader<any>[], required: true },
      page: { type: Number, required: false, default: 1 },
      pageSize: { type: Number, required: false, default: 10 },
      total: { type: Number, required: false },
      backendPaginationSorting: { type: Boolean, required: false, default: false },
      withPagination: { type: Boolean, required: false, default: false },
      defaultSort: { type: Object as PropType<ISort>, required: false },
      rowClass: { type: String, required: false },
    },
    components: { ElPagination },

    emits: Object.values(Emits),
    setup(props, { emit }) {
      const sort = ref<ISort | undefined>(props.defaultSort);
      const currentPage = ref<number>(props.page);
      const currentPageSize = ref<number>(props.pageSize);
      const dataList = computed(() => {
        let tempData = props.data;
        if (props.backendPaginationSorting) return tempData;

        if (sort.value) tempData = orderBy(tempData, sort.value, props.headers);

        if (props.withPagination) tempData = tempData.slice((currentPage.value - 1) * currentPageSize.value, currentPage.value * currentPageSize.value);

        return tempData;
      });

      const sortData = (header: string) => {
        if (sort && sort.value && sort.value.prop == header) {
          sort.value.order = sort.value.order === 'descending' ? 'ascending' : 'descending';
          return;
        }
        sort.value = {
          order: 'ascending',
          prop: header,
        };
      };

      const paginatedData = computed(() => {
        if (!props.withPagination) return props.data;
        return props.data.slice((currentPageSize.value - 1) * currentPageSize.value, currentPageSize.value * currentPageSize.value);
      });

      const handleSortChanged = (sortEvent: ISort) => {
        if (!props.backendPaginationSorting) return;
        emit(Emits.SortChanged, sortEvent);
      };

      const handlePageChanged = (pageEvent: number) => {
        if (props.backendPaginationSorting) {
          emit(Emits.PageChanged, pageEvent);
          return;
        }
        currentPage.value = pageEvent;
      };

      const handleSizeChanged = (sizeEvent: number) => {
        if (props.backendPaginationSorting) {
          emit(Emits.PageSizeChanged, sizeEvent);
          return;
        }
        currentPageSize.value = sizeEvent;
      };

      const draggingOverData = ref<TEntry>();
      const initRangeSelectionData = ref<TEntry>();
      const isDragging = ref<boolean>(false);
      const selectedDatas = ref<TEntry[]>([]);
      const previousRangeSelectionData = ref<TEntry[]>([]);

      const selectItem = (data: TEntry) => {
        emit(Emits.RowClicked, data);
        selectedDatas.value = [ data ];
        emit(Emits.SelectedItems, selectedDatas.value);

        initRangeSelectionData.value = data;
        previousRangeSelectionData.value = [];
      }

      const addItemToSelect = (data: TEntry) => {
        let position = selectedDatas.value.indexOf(data);

        initRangeSelectionData.value = data;
        previousRangeSelectionData.value = [];

        if (position < 0) {
          selectedDatas.value.push(data);
        } else {
          selectedDatas.value.splice(position, 1);
        }

        emit(Emits.SelectedItems, selectedDatas.value);
      }

      const selectRange = (data: TEntry) => {
        let initPosition = dataList.value.indexOf(initRangeSelectionData.value);
        let endPosition = dataList.value.indexOf(data);

        if (0 <= initPosition && 0 <= endPosition) {

          // Remove of all previously selected by range
          previousRangeSelectionData.value.forEach(data => {
            let position = selectedDatas.value.indexOf(data);
            if (0 <= position) {
              selectedDatas.value.splice(position, 1);
            }
          });

          // Add newly selected
          let rangeSelectedDatas = [];
          if (initPosition <= endPosition) {
            rangeSelectedDatas = dataList.value.slice(initPosition, endPosition + 1);
          } else {
            rangeSelectedDatas = dataList.value.slice(endPosition, initPosition + 1);
          }

          rangeSelectedDatas.forEach(data => {
            if (!selectedDatas.value.includes(data)) {
              selectedDatas.value.push(data);
            }
          })

          previousRangeSelectionData.value = rangeSelectedDatas;
        }

        emit(Emits.SelectedItems, selectedDatas.value);
      }

      const dragStart = (data: TEntry) => {
        if (!selectedDatas.value.includes(data)) {
          selectedDatas.value = [ data ];
        }
        isDragging.value = true;
      }

      const dragOver = (data: TEntry) => {
        draggingOverData.value = data;
      }

      const dragDrop = (data: TEntry) => {
        if (data.isFolder && !selectedDatas.value.includes(data)) {
          emit(Emits.MoveItems, <IMoveItems> {
            source: selectedDatas.value,
            destination: data});
        }

        isDragging.value = false;
        draggingOverData.value = undefined;
      }

      const openItem = (data: TEntry) => {
        if (data.isFolder) {
          draggingOverData.value = undefined;
          initRangeSelectionData.value = undefined;
          isDragging.value = false;
          selectedDatas.value = [];
          previousRangeSelectionData.value = [];

          emit(Emits.OpenItem, data);
        }
      }
        
      return {
        dataList,
        sort,
        sortData,
        paginatedData,
        handleSortChanged,
        handlePageChanged,
        handleSizeChanged,
        Emits,
        currentPage,
        currentPageSize,
        draggingOverData,
        isDragging,
        initRangeSelectionData,
        selectedDatas,
        selectItem ,
        selectRange,
        addItemToSelect,
        dragStart,
        dragOver,
        dragDrop,
        openItem,
      };
    },
  });

</script>

<style>
</style>
