<template>
  <div class="app-container">
    <div class="menu-tree">
      <el-tree
        :data="treeData"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.name }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              class="el-icon-edit"
              @click="() => addOrUpdate(data)"
            />
            <el-button
              type="text"
              size="mini"
              class="el-icon-delete"
              @click="() => del(data)"
            />
          </span>
        </span>
      </el-tree>
    </div>
    <div class="menu-table">
      <div class="search-form" style="margin-bottom:15px">
        <el-input v-model="searchForm.name" size="small" clearable placeholder="菜单名称" style="width:200px" />
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
        <el-table-column label="名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="图标" width="60">
          <template slot-scope="scope">
            <svg-icon style="font-size:20px;" :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column label="类型" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.type | typeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            {{ scope.row.url }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="排序" width="80">
          <template slot-scope="scope">
            {{ scope.row.sort }}
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
      <div>
        <pagination :pagination="pagination" />
      </div>
    </div>

    <el-dialog :title="activeTitle" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="form" :rules="ruleList">
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type==2" label="父节点" :label-width="formLabelWidth" prop="parentId">
          <el-select v-model="form.parentId" clearable filterable placeholder="请选择父级节点" style="width:100%">
            <el-option v-for="item in menulist" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type==2" label="链接地址" :label-width="formLabelWidth" prop="url">
          <el-input v-model="form.url" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="form.enable">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" clearable autocomplete="off" />
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
import { getMenuList, getMenuTree, getMenuDetail, saveMenu, delMenu } from '@/api/systemapi/menu'
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
      menuList: null,
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
      activeTitle: '新增菜单', // 新增编辑菜单模态框标题
      dialogFormVisible: false, // 模态框
      formLabelWidth: '100px',
      form: {
        name: '',
        parentId: '',
        type: 1,
        icon: '',
        url: '',
        enable: 1,
        sort: ''
      },
      rules1: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      rules2: {
        parentId: [
          { required: true, message: '请选择父级节点', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入菜单地址', trigger: 'blur' }
        ]
      },
      // 分页
      pagination: pageParams
    }
  },
  computed: {
    ruleList: function() {
      if (this.form.type === 1) {
        return this.rules1
      } else if (this.form.type === 2) {
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
    this.fetchData()
    this.fetchTreeData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMenuList({ ...this.searchForm }).then(response => {
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
        delMenu(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.fetchData()
            this.fetchTreeData()
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
        parentId: '',
        type: 1,
        icon: '',
        url: '',
        enable: 1,
        sort: ''
      }
      this.dialogFormVisible = true
      this.activeTitle = '新增菜单'
      if (data) {
        this.activeTitle = '编辑菜单'
        getMenuDetail(data.id).then(response => {
          this.form = response.data
          delete this.form.childs
        })
      }
    },
    // 保存
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          saveMenu(this.form).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.fetchData()
              this.fetchTreeData()
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
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container {
    display: flex;
    width: 100%;
    .menu-tree {
      width:300px;
    }
    .menu-table {
      flex:1;
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
