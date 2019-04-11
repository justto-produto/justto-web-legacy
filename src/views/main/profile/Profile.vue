<template lang="html">
  <jus-view-main class="profile-view" right-card-width="550">
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
        <el-form label-position="top">
          <el-form-item label="Nome">
            <el-input v-model="person.name">
              <el-button slot="append" @click="changeName">
                Alterar
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="$store.state.accountModule.email" disabled />
          </el-form-item>
          <el-form-item label="Nova senha">
            <el-input v-model="profileForm.newPassword" type="password">
              <el-button slot="append" @click="passwordModal">Alterar</el-button>
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
    </template>
    <template slot="right-card">
      <h3>WhatsApp</h3>
      <jus-whatsapp v-if="!$store.getters.isWhatsappOffline" />
      <div v-else>
        <h2>Desculpe :(</h2>
        <p>
          Nosso servidor Whatsapp encontra-se instável neste momento.<br>
          Tente novamente mais tarde ou entre em contato com nosso suporte técnico.
        </p>
      </div>
      <br>
      <hr>
      <br>
      <el-form label-position="top">
        <el-form-item label="Nome da equipe">
          <el-input v-model="teamName">
            <el-button slot="append" @click.prevent="changeWorkspaceName">Alterar</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <br>
      <hr>
      <br>
      <div class="profile-view__team">
        <h3>
          Equipe
          <a href="#" @click.prevent="dialogInvite = true">
            <jus-icon icon="add" />
          </a>
        </h3>
        <div v-for="member in teamMembers" :key="member.id">
          <div class="profile-view__members-list">
            <div class="member">
              <strong>{{ member.person.name }}: </strong>
              <span> {{ $t('profile.' + member.profile) }}</span>
            </div>
            <div class="actions">
              <a href="#" @click.prevent="removeMember(member.id, member.person.name)"><jus-icon icon="trash" /></a>
              <a href="#" @click.prevent="showEditMember(member)"><jus-icon icon="edit" /></a>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        v-if="currentEditMember.person"
        :title="currentEditMember.person.name"
        :visible.sync="dialogMember"
        width="400px">
        <el-form label-position="top">
          <el-form-item label="Perfil">
            <el-select v-model="currentEditMember.profile">
              <el-option
                v-for="role in roles"
                :key="role.key"
                :label="role.value"
                :value="role.key" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMember = false">Cancelar</el-button>
          <el-button type="primary" @click="editMember">Salvar alterações</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogPassword"
        :before-close="cancelChangePassword"
        title="Alterar senha"
        width="30%">
        <el-form label-position="top">
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
      <el-dialog
        :visible.sync="dialogInvite"
        class="profile-view__invite-dialog"
        title="Convide pessoas à sua equipe"
        width="600px">
        <el-form
          ref="inviteForm"
          :model="inviteForm"
          :rules="inviteFormRules"
          label-position="top"
          @submit.native.prevent="inviteTeammate">
          <el-form-item label="Email" prop="email">
            <el-input v-model="inviteForm.email" />
          </el-form-item>
          <el-form-item label="Perfil" prop="profile">
            <el-select v-model="inviteForm.profile">
              <el-option
                v-for="role in roles"
                :key="role.key"
                :label="role.value"
                :value="role.key" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">Convidar</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
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
      dialogMember: false,
      dialogInvite: false,
      roles: [{ key: 'NEGOTIATOR', value: 'Negociador' }, { key: 'ADMINISTRATOR', value: 'Administrador' }],
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
      inviteForm: {
        email: '',
        profile: 'NEGOTIATOR'
      },
      inviteFormRules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ]
      },
      syncedEmails: [],
      person: {},
      teamName: '',
      teamMembers: [],
      currentEditMember: {}
    }
  },
  beforeMount () {
    this.getSyncedEmails()
  },
  mounted () {
    this.getMembers()
    this.person = JSON.parse(JSON.stringify(this.$store.state.personModule.person))
    this.teamName = this.$store.state.workspaceModule.name + ''
    this.$store.dispatch('whatsappStatus').then((whatsapp) => {
      if (whatsapp.status === 'OFFLINE') {
        this.$store.dispatch('whatsappStart')
      } else {
        this.$store.commit('SOCKET_refresh', whatsapp)
      }
      this.$socket.emit('subscribe', '/whatsapp/' + this.$store.state.workspaceModule.subdomain)
    })
  },
  destroyed () {
    this.$socket.emit('unsubscribe', '/whatsapp/' + this.$store.state.workspaceModule.subdomain)
  },
  methods: {
    getMembers () {
      this.$store.dispatch('getWorkspaceMembers').then(response => {
        this.teamMembers = response
      })
    },
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
              window.analytics.track('Nome alterado')
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
        window.analytics.track('Senha alterada')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Senha alterada com sucesso.',
          type: 'success'
        })
        this.dialogPassword = false
      }).catch(error => {
        console.error(error)
        if (error.response.status === 401) {
          this.$jusNotification({
            title: 'Ops!',
            message: 'Senha atual incorreta',
            type: 'warning'
          })
        } else {
          this.$jusNotification({
            title: 'Ops!',
            message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
            type: 'error'
          })
        }
      })
    },
    removeEmail (id) {
      this.$confirm('Tem certeza que deseja remover este email sincronizado?', 'Excluir email', {
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.$store.commit('showLoading')
        this.$store.dispatch('removeInbox', id).then(() => {
          window.analytics.track('Email removido')
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
              window.analytics.track('Sincroniza novo e-mail')
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
    },
    removeMember (id, name) {
      this.$confirm('Tem certeza que deseja remover ' + name + ' da equipe?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('removeWorkspaceMember', id).then(() => {
          window.analytics.track('Membro removido')
          this.getMembers()
          this.$jusNotification({
            title: 'Yay!',
            message: 'Usuário removido com sucesso.',
            type: 'success'
          })
        })
      })
    },
    showEditMember (member) {
      this.currentEditMember = JSON.parse(JSON.stringify(member))
      this.dialogMember = true
    },
    editMember () {
      delete this.currentEditMember.person
      this.$store.dispatch('editWorkspaceMember', this.currentEditMember).then(() => {
        this.getMembers()
        this.dialogMember = false
        this.$jusNotification({
          title: 'Yay!',
          message: 'Usuário editado com sucesso.',
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
    changeWorkspaceName () {
      if (this.teamName) {
        this.$store.dispatch('editWorkpace', { name: this.teamName }).then(() => {
          window.analytics.track('Nome da equipe alterado')
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nome da equipe editada com sucesso.',
            type: 'success'
          })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome não pode ficar em branco.',
          type: 'warning'
        })
      }
    },
    inviteTeammate () {
      this.$refs['inviteForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('inviteTeammates', [{
            email: this.inviteForm.email,
            profile: this.inviteForm.profile
            // profile: 'NEGOTIATOR'
          }]).then(response => {
            window.analytics.track('Novo usuário convidado')
            this.$jusNotification({
              title: 'Yay!',
              message: 'Convite enviado com sucesso.',
              type: 'success'
            })
            this.dialogInvite = false
            this.inviteForm.email = ''
            this.inviteForm.profile = 'NEGOTIATOR'
            this.getMembers()
          }).catch(error => {
            console.error(error)
            this.$jusNotification({
              title: 'Ops!',
              message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
              type: 'error'
            })
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
  &__invite-dialog {
    .el-button {
      float: right;
      margin-top: 10px;
      margin-bottom: 40px;
    }
  }
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
  &__team {
    h3 a {
      float: right;
    }
  }
  &__members-list {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    a + a {
      margin-left: 10px;
    }
    .member {
      span {
        text-transform: capitalize;
      }
    }
  }
  .el-card__body {
    position: relative;
    height: fit-content;
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
  .el-dialog {
    .el-select {
      width: 100%;
    }
  }
}
</style>
