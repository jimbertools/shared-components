 <template>
  <el-table
    :data="tableData"
    height="250"
    >
    <el-table-column
      label="id"
      width="180">
      <template #default="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Name"
      width="180">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top">
          <template #default>
            <p>姓名: {{ scope.row.name }}</p>
            <p>住址: {{ scope.row.address }}</p>
          </template>
          <template #reference>
            <div class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="title"
      class="hidden md:block">
      <template #default="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { defineComponent, onBeforeMount, ref } from 'vue';

export default {
    name: 'CompactTableWithActionsAndSelect',
    props: {
      tableData: [],
    },
    setup({tableData}) {
        onBeforeMount(()=> {
            console.log("adsasdf",tableData)
        })
        return {
            tableData
        };
    },
};
</script>