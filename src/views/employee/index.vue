<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px;">员工姓名：</label>
        <el-input
          v-model="name"
          placeholder="请输入员工姓名"
          style="width: 15%; height: 54px;"
        />
        <el-button
          type="primary"
          style="margin-left: 5px;"
          @click="pageQuery()"
        >
          查询
        </el-button>
        <div style="float: right;">
          <el-button type="primary" @click="handleAddEmp">+添加员工</el-button>
        </div>
      </div>
    </div>

    <el-table :data="records" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="username" label="账号" width="180" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="status" label="账号状态">
        <template v-slot="scope">
          {{ scope.row.status === 0 ? '禁用' : '启用' }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后操作时间" width="180" />
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button type="text" @click="handleUpdateEmp(scope.row)">修改</el-button>
          <el-button type="text" @click="handleStartOrStop(scope.row)">
            {{ scope.row.status === 0 ? '启用' : '禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: center">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getEmployeeList, enableOrDisableEmployee } from '@/api/employee'

export default {
  data() {
    return {
      name: '',
      page: 1,
      pageSize: 10,
      total: 0,
      records: []
    }
  },
  created() {
    this.pageQuery()
  },
  methods: {
    pageQuery() {
      const params = {
        name: this.name,
        page: this.page,
        pageSize: this.pageSize,
        _t: new Date().getTime() // 强制刷新，避免缓存
      }
      getEmployeeList(params)
        .then(res => {
          if (res.data.code === 1) {
            this.total = res.data.data.total
            this.records = res.data.data.records
          }
        })
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageQuery()
    },

    handleCurrentChange(page) {
      this.page = page
      this.pageQuery()
    },

    handleStartOrStop(row) {
      if (row.username === 'admin') {
        this.$message.error('admin为系统管理员账号，不能更改账号状态！')
        return
      }

      const params = {
        id: row.id,
        status: row.status === 0 ? 1 : 0
      }

      enableOrDisableEmployee(params)
        .then((res) => {
          if (res.data.code === 1) {
            this.$message.success(res.data.msg || '员工账号状态更改成功')
            this.pageQuery()
          } else {
            this.$message.error(res.data.msg || '状态更改失败，请重试')
          }
        })
        .catch((err) => {
          this.$message.error('网络异常，请稍后重试')
          console.error(err)
        })
    },

    handleAddEmp() {
      this.$router.push('/employee/add')
    },

    handleUpdateEmp(row) {
      if (row.username === 'admin') {
        this.$message.error('系统管理员账号不允许修改！')
        return
      }

      this.$router.push({
        path: '/employee/add',
        query: {
          id: row.id,
          username: row.username
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #bac0cd !important;
}
</style>