<template>
  <div class="pagination">
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :pagination="pagination"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      :total="pagination.total"
      :page-sizes="pagination.pageSizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      default: () => ({ pageSizes: [], pageSize: 10, currentPage: 1, total: 0 })
    }
  },
  methods: {
    handleCurrentChange: function(val) {
      this.pagination.currentPage = val
      // this.$emit('refresh')
    },
    handleSizeChange: function(val) {
      this.pagination.pageSize = val
      // this.$emit('refresh')
    }
  }
}
</script>

<style>
.pagination {
  width: 40%;
  margin: 35px auto;
}
</style>
