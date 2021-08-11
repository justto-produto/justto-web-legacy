<template>
  <div class="configuration-blackList-view">
    <el-table
      :data="filteredBlackList"
      width="100%"
    >
      <el-table-column label="Termo bloqueado">
        <template v-slot="props">
          {{ props.row }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="400px"
      >
        <div
          slot="header"
          class="configuration-blackList-view__column-header"
        >
          <input
            v-model="search"
            class="el-input__inner"
            placeholder="Buscar"
          >
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="blackListDialogVisible = true"
          >
            Adicionar
          </el-button>
        </div>

        <div slot-scope="props">
          <el-tooltip content="Excluir">
            <el-button
              size="mini"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="deleteBlackList(props.row)"
            />
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="blackListDialogVisible"
      append-to-body
      title="Adicionar à blackList"
      label-position="top"
      width="40%"
    >
      <el-alert type="info">
        Exemplos: <br><br>
        <b>contato@empresa.com.br</b> bloqueará o envio automático de e-mails somente para o endereço específico.
        <br><br>
        <b>@empresa.com.br</b> bloqueará todos os e-mails de mesmo domínio.
        <br><br>
        <b>jose.silva</b> bloqueará todos os e-mails contendo <i>jose.silva</i>, como <i>jose.silva@gmail.com</i> e <i>jose.silva@outlook.com</i>.
        <br><br>
        <b>11999990000</b> bloqueará Whatsapp para o número específico, no caso <i>(11) 99999 0000</i>.
        <br><br>
        <b>1199020</b> bloqueará Whatsapp para todos os números iniciados com <i>1199020</i>, como <i>(11) 99020 9246</i>.
        <br>
      </el-alert>
      <el-form
        ref="blackListForm"
        :model="blackListForm"
        :rules="blackListRules"
        label-position="top"
        @submit.native.prevent="addBlackList"
      >
        <el-form-item
          label="Termo a ser bloqueado"
          prop="contact"
        >
          <el-input v-model="blackListForm.contact" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          plain
          @click="blackListDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          type="primary"
          @click="addBlackList"
        >Adicionar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationBlackList',

  data() {
    return {
      blackListDialogVisible: false,
      search: '',
      blackListForm: { contact: '' },
      blackListRules: { contact: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }] }
    }
  },

  computed: {
    filteredBlackList() {
      return this.$store.getters.workspaceBlackList.filter(minute => {
        if (!minute) {
          return false
        }
        return !this.search || minute.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },

  mounted() {
    this.search = ''
  },

  methods: {
    addBlackList() {
      this.$refs.blackListForm.validate(valid => {
        if (valid) {
          const blackList = [...this.$store.getters.workspaceBlackList]
          blackList.push(this.blackListForm.contact)
          this.$store.dispatch('patchBlackList', blackList).then(response => {
            this.$store.commit('setBlackList', blackList)
            this.blackListDialogVisible = false
            this.blackListForm.contact = ''
            this.$jusNotification({
              title: 'Yay!',
              message: 'Termo adicionado na blackList com sucesso',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          })
        }
      })
    },
    deleteBlackList(term) {
      this.$confirm('Tem certeza que deseja excluir?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        confirmButtonClass: 'el-button--danger',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            let blackList = [...this.$store.getters.workspaceBlackList]
            blackList = blackList.filter(a => a !== term)
            this.$store.dispatch('patchBlackList', blackList).then(response => {
              done()
              this.$store.commit('setBlackList', blackList)
            }).catch(error => {
              console.error(error)
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta excluída com sucesso',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.configuration-blackList-view {
  th.is-right .cell {
    display: flex;
  }
  .configuration-blackList-view__column-header {
    display: flex;
  }
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>
