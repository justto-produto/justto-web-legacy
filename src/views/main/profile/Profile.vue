<template lang="html">
  <jus-view-main class="profile-view" right-card-width="500">
    <template slot="title">
      <h1>
        <router-link to="/">
          <jus-icon icon="back" />
        </router-link>
        Configurações de usuário
      </h1>
    </template>
    <template slot="main">
      <div class="profile-view__container">
        <el-form>
          <el-form-item label="Nome">
            <el-input v-model="person.name">
              <el-button slot="append" @click="changeName">
                Salvar
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="$store.state.accountModule.email" disabled />
          </el-form-item>
          <el-form-item label="Nova senha">
            <el-input v-model="profileForm.newPassword" type="password">
              <el-button slot="append" @click="passwordModal">Alterar senha</el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <br>
        <hr>
        <br>
        <h3>E-mails sincronizados de contato com as partes</h3>
        <el-form
          v-loading="$store.state.loading"
          ref="syncForm"
          :model="syncForm"
          :rules="syncFormRules"
          label-position="top"
          class="profile-view__sync-form"
          @submit.native.prevent="syncNewEmail">
          <el-form-item label="Email" prop="email">
            <el-input v-model="syncForm.email" type="text"/>
          </el-form-item>
          <el-form-item label="Senha" prop="password">
            <el-input v-model="syncForm.password" type="password"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">Sincronizar novo email</el-button>
          </el-form-item>
        </el-form>
        <el-collapse v-loading="$store.state.loading">
          <el-collapse-item title="Lista de emails sincronizados">
            <div v-for="email in syncedEmails" :key="email.id" class="profile-view__synced-email">
              {{ email.email }}
              <a href="#" @click.prevent="removeEmail(email.id)">
                <jus-icon icon="trash" />
              </a>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-dialog
        :visible.sync="dialogPassword"
        :before-close="cancelChangePassword"
        title="Alterar senha"
        width="30%">
        <el-form>
          <el-form-item label="Nova senha">
            <el-input v-model="profileForm.newPassword" type="password" disabled />
          </el-form-item>
          <el-form-item label="Senha atual">
            <el-input v-model="profileForm.password" type="password" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelChangePassword">Cancelar</el-button>
          <el-button :disabled="!profileForm.password.length" type="primary" @click="updatePassword">
            Alterar
          </el-button>
        </span>
      </el-dialog>
    </template>
    <template slot="right-card">
      <jus-whatsapp />
    </template>
  </jus-view-main>
</template>

<script>
import JusWhatsapp from '@/components/layouts/JusWhatsapp'

export default {
  name: 'Profile',
  components: {
    JusWhatsapp
  },
  data () {
    return {
      dialogPassword: false,
      profileForm: {
        newPassword: '',
        password: ''
      },
      syncForm: {
        email: '',
        password: ''
      },
      syncFormRules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'change' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['change'] }
        ],
        password: [
          { required: true, message: 'Campo obrigatório', trigger: 'change' }
        ]
      },
      syncedEmails: [],
      person: {}
    }
  },
  beforeMount () {
    this.getSyncedEmails()
  },
  mounted () {
    this.person = JSON.parse(JSON.stringify(this.$store.state.personModule.person))
  },
  methods: {
    getSyncedEmails () {
      this.$store.dispatch('getInbox').then(response => {
        this.syncedEmails = response.content
      })
    },
    changeName () {
      if (this.person.name) {
        if (this.person.name.length > 2) {
          this.$store.dispatch('setPerson', this.person)
            .then(response => {
              this.$jusNotification({
                title: 'Yay!',
                message: 'Nome alterado com sucesso.',
                type: 'success'
              })
            }).catch(error => {
              console.error(error)
              this.$jusNotification({
                title: 'Ops!',
                message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
                type: 'error'
              })
            })
        } else {
          this.$jusNotification({
            title: 'Ops!',
            message: 'Nome precisa conter mais de 3 caracteres.',
            type: 'warning'
          })
        }
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome não pode ficar em branco.',
          type: 'warning'
        })
      }
    },
    cancelChangePassword () {
      this.dialogPassword = false
    },
    passwordModal () {
      if (this.profileForm.newPassword) {
        if (this.profileForm.newPassword.length < 6) {
          this.$jusNotification({
            title: 'Ops!',
            message: 'Senha precisa conter no mínimo 6 caracteres.',
            type: 'warning'
          })
        } else {
          this.profileForm.password = ''
          this.dialogPassword = true
        }
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Senha não pode ficar em branco.',
          type: 'warning'
        })
      }
    },
    updatePassword () {
      this.$store.dispatch('updatePassword', {
        password: this.profileForm.newPassword,
        oldPassword: this.profileForm.password
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Senha alterada com sucesso.',
          type: 'success'
        })
      }).catch(error => {
        console.error(error)
        this.$jusNotification({
          title: 'Ops!',
          message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
          type: 'error'
        })
      })
    },
    removeEmail (id) {
      this.$confirm('Tem certeza que deseja remover este email sincronizado?', 'Remover email', {
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.$store.commit('showLoading')
        this.$store.dispatch('removeInbox', id).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Email removido com sucesso.',
            type: 'success'
          })
          var self = this
          setTimeout(function () {
            self.$store.commit('hideLoading')
            self.getSyncedEmails()
          }, 1000)
        }).catch(error => {
          console.error(error)
          this.$store.commit('hideLoading')
          this.$jusNotification({
            title: 'Ops!',
            message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
            type: 'error'
          })
        })
      })
    },
    syncNewEmail () {
      this.$refs['syncForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('showLoading')
          this.$store.dispatch('syncInbox', this.syncForm)
            .then(response => {
              this.$jusNotification({
                title: 'Yay!',
                message: 'Email sincronizado com sucesso.',
                type: 'success'
              })
            }).catch(error => {
              console.error(error)
              this.$jusNotification({
                title: 'Ops!',
                message: 'Não foi possível sincronizar seu email. Tente novamente ou entre em contato com o administrador do sistema.',
                type: 'error'
              })
            }).finally(() => {
              this.$store.dispatch('hideLoading')
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.profile-view {
  &__sync-form {
    .el-button {
      width: 100%;
    }
  }
  &__container {
    max-width: 400px;
    margin: auto;
    margin-top: 20px;
  }
  &__synced-email {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 10px 5px;
    &:hover {
      background-color: #eeeeee;
    }
  }
  .el-card__body {
    position: relative;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
}
</style>
