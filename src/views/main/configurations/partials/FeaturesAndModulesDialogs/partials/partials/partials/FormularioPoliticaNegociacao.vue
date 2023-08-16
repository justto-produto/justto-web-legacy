<template>
  <el-form
    :model="form"
    label-position="top"
    class="politica-negociacao__form"
  >
    <el-form-item
      label="Defina abaixo quantos dias a disputa ficará disponível para negociar"
      class="politica-negociacao__form-item"
    >
      <span>Expirar disputas</span>

      <el-input-number
        v-model="form.PROJURIS_SOAP_DIAS_PARA_EXPIRAR"
        controls-position="right"
        :min="1"
        size="mini"
      />

      <span>dias após importação.</span>
    </el-form-item>

    <el-form-item
      label="Defina abaixo qual deve ser a política máxima negociada"
      class="politica-negociacao__form-item"
    >
      <el-collapse
        v-model="tipoDePolitica"
        accordion
        @change="atualizarTipoDePolitica"
      >
        <el-collapse-item
          title="Política de alçada proporcional à valor da disputa"
          name="proporcional"
        >
          <article class="display-flex">
            <div class="el-input el-input--mini auto-width">
              <MoneyInput
                v-model="form.PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA"
                class="el-input__inner"
                decimal="."
                suffix=" %"
                prefix=""
                :precision="0"
              />
            </div>

            <span>do valor</span>

            <el-select
              v-model="form.PROJURIS_SOAP_VALOR_BASE"
              size="mini"
              class="auto-width"
            >
              <el-option
                label="Perda provável"
                value="perdaProvavel"
              />

              <el-option
                label="Danos materiais"
                value="danosMateriais"
              />
            </el-select>
          </article>
        </el-collapse-item>

        <el-collapse-item
          title="Política de alçada customizada"
          name="customizada"
        >
          <article class="display-flex">
            <span class="mr8">Nome da política: </span>

            <div class="el-input el-input--mini auto-width">
              <input
                v-model="form.PROJURIS_SOAP_ESTRATEGIA_PERSONALIZADA"
                class="el-input__inner"
              >
            </div>
          </article>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Money } from 'v-money'

export default {
  components: {
    MoneyInput: Money
  },

  data: () => ({
    form: {
      PROJURIS_SOAP_DIAS_PARA_EXPIRAR: 1,
      PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA: 75,
      PROJURIS_SOAP_VALOR_BASE: '',
      PROJURIS_SOAP_ESTRATEGIA_PERSONALIZADA: ''
    },

    tipoDePolitica: 'proporcional'
  }),

  computed: {
    ...mapGetters({ configs: 'getIntegrationConfigs' })
  },

  beforeMount() {
    this.init()
  },

  methods: {
    ...mapActions([
      'saveIntegrationConfigs',
      'getIntegrationConfigs',
      'buscarIntegracaoDataLimite',
      'salvarIntegracaoDataLimite',
      'buscarIntegracaoSugestaoAlcada',
      'salvarIntegracaoSugestaoAlcada'
    ]),

    init() {
      this.buscarIntegracaoDataLimite().then(({ dataLimite }) => {
        this.form.PROJURIS_SOAP_DIAS_PARA_EXPIRAR = dataLimite || 1
      }).catch(error => this.$jusNotification({ error }))

      this.buscarIntegracaoSugestaoAlcada().then(configs => {
        if (Object.entries(configs).length) {
          const [[valorBase, porcentagemAlcadaMaxima]] = Object.entries(configs)

          this.form.PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA = porcentagemAlcadaMaxima || 75
          this.form.PROJURIS_SOAP_VALOR_BASE = valorBase || ''

          this.tipoDePolitica = valorBase === 'customized' ? 'customizada' : 'proporcional'
        }
      }).catch(error => this.$jusNotification({ error }))
    },

    save() {
      return Promise.all([
        this.salvarIntegracaoDataLimite(this.form?.PROJURIS_SOAP_DIAS_PARA_EXPIRAR || 1),

        this.form.PROJURIS_SOAP_VALOR_BASE === 'nomeAlcadaCustomizada' ? this.salvarIntegracaoSugestaoAlcada({
          [this.form?.PROJURIS_SOAP_VALOR_BASE]: this.form?.PROJURIS_SOAP_ESTRATEGIA_PERSONALIZADA || ''
        }) : this.salvarIntegracaoSugestaoAlcada({
          [this.form?.PROJURIS_SOAP_VALOR_BASE]: this.form?.PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA || 75
        })
      ])
    },

    atualizarTipoDePolitica(tipo) {
      if (tipo === 'customizada') {
        this.form.PROJURIS_SOAP_VALOR_BASE = 'nomeAlcadaCustomizada'
      } else {
        this.form.PROJURIS_SOAP_VALOR_BASE = ''
        this.form.PROJURIS_SOAP_ESTRATEGIA_PERSONALIZADA = ''
      }
    }
  }
}
</script>

<style lang="scss">
.politica-negociacao__form {
  .politica-negociacao__form-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;

    .el-form-item__label {
      font-size: 1rem !important;
    }

    .el-form-item__content {
      display: flex;
      justify-content: center;
      align-items: center;

      & > span {
        &::before, &::after {
          content: '\00a0'
        }
      }
    }
  }
}
</style>
