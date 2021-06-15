<template>
  <section
    v-loading="isLoading"
    class="workspace-container"
  >
    <el-table
      :data="filteredWorkspaces"
      style="width: 100%"
      height="95vh"
      class="workspace-container__table"
      @row-click="handleRowClick"
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
        <template v-slot="scope">
          <el-select
            v-if="scope.row.id === activeRow"
            :id="`ka-select-${scope.row.id}`"
            :value="scope.row.keyAccountId"
            size="small"
            filterable
            @change="saveKeyAccountInToWorkspace($event, scope.row)"
          >
            <el-option
              v-for="keyAccount in keyAccounts"
              :key="`key-account-${keyAccount.id}`"
              :value="keyAccount.id"
              :label="keyAccountTemplate(keyAccount)"
            />
          </el-select>

          <span
            v-else
            :style="{cursor: 'pointer'}"
          >
            {{ keyAccountTemplate(findKeyAccount(scope.row.keyAccountId)) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="portifolios"
        label="Portifolios"
      >
        <template v-slot="scope">
          <span
            :style="{ cursor: 'pointer' }"
            @click="openPortifolioDialog(scope.row.id)"
          >Ver portifolios</span>
          <!-- <el-select
            :value="scope.row.portifolios"
            size="small"
            multiple
            @change="setPortifolioToWorkspace($event, scope.row)"
          >
            <el-option
              v-for="(portifolio) in portifolios"
              :key="`portifolio-${portifolio.id}-workspace-${scope.row.id}`"
              :value="portifolio.id"
              :label="portifolio.name"
            />
          </el-select> -->
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

    <el-dialog
      title="Portifolios"
      :visible.sync="dialog.visible"
      append-to-body
    >
      <span>This is a message</span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data: () => ({
    isLoading: false,
    search: '',
    dialog: {
      visible: false,
      workspace: null
    },
    activeRow: null
  }),

  computed: {
    ...mapGetters({
      workspaces: 'getMyWorkspaces',
      keyAccounts: 'getWorkspaceKeyAccounts',
      portifolios: 'getPortifolios'
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

  beforeMount() {
    this.init()
  },

  methods: {
    ...mapActions([
      'myWorkspace',
      'getPortifolios',
      'getPortifolioAssociated',
      'getWorkspaceKeyAccounts',
      'setPortifolioToWorkspace',
      'updateWorkspaceKeyAccount'
    ]),

    init() {
      this.isLoading = true

      Promise.all([
        this.myWorkspace(),
        this.getPortifolios(),
        this.getWorkspaceKeyAccounts()
      ]).then(() => {}).finally(() => {
        this.isLoading = false
      })
    },

    findKeyAccount(keyAccountId) {
      return this.keyAccounts.find(({ id }) => Number(id) === Number(keyAccountId))
    },

    keyAccountTemplate(ka) {
      if (ka) {
        return (ka.name ? `${ka.name} - ` : '') + `${ka.email}`
      } else {
        return '-'
      }
    },

    openPortifolioDialog(workspaceId) {
      this.isLoading = true

      this.getPortifolioAssociated(workspaceId).then(res => {
        console.log(res)
        this.dialog.workspace = workspaceId
        this.dialog.visible = true
      }).finally(() => {
        this.isLoading = false
      })
    },

    setPortifolioToWorkspace(portifolio, workspace) {
      if (_.difference(portifolio, workspace.portifolios).length) {
        console.log('inserir')
      } else if (_.difference(workspace.portifolios, portifolio).length) {
        console.log('remover')
      }
      // this.setPortifolioToWorkspace()
    },

    handleRowClick(row, column, _event) {
      switch (column.property) {
        case 'keyAccountId':
          this.setActiveRow(row.id)
          break
        default:
          console.log(column)
          break
      }
    },

    setActiveRow(row) {
      this.activeRow = row
      this.$nextTick(() => {
        if (document.querySelector(`#ka-select-${row}`)) {
          document.querySelector(`#ka-select-${row}`).click()
        }
      })
    },

    saveKeyAccountInToWorkspace(keyAccountId, { id }) {
      this.updateWorkspaceKeyAccount({ keyAccountId, workspaceId: id }).then(() => {
        this.setActiveRow(null)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.workspace-container {
  width: 100%;
}
</style>
