<template>
  <div class="onboard-view">
    <el-row>
      <el-col :md="left" class="hidden-sm-and-down" style="transition: width ease 0.8s;">
        <external-sidenav></external-sidenav>
      </el-col>
      <el-col :md="right" v-if="right > 0">
        <el-row type="flex" align="middle">
          <swiper ref="swiper" :options="swiperOption">
            <swiper-slide>
              <div>
                <company-logo-image src="nestle.jpg"></company-logo-image>
                <h1>Junte-se à equipe da Nestlé</h1>
                <el-button type="primary" @click="nextStep()">Entrar na equipe</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h1>Bem-vinda, Mariana</h1>
                <p>
                  Para completar o seu cadastro precisamos de algumas informações
                </p>
                <el-button type="primary" @click="nextStep()">Beleza! Vamos começar</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h2>Para começar, qual a sua OAB?</h2>
                <el-form @submit.native.prevent="submitForm('oabForm')" label-position="top" ref="oabForm" :model="oabForm" :rules="rules">
                  <el-form-item label="OAB" prop="oab">
                    <el-input v-model="oabForm.oab"></el-input>
                  </el-form-item>
                </el-form>
                <el-button type="primary" @click="submitForm('oabForm')">Próximo</el-button>
                <el-button type="text" @click="nextStep()">Pular</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h2>Deseja sincronizar o seu e-mail com a plataforma?</h2>
                <p>
                  Ao clicar no botão, você concorda em liberar o acesso de leitura dos emails de sua caixa de entrada para que a plataforma Justto realize leitura dos emails relacionados às negociações em processo na plataforma. Se desejar, você pode configurar isso depois.
                </p>
                <div class="radio-group horizontal">
                  <el-radio v-model="syncService" label="1" border>
                    <div class="sync-service">
                      <div>
                        <img src="https://cdn2.iconfinder.com/data/icons/capsocial-square-flat-3/500/Outlook-512.png" alt="">
                      </div>
                      <div>
                        <strong>Microsoft</strong>
                        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
                      </div>
                    </div>
                  </el-radio>
                  <el-radio v-model="syncService" label="2" border>
                    <div class="sync-service">
                      <div>
                        <img src="https://cdn.iconscout.com/icon/free/png-512/inbox-348-722710.png">
                      </div>
                      <div>
                        <strong>Microsoft</strong>
                        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
                      </div>
                    </div>
                  </el-radio>
                </div>
                <el-button type="primary" @click="nextStep()">Sincronizar</el-button>
                <el-button type="text" @click="nextStep()">Pular</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h2>Você gostaria de adicionar integrações?</h2>
                <div class="radio-group vertical">
                  <el-radio v-model="syncApp" label="1" border>
                    <div class="sync-app">
                      <div>
                        <img src="@/assets/logo-zapier.png">
                      </div>
                      <strong>Zapier</strong>
                    </div>
                  </el-radio>
                  <el-radio v-model="syncApp" label="2" border>
                    <div class="sync-app">
                      <div>
                        <img src="@/assets/logo-ifttt.png">
                      </div>
                      <strong>IFTTT</strong>
                    </div>
                  </el-radio>
                  <el-radio v-model="syncApp" label="3" border>
                    <div class="sync-app">
                      <div>
                        <img src="@/assets/logo-msflow.png">
                      </div>
                      <strong>MSFlow</strong>
                    </div>
                  </el-radio>
                </div>
                <el-button type="primary" @click="nextStep()">Adicionar</el-button>
                <el-button type="text" @click="nextStep()">Pular</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h2>Qual o nome do seu time?</h2>
                <p>Você pode colocar o nome do seu escritório, por exemplo.</p>
                <el-form @submit.native.prevent="submitForm('teamNameForm')" label-position="top" ref="teamNameForm" :model="teamNameForm" :rules="rules">
                  <el-form-item label="Time" prop="teamName">
                    <el-input v-model="teamNameForm.teamName"></el-input>
                  </el-form-item>
                </el-form>
                <el-button type="primary" @click="submitForm('teamNameForm')">Próximo</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h2>Convide pessoas para o seu time</h2>
                <p>Os usuários convidados por você irão receber um e-mail para acessar a plataforma.</p>
                <el-form @submit.native.prevent="addTeamMember('teamMembersForm')" label-position="top" ref="teamMembersForm" :model="teamMembersForm" :rules="rules">
                  <el-form-item label="E-mail" prop="teamMember">
                    <el-input v-model="teamMembersForm.teamMember">
                    </el-input>
                  </el-form-item>
                  <ul>
                    <li :key="member" v-for="member in teamMembersForm.teamMembers">
                      <img src="@/assets/icons/ic-check.svg">
                      {{member}}
                      <img @click="removeTeamMember(member)" src="@/assets/icons/ic-error.svg">
                    </li>
                  </ul>
                </el-form>
                <el-button type="primary" :disabled="teamMembersForm.teamMembers.length === 0" @click="nextStep()">Próximo</el-button>
                <el-button type="text" @click="nextStep()">Pular</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h1>Tudo pronto, <br>Mariana!</h1>
                <el-button type="primary" @click="nextStep()">Vamos começar</el-button>
              </div>
            </swiper-slide>
          </swiper>
          <el-button :disabled="firstStep" class="previous-step" type="primary" icon="el-icon-arrow-up" @click="previousStep()"></el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ExternalSidenav from '@/components/layouts/ExternalSidenav'
import CompanyLogoImage from '@/components/images/CompanyLogoImage'

export default {
  name: 'Onboard',
  components: {
    ExternalSidenav,
    CompanyLogoImage
  },
  data () {
    return {
      firstStep: true,
      left: 12,
      right: 0,
      syncService: '',
      syncApp: '',
      oabForm: {
        oab: ''
      },
      teamNameForm: {
        teamName: ''
      },
      teamMembersForm: {
        teamMember: '',
        teamMembers: []
      },
      rules: {
        oab: [
          { required: true, message: 'Este campo é obrigatório', trigger: 'submit' }
        ],
        teamName: [
          { required: true, message: 'Este campo é obrigatório', trigger: 'submit' }
        ],
        teamMember: [
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ]
      },
      swiperOption: {
        direction: 'vertical',
        autoHeight: true,
        allowTouchMove: false
      }
    }
  },
  methods: {
    submitForm (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$refs['swiper'].swiper.slideNext(800)
        } else {
          return false
        }
      })
    },
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
    },
    nextStep () {
      this.$refs['swiper'].swiper.slideNext(800)
      this.verifyFirstStep()
    },
    previousStep () {
      this.$refs['swiper'].swiper.slidePrev(800)
      this.verifyFirstStep()
    },
    verifyFirstStep () {
      this.firstStep = this.$refs['swiper'].swiper.activeIndex === 0
    }
  },
  created: function () {
    setTimeout(function () {
      this.left = 6
    }.bind(this), 200)
    setTimeout(function () {
      this.right = 18
    }.bind(this), 1000)
  }
}
</script>

<style lang="scss">
.onboard-view{
  height: 100%;
  >.el-row, >.el-row>.el-col, >.el-row>.el-col>.el-row {
    height: 100%
  }
  .swiper-slide{
    display: flex;
    align-items: center;
    overflow: scroll;
    max-height: 100vh;
    > div{
      padding: 120px 0;
      margin: auto 150px;
    }
  }
  form{
    width: 400px;
    .el-button--primary{
      width: 100%;
    }
  }
  .el-button--text{
    margin-left: 30px;
  }
  h1{
    color: #343c4b;
    font-size: 40px;
    margin-bottom: 40px;
  }
  .radio-group{
    margin-top: 40px;
    p{
      white-space: normal;
      color: #adadad;
      font-size: 12px;
    }
    strong{
      font-size: 16px;
    }
    &.vertical{
      display: flex;
      margin-bottom: 40px;
      .el-radio{
        padding: 20px;
        flex-direction: column;
      }
      .sync-app{
        div{
          position: relative;
          width: 80px;
          height: 50px;
          text-align: center;
          margin: 20px 0;
          img{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
          }
        }
      }
    }
    &.horizontal{
      .el-radio{
        padding: 20px;
        padding-right: 20px;
        margin: 0 0 20px !important;
        &:last-of-type{
          margin-bottom: 40px !important;
        }
        .sync-service{
          display: flex;
          div{
            margin-left: 10px;
            &+div{
              margin-left: 30px;
            }
          }
        }
      }
    }
    .el-radio{
      display: flex;
      align-items: center;
      height: auto;
      img{
        max-height: 50px;
        max-width: 80px;
      }
    }
  }
  ul{
    padding: 0;
    margin: 10px 0 20px;
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
  .previous-step{
    z-index: 9;
    border-radius: 6px;
    padding: 12px;
    position: absolute;
    bottom: 40px;
    right: 40px;
    i{
      font-weight: bold;
      font-size: 20px;
    }
  }
}
</style>
