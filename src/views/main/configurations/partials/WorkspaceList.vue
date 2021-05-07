<template>
  <section class="workspace-container">
    <el-table
      :data="workspaces"
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
          {{ keyAccountTemplate(scope.row.keyAccountId) }}
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
      workspaces: 'getMyWorkspaces',
      keyAccounts: 'getWorkspaceKeyAccounts'
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
    },

    keyAccountTemplate(keyAccountId) {
      const ka = this.keyAccounts.find(({ id }) => Number(id) === Number(keyAccountId))

      if (ka) {
        return (ka.name ? `${ka.name} - ` : '') + `${ka.email}`
      } else {
        return '-'
      }
    }
  }
}
</script>

<style lang="scss">
  .workspace-container {
    .workspace-container__table {
      width: 100%;
      max-height: 85vh;
      overflow-y: scroll;

      .el-table__body-wrapper {
        height: auto !important;
      }
    }
  }
</style>
