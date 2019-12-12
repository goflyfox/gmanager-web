<template>
  <div class="app-container">
    <div class="div-tree">
      <el-tree
        :data="treeData"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="filterDepart"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.name }}</span>
        </span>
      </el-tree>
    </div>
    <div class="div-table">
      <div class="search-form" style="margin-bottom:15px;">
        <el-input
          v-model="searchForm.name"
          size="small"
          clearable
          placeholder="用户名称"
          style="width:200px;"
        />
        <el-input
          v-model="searchForm.realName"
          size="small"
          clearable
          placeholder="真实姓名"
          style="width:200px;"
        />
        <el-select
          v-model="searchForm.userType"
          size="small"
          clearable
          filterable
          placeholder="请选择用户类型"
        >
          <el-option
            v-for="item in userTypeMaps"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" size="small" @click="() => fetchData()">查询</el-button>
        <el-button type="primary" size="small" @click="() => reset()">重置</el-button>
        <el-button type="primary" size="small" @click="() => addOrUpdate()">新增</el-button>
      </div>
      <span v-show="currentDepart">当前选择机构：{{ currentDepart }}</span>
      <el-table
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @sort-change="sortTable"
      >
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="所属部门" prop="departName" sortable>
          <template slot-scope="scope">{{ scope.row.departName }}</template>
        </el-table-column>
        <el-table-column label="用户名称" prop="username" sortable>
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="真实姓名" prop="realName" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="用户类型" width="120" prop="userType" sortable>
          <template slot-scope="scope">
            <el-tag>{{ scope.row.userType | userTypeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号码">
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createName" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.createName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="() => addOrUpdate(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="() => del(scope.row)">删除</el-button>
            <el-button
              v-if="scope.row.userType !== 1"
              size="small"
              type="success"
              @click="() => setAuth(scope.row)"
            >授权</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination :pagination="pagination" />
      </div>
    </div>

    <el-dialog :title="activeTitle" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="form" :rules="formrules">
        <el-form-item label="所属部门" :label-width="formLabelWidth" prop="departId">
          <el-select
            v-model="form.departId"
            size="small"
            clearable
            filterable
            placeholder="请选择所属部门"
          >
            <el-option
              v-for="item in departList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" :label-width="formLabelWidth" prop="userType">
          <el-select
            v-model="form.userType"
            size="small"
            clearable
            filterable
            placeholder="请选择用户类型"
          >
            <el-option
              v-for="item in userTypeMaps"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realName" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.tel" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" clearable autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户授权 -->
    <el-dialog title="用户权限" :visible.sync="dialogAuthVisible">
      <el-form :model="form">
        <el-form-item label="角色授权" :label-width="formLabelWidth">
          <el-checkbox-group v-model="authRole">
            <el-checkbox
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.id"
              :disabled="item.status === 2"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAuthVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import {
  getList,
  getDetail,
  getRoleInfo,
  saveRoleInfo,
  save,
  del
} from '@/api/systemapi/user'
import { getTree } from '@/api/systemapi/depart'
import { translateDataToTree } from '@/utils'
import { pageParams } from '@/settings'

export default {
  components: {
    pagination: Pagination
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        1: '目录',
        2: '菜单'
      }
      return typeMap[type]
    },
    userTypeFilter(status) {
      const statusMap = {
        1: '管理员',
        2: '普通用户',
        3: '前台用户'
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
      userTypeMaps: [
        { id: 1, name: '管理员' },
        { id: 2, name: '普通用户' },
        { id: 3, name: '前台用户' }
      ],
      treeData: null,
      list: null,
      listLoading: true,
      currentDepart: null, // 当前选择的机构
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      searchForm: {
        sidx: '', // 排序字段
        sord: '', // 排序方向
        username: '',
        realName: '',
        userType: '',
        rows: '10',
        page: '1',
        departId: ''
      },

      activeTitle: '新增用户', // 新增编辑菜单模态框标题
      dialogFormVisible: false, // 模态框
      formLabelWidth: '100px',
      departList: [], // 机构下拉框数据
      form: {
        departId: '',
        userType: '',
        username: '',
        realName: '',
        tel: '',
        remark: ''
      },
      formrules: {
        departId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 授权
      dialogAuthVisible: false,
      roleList: null, // 角色列表
      authRole: [], // 用户已授权角色
      authForm: {
        userid: '',
        roleids: ''
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
    this.fetchTreeData()
  },
  methods: {
    // 点击树形节点 ，过滤列表坐席
    filterDepart(data) {
      this.searchForm.departId = data.id
      this.currentDepart = data.name
      this.fetchData(data.id)
    },
    // 重置搜索，刷新列表
    reset() {
      this.searchForm = {
        sidx: '',
        sord: '',
        username: '',
        realName: '',
        userType: '',
        rows: '10',
        page: '1',
        departId: ''
      }
      this.currentDepart = null
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList({ ...this.searchForm }).then(response => {
        this.list = response.data.rows
        this.pagination.total = response.data.records
        this.listLoading = false
      })
    },
    sortTable(column) {
      console.log(column)
      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order

      const sortTypeMap = {
        '': '',
        ascending: 'asc',
        descending: 'desc'
      }

      this.searchForm.sidx = fieldName
      this.searchForm.sord = sortTypeMap[sortingType]

      this.fetchData()
    },
    fetchTreeData() {
      this.listLoading = true
      getTree().then(response => {
        this.departList = response.data
        this.treeData = translateDataToTree(response.data)
        this.listLoading = false
      })
    },
    // 用户授权
    setAuth(data) {
      this.dialogAuthVisible = true
      this.authForm.userid = data.id
      getRoleInfo({ userId: data.id }).then(response => {
        this.roleList = response.data.list
        this.authForm.roleids = response.data.roleIds
        this.authRole = this.authForm.roleids
          ? this.authForm.roleids.split(',').map(Number)
          : []
      })
    },
    saveRole() {
      this.authForm.roleids = this.authRole.join(',')
      saveRoleInfo({ ...this.authForm }).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '授权成功',
            type: 'success'
          })
          this.dialogAuthVisible = false
          this.fetchData()
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除
    del(data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
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
        })
        .catch(() => {
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
        departId: '',
        userType: '',
        username: '',
        realName: '',
        tel: '',
        remark: ''
      }
      this.dialogFormVisible = true
      this.activeTitle = '新增用户'
      this.fetchTreeData()
      if (data) {
        this.activeTitle = '编辑用户'
        getDetail(data.id).then(response => {
          this.form = response.data
        })
      }
    },
    // 保存
    save() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          save({ ...this.form }).then(response => {
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
  .div-tree {
    width: 300px;
  }
  .div-table {
    flex: 1;
  }
  .el-row {
    height: 300px;
    .el-col {
      height: 100%;
      .div-tree {
        height: 90%;
        .el-tree {
          height: 100%;
          overflow-y: auto;
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
