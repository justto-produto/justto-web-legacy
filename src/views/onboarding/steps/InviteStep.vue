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
      <el-form ref="teamMembersForm" :model="teamMembersForm" :rules="teamMembersFormRules" label-position="top" @submit.native.prevent="addTeamMember('teamMembersForm')">
        <el-form-item label="E-mail" prop="teamMember">
          <el-input v-model="teamMembersForm.teamMember">
            <el-button slot="append" icon="el-icon-plus" native-type="submit"/>
          </el-input>
        </el-form-item>
        <ul>
          <li v-for="member in teamMembersForm.teamMembers" :key="member">
            <img src="@/assets/icons/ic-check.svg">
            <span>
              {{ member }}
            </span>
            <img src="@/assets/icons/ic-error.svg" @click="removeTeamMember(member)">
          </li>
        </ul>
      </el-form>
    </div>
    <el-button :disabled="teamMembersForm.teamMembers.length === 0" type="primary" @click="$emit('onboarding:step:next')">Convidar</el-button>
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
      teamMembersForm: {
        teamMember: '',
        teamMembers: [
          // 'wojciech@msn.com',
          // 'stern@mac.com',
          // 'frederic@live.com',
          // 'jbryan@att.net',
          // 'quantamanmmm@sbcglobal.net',
          // 'marioph@live.com',
          // 'msusa@yahoo.ca',
          // 'mirod@gmail.com',
          // 'slanglois@verizon.net',
          // 'choset@me.co',
          // 'hikoza@hotmail.com',
          // 'fwitness@mac.com',
          // 'mkearl@verizon.net',
          // 'rupak@live.com'
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
            this.teamMembersForm.teamMembers.push(this.teamMembersForm.teamMember)
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
    }
  }
}
</script>

<style lang="scss">
.onboarding-invite-step {
  ul{
    padding: 0;
    margin: 10px 4px 40px;
    li{
      margin-top: 10px;
      list-style-type: none;
      img{
        &:first-of-type{
          margin-right: 20px;
        }
        &:last-of-type{
          cursor: pointer;
          float: right;
        }
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
