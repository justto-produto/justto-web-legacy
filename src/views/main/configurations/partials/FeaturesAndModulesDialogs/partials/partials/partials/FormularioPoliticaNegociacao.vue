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
        v-model="form.PROJURIS_SOAP_DIAS_EXPIRAR"
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
      <el-input-number
        v-model="form.PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA"
        controls-position="right"
        :min="1"
        :max="100"
        :step="1"
        size="mini"
        step-strictly
        label="%"
      />

      <span>do valor</span>

      <el-select
        v-model="form.PROJURIS_SOAP_VALOR_BASE"
        size="mini"
        class="auto-width"
      >
        <el-option
          label="Perda provável"
          value="PERDA_PROVAVEL"
        />

        <el-option
          label="Danos materiais"
          value="DANOS_MATERIAIS"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    form: {
      PROJURIS_SOAP_DIAS_EXPIRAR: 1,
      PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA: 75,
      PROJURIS_SOAP_VALOR_BASE: ''
    }
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
      'getIntegrationConfigs'
    ]),

    init() {
      this.getIntegrationConfigs().then(configs => {
        this.form.PROJURIS_SOAP_DIAS_EXPIRAR = configs?.PROJURIS_SOAP_DIAS_EXPIRAR || 1
        this.form.PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA = configs?.PROJURIS_SOAP_PORCENTAGEM_ALCADA_MAXIMA || 75
        this.form.PROJURIS_SOAP_VALOR_BASE = configs?.PROJURIS_SOAP_VALOR_BASE || ''
      }).catch(error => this.$jusNotification({ error }))
    },

    save() {
      return this.saveIntegrationConfigs(this.form)
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
