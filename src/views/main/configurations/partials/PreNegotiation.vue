<template>
  <el-form
    label-position="top"
    class="pre-negotiation__form"
  >
    <el-form-item
      label="Palavras a serem detectadas para classificar como pré negociação"
      class="pre-negotiation__form-select"
    >
      <el-select
        v-model="workspacePreNegotiation.keyWords"
        multiple
        filterable
        allow-create
        default-first-option
      />
    </el-form-item>

    <el-form-item
      label="Limite de valor do processo para classificar como pré negociação"
    >
      <div class="el-input">
        <money
          v-model="workspacePreNegotiation.limitValue"
          class="el-input__inner"
          maxlength="16"
        />
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click.prevent="saveProperties"
      >
        Salvar
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    workspacePreNegotiation: {
      preNegotiation: false,
      keyWords: [],
      limitValue: 0
    }
  }),
  computed: {
    ...mapGetters({
      preNegotiation: 'getPreNegotiation',
      workspaceProperties: 'workspaceProperties'
    }),

    preNegotiationAlreadyEnebled() {
      return this.workspaceProperties.PRE_NEGOTIATION && this.workspaceProperties.PRE_NEGOTIATION === 'true'
    }
  },

  watch: {
    workspaceProperties() {
      this.workspacePreNegotiation.preNegotiation = this.preNegotiationAlreadyEnebled
    },
    'workspacePreNegotiation.preNegotiation'() {
      if (this.workspacePreNegotiation.preNegotiation && !this.preNegotiationAlreadyEnebled) {
        const title = 'Esta funcionalidade irá gerar custos adicionais.'
        const message = `
        Se você tem alguma dúvida de seu funcionamento, converse com seu <i>Key Account</i> antes.
        <br/><br/>
        Tem certeza que deseja ativar a pré negociação?
        `
        this.$confirm(message, title, {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          showClose: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.workspacePreNegotiation.preNegotiation = true
          this.saveProperties()
        }).catch(() => {
          this.workspacePreNegotiation.preNegotiation = false
        })
      }
    }
  },

  mounted() {
    this.workspacePreNegotiation.preNegotiation = this.workspaceProperties.PRE_NEGOTIATION && this.workspaceProperties.PRE_NEGOTIATION === 'true'

    this.initPreNegotiation()
  },

  methods: {
    ...mapActions([
      'editWorkpaceProperties',
      'getPreNegotiationLimitValue',
      'putPreNegotiationLimitValue',
      'getWorkspacePreNegotiationKeywords',
      'putWorkspacePreNegotiationKeywords'
    ]),

    initPreNegotiation() {
      Promise.all([
        this.getWorkspacePreNegotiationKeywords(),
        this.getPreNegotiationLimitValue()
      ]).then(() => {
        Object.assign(this.workspacePreNegotiation, this.preNegotiation)
      })
    },

    saveProperties() {
      const request = {
        PRE_NEGOTIATION: this.workspacePreNegotiation.preNegotiation
      }
      const { limitValue, keyWords } = this.workspacePreNegotiation

      Promise.all([
        this.editWorkpaceProperties(request),
        this.putPreNegotiationLimitValue(request.PRE_NEGOTIATION ? limitValue : 0),
        this.putWorkspacePreNegotiationKeywords(keyWords)
      ]).then(() => {
        // SEGMENT TRACK
        this.$jusSegment('Configurações da pré negociação')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Configurações da pré negociação alteradas com sucesso.',
          type: 'success'
        })
        this.$emit('close')
      }).catch(error => {
        this.$jusNotification({ error })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pre-negotiation__form {
  .pre-negotiation-form-switch {
    display: flex;
    align-items: center;

    span {
      margin: 0px 2px;
    }
  }

  .el-form-item:last-child {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
