<template>
  <section class="workspace-container">
    <el-table
      :data="filteredWorkspaces"
      style="width: 100%"
      height="95vh"
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
      <el-table-column
        label="Portifolio"
      >
        <template>
          <el-select
            v-model="portifolios"
            size="small"
            multiple
          >
            <el-option
              v-for="(portifolio, pIndex) in portifolioList"
              :key="`portifolio${pIndex}`"
              :label="portifolio.name"
              :value="portifolio.name"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template
          slot="header"
        >
          <div class="el-input el-input--mini">
            <input
              v-model="search"
              placeholder="Pesquise aqui"
              class="el-input__inner"
              @input="$forceUpdate()"
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="60"
      >
        <template>
          <el-button
            icon="el-icon-edit"
            size="small"
            circle
          />
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    search: '',
    portifolios: []
  }),

  computed: {
    ...mapGetters({
      workspaces: 'getMyWorkspaces',
      keyAccounts: 'getWorkspaceKeyAccounts',
      portifolioList: 'getPortifolio'
    }),

    filteredWorkspaces() {
      if (!this.search) {
        return this.workspaces
      } else {
        return this.workspaces.filter(({ name, teamName, keyAccountId }) => {
          const lowerCaseSearch = this.search.toLocaleLowerCase()

          const lowerCaseTeamName = (teamName || '').toLocaleLowerCase()
          const lowerCaseKeyAccount = this.keyAccountTemplate(keyAccountId).toLocaleLowerCase()
          const lowerCaseName = (name || '').toLocaleLowerCase()

          return lowerCaseTeamName.includes(lowerCaseSearch) || lowerCaseName.includes(lowerCaseSearch) || lowerCaseKeyAccount.includes(this.search)
        })
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions([
      'myWorkspace',
      'getWorkspaceKeyAccounts',
      'getPortifolio'
    ]),

    init() {
      this.myWorkspace()
      this.getPortifolio()
      this.getWorkspaceKeyAccounts()
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
