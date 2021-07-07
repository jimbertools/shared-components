<template>
  <div class="flex flex-row w-full max-w-full">
    <div class="flex flex-col flex-1 border-r-2 border-grey-100">
      <div>
        <slot name="quickAccess">
          Quick folder access
          {{ quickAccessData }}
        </slot>
      </div>
      <div class="flex flex-row justify-end mb-4">
        <el-input class="mr-auto max-w-xs" v-if="withFiltering" v-model="searchValue" placeholder="Search..." @input="debounceSearch">
          <template #prefix>
            <em class="fas fa-search"></em>
          </template>
        </el-input>
        <div v-if="activeView === View.Grid && headers?.some(x => x.enableSorting)">
          <el-dropdown>
            <el-button type="default"> {{ sortDisplayName }}<i class="fas fa-chevron-down ml-2"></i> </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="header in headers.filter(x => x.enableSorting)" @click="sortHeader(header.key)" :key="header.key">
                  {{ header.displayName ?? header.key }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-if="sort?.order !== 'ascending'" @click="sortDirection('ascending')">
            <div>
              <em class="fas fa-sort-amount-down"></em>
            </div>
          </el-button>
          <el-button v-if="sort?.order !== 'descending'" @click="sortDirection('descending')">
            <div>
              <em class="fas fa-sort-amount-up"></em>
            </div>
          </el-button>
        </div>
        <el-button-group :key="activeView" class="ml-4">
          <el-button @click="activeView = View.List">
            <div :class="{ 'active-view': activeView === View.List }">
              <em class="fas fa-bars"></em>
            </div>
          </el-button>
          <el-button @click="activeView = View.Grid">
            <div :class="{ 'active-view': activeView === View.Grid }">
              <em class="fas fa-th"></em>
            </div>
          </el-button>
        </el-button-group>
      </div>
      <div class="flex flex-col">
        <div class="overflow-x-auto">
          <div class="align-middle inline-block min-w-full">
            <div class="shadow overflow-hidden sm:rounded-lg">
              <template v-if="activeView === View.List">
                <test-table
                  :withPagination="withPagination"
                  :backendPaginationSorting="backendPaginationSorting"
                  rowClass="bg-gray-50"
                  :data="dataList"
                  :headers="headers"
                  :pageSize="pageSize"
                  :page="pageValue"
                  :total="totalValue"
                  :defaultSort="sort"
                  @[TableEmits.RowClicked]="data => $emit(Emits.SelectedChanged, data)"
                  @[TableEmits.SortChanged]="e => $emit(Emits.SortChanged, e)"
                >
                  <template v-if="!hasSlot('data-name')" #data-name="rowData">
                    <em :class="getIcon(rowData.row.fileType) + ' ' + getIconColor(rowData.row.fileType)"></em>
                    {{ getName(rowData.row) }}
                  </template>
                  <template v-for="(_, slot) of $slots" v-slot:[slot]="props">
                    <slot :name="slot" v-bind="props"></slot>
                  </template>
                </test-table>
              </template>
              <template v-if="activeView === View.Grid">
                <grid-view
                  :withPagination="withPagination"
                  :backendPaginationSorting="backendPaginationSorting"
                  gridClass="bg-gray-50"
                  :data="dataList"
                  :headers="headers"
                  :pageSize="pageSize"
                  :page="pageValue"
                  :total="totalValue"
                  :defaultSort="sort"
                  @[GridViewEmits.RowClicked]="data => $emit(Emits.SelectedChanged, data)"
                  @[GridViewEmits.SortChanged]="e => $emit(Emits.SortChanged, e)"
                >
                  <template #grid-item="gridData" class="">
                    <div class="flex-col items-center justify-center text-center w-28 break-word p-2 hover:bg-gray-100 cursor-pointer" :key="getName(gridData.item)">
                      <div class="flex justify-center">
                        <em class="fa-2x" :class="getIcon(gridData.item.fileType) + ' ' + getIconColor(gridData.item.fileType)"></em>
                      </div>

                      <el-tooltip class="item" effect="dark" :content="getName(gridData.item)" placement="bottom-start">
                        <span class="block truncate whitespace-normal">
                          {{ gridData.item.name.length > 25 ? `${gridData.item.name.slice(0, 25)}...` : getName(gridData.item) }}
                        </span>
                      </el-tooltip>
                    </div>
                  </template>
                </grid-view>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/4 flex-shrink-0" v-if="sidebarData">
      <slot name="sideBar">
        <div v-for="key of Object.keys(sidebarData)" :key="key">
          <span class="font-bold"> {{ key }} </span> <span class="italic">{{ sidebarData[key] }}</span
          ><br />
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref } from 'vue';
  import TestTable, { Emits as TableEmits } from './TestTable.vue';
  import GridView, { Emits as GridViewEmits } from './GridView.vue';
  import { IHeader, ISort, TEntry, FileManagerEmits as Emits, FileManagerViews as View } from '../types/FileManagerTypes';
  import { getIcon, getIconColor, getName } from '../infrastructure/utils/FileUtil';
  import { ElInput, ElDropdown, ElButton, ElTooltip } from 'element-plus';

  const comparerFunction = (a: TEntry, b: TEntry, i: number) => {
    if (!a.isFolder && b.isFolder) return 1;
    if (a.isFolder && !b.isFolder) return -1;

    return a.name.localeCompare(b.name) * i;
  };

  const defaultHeaders = [
    { displayName: 'Id', key: 'id', enableSorting: true, customTemplate: true },
    {
      displayName: 'Name',
      key: 'name',
      enableSorting: true,
      comparer: (entry1, entry2, i) => comparerFunction(entry1, entry2, i),
    },
    {
      displayName: 'Modified',
      key: 'modified',
      enableSorting: true,
      formatter: entry => {
        if (entry.isFolder) return;
        const date = new Date(<string>entry.modified);
        return date.toDateString();
      },
    },
    { displayName: 'Created', key: 'created', enableSorting: true },
    { displayName: 'Size', key: 'size', enableSorting: true },
  ] as IHeader<TEntry>[];

  function defineGenericComponent<T extends Partial<TEntry>>() {
    return defineComponent({
      name: 'FileManager',
      components: {
        TestTable,
        GridView,
        ElInput,
        ElDropdown,
        ElButton,
        ElTooltip,
      },
      props: {
        data: { type: Array as PropType<T[]>, required: true },
        quickAccessData: { type: Array as PropType<T[]>, required: false },
        sidebarData: { type: Object, required: false },
        headers: { type: Array as PropType<IHeader<T>[]>, required: false },
        page: { type: Number, required: false, default: 1 },
        pageSize: { type: Number, required: false, default: 10 },
        total: { type: Number, required: false },
        backendPaginationSorting: { type: Boolean, required: false, default: false },
        backendFiltering: { type: Boolean, required: false, default: false },
        withPagination: { type: Boolean, required: false, default: false },
        withFiltering: { type: Boolean, required: false, default: false },
        defaultSort: { type: Object as PropType<ISort>, required: false },
        icons: { type: Object, required: false },
      },
      emits: Object.values(Emits),
      setup(props, { slots, emit }) {
        const activeView = ref<View>(View.List);
        const sort = ref<ISort | undefined>(props.defaultSort ?? { prop: 'name', order: 'ascending' });
        const searchValue = ref<string>();
        const debouncedSearchValue = ref<string>();
        const pageValue = ref(props.page);

        const headers = computed(() => {
          if (!props.headers || !(props.headers.length > 0)) return defaultHeaders;
          return props.headers
            .map(h => {
              if (!h?.key) return;
              const defaultValue = defaultHeaders.find(x => x.key === h.key);
              return {
                ...defaultValue,
                ...h,
              };
            })
            .filter(h => !!h);
        });
        const nameHeader = headers.value?.find(x => x?.key === 'name');
        const totalValue = ref(props.backendFiltering ? props.total : props.total ? props.total : props.data?.length);
        const dataList = computed(() => {
          const getData = () => {
            if (props.backendFiltering) return props.data;

            if (props.withFiltering && nameHeader && debouncedSearchValue.value) return props.data.filter(x => x.name?.toLowerCase().includes(<string>debouncedSearchValue.value));

            return props.data;
          };
          const dl = getData();
          totalValue.value = dl.length;
          return dl;
        });

        const sortChanged = () => {
          emit(Emits.SortChanged, sort.value);
        };

        const sortHeader = (header: string) => {
          sort.value = {
            prop: header,
            order: sort.value?.order === 'descending' ? 'ascending' : 'descending',
          } as ISort;
          sortChanged();
        };

        const sortDirection = (direction: 'ascending' | 'descending') => {
          sort.value = {
            ...(sort.value ?? {}),
            order: direction,
          } as ISort;
          sortChanged();
        };

        const sortDisplayName = computed(() => {
          if (!sort.value?.prop) return 'Sorteer';
          const header = headers?.value?.find(x => x?.key === sort?.value?.prop);
          if (!header?.displayName) return sort.value.prop;
          return header.displayName;
        });

        const hasSlot = computed(() => {
          return (slotName: string) => {
            return slots?.[slotName];
          };
        });

        let debounce: NodeJS.Timeout;
        const debounceSearch = (input: string) => {
          clearTimeout(debounce);
          debounce = setTimeout(() => {
            if (props.backendFiltering) emit(Emits.SearchChanged, input);

            debouncedSearchValue.value = input;
            pageValue.value = 1;
          }, 300);
        };

        return {
          dataList,
          headers,
          TableEmits,
          GridViewEmits,
          sort,
          sortDirection,
          sortHeader,
          Emits,
          hasSlot,
          getIcon,
          getIconColor,
          getName,
          activeView,
          View,
          sortDisplayName,
          debounceSearch,
          totalValue,
          pageValue,
          searchValue,
        };
      },
    });
  }

  export default defineGenericComponent();
</script>

<style>
  .active-view {
    color: #409eff;
  }

  .table tr {
    background: gray;
  }
</style>
