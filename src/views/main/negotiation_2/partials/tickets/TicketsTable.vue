<template>
  <el-table
    :data="content"
  >
    <el-table-column
      prop="disputeId"
      label="ID"
      width="180"
    />

    <el-table-column
      prop="disputeStatus"
      label="Status"
    />
  </el-table>
</template>

<script>
export default {
  props: {
    tab: {
      type: String,
      default: 'running'
    },

    tickets: {
      type: Object,
      required: true
    }
  },

  computed: {
    content() {
      return this.tickets?.content || []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
