<template>
  <article>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="newMemberDialogVisible"
      title="Convide pessoas à sua equipe"
      width="40%"
    >
      <el-form
        ref="inviteForm"
        :model="newMemberForm"
        :rules="newMemberFormRules"
        :disabled="newMemberDialogLoading"
        label-position="top"
        @submit.native.prevent="inviteTeammate"
      >
        <el-form-item
          label="Email"
          prop="email"
        >
          <el-input v-model="newMemberForm.email" />
        </el-form-item>
        <el-form-item
          label="Perfil"
          prop="profile"
        >
          <el-select
            v-model="newMemberForm.profile"
            style="width: 100%"
          >
            <el-option
              v-for="role in profileOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          v-loading="newMemberDialogLoading"
          plain
          @click="newMemberDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          type="primary"
          @click="inviteTeammate"
        >
          Convidar
        </el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TeamDialogs',
  data: () => ({
    newMemberDialogVisible: false,
    newMemberForm: {
      email: '',
      profile: 'NEGOTIATOR'
    },
    newMemberFormRules: {
      email: [
        { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
      ]
    },
    newMemberDialogLoading: false
  }),
  computed: {
    profileOptions() {
      return [
        {
          label: this.$options.filters.capitalize(this.$t('profile.ADMINISTRATOR')),
          value: 'ADMINISTRATOR'
        },
        {
          label: this.$options.filters.capitalize(this.$t('profile.NEGOTIATOR')),
          value: 'NEGOTIATOR'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'inviteTeammates'
    ]),

    openNewMemberDialog() {
      this.newMemberDialogVisible = true
      this.newMemberForm = {
        email: '',
        profile: 'NEGOTIATOR'
      }
    },

    inviteTeammate() {
      this.newMemberForm.email = this.newMemberForm.email.trim()
      this.$refs.inviteForm.validate((valid) => {
        if (valid) {
          this.newMemberDialogLoading = true
          const { email, profile } = this.newMemberForm

          this.inviteTeammates([{ email, profile }])
            .then(response => {
              this.$jusSegment('Convite de novo membro', { description: `Usuário convidado: ${this.newMemberForm.email} como ${this.newMemberForm.profile}` })
              this.$jusNotification({
                title: 'Yay!',
                message: 'Convite enviado com sucesso.',
                type: 'success'
              })
              this.newMemberDialogVisible = false
            })
            .catch(error => {
              if (error.code === 'ALREADY_EXISTS') {
                this.$jusNotification({ error })
              } else {
                this.$jusNotification({
                  message: 'Este e-mail já está cadastrado como membro de sua equipe. De qualquer forma, enviaremos um e-mail informando sua intenção de adiciona-lo na equipe.',
                  type: 'warning'
                })
              }
            })
            .finally(() => {
              this.newMemberDialogLoading = false
            })
        } return false
      })
    }
  }
}
</script>

<style lang="scss">

</style>
