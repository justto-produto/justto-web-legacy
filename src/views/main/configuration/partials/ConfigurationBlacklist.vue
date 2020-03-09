<template lang="html">
  <div class="configuration-blacklist-view">
    <el-table v-loading="loadingBlacklist" :data="filteredBlacklist" width="100%">
      <el-table-column prop="contact" label="Termo bloqueado"/>
      <el-table-column align="right" width="400px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            placeholder="Buscar"/>
          <el-button type="primary" icon="el-icon-plus" @click="blacklistDialogVisible = true">
            Adicionar
          </el-button>
        </template>
        <template slot-scope="props">
          <el-tooltip content="Excluir">
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteBlacklist(props.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="blacklistDialogVisible"
      title="Adicionar à blacklist"
      label-position="top"
      width="40%">
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
      <el-form :model="blacklistForm">
        <el-form-item label="Termo a ser bloqueado">
          <el-input v-model="blacklistForm.contact" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button plain @click="blacklistDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="blacklistDialogVisible = false">Adicionar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationBlacklist',
  data () {
    return {
      loadingBlacklist: true,
      blacklistDialogVisible: false,
      search: '',
      blacklist: [{
        id: 1,
        contact: 'a@a.com'
      }, {
        id: 2,
        contact: '(12) 988888384'
      }, {
        id: 3,
        contact: 'b@b.com'
      }],
      blacklistForm: { contact: '' }
    }
  },
  computed: {
    filteredBlacklist () {
      return this.blacklist.filter(minute => {
        if (!minute.contact) {
          return false
        }
        return !this.search || minute.contact.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted () {
    // this.fetchMinutes()
    setTimeout(() => {
      this.loadingBlacklist = false
    }, 1000)
  },
  methods: {
    fetchBlacklist () {
      // this.loadingBlacklist = true
      // this.$store.dispatch('getDocumentModels').then(response => {
      //   this.minutes = response
      // }).catch(error => {
      //   console.error(error)
      // }).finally(() => {
      //   this.loadingBlacklist = false
      // })
    },
    addBlacklist () {
      this.$prompt('Insira a URL (Google Docs) do documento:', 'Adicionar minuta', {
        confirmButtonText: 'Adicionar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        inputPattern: /.*docs\.google\.com.*/,
        inputErrorMessage: 'URL inválida',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$store.dispatch('addModel', instance.inputValue).then(response => {
              this.fetchMinutes()
            }).catch(error => {
              console.error(error)
              this.$jusNotification({
                title: 'Ops!',
                message: 'Houve uma falha ao adicionar minuta. Certifique-se de que o documento adicionado é público.',
                type: 'warning'
              })
            }).finally(() => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(({ value }) => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta adicionada com sucesso',
          type: 'success'
        })
      })
    },
    deleteBlacklist (modelId) {
      this.$confirm('Tem certeza que deseja excluir?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        confirmButtonClass: 'el-button--danger',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$store.dispatch('deleteModel', modelId).then(response => {
              done()
              this.fetchMinutes()
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
.configuration-blacklist-view {
  th.is-right .cell {
    display: flex;
  }
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>
