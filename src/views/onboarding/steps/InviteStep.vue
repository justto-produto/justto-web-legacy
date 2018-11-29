<template lang="html">
  <div class="onboarding-invite-step">
    <div class="onboarding-step-content">
      <div class="onboarding-step-content__title">
        <h2>Adicione pessoas à sua equipe</h2>
        <p>
          Adicione todos os usuários que farão parte da sua equipe (você poderá adicionar pessoas posteriormente).
          Os convidados irão receber um e-mail para juntar-se à equipe Shostners & Shostners no sistema da Justto.
        </p>
      </div>
      <el-form
        ref="teamMembersForm"
        :model="teamMembersForm"
        :rules="teamMembersFormRules"
        label-position="top"
        @submit.native.prevent="addTeamMember('teamMembersForm')">
        <el-form-item label="E-mail" prop="teamMember">
          <el-input v-model="teamMembersForm.teamMember">
            <el-button slot="append" icon="el-icon-plus" native-type="submit"/>
          </el-input>
        </el-form-item>
        <ul>
          <li v-for="member in teamMembersForm.teamMembers" :key="member.$index">
            <div>
              <img src="@/assets/icons/ic-check.svg">
              <span class="member-email">
                {{ member.email }}
              </span>
            </div>
            <div>
              <el-select v-model="member.type" size="mini">
                <el-option
                  v-for="type in types"
                  :key="type.$index"
                  :label="type.label"
                  :value="type.value"/>
              </el-select>
              <img class="remove-member" src="@/assets/icons/ic-error.svg" @click="removeTeamMember(member)">
            </div>
          </li>
        </ul>
      </el-form>
    </div>
    <el-button :disabled="teamMembersForm.teamMembers.length === 0" type="primary" @click="submitForm">Convidar</el-button>
    <el-button type="text" @click="$emit('onboarding:step:next')">Pular</el-button>
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
  data () {
    return {
      types: [
        {
          label: 'Administrador',
          value: 1
        },
        {
          label: 'Negociador',
          value: 2
        }
      ],
      teamMembersForm: {
        teamMember: '',
        teamMemberType: '',
        teamMembers: [
          {
            email: 'choset@me.co',
            type: 'Administrador'
          },
          {
            email: 'hikoza@hotmail.com',
            type: 'Negociador'
          },
          {
            email: 'mkearl@verizon.net',
            type: 'Administrador'
          }
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
    addTeamMember (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (!this.teamMembersForm.teamMembers.includes(this.teamMembersForm.teamMember)) {
            this.teamMembersForm.teamMembers.push(
              {
                email: this.teamMembersForm.teamMember,
                type: 'Negociador'
              }
            )
          }
          this.$refs[form].resetFields()
        } else {
          return false
        }
      })
    },
    removeTeamMember (member) {
      this.teamMembersForm.teamMembers.splice(
        this.teamMembersForm.teamMembers.indexOf(member), 1
      )
    },
    submitForm () {
      this.$emit('onboarding:step:next', { teammates: this.teamMembersForm.teamMembers })
    }
  }
}
</script>

<style lang="scss">
.onboarding-invite-step {
  form {
    max-width: 475px !important;
    .el-select {
      max-width: 128px !important;
    }
  }
  ul{
    padding: 0;
    margin: 10px 4px 40px;
    li{
      height: 28px;
      margin-top: 10px;
      list-style-type: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .member-email{
        margin-left: 20px;
      }
      .remove-member{
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
  @media (max-width: 991px) {
    ul {
      max-height: 120px;
      overflow: scroll;
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
