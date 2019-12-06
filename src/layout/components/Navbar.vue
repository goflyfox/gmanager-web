<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <div class="user-avatar">
            <svg-icon style="font-size:40px;" icon-class="setting" />
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <a target="_blank" href="https://github.com/goflyfox/gmanager-web">
            <el-dropdown-item>
              <svg-icon icon-class="github" />
              Github
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="updatepwd">
              <svg-icon icon-class="updatepassword" />
              修改密码
            </span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">
              <svg-icon icon-class="logout" />
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="formrule">
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" type="password" placeholder="原密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" placeholder="新密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="再次输入新密码"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="savePassword">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MD5 from 'js-md5'
import { changePwd } from '@/api/user'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      formLabelWidth: '100px',
      form: {
        username: '',
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      formrule: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 修改密码
    updatepwd() {
      this.dialogFormVisible = true
    },
    savePassword() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const postdata = {
            password: MD5(this.form.password),
            newPassword: MD5(this.form.newPassword)
          }
          console.log(postdata, 'MD5')
          changePwd({ ...postdata }).then(response => {
            if (response.code === 0) {
              // 修改密码成功后，退出当前登录，跳转到登录页
              this.$message({
                type: 'success',
                message: '密码修改成功',
                duration: 1000
              })
              const then = this
              setTimeout(function() {
                then.logout()
              }, 1000)
            } else {
              this.$message({
                type: 'info',
                message: response.data.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.$refs['form'].resetFields()
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        padding-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 50px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
      .avatar-wrapper:hover {
         background-color:#c6c6c6;
        }
    }
  }
}
</style>
