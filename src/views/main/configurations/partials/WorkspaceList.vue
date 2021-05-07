<template>
  <section class="workspace-container">
    <el-table
      :data="workspaces"
      height="80vh"
      class="workspace-container__table"
    >
      <el-table-column
        prop="name"
        label="Workspace"
      />
      <el-table-column
        prop="teamName"
        label="Equipe"
      />
      <el-table-column
        prop="keyAccountId"
        label="Key Account"
      >
        <template slot-scope="scope">
          {{ scope.row.keyAccountId || '-' }}
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      workspaces: 'getMyWorkspaces'
    })
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions({
      getAssociatedKeyAccountByWorkspace: 'getAssociatedKeyAccountByWorkspace'
    }),

    init() {
      this.getAssociatedKeyAccountByWorkspace()
    }
  }
}
</script>

<style lang="scss">
  .workspace-container {
    .workspace-container__table {
      width: 100%;

      .el-table__body-wrapper {
        height: auto !important;
      }
    }
  }
</style>
