<template>
  <div class="app-container">
    <div class="search-form" style="margin-bottom:15px;">
      <el-input v-model="searchForm.operObject" size="small" clearable placeholder="请输入操作对象" style="width:200px;" />
      <el-input v-model="searchForm.operTable" size="small" clearable placeholder="请输入操作表" style="width:200px;" />
      <el-select v-model="searchForm.logType" size="small" clearable filterable placeholder="请选择类型">
        <el-option
          v-for="item in logTypeMaps"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        type="primary"
        size="small"
        @click="() => fetchData()"
      >
        查询
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="() => resetForm()"
      >
        重置
      </el-button>
    </div>
    <div class="div-table">
      <el-table
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            {{ scope.row.logType==1?"类型":"数据" }}
          </template>
        </el-table-column>
        <el-table-column label="操作对象">
          <template slot-scope="scope">
            <span>{{ scope.row.operObject }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作表">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.operTable }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作主键">
          <template slot-scope="scope">
            <span>{{ scope.row.operId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型">
          <template slot-scope="scope">
            <span>{{ scope.row.operType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span>{{ scope.row.createName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="() => showDetail(scope.row)"
            >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <pagination :pagination="pagination" />
    </div>

    <el-dialog :title="activeTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="类型" :label-width="formLabelWidth">
          <span>{{ form.logType==1?"系统类型":"操作类型" }}</span>
        </el-form-item>
        <el-form-item label="操作对象" :label-width="formLabelWidth">
          <span>{{ form.operObject }}</span>
        </el-form-item>
        <el-form-item label="操作表" :label-width="formLabelWidth">
          <span>{{ form.operTable }}</span>
        </el-form-item>
        <el-form-item label="操作主键" :label-width="formLabelWidth">
          <span>{{ form.operId }}</span>
        </el-form-item>
        <el-form-item label="创建时间" :label-width="formLabelWidth">
          <span>{{ form.createTime }}</span>
        </el-form-item>
        <el-form-item label="创建人Id" :label-width="formLabelWidth">
          <span>{{ form.createId }}</span>
        </el-form-item>
        <el-form-item label="日志" :label-width="formLabelWidth">
          <el-input v-model="form.operRemark" type="textarea" :rows="4" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { getList, getDetail } from '@/api/systemapi/log'
import { pageParams } from '@/settings'

export default {
  components: {
    'pagination': Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      searchForm: {
        operObject: '',
        operTable: '',
        logType: '',
        rows: '10',
        page: '1'
      },
      logTypeMaps: [
        { id: 1, name: '系统类型' },
        { id: 2, name: '操作类型' }
      ],
      activeTitle: '查看日志详情', // 新增编辑菜单模态框标题
      dialogFormVisible: false, // 模态框
      formLabelWidth: '100px',
      form: {
        logType: '',
        operObject: '',
        operTable: '',
        operId: '',
        createTime: '',
        createId: '',
        operRemark: ''
      },
      // 分页
      pagination: pageParams
    }
  },
  watch: {
    // 分页
    'pagination.currentPage': function() {
      this.searchForm.page = this.pagination.currentPage
      this.fetchData()
    },
    'pagination.pageSize': function() {
      this.searchForm.rows = this.pagination.pageSize
      this.searchForm.page = 1
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({ ...this.searchForm }).then(response => {
        this.list = response.data.rows
        this.pagination.total = response.data.records
        this.listLoading = false
      })
    },
    resetForm() {
      this.searchForm = {
        operObject: '',
        operTable: '',
        logType: '',
        rows: '10',
        page: '1'
      }
      this.fetchData()
    },
    // 新增
    showDetail(data) {
      this.dialogFormVisible = true
      getDetail(data.id).then(response => {
        this.form = response.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container {
    width: 100%;
    .div-table{
      width:100%;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
