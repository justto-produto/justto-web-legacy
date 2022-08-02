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
        align="right"
        prop="portifolios"
        class-name="portifolios-column"
      >
        <template
          v-if="!hideSearch"
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

        <template v-slot="scope">
          <el-tag
            v-for="tag in scope.row.portifolios"
            :key="tag.id"
            size="mini"
          >
            {{ portifolioById(tag.id).name }}
          </el-tag>

          <a v-if="scope.row.portifolios.length === 0">Ver tipos de carteira</a>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Tipos de carteira"
      :visible.sync="dialog.visible"
      append-to-body
      custom-class="portifolios-dialog"
    >
      <el-select
        v-model="handledDialogPortifolios"
        v-loading="isLoading"
        size="small"
        default-first-option
        allow-create
        filterable
        multiple
      >
        <el-option
          v-for="portifolio in portifolios"
          :key="`portifolio-${portifolio.id}`"
          :value="portifolio.id"
          :label="portifolio.name"
        />
      </el-select>

      <span slot="footer">
        <el-button @click="closeDialog()">Cancelar</el-button>
        <el-button
          type="primary"
          :disabled="disableSavePortifolios"
          @click="salvarPortifolios"
        >
          Salvar
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  props: {
    filterTerm: {
      type: String,
      default: () => ''
    },

    hideSearch: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    isLoading: false,
    modelSearch: '',
    dialog: {
      visible: false,
      workspace: null,
      portifolios: []
    },
    activeRow: null
  }),

  computed: {
    ...mapGetters({
      workspaces: 'getMyWorkspaces',
      keyAccounts: 'getWorkspaceKeyAccounts',
      portifolios: 'getPortifolios',
      portifoliosByWorkspace: 'getPortifoliosByWorkspace'
    }),

    search: {
      get() {
        return this.modelSearch || this.filterTerm
      },

      set(value) {
        this.modelSearch = value
      }
    },

    portifolioById() {
      return (id) => this.portifolios.find(portifolio => Number(portifolio.id) === Number(id))
    },

    filteredWorkspaces() {
      if (!this.search) {
        return this.workspaces.map(item => ({
          portifolios: [],
          ...item
        }))
      } else {
        return this.workspaces.filter(({ name, teamName, keyAccountId }) => {
          const lowerCaseSearch = this.search.toLocaleLowerCase()

          const lowerCaseTeamName = (teamName || '').toLocaleLowerCase()
          const lowerCaseKeyAccount = (this.keyAccountTemplate(this.findKeyAccount(keyAccountId)) || '').toLocaleLowerCase()
          const lowerCaseName = (name || '').toLocaleLowerCase()

          return lowerCaseTeamName.includes(lowerCaseSearch) || lowerCaseName.includes(lowerCaseSearch) || lowerCaseKeyAccount.includes(lowerCaseSearch)
        }).map(item => ({
          portifolios: [],
          ...item
        }))
      }
    },

    handledDialogPortifolios: {
      get() {
        return this.portifoliosByWorkspace[this.dialog.workspace] || []
      },

      set(values) {
        const portifolios = values.filter(name => {
          if (typeof name === 'string') {
            this.createPortifolioAndInsert({
              name,
              workspaceId: this.dialog.workspace
            }).finally(() => this.$forceUpdate())

            return false
          }

          return true
        })

        this.insertPortifolios({
          portifolios,
          workspaceId: this.dialog.workspace
        })
      }
    },

    disableSavePortifolios() {
      return _.isEqual(this.handledDialogPortifolios, this.dialog.portifolios)
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
      'updateWorkspaceKeyAccount',
      'createPortifolioAndInsert',
      'associatePortifolioToWorkspace',
      'disassociatePortifolioToWorkspace'
    ]),

    ...mapMutations([
      'insertPortifolios'
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

    updateWorkspacePortifolios(workspaceId, portifolios) {
      this.$set(this.workspaces.find(({ id }) => Number(id) === Number(workspaceId)), 'portifolios', portifolios)
    },

    openPortifolioDialog(workspaceId) {
      this.isLoading = true

      this.getPortifolioAssociated(workspaceId).then(portifolios => {
        this.updateWorkspacePortifolios(workspaceId, portifolios)

        this.dialog = {
          portifolios: portifolios.map(({ id }) => Number(id)),
          visible: true,
          workspace: workspaceId
        }

        this.handledDialogPortifolios = portifolios.map(({ id }) => Number(id))
      }).finally(() => {
        this.isLoading = false
      })
    },

    salvarPortifolios() {
      const toSave = _.difference(this.handledDialogPortifolios, this.dialog.portifolios)
      const toRemove = _.difference(this.dialog.portifolios, this.handledDialogPortifolios)
      const workspaceId = this.dialog.workspace

      this.isLoading = true

      Promise.all([
        ...toRemove.map(portifolioId => this.disassociatePortifolioToWorkspace({ portifolioId, workspaceId })),
        ...toSave.map(portifolioId => this.associatePortifolioToWorkspace({ portifolioId, workspaceId }))
      ]).then(() => {
        this.updateWorkspacePortifolios(workspaceId, this.handledDialogPortifolios.map(id => ({ id })))

        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Tipos de carteira salvos com sucesso'
        })
        this.closeDialog()
      }).finally(() => {
        this.isLoading = false
      })
    },

    closeDialog() {
      this.dialog = {
        portifolios: [],
        visible: false,
        workspace: null
      }
    },

    handleRowClick(row, column, _event) {
      switch (column.property) {
        case 'portifolios':
          this.openPortifolioDialog(row.id)
          break
        case 'keyAccountId':
          this.setActiveRow(row.id)
          break
        default:
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

<style lang="scss">
.portifolios-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
  }
}

.portifolios-column {
  padding: 4px 0 !important;

  .cell {
    .el-tag {
      margin: 4px;
    }
  }
}
</style>

<style lang="scss" scoped>
.workspace-container {
  width: 100%;
}
</style>
