<template>
  <div class="addBrand-container">
    <div class="container">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="180px"
      >
        <el-form-item v-if="optType === 'add'" label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>

        <el-form-item v-else label="账号">
          <el-input v-model="ruleForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio v-model="ruleForm.sex" :label="1">男</el-radio>
          <el-radio v-model="ruleForm.sex" :label="2">女</el-radio>
        </el-form-item>

        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="ruleForm.idNumber"></el-input>
        </el-form-item>

        <div class="subBox">
          <el-button type="primary" @click="submitForm('ruleForm', false)">
            保存
          </el-button>
          <el-button
            v-if="optType === 'add'"
            type="primary"
            @click="submitForm('ruleForm', true)"
          >
            保存并继续添加员工
          </el-button>
          <el-button @click="$router.push('/employee')">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  addEmployee,
  editEmployee,
  queryEmployeeById
} from '@/api/employee'

export default {
  data() {
    return {
      optType: '',
      employeeId: '',
      ruleForm: {
        id: '',
        name: '',
        username: '',
        sex: 1,
        phone: '',
        idNumber: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        idNumber: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value === '' ||
                !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(X|x)$)/.test(value)
              ) {
                callback(new Error('请输入正确的身份证号！'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },

  created() {
    this.employeeId = this.$route.query.id || ''
    this.optType = this.employeeId ? 'update' : 'add'

    if (this.optType === 'update') {
      this.ruleForm.username = this.$route.query.username || ''
      this.getEmployeeDetail()
    }
  },

  methods: {
    getEmployeeDetail() {
      queryEmployeeById(this.employeeId)
        .then((res) => {
          if (res.data.code === 1) {
            const detail = res.data.data || {}

            this.ruleForm = {
              ...this.ruleForm,
              ...detail,
              username:
                detail.username !== undefined && detail.username !== null
                  ? detail.username
                  : this.ruleForm.username,
              sex:
                detail.sex !== undefined && detail.sex !== null
                  ? Number(detail.sex)
                  : this.ruleForm.sex
            }
          } else {
            this.$message.error(res.data.msg || '查询员工信息失败')
          }
        })
        .catch((err) => {
          this.$message.error('查询员工信息失败：' + err.message)
          console.error(err)
        })
    },

    resetForm() {
      this.ruleForm = {
        id: '',
        name: '',
        username: '',
        sex: 1,
        phone: '',
        idNumber: ''
      }

      this.$nextTick(() => {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate()
        }
      })
    },

    submitForm(formName, isContinue) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('表单校验没有通过')
          return
        }

        const addParams = {
          username: this.ruleForm.username,
          name: this.ruleForm.name,
          phone: this.ruleForm.phone,
          sex: Number(this.ruleForm.sex),
          idNumber: this.ruleForm.idNumber
        }

        const editParams = {
          id: Number(this.employeeId),
          name: this.ruleForm.name,
          phone: this.ruleForm.phone,
          sex: Number(this.ruleForm.sex),
          idNumber: this.ruleForm.idNumber
        }

        const request =
          this.optType === 'add'
            ? addEmployee(addParams)
            : editEmployee(editParams)

        request
          .then((res) => {
            console.log('save response:', res)

            if (res.data.code === 1) {
              this.$message.success(
                this.optType === 'add' ? '员工添加成功！' : '员工修改成功！'
              )

              if (this.optType === 'add' && isContinue) {
                this.resetForm()
              } else {
                this.$router.push('/employee')
              }
            } else {
              this.$message.error(res.data.msg || '操作失败')
              console.log('save fail body:', res.data)
            }
          })
          .catch((err) => {
            var errMsg = '请求失败'
            if (
              err &&
              err.response &&
              err.response.data &&
              err.response.data.msg
            ) {
              errMsg = err.response.data.msg
            } else if (err && err.message) {
              errMsg = err.message
            }

            this.$message.error(errMsg)
            console.error('save error:', err)
            if (err && err.response) {
              console.error('save error response:', err.response)
            }
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 30px;

    .HeadLable {
      background-color: transparent;
      margin-bottom: 0;
      padding-left: 0;
    }

    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;

      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
    }

    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }

    .el-input {
      width: 293px;
    }
  }
}
</style>