<template lang="html">
  <jus-view-main :class="{'configuration-view--user': !isAdminProfile}" class="configuration-view" right-card-width="550">
    <template slot="title">
      <h1>Configurações</h1>
    </template>
    <template slot="main">
      <el-tabs tab-position="top" value="profile">
        <el-tab-pane label="Perfil" name="profile">
          <el-form
            ref="profileForm"
            :model="profileForm"
            :rules="profileFormRules"
            label-position="top">
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
              <el-input v-model="profileForm.newPassword" :type="passwordType" auto-complete="new-password" @keyup.enter.native="passwordModal">
                <span slot="append" class="float-button">
                  <el-button type="text" @click="showPassword = !showPassword">
                    <jus-icon
                      :icon="showPassword ? 'hide' : 'eye'"
                      class="show-password" />
                  </el-button>
                </span>
                <el-button slot="append" @click="passwordModal">Alterar</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="Contato" prop="phone">
              <el-input v-mask="['(##) ####-####', '(##) #####-####']" v-model="profileForm.phone">
                <el-button slot="append" @click="updatePhone">Alterar</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Equipe" name="team">
          <div class="configuration-view__team">
            <el-form label-position="top">
              <h3>Alterar nome da Equipe</h3>
              <el-alert
                :closable="false"
                type="info"
                show-icon>
                <span slot="title">
                  Este nome <strong>NÃO</strong> irá aparecer nas mensagens automáticas. Utilize-o para organização interna.
                </span>
              </el-alert>
              <br>
              <el-form-item label="Nome da equipe">
                <el-input v-model="teamName">
                  <el-button slot="append" @click.prevent="changeTeamName">Alterar nome</el-button>
                </el-input>
              </el-form-item>
            </el-form>
            <h3 class="mt40 mb30">Membros da equipe</h3>
            <div v-for="member in teamMembers" :key="member.id">
              <div class="configuration-view__members-list">
                <div class="member">
                  <strong>{{ member.person.name }}: </strong>
                  <span> {{ $t('profile.' + member.profile) | capitalize }}(a)</span>
                </div>
                <div class="actions">
                  <a href="#" @click.prevent="showEditMember(member)"><jus-icon icon="edit" /></a>
                  <a href="#" @click.prevent="removeMember(member.id, member.person.name)"><jus-icon icon="trash" /></a>
                </div>
              </div>
            </div>
            <el-button type="primary" @click="dialogInvite = true">
              Convidar novo membro
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Empresa" name="company">
          <div class="configuration-view__company">
            <h3>Alterar nome da empresa/escritório</h3>
            <el-alert
              :closable="false"
              type="info"
              show-icon>
              <span slot="title">
                Este nome <strong>IRÁ</strong> aparecer em todas as mensagens automáticas enviadas pela Justto.
              </span>
            </el-alert>
            <br>
            <el-form label-position="top">
              <el-form-item label="Nome da empresa/escritório">
                <el-input v-model="companyName">
                  <el-button slot="append" @click.prevent="changeCompanyName">Alterar</el-button>
                </el-input>
              </el-form-item>
            </el-form>
            <h3 class="mt40">Criação de novas equipes</h3>
            <p>
              Se o seu escritório possui mais de uma célula de negociação, você
              pode criar uma nova equipe e se organizar melhor.
            </p>
            <el-button type="secondary" @click="createWorkspace">
              Criar nova Equipe
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Blacklist" name="blacklist" class="configuration-view__blacklist">
          <configuration-blacklist />
        </el-tab-pane>
        <el-tab-pane v-if="$store.getters.isJusttoAdmin" name="minute" class="configuration-view__minute">
          <span slot="label">
            <el-tooltip content="Somentes administradores Justto">
              <i class="el-icon-lock"/>
            </el-tooltip>
            Minuta
          </span>
          <panel-minute />
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        v-if="currentEditMember.person"
        :close-on-click-modal="false"
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
        <span slot="footer">
          <el-button plain @click="dialogMember = false">Cancelar</el-button>
          <el-button type="primary" @click="editMember">Salvar alterações</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogPassword"
        :before-close="cancelChangePassword"
        title="Alterar senha"
        width="40%">
        <el-form
          ref="profileForm"
          :disabled="loadingUpdatePassword"
          :model="profileForm"
          :rules="profileFormRules"
          label-position="top">
          <el-form-item label="Nova senha">
            <el-input v-model="profileForm.newPassword" type="password" disabled />
          </el-form-item>
          <el-form-item label="Confirme a senha atual" prop="password">
            <el-input v-model="profileForm.password" :type="passwordType" auto-complete="new-password" @keyup.enter.native="updatePassword">
              <el-button slot="append" @click="showPassword = !showPassword">
                <jus-icon
                  :icon="showPassword ? 'hide' : 'eye'"
                  class="show-password" />
              </el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button plain @click="cancelChangePassword">Cancelar</el-button>
          <el-button :loading="loadingUpdatePassword" type="primary" @click="updatePassword">Alterar senha</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogInvite"
        title="Convide pessoas à sua equipe"
        width="50%">
        <el-form
          ref="inviteForm"
          :disabled="loadingInvite"
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
        </el-form>
        <span slot="footer">
          <el-button :loading="loadingInvite" type="primary" @click="inviteTeammate">Convidar</el-button>
        </span>
      </el-dialog>
    </template>
  </jus-view-main>
</template>

<script>
import { mask } from 'vue-the-mask'
import { validatePhone } from '@/utils/validations'

export default {
  name: 'Configuration',
  directives: { mask },
  components: {
    ConfigurationBlacklist: () => import('./partials/ConfigurationBlacklist'),
    PanelMinute: () => import('@/views/adminPanel/partials/PanelMinute')
  },
  data () {
    return {
      dialogPassword: false,
      dialogMember: false,
      dialogInvite: false,
      loadingInvite: false,
      loadingUpdatePassword: false,
      showPassword: false,
      roles: [{ key: 'NEGOTIATOR', value: 'Negociador(a)' }, { key: 'ADMINISTRATOR', value: 'Administrador(a)' }],
      profileForm: {
        newPassword: '',
        password: '',
        phone: ''
      },
      profileFormRules: {
        phone: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }
        ],
        password: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
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
      companyName: '',
      teamMembers: [],
      currentEditMember: {}
    }
  },
  computed: {
    isAdminProfile () {
      return this.$store.getters.isAdminProfile
    },
    passwordType () {
      return this.showPassword ? 'text' : 'password'
    }
  },
  mounted () {
    this.getMembers()
    this.person = JSON.parse(JSON.stringify(this.$store.getters.loggedPerson))
    this.teamName = this.$store.state.workspaceModule.teamName + ''
    this.companyName = this.$store.state.workspaceModule.name + ''
    this.profileForm.phone = this.$store.getters.loggedPersonPhone ? this.$store.getters.loggedPersonPhone.number : ''
    if (this.profileForm.phone && this.profileForm.phone.length === 13) {
      this.profileForm.phone = this.profileForm.phone.substr(2)
    } else {
      this.profileForm.phone = this.profileForm.phone
    }
  },
  methods: {
    createWorkspace () {
      this.$confirm('Você será redirecionado para a criação de nova Equipe, deseja continuar?', 'Redirecionamento', {
        confirmButtonText: 'Criar nova Equipe',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        type: 'warning'
      }).then(() => {
        this.$store.commit('redirectNewWorkspaceTrue')
        this.$router.push('onboarding')
      })
    },
    getMembers () {
      this.$store.dispatch('getWorkspaceMembers').then(response => {
        this.teamMembers = response
          .sort((a, b) => a.person.name < b.person.name ? -1 : a.person.name > b.person.name ? 1 : 0)
          .filter(r => !r.archived)
      })
    },
    changeName () {
      if (this.person.name) {
        if (this.person.name.length > 2) {
          this.$store.dispatch('changePersonName', this.person)
            .then(response => {
              // SEGMENT TRACK
              this.$jusSegment('Nome do usuário alterado')
              this.$jusNotification({
                title: 'Yay!',
                message: 'Nome alterado com sucesso.',
                type: 'success'
              })
            }).catch(e => {
              console.error(e)
              this.$jusNotification({ type: 'error' })
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
    updatePhone () {
      this.$refs.profileForm.validateField('phone', errorMessage => {
        if (!errorMessage) {
          this.$store.dispatch('setMainPhone', {
            phoneDTO: { number: this.profileForm.phone },
            personId: this.person.id
          }).then(phoneDTO => {
            let person = JSON.parse(localStorage.getItem('jusperson'))
            person.phones = [phoneDTO]
            this.$store.commit('setLoggedPerson', person)
            this.profileForm.phone = phoneDTO.number
            this.$jusNotification({
              title: 'Yay!',
              message: 'Telefone de contato alterado com sucesso.',
              type: 'success'
            })
          }).catch(() => {
            this.$jusNotification({ type: 'error' })
          })
        }
      })
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
      this.$refs.profileForm.validateField('password', errorMessage => {
        if (!errorMessage) {
          this.loadingUpdatePassword = true
          this.$store.dispatch('updatePassword', {
            password: this.profileForm.newPassword,
            oldPassword: this.profileForm.password
          }).then(() => {
            // SEGMENT TRACK
            this.$jusSegment('Senha do usuário alterada')
            this.$jusNotification({
              title: 'Yay!',
              message: 'Senha alterada com sucesso.',
              type: 'success'
            })
            this.profileForm.password = ''
            this.profileForm.newPassword = ''
            this.dialogPassword = false
          }).catch(error => {
            if (error.response.status === 401) {
              this.$jusNotification({
                title: 'Ops!',
                message: 'Senha atual incorreta',
                type: 'warning'
              })
            } else {
              this.$jusNotification({ type: 'error' })
            }
          }).finally(() => {
            this.loadingUpdatePassword = false
          })
        }
      })
    },
    removeMember (id, name) {
      this.$confirm('Tem certeza que deseja excluir ' + name + ' da equipe?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('removeWorkspaceMember', id).then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Membro removido do workspace', { description: `ID ${id}, nome ${name}` })
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
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      })
    },
    inviteTeammate () {
      this.$refs['inviteForm'].validate((valid) => {
        if (valid) {
          this.loadingInvite = true
          this.$store.dispatch('inviteTeammates', [{
            email: this.inviteForm.email,
            profile: this.inviteForm.profile
          }]).then(response => {
            this.$jusSegment('Convite de novo membro', {
              description: `Usuário convidado: ${this.inviteForm.email} como ${this.inviteForm.profile}`
            })
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
            if (error.code === 'ALREADY_EXISTS') {
              this.$jusNotification({ type: 'error' })
            } else {
              this.$jusNotification({
                message: 'E-mail já convidado para esta Equipe.',
                type: 'warning'
              })
            }
          }).finally(() => {
            this.loadingInvite = false
          })
        } else {
          return false
        }
      })
    },
    changeTeamName () {
      if (this.teamName) {
        this.$store.dispatch('changeTeamName', {
          teamName: this.teamName,
          id: this.$store.getters.workspaceId
        }).then(() => {
          const workspace = this.$store.getters.workspace
          workspace.teamName = this.teamName
          this.$store.commit('setWorkspace', workspace)
          // SEGMENT TRACK
          this.$jusSegment('Nome da equipe alterado')
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nome da equipe alterado com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          console.error(error)
          this.$jusNotification({ type: 'error' })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome não pode ficar em branco.',
          type: 'warning'
        })
      }
    },
    changeCompanyName () {
      if (this.companyName) {
        this.$store.dispatch('editWorkpace', {
          teamName: this.teamName,
          name: this.companyName
        }).then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Nome do escritório/empresa alterado')
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nome do escritório/empresa alterado com sucesso.',
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
    }
  }
}
</script>

<style lang="scss">
.configuration-view {
  .el-tab-pane {
    margin: auto;
    margin-top: 20px;
    &:not(.configuration-view__minute):not(.configuration-view__blacklist) {
      max-width: 500px;
    }
  }
  &--user {
    .el-tabs__header {
      display: none;
    }
  }

  &__team {
    button {
      width: 100%;
      margin-top: 40px;
    }
  }
  &__company {
    button {
      width: 100%;
    }
  }
  &__members-list {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    a + a {
      margin-left: 10px;
    }
    .actions {
      min-width: 42px;
    }
    img {
      width: 16px;
    }
  }
  .el-dialog {
    .el-select {
      width: 100%;
    }
  }
  p {
    text-align: justify;
  }
  .show-password {

  }
}
</style>
