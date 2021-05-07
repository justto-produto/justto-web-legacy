<template>
  <section class="workspace-container">
    <el-table
      :data="workspaces"
      style="width: 100%"
    >
      <el-table-column
        prop="workspace.name"
        label="Workspace"
      />
      <el-table-column
        prop="workspace.teamName"
        label="Equipe"
      />
      <el-table-column
        prop="portifolios"
        label="Carteiras"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="(portifolio, portifolioIndex) in scope.row.portifolios"
            :key="`portifolioIndex-${portifolioIndex}`"
            style="margin: 4px;"
          >
            {{ portifolio }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="keyAccount.name"
        label="Key Account"
      />
      <el-table-column
        prop="keyAccount.email"
        label="Email"
      />
    </el-table>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      workspaces: 'getKeyAccountByWorkspace'
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
