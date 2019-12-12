<template>
  <div class="app-container">
    <div class="search-form" style="margin-bottom:15px">
      <el-input v-model="searchForm.name" size="small" clearable placeholder="请输入名称" style="width:200px;" />
      <el-input v-model="searchForm.key" size="small" clearable placeholder="请输入键" style="width:200px;" />
      <el-select v-model="searchForm.parentId" size="small" clearable filterable placeholder="请选择类型">
        <el-option
          v-for="item in typeMaps"
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
        @click="() => addOrUpdate()"
      >
        新增
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
            {{ scope.row.typeName ? scope.row.typeName : "类型" }}
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="键">
          <template slot-scope="scope">
            <span>{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值">
          <template slot-scope="scope">
            <span>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="50">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新人">
          <template slot-scope="scope">
            <span>{{ scope.row.updateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span>{{ scope.row.createName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="() => addOrUpdate(scope.row)"
            >编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="() => del(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <pagination :pagination="pagination" />
    </div>

    <el-dialog :title="activeTitle" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="form" :rules="ruleList">
        <el-form-item label="编辑类型" :label-width="formLabelWidth">
          <el-radio-group v-model="operType" @change="resetFileds">
            <el-radio :label="1">数据</el-radio>
            <el-radio :label="2">类型</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="operType==1" label="类型" :label-width="formLabelWidth" prop="parentId">
          <el-select v-model="form.parentId" clearable filterable placeholder="请选择类型" style="width:100%">
            <el-option v-for="item in typeMaps" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="键" :label-width="formLabelWidth" prop="key">
          <el-input v-model="form.key" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="operType==1" label="值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="form.value" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="operType==1" label="编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="form.code" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序号" :label-width="formLabelWidth">
          <el-input v-model="form.sort" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-radio-group v-model="form.enable">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="operType==1" label="是否拷贝" :label-width="formLabelWidth">
          <el-radio-group v-model="form.copyStatus">
            <el-radio :label="'1'">拷贝</el-radio>
            <el-radio :label="'2'">不拷贝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="operType==1" label="是否可更改" :label-width="formLabelWidth">
          <el-radio-group v-model="form.changeStatus">
            <el-radio :label="'1'">可更改</el-radio>
            <el-radio :label="'2'">不可更改</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { getList, getDetail, getType, save, del } from '@/api/systemapi/config'
import { pageParams } from '@/settings'

export default {
  components: {
    'pagination': Pagination
  },
  data() {
    return {
      treeData: null,
      list: null,
      typeMaps: null,
      listLoading: true,
      searchForm: {
        name: '',
        key: '',
        parentId: '',
        rows: '10',
        page: '1'
      },
      activeTitle: '新增菜单', // 新增编辑菜单模态框标题
      dialogFormVisible: false, // 模态框
      formLabelWidth: '100px',
      operType: 1, // 编辑类型
      form: {
        parentId: '',
        name: '',
        key: '',
        value: '',
        code: '',
        sort: '',
        enable: 1,
        copyStatus: '1',
        changeStatus: '1'
      },
      rules1: {
        parentId: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入键', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入值', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      rules2: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入键', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 分页
      pagination: pageParams
    }
  },
  computed: {
    ruleList: function() {
      if (this.operType === 1) {
        return this.rules1
      } else if (this.operType === 2) {
        return this.rules2
      } else {
        return {}
      }
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
    this.getTypeList()
    this.fetchData()
  },
  methods: {
    getTypeList() {
      getType().then(response => {
        this.typeMaps = response.data
      })
    },
    fetchData() {
      this.listLoading = true
      getList({ ...this.searchForm }).then(response => {
        this.list = response.data.rows
        this.pagination.total = response.data.records
        this.listLoading = false
      })
    },
    // 删除
    del(data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.fetchData()
          } else {
            this.$message({
              message: response.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增
    addOrUpdate(data) {
      this.resetFileds()
      this.form = {
        parentId: '',
        name: '',
        key: '',
        value: '',
        code: '',
        sort: '',
        enable: 1,
        copyStatus: '1',
        changeStatus: '1'
      }
      this.getTypeList()
      this.activeTitle = '新增配置'
      if (data) {
        this.activeTitle = '编辑配置'
        getDetail(data.id).then(response => {
          this.form = response.data
          this.getTypeList()
          if (this.form.parentId === 0) {
            this.operType = 2
          } else {
            this.operType = 1
          }
          this.dialogFormVisible = true
        })
      } else {
        this.operType = 1
        this.dialogFormVisible = true
      }
    },
    // 保存
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          save(this.form).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.fetchData()
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetFileds() {
      this.form = {
        parentId: '',
        name: '',
        key: '',
        value: '',
        code: '',
        sort: '',
        enable: 1,
        copyStatus: '1',
        changeStatus: '1'
      }
      // 重置校验
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
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
