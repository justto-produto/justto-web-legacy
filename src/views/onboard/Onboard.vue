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
                  Para compeltar o seu cadastro precisamos de algumas informações
                </p>
                <el-button type="primary" @click="nextStep()">Beleza! Vamos começar</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="">
                <h2>Para começar, qual a sua OAB?</h2>
                <el-form label-position="top" ref="oabForm" :model="oabForm">
                  <el-form-item label="oab" prop="oab" :rules="{ required: true, message: 'Este campo é obrigatório', trigger: 'blur' }">
                    <el-input v-model="oabForm.oab"></el-input>
                  </el-form-item>
                </el-form>
                <el-button type="primary" @click="submitForm('oabForm')">Próximo</el-button>
                <el-button type="text" @click="nextStep()">Pular</el-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="">
                <h2>Para começar, qual a sua OAB?</h2>
                <el-form label-position="top" ref="oabForm" :model="oabForm">
                  <el-form-item label="oab" prop="oab" :rules="{ required: true, message: 'Este campo é obrigatório', trigger: 'blur' }">
                    <el-input v-model="oabForm.oab"></el-input>
                  </el-form-item>
                </el-form>
                <el-button type="primary" @click="submitForm('oabForm')">Próximo</el-button>
                <el-button type="text" @click="nextStep()">Pular</el-button>
              </div>
            </swiper-slide>
          </swiper>
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
      left: 12,
      right: 0,
      oabForm: {
        oab: ''
      },
      swiperOption: {
        direction: 'vertical',
        autoHeight: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
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
    }
  },
  mounted: function () {
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
