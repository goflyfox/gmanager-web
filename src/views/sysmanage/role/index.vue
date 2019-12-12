<template>
  <div class="app-container">
    <div class="search-form" style="margin-bottom:15px;">
      <el-input v-model="searchForm.name" size="small" clearable placeholder="角色名称" style="width:200px;" />
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
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="角色说明" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
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
      <el-row :gutter="50">
        <el-col :span="10">
          <el-form ref="ruleForm" :model="form" :rules="formrules">
            <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色说明" :label-width="formLabelWidth">
              <el-input v-model="form.remark" type="textarea" clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="2">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input v-model="form.sort" clearable autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <span>
            <span style="color:red;">*</span>
            菜单权限
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span v-show="showMenuErr" style="color:red;">请选择菜单权限</span>
          <div class="div-tree">
            <el-tree
              ref="menuTree"
              :data="treeData"
              node-key="id"
              show-checkbox
              default-expand-all
              :default-checked-keys="selectedmenu"
              :expand-on-click-node="false"
              @check="handelMenuCheck"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ data.name }}</span>
              </span>
            </el-tree>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { getList, getDetail, getInfo, save, del } from '@/api/systemapi/role'
import { getMenuTree } from '@/api/systemapi/menu'
import { translateDataToTree } from '@/utils'
import { pageParams } from '@/settings'

export default {
  components: {
    'pagination': Pagination
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        1: '目录',
        2: '菜单'
      }
      return typeMap[type]
    },
    statusFilter(status) {
      const statusMap = {
        1: '启用',
        2: '禁用'
      }
      return statusMap[status]
    },
    statusTypeFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      treeData: null,
      list: null,
      listLoading: true,
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      searchForm: {
        name: '',
        rows: '10',
        page: '1'
      },
      activeTitle: '新增角色', // 新增编辑菜单模态框标题
      dialogFormVisible: false, // 模态框
      formLabelWidth: '100px',
      selectedmenu: [], // 选择的菜单权限
      form: {
        name: '',
        remark: '',
        status: 1,
        sort: ''
      },
      showMenuErr: false, // 菜单未选择提示
      formrules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
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
    fetchTreeData() {
      this.listLoading = true
      getMenuTree().then(response => {
        this.menulist = response.data
        this.treeData = translateDataToTree(response.data)
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
        name: '',
        remark: '',
        status: 1,
        sort: ''
      }
      this.selectedmenu = []
      this.dialogFormVisible = true
      this.activeTitle = '新增角色'
      this.fetchTreeData()
      if (data) {
        this.activeTitle = '编辑角色'
        getDetail(data.id).then(response => {
          this.form = response.data
        })
        getInfo({ roleId: data.id }).then(response => {
          this.selectedmenu = response.data.menus
        })
      }
    },
    // 保存
    save() {
      const menus = this.$refs.menuTree.getCheckedKeys()
      if (!menus.length) {
        this.showMenuErr = true
        return
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          save({ ...this.form, ...{ menus: menus.join(',') }}).then(response => {
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
      // 重置校验
      this.showMenuErr = false
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
    },
    handelMenuCheck() {
      const menus = this.$refs.menuTree.getCheckedKeys()
      if (!menus.length) {
        this.showMenuErr = true
      } else {
        this.showMenuErr = false
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
    .el-row {
      height:300px;
      .el-col {
        height:100%;
        .div-tree {
          height:90%;
          .el-tree {
            height:100%;
            overflow-y :auto;
          }
        }
      }
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
