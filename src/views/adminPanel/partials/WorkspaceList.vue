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
      >
        <template v-slot="scope">
          {{ scope.row.name }}

          <el-popover
            ref="worspaceNameEditPopover"
            title="Editar"
            width="auto"
            trigger="click"
            popper-class="worspace-name__edit"
          >
            <i
              slot="reference"
              class="el-icon-edit"
            />

            <article>
              <el-input
                v-model="scope.row.name"
                size="mini"
                @keyup.enter.native="handleEditWorkspace(scope.row)"
              />

              <el-button
                type="success"
                size="mini"
                @click="handleEditWorkspace(scope.row)"
              >
                Salvar
              </el-button>
            </article>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="teamName"
        label="Equipe"
      >
        <template v-slot="scope">
          {{ scope.row.teamName }}

          <el-popover
            ref="worspaceTeamNameEditPopover"
            title="Editar"
            width="auto"
            trigger="click"
            popper-class="worspace-name__edit"
          >
            <i
              slot="reference"
              class="el-icon-edit"
            />

            <article>
              <el-input
                v-model="scope.row.teamName"
                size="mini"
                @keyup.enter.native="handleEditWorkspace(scope.row)"
              />

              <el-button
                type="success"
                size="mini"
                @click="handleEditWorkspace(scope.row)"
              >
                Salvar
              </el-button>
            </article>
          </el-popover>
        </template>
      </el-table-column>

      <!-- <el-table-column
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
      </el-table-column> -->

      <el-table-column
        align="right"
        prop="archived"
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

        <div
          slot-scope="scope"
          class="portifolios-column__container"
        >
          <el-popover
            ref="worspaceTeamNameEditPopover"
            title="Convidar"
            width="auto"
            trigger="click"
            popper-class="worspace-name__edit"
          >
            <el-button
              slot="reference"
              :disabled="scope.row.archived"
              icon="el-icon-plus"
              size="mini"
              circle
            />

            <article>
              <label for="inviteForm__email">E-mail</label>

              <div class="el-input--mini">
                <input
                  id="inviteForm__email"
                  v-model="inviteForm.email"
                  type="email"
                  name="inviteForm__email"
                  class="el-input__inner"
                  @input="$forceUpdate()"
                >
              </div>

              <label>Perfil</label>

              <el-select
                v-model="inviteForm.profile"
                size="mini"
              >
                <el-option
                  v-for="item in ['NEGOTIATOR', 'ADMINISTRATOR']"
                  :key="item"
                  :label="$t('profile.' + item).toUpperCase()"
                  :value="item"
                />
              </el-select>

              <el-button
                type="success"
                size="mini"
                @click="handleInviteEmail(scope.row)"
              >
                Convidar
              </el-button>
            </article>
          </el-popover>

          <el-switch
            :value="!(scope.row.archived)"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleArchiveWorkspace(!$event, scope.row)"
          />
        </div>
      </el-table-column>

      <!-- <el-table-column
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
      </el-table-column> -->
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
    workspaces: [],
    activeRow: null,
    debounce: null,
    inviteForm: {
      email: '',
      profile: ''
    }
  }),

  computed: {
    ...mapGetters({
      keyAccounts: 'getWorkspaceKeyAccounts',
      portifolios: 'getPortifolios',
      portifoliosByWorkspace: 'getPortifoliosByWorkspace'
    }),

    search: {
      get() {
        return this.modelSearch || this.filterTerm
      },

      set(value) {
        clearTimeout(this.debounce)

        this.debounce = setTimeout(() => {
          this.modelSearch = value
        }, 250)
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
      'editWorkpace',
      'getPortifolios',
      'adminWorkspaces',
      'adminWorkspaceUsers',
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

      // Promise.all([
      //   this.myWorkspace(),
      //   this.getPortifolios(),
      //   this.getWorkspaceKeyAccounts()
      // ]).then(() => {}).finally(() => {
      //   this.isLoading = false
      // })

      this.adminWorkspaces({ method: 'get', params: { size: 99999 } }).then(({ content: workspaces }) => {
        this.$set(this, 'workspaces', [])
        this.workspaces = workspaces
        this.isLoading = false
      }).finally(() => {
        this.isLoading = false
      })
    },

    findKeyAccount(keyAccountId) {
      return (this.keyAccounts || []).find(({ id }) => Number(id) === Number(keyAccountId))
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
    },

    handleEditWorkspace(data) {
      document.querySelector('.admin-panel-view__panel-header').click()

      this.isLoading = true

      this.adminWorkspaces({ method: 'put', data }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Alteração salva com sucesso!',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(this.init)
    },

    handleArchiveWorkspace(archived, workspace) {
      this.$confirm(`Deseja realmente <strong>${archived ? 'desativar' : 'reativar'}</strong> a workspace <strong>${workspace.name}</strong>?`, 'Atenção', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        center: true
      }).then(() => {
        this.adminWorkspaces({
          method: 'put',
          data: {
            ...workspace,
            archived
          }
        }).then(() => this.$jusNotification({
          title: 'Yay!',
          message: 'Ação executada com sucesso.',
          type: 'success'
        })).catch(error => this.$jusNotification({
          error
        })).finally(this.init)
      })
    },

    handleInviteEmail({ subDomain }) {
      this.adminWorkspaceUsers({
        method: 'post',
        url: `api/accounts/workspaces/invite-teammates/${subDomain}`,
        data: [{ ...this.inviteForm }],
        headers: { Workspace: subDomain }
      }).then(() => this.$jusNotification({
        title: 'Yay!',
        message: 'Convite enviado.',
        type: 'success'
      })).catch(error => this.$jusNotification({
        error
      })).finally(() => {
        document.querySelector('.admin-panel-view__panel-header').click()
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

    .portifolios-column__container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 16px;
    }
  }
}

.el-table__row {
  .el-table__cell {
    .cell {
      .el-select {
        background-color: transparent;

        .el-input {
          overflow: hidden;
          background-color: transparent;

          .el-input__inner {
            border: none;
            text-align: left;
            padding-left: 0;
            background-color: transparent;
          }

          .el-input__suffix {
            visibility: hidden;
          }
        }
      }

      .el-icon-edit {
        display: none;
        cursor: pointer;
      }

      &:hover {
        .el-icon-edit {
          display: inline;
        }

        .el-select {
          .el-input {
            .el-input__suffix {
              visibility: visible;
            }
          }
        }
      }
    }
  }
}

.worspace-name__edit {
  .el-popover__title {
    text-align: center;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 20vw;

    .actions {
      display: flex;
      gap: 8px;

      .el-button {
        flex: 1;
        margin: 0;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.workspace-container {
  width: 100%;
}
</style>
