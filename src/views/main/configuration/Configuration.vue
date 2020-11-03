<template lang="html">
  <jus-view-main
    :class="{'configuration-view--user': !isAdminProfile}"
    class="configuration-view"
    right-card-width="550"
  >
    <template slot="title">
      <h1>Configurações</h1>
    </template>
    <div slot="main">
      <el-tabs
        tab-position="top"
        value="profile"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          label="Perfil"
          name="profile"
          class="configuration-view__profile"
        >
          <el-row :gutter="20">
            <el-col
              :span="12"
              :offset="6"
            >
              <el-form
                ref="profileForm"
                :model="profileForm"
                :rules="profileFormRules"
                label-position="top"
              >
                <el-form-item label="Nome">
                  <el-input v-model="person.name">
                    <el-button
                      slot="append"
                      @click="changeName(person, true)"
                    >
                      Alterar
                    </el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="Email">
                  <el-input
                    v-model="$store.state.accountModule.email"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="Nova senha">
                  <el-input
                    v-model="profileForm.newPassword"
                    :type="passwordType"
                    auto-complete="new-password"
                    @keyup.enter.native="passwordModal"
                  >
                    <span
                      slot="append"
                      class="float-button"
                    >
                      <el-button
                        type="text"
                        @click="showPassword = !showPassword"
                      >
                        <jus-icon
                          :icon="showPassword ? 'hide' : 'eye'"
                          class="show-password"
                        />
                      </el-button>
                    </span>
                    <el-button
                      slot="append"
                      @click="passwordModal"
                    >
                      Alterar
                    </el-button>
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="Contato"
                  prop="phone"
                >
                  <el-input
                    v-model="profileForm.phone"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                  >
                    <el-button
                      slot="append"
                      @click="updatePhone"
                    >
                      Alterar
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          label="Equipe"
          name="team"
          class="configuration-view__team"
        >
          <el-row :gutter="20">
            <el-col
              :span="9"
              :offset="2"
            >
              <el-form label-position="top">
                <h3>Alterar nome da Equipe</h3>
                <el-alert
                  :closable="false"
                  type="info"
                  show-icon
                >
                  <span slot="title">
                    Este nome <strong>NÃO</strong> irá aparecer nas mensagens automáticas. Utilize-o para organização interna.
                  </span>
                </el-alert>
                <br>
                <el-form-item label="Nome da equipe">
                  <el-input v-model="teamName">
                    <el-button
                      slot="append"
                      @click.prevent="changeTeamName"
                    >
                      Alterar nome
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <br>
              <el-form label-position="top">
                <h3>Configurações gerais da Equipe</h3>
                <el-form-item label="Como detectar possíveis ofensores em sua carteira?">
                  <el-select v-model="vexatiousType">
                    <el-option
                      v-for="type in ['QUANTITY', 'AVERAGE']"
                      :key="type"
                      :label="$t(`threshold.${type}`)"
                      :value="type"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="vexatiousType">
                  <span slot="label">
                    <span v-if="vexatiousType === 'QUANTITY'">Quantas disputas uma mesma pessoa precisa ter para ser qualificado como possível ofensor?</span>
                    <span v-else>Qual percentual acima da média de disputas uma pessoa precisa ter para ser qualificado como possível ofensor?</span>
                  </span>
                  <money
                    v-model="vexatiousThreshold"
                    v-bind="vexatiousTypeMask"
                    class="el-input__inner"
                  />
                </el-form-item>
                <el-button
                  type="primary"
                  @click.prevent="saveProperties"
                >
                  Salvar
                </el-button>
              </el-form>
            </el-col>
            <el-col
              :span="9"
              :offset="2"
            >
              <h3 class="mt40 mb30">
                Membros da equipe
              </h3>
              <div
                v-for="member in workspaceMembersSorted"
                :key="member.id"
              >
                <div class="configuration-view__members-list">
                  <el-tooltip
                    :content="memberEmail(member.accountEmail)"
                    :open-delay="500"
                  >
                    <div class="configuration-view__member">
                      <strong>{{ member.person.name }}: </strong>
                      <span> {{ $t(`profile.${member.profile}`) | capitalize }}(a)</span>
                    </div>
                  </el-tooltip>
                  <div class="configuration-view__actions">
                    <div v-if="canDoActions(member.accountEmail)">
                      <a
                        href="#"
                        class="configuration-view__link"
                        @click.prevent="showEditMember(member)"
                      >
                        <jus-icon
                          icon="edit"
                          class="configuration-view__icon"
                        />
                      </a>
                      <a
                        href="#"
                        class="configuration-view__link"
                        @click.prevent="removeMember(member.id, member.person.name)"
                      >
                        <jus-icon
                          icon="trash"
                          class="configuration-view__icon"
                        />
                      </a>
                    </div>
                    <div v-else>
                      <el-tooltip content="Esse usuário é um Administrador Justto e não pode ser editado ou removido.">
                        <jus-icon
                          icon="admin"
                          class="configuration-view__icon"
                        />
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <el-button
                type="primary"
                class="mt40"
                @click="dialogInvite = true"
              >
                Convidar novo membro
              </el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          label="Empresa"
          name="company"
          class="configuration-view__company"
        >
          <el-row :gutter="20">
            <el-col
              :span="12"
              :offset="6"
            >
              <h3>Alterar nome da empresa/escritório</h3>
              <el-alert
                :closable="false"
                type="info"
                show-icon
              >
                <span slot="title">
                  Este nome <strong>IRÁ</strong> aparecer em todas as mensagens automáticas enviadas pela Justto.
                </span>
              </el-alert>
              <br>
              <el-form label-position="top">
                <el-form-item label="Nome da empresa/escritório">
                  <el-input v-model="companyName">
                    <el-button
                      slot="append"
                      @click.prevent="changeCompanyName"
                    >
                      Alterar
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <h3 class="mt40">
                Criação de novas equipes
              </h3>
              <p>
                Se o seu escritório possui mais de uma célula de negociação, você
                pode criar uma nova equipe e se organizar melhor.
              </p>
              <el-button
                type="secondary"
                @click="createWorkspace"
              >
                Criar nova Equipe
              </el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          label="Blacklist"
          name="blacklist"
          class="configuration-view__blacklist"
        >
          <configuration-blacklist />
        </el-tab-pane>
        <el-tab-pane
          v-if="isJusttoAdmin"
          name="minute"
          class="configuration-view__minute"
        >
          <span slot="label">
            <el-tooltip content="Somentes administradores Justto">
              <i class="el-icon-lock" />
            </el-tooltip>
            Minuta
          </span>
          <panel-minute />
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        v-if="currentEditMember.person"
        :close-on-click-modal="false"
        :title="`Editar membro ${currentEditMember.person.name}`"
        :visible.sync="dialogMember"
        width="400px"
      >
        <el-form label-position="top">
          <el-form-item
            v-if="isAdminProfile || isJusttoAdmin"
            label="Nome"
          >
            <el-input v-model="currentEditMember.person.name" />
          </el-form-item>
          <el-form-item label="Perfil">
            <el-select v-model="currentEditMember.profile">
              <el-option
                v-for="role in roles"
                :key="role.key"
                :label="role.value"
                :value="role.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button
            plain
            @click="dialogMember = false"
          >
            Cancelar
          </el-button>
          <el-button
            type="primary"
            @click="changeName(currentEditMember.person, false); editMember()"
          >
            Salvar alterações
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogPassword"
        :before-close="cancelChangePassword"
        title="Alterar senha"
        width="40%"
      >
        <el-form
          ref="profileForm"
          :disabled="loadingUpdatePassword"
          :model="profileForm"
          :rules="profileFormRules"
          label-position="top"
        >
          <el-form-item label="Nova senha">
            <el-input
              v-model="profileForm.newPassword"
              :type="passwordType"
              disabled
            >
              <el-button
                slot="append"
                @click="showPassword = !showPassword"
              >
                <jus-icon
                  :icon="showPassword ? 'hide' : 'eye'"
                  class="show-password"
                />
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="Confirme a nova senha"
            prop="newPasswordConfirm"
          >
            <el-input
              v-model="profileForm.newPasswordConfirm"
              :type="passwordType"
              auto-complete="new-password"
              @keyup.enter.native="updatePassword"
            >
              <el-button
                slot="append"
                @click="showPassword = !showPassword"
              >
                <jus-icon
                  :icon="showPassword ? 'hide' : 'eye'"
                  class="show-password"
                />
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="Senha atual"
            prop="password"
          >
            <el-input
              v-model="profileForm.password"
              :type="passwordType"
              auto-complete="new-password"
              @keyup.enter.native="updatePassword"
            >
              <el-button
                slot="append"
                @click="showPassword = !showPassword"
              >
                <jus-icon
                  :icon="showPassword ? 'hide' : 'eye'"
                  class="show-password"
                />
              </el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button
            plain
            @click="cancelChangePassword"
          >
            Cancelar
          </el-button>
          <el-button
            :loading="loadingUpdatePassword"
            type="primary"
            @click="updatePassword"
          >
            Alterar senha
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogInvite"
        title="Convide pessoas à sua equipe"
        width="50%"
      >
        <el-form
          ref="inviteForm"
          :disabled="loadingInvite"
          :model="inviteForm"
          :rules="inviteFormRules"
          label-position="top"
          @submit.native.prevent="inviteTeammate"
        >
          <el-form-item
            label="Email"
            prop="email"
          >
            <el-input v-model="inviteForm.email" />
          </el-form-item>
          <el-form-item
            label="Perfil"
            prop="profile"
          >
            <el-select v-model="inviteForm.profile">
              <el-option
                v-for="role in roles"
                :key="role.key"
                :label="role.value"
                :value="role.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button
            :loading="loadingInvite"
            type="primary"
            @click="inviteTeammate"
          >
            Convidar
          </el-button>
        </span>
      </el-dialog>
    </div>
  </jus-view-main>
</template>

<script>
import { mask } from 'vue-the-mask'
import { validatePhone, isJusttoUser } from '@/utils/validations'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Configuration',
  directives: { mask },
  components: {
    ConfigurationBlacklist: () => import('./partials/ConfigurationBlacklist'),
    PanelMinute: () => import('@/views/adminPanel/partials/PanelMinute')
  },
  data() {
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
        newPasswordConfirm: '',
        password: '',
        phone: ''
      },
      profileFormRules: {
        phone: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }
        ],
        password: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        newPasswordConfirm: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
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
      currentEditMember: {},
      vexatiousThreshold: '',
      vexatiousType: ''
    }
  },
  computed: {
    ...mapGetters([
      'isAdminProfile',
      'isJusttoAdmin',
      'workspaceMembersSorted'
    ]),
    ...mapGetters({
      workspace: 'workspace',
      loggedPersonPhone: 'loggedPersonPhone',
      workspaceProperties: 'workspaceProperties'
    }),
    passwordType() {
      return this.showPassword ? 'text' : 'password'
    },
    vexatiousTypeMask() {
      return {
        decimal: '',
        thousands: '',
        prefix: '',
        suffix: this.vexatiousType === 'AVERAGE' ? ' %' : '',
        precision: 0,
        masked: false
      }
    }
  },
  mounted() {
    this.getMembers()
    this.person = JSON.parse(JSON.stringify(this.$store.getters.loggedPerson))
    this.teamName = this.workspace.teamName + ''
    this.companyName = this.workspace.name + ''
    this.vexatiousType = this.workspaceProperties.VEXATIOUS_TYPE
    this.vexatiousThreshold = this.workspaceProperties.VEXATIOUS_THRESHOLD
    this.profileForm.phone = this.loggedPersonPhone ? this.$store.getters.loggedPersonPhone.number : ''
    if (this.profileForm.phone && this.profileForm.phone.length === 13) {
      this.profileForm.phone = this.profileForm.phone.substr(2)
    } else {
      // eslint-disable-next-line no-self-assign
      this.profileForm.phone = this.profileForm.phone
    }
  },
  methods: {
    ...mapActions([
      'editWorkpace',
      'editWorkpaceProperties'
    ]),

    isJusttoUser(email) {
      if (email) {
        return isJusttoUser(email)
      } return false
    },
    memberEmail(email) {
      return email || 'Sem e-mail'
    },
    canDoActions(email) {
      return !this.isJusttoUser(email) || this.isJusttoAdmin
    },
    handleTabClick(tab) {
      if (tab.name === 'blacklist') {
        this.$store.dispatch('getWorkspace')
      }
    },
    createWorkspace() {
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
    getMembers() {
      this.$store.dispatch('getWorkspaceMembers')
    },
    changeName(person, isEditingLoggedPerson) {
      if (person.name && person.name.length > 2) {
        this.$store.dispatch('changePersonName', { person, isEditingLoggedPerson })
          .then(response => {
            // SEGMENT TRACK
            this.$jusSegment('Nome do usuário alterado')
            this.$jusNotification({
              title: 'Yay!',
              message: 'Nome alterado com sucesso.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome precisa conter mais de 3 caracteres.',
          type: 'warning'
        })
      }
    },
    cancelChangePassword() {
      this.dialogPassword = false
    },
    updatePhone() {
      this.$refs.profileForm.validateField('phone', errorMessage => {
        if (!errorMessage) {
          this.$store.dispatch('setMainPhone', {
            phoneDTO: { number: this.profileForm.phone },
            personId: this.person.id
          }).then(phoneDTO => {
            const person = JSON.parse(localStorage.getItem('jusperson'))
            person.phones = [phoneDTO]
            this.$store.commit('setLoggedPerson', person)
            this.profileForm.phone = phoneDTO.number
            this.$jusNotification({
              title: 'Yay!',
              message: 'Telefone de contato alterado com sucesso.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          })
        }
      })
    },
    passwordModal() {
      if (this.profileForm.newPassword) {
        if (this.profileForm.newPassword.length < 6) {
          this.$jusNotification({
            title: 'Ops!',
            message: 'Senha precisa conter no mínimo 6 caracteres.',
            type: 'warning'
          })
        } else {
          this.profileForm.newPasswordConfirm = ''
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
    updatePassword() {
      this.$refs.profileForm.validateField(['password', 'newPasswordConfirm'], errorMessage => {
        if (!errorMessage) {
          if (this.profileForm.newPassword !== this.profileForm.newPasswordConfirm) {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Senha de confirmação não corresponde à nova senha.',
              type: 'warning'
            })
            return false
          }
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
            this.profileForm.newPasswordConfirm = ''
            this.dialogPassword = false
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(() => {
            this.loadingUpdatePassword = false
          })
        }
      })
    },
    removeMember(id, name) {
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
    showEditMember(member) {
      this.currentEditMember = JSON.parse(JSON.stringify(member))
      // this.currentEditMemberName = this.currentEditMember.person.name
      this.dialogMember = true
    },
    editMember() {
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
        this.$jusNotification({ error })
      })
    },
    inviteTeammate() {
      this.inviteForm.email = this.inviteForm.email.trim()
      this.$refs.inviteForm.validate((valid) => {
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
              this.$jusNotification({ error })
            } else {
              this.$jusNotification({
                message: 'Este e-mail já está cadastrado como membro de sua equipe. De qualquer forma, enviaremos um e-mail informando sua intenção de adiciona-lo na equipe.',
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
    saveProperties() {
      if (this.vexatiousThreshold && this.vexatiousType) {
        this.editWorkpaceProperties({
          VEXATIOUS_THRESHOLD: (this.vexatiousThreshold || '').toString(),
          VEXATIOUS_TYPE: (this.vexatiousType || '').toString()
        }).then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Configurações da equipe alterada')
          this.$jusNotification({
            title: 'Yay!',
            message: 'Configurações da equipe alteradas com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        })
      }
    },
    changeTeamName() {
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
          this.$jusNotification({ error })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome não pode ficar em branco.',
          type: 'warning'
        })
      }
    },
    changeCompanyName() {
      if (this.companyName) {
        this.editWorkpace({
          name: this.companyName
        })
        // .then(() => {
        //   // SEGMENT TRACK
        //   this.$jusSegment('Nome do escritório/empresa alterado')
        //   this.$jusNotification({
        //     title: 'Yay!',
        //     message: 'Nome do escritório/empresa alterado com sucesso.',
        //     type: 'success'
        //   })
        // }).catch(error => {
        //   this.$jusNotification({ error })
        // })
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
  }
  &--user {
    .el-tabs__header {
      display: none;
    }
  }
  &__team {
    button, .el-select {
      width: 100%;
    }
    .el-form--label-top .el-form-item__label {
      line-height: normal !important;
      margin-bottom: 8px;
    }
  }
  &__company {
    button {
      width: 100%;
    }
  }

  .configuration-view__members-list {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    min-height: 22px;

    .configuration-view__link + .configuration-view__link {
      margin-left: 10px;
    }

    .configuration-view__member {
      max-width: 340px;
    }

    .configuration-view__actions {
      float: right;
      display: none;

      .configuration-view__icon {
        width: 18px;
        height: 18px;
      }
    }

    &:hover .configuration-view__actions{
      display: inline;
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
}
</style>
