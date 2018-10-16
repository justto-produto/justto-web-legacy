<template lang="html">
  <JusViewMain side-card class="import-feedback">
    <template slot="main">
      <el-steps :active="3" class="el-steps--wizard" finish-status="finish">
        <el-step/>
        <el-step/>
        <el-step/>
        <el-step/>
      </el-steps>
      <div class="step-main">
        <h2>Visão geral da importação</h2>
        <p>
          Alguns casos necessitam da sua revisão. Para prosseguir para o próximo passo você deve verificar a
          checklist que nós montamos ao lado, e indicar no checkbox o que já foi verificado por você.
        </p>
        <br>
        <el-row>
          <el-col :offset="1" :span="23">
            <h3>Casos importados</h3>
          </el-col>
        </el-row>
        <el-row class="display-flex">
          <el-col :span="1" class="feedback-checkbox">
            <el-checkbox v-model="checked1"/>
          </el-col>
          <el-col :span="23">
            <el-card class="el-card--bordered el-card--feedback el-card--danger">
              <el-row :gutter="12" class="display-flex">
                <el-col :span="3">
                  <span class="el-card__title">ID do caso</span>
                  <div class="el-card__content">
                    <strong>14567</strong>
                  </div>
                </el-col>
                <el-col :span="8">
                  <span class="el-card__title">Parte(s) contrária(s)</span>
                  <div class="el-card__content">
                    Vanilda Silva, Hortência Aparecida
                  </div>
                </el-col>
                <el-col :span="7">
                  <span class="el-card__title">Advogado(s)</span>
                  <div class="el-card__content">
                    Lilian Monteiro
                  </div>
                </el-col>
                <el-col :span="4">
                  <span class="el-card__title">Empresa</span>
                  <div class="el-card__content">
                    Nestlé
                  </div>
                </el-col>
                <el-col :span="2" class="display-flex align-center">
                  • • •
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="display-flex">
          <el-col :span="1" class="feedback-checkbox">
            <el-checkbox v-model="checked1"/>
          </el-col>
          <el-col :span="23">
            <el-card class="el-card--bordered el-card--feedback el-card--danger">
              <el-row :gutter="12" class="display-flex">
                <el-col :span="3">
                  <span class="el-card__title">ID do caso</span>
                  <div class="el-card__content">
                    <strong>14567</strong>
                  </div>
                </el-col>
                <el-col :span="8">
                  <span class="el-card__title">Parte(s) contrária(s)</span>
                  <div class="el-card__content">
                    Vanilda Silva, Hortência Aparecida
                  </div>
                </el-col>
                <el-col :span="7">
                  <span class="el-card__title">Advogado(s)</span>
                  <div class="el-card__content">
                    Lilian Monteiro
                  </div>
                </el-col>
                <el-col :span="4">
                  <span class="el-card__title">Empresa</span>
                  <div class="el-card__content">
                    Nestlé
                  </div>
                </el-col>
                <el-col :span="2" class="display-flex align-center">
                  • • •
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="display-flex">
          <el-col :span="1" class="feedback-checkbox">
            <el-checkbox v-model="checked1"/>
          </el-col>
          <el-col :span="23">
            <el-card class="el-card--bordered el-card--feedback el-card--success">
              <el-row :gutter="12" class="display-flex">
                <el-col :span="3">
                  <span class="el-card__title">ID do caso</span>
                  <div class="el-card__content">
                    <strong>14567</strong>
                  </div>
                </el-col>
                <el-col :span="8">
                  <span class="el-card__title">Parte(s) contrária(s)</span>
                  <div class="el-card__content">
                    Vanilda Silva, Hortência Aparecida
                  </div>
                </el-col>
                <el-col :span="7">
                  <span class="el-card__title">Advogado(s)</span>
                  <div class="el-card__content">
                    Lilian Monteiro
                  </div>
                </el-col>
                <el-col :span="4">
                  <span class="el-card__title">Empresa</span>
                  <div class="el-card__content">
                    Nestlé
                  </div>
                </el-col>
                <el-col :span="2" class="display-flex align-center">
                  • • •
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <br>
        <el-button type="primary" plain @click="$router.push('/import/enrichment')">Próximo</el-button>
      </div>
    </template>
    <template slot="aside">
      <el-carousel :interval="5000" :autoplay="false" arrow="always" height="107px" trigger="click" class="el-carousel__container--profile">
        <el-carousel-item v-for="item in 3" :key="item">
          <div class="el-carousel__item-main">
            <h2>1.000</h2>
            <span>casos importados</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'ImportFeedback',
  data () {
    return {
      checked1: false
    }
  }
}
</script>

<style lang="scss">
.import-feedback {
  .feedback-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
