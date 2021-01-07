<template>
  <div class="onboarding-step-content">
    <div class="onboarding-invite-step">
      <div class="onboarding-step-content__title">
        <h2>Adicione pessoas à sua equipe</h2>
        <p>
          Adicione todos os usuários que farão parte da sua equipe (você poderá adicionar pessoas posteriormente).
          Os convidados irão receber um e-mail para juntar-se à equipe {{ $store.state.workspaceModule.name }} no sistema da Justto.
        </p>
      </div>
      <el-form
        ref="teamMembersForm"
        :model="teamMembersForm"
        :rules="teamMembersFormRules"
        label-position="top"
        @submit.native.prevent="addTeamMember('teamMembersForm')"
      >
        <el-form-item
          label="E-mail"
          prop="teamMember"
        >
          <el-input
            v-model="teamMembersForm.teamMember"
            name="teamMember"
            data-testid="email-teammember"
          >
            <el-button
              slot="append"
              icon="el-icon-plus"
              native-type="submit"
              data-testid="submit-teammember"
              @click="addTeamMember('teamMembersForm')"
            />
          </el-input>
        </el-form-item>
        <ul>
          <li
            v-for="member in teamMembersForm.teamMembers"
            :key="member.$index"
          >
            <div>
              <img
                data-testid="check-teammember"
                src="@/assets/icons/ic-check.svg"
              >
              <span class="member-email">
                {{ member.email }}
              </span>
            </div>
            <div>
              <el-select
                v-model="member.profile"
                data-testid="profile-teammember"
                size="mini"
              >
                <el-option
                  v-for="profile in profiles"
                  :key="profile.$index"
                  :label="profile.label"
                  :value="profile.value"
                />
              </el-select>
              <img
                class="remove-member"
                src="@/assets/icons/ic-error.svg"
                @click="removeTeamMember(member)"
              >
            </div>
          </li>
        </ul>
      </el-form>
    </div>
    <el-alert
      v-if="showError"
      title="Houve uma falha de conexão com o servidor.
      Tente novamente ou entre em contato com o administrador do sistema."
      type="error"
    />
    <el-button
      :disabled="teamMembersForm.teamMembers.length === 0"
      type="primary"
      data-testid="invite-teammember"
      @click="submitForm"
    >
      Convidar
    </el-button>
    <el-button
      type="text"
      @click="$emit('onboarding:step:next')"
    >
      Pular
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showError: false,
      profiles: [
        { label: 'Administrador', value: 'ADMINISTRATOR' },
        { label: 'Negociador', value: 'NEGOTIATOR' }
      ],
      teamMembersForm: {
        teamMember: '',
        teamMemberType: '',
        teamMembers: [
        ]
      },
      teamMembersFormRules: {
        teamMember: [
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ]
      }
    }
  },
  methods: {
    addTeamMember(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.teamMembersForm.teamMember === this.$store.state.accountModule.email) {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Não é possível enviar convites a si mesmo',
              type: 'warning'
            })
          } else if (!this.teamMembersForm.teamMembers.includes(this.teamMembersForm.teamMember)) {
            this.teamMembersForm.teamMembers.push(
              {
                email: this.teamMembersForm.teamMember,
                profile: 'NEGOTIATOR'
              }
            )
          }
          this.$refs[form].resetFields()
        } else {
          return false
        }
      })
    },
    removeTeamMember(member) {
      this.teamMembersForm.teamMembers.splice(
        this.teamMembersForm.teamMembers.indexOf(member), 1
      )
    },
    submitForm() {
      this.showError = false
      this.$store.dispatch('showLoading')
      this.$store.dispatch('inviteTeammates', this.teamMembersForm.teamMembers)
        .then(() => {
          this.$emit('onboarding:step:next')
        })
        .catch(() => {
          this.showError = true
        }).finally(() => {
          this.$store.dispatch('hideLoading')
        })
    }
  }
}
</script>

<style lang="scss">
.onboarding-invite-step {
  form {
    max-width: 554px !important;
    .el-select {
      max-width: 134px !important;
    }
  }
  ul{
    padding: 0;
    max-height: 380px;
    overflow-y: auto;
    margin: 10px 4px 40px;
    li{
      height: 28px;
      margin-top: 10px;
      list-style-type: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        align-items: center;
      }
      .member-email{
        margin-left: 20px;
      }
      .remove-member {
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
  @media (max-width: 991px) {
    form {
      max-width: 100% !important;
    }
    ul {
      max-height: 120px;
      overflow-y: auto;
      margin: 0;
    }
    li {
      display: flex;
      span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
      }
      img{
        &:first-of-type{
          margin-right: 10px !important;
        }
        &:last-of-type{
          cursor: pointer;
          float: right;
        }
      }
    }
  }
}
</style>
