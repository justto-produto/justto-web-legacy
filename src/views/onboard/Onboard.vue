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
                <h1>Bem-vinda, Mariana!</h1>
                <p>
                  Para completar o seu cadastro precisamos de algumas informações
                </p>
                <el-button type="primary" @click="nextStep()">Beleza! Vamos começar</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div>
                <h2>Para começar, qual a sua OAB?</h2>
                <el-form label-position="top" ref="oabForm" :model="oabForm" :rules="rules">
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
                <el-radio v-model="sync" label="1" border>
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
                <el-radio v-model="sync" label="2" border>
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
                <el-button type="primary" @click="nextStep()">Sincronizar</el-button>
                <el-button type="text" @click="nextStep()">Pular</el-button>
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
import OnboardForm from '@/components/layouts/OnboardForm'

export default {
  name: 'Onboard',
  components: {
    ExternalSidenav,
    OnboardForm
  },
  data () {
    return {
      firstStep: true,
      left: 12,
      right: 0,
      sync: '',
      oabForm: {
        oab: ''
      },
      rules: {
        oab: [
          { required: true, message: 'Este campo é obrigatório', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
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
    font-size: 30px;
    margin-bottom: 40px;
  }
  p{
    margin-bottom: 40px;
  }
  .swiper-slide{
    display: flex;
    align-items: center;
    > div{
      max-width: 580px;
      .sync-service{
        display: flex;
        div{
          margin-left: 20px;
          &+div{
            margin-left: 30px;
          }
        }
      }
      p{
        white-space: normal;
        color: #adadad;
      }
      strong{
        font-size: 16px;
      }
    }
  }

  .el-radio{
    display: inline-table;
    padding: 20px 20px 20px 10px;
    margin: 0 0 20px !important;
    .el-radio__input{
      display: table-cell;
      padding-left: 8px;
    }
    img{
      width: 80px;
    }
  }
  .previous-step{
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

<!-- <onboard-form>
<template slot="child1">
<h1>Bem-vinda, Mariana </h1>
<p>
Para compeltar o seu cadastro precisamos de algumas informações
</p>
<el-button type="primary" @click="nextStep()">Beleza! Vamos começar</el-button>
</template>
<template slot="child2">
<h1>Bem-vindo, Henrique </h1>
<p>
@@@@@@
</p>
<el-button type="primary" @click="nextStep()">Beleza! Vamos começar</el-button>
</template>
</onboard-form> -->
