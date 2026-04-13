<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label>套餐名称：</label>
        <el-input
          style="width: 15%; margin-right: 5px"
          placeholder="请输入套餐名称"
          v-model="name"
        />

        <label>套餐分类：</label>
        <el-select
          v-model="categoryId"
          placeholder="请选择"
          style="width: 15%; margin-right: 5px"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <el-button type="primary" @click="pageQuery">查询</el-button>

        <div style="float: right;">
          <el-button type="primary" @click="handleAddSetmeal" style="margin-left: 5px;">+添加套餐</el-button>
        </div>
      </div>
    </div>

    <el-table :data="records" style="width: 100%">
      <el-table-column prop="name" label="套餐名称" width="180" />
      <el-table-column prop="categoryName" label="分类" width="180" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template v-slot="scope">
          {{ scope.row.status === 0 ? '停售' : '在售' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button type="text" @click="handleUpdateSetmeal(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleStartOrStop(scope.row)">
            {{ scope.row.status === 0 ? '上架' : '下架' }}
          </el-button>
          <el-button type="text" @click="handleDeleteSetmeal(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pageList">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getSetmealList, enableOrDisableSetmeal, getSetmealCategories, deleteSetmeal } from '@/api/setmeal'

export default {
  data() {
    return {
      name: '', // 套餐名称
      categoryId: '', // 选中的分类
      categories: [], // 分类列表
      page: 1,
      pageSize: 10,
      total: 0,
      records: []
    }
  },
  created() {
    this.loadCategories()
    this.pageQuery()
  },
  methods: {
    loadCategories() {
      getSetmealCategories().then(res => {
        if (res.data.code === 1) {
          this.categories = res.data.data
        }
      })
    },
    pageQuery() {
      const params = {
        name: this.name,
        categoryId: this.categoryId,
        page: this.page,
        pageSize: this.pageSize
      }
      getSetmealList(params)
        .then(res => {
          if (res.data.code === 1) {
            this.total = res.data.data.total
            this.records = res.data.data.records
          }
        })
        .catch(err => {
          this.$message.error('请求出错：' + err.message)
        })
    },
    handleSizeChange(pageSize: number) {
      this.pageSize = pageSize
      this.pageQuery()
    },
    handleCurrentChange(page: number) {
      this.page = page
      this.pageQuery()
    },
    handleStartOrStop(row: any) {
      const status = row.status === 0 ? 1 : 0 // 0->1 上架, 1->0 下架
      enableOrDisableSetmeal({ id: row.id, status })
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.msg || '操作成功')
            this.pageQuery() // 刷新当前页
          } else {
            this.$message.error(res.data.msg || '操作失败')
          }
        })
        .catch(err => {
          this.$message.error('网络异常，请稍后重试')
        })
    },
    handleAddSetmeal() {
      this.$router.push('/setmeal/add')
    },
    handleUpdateSetmeal(row: any) {
      this.$router.push({
        path: '/setmeal/add',
        query: { id: row.id }
      })
    },
    handleDeleteSetmeal(row: any) {
      this.$confirm('确定要删除该套餐吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSetmeal(row.id)
          .then((res) => {
            if (res.data.code === 1) {
              this.$message.success('删除成功')
              this.pageQuery()
            } else {
              this.$message.error(res.data.msg || '删除失败')
            }
          })
          .catch(() => {
            this.$message.error('网络异常，请稍后重试')
          })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.pageList {
  text-align: center;
  margin-top: 20px;
}
.tableBar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>