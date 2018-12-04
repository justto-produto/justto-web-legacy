<template>
  <div class="onboarding-step-content onboarding-whatsapp-step">
    <div class="onboarding-step-content__title">
      <h2>Whatsapp</h2>
      <p>
        Mais adiante você poderá ver as mensagens que nosso sistema enviará. Contudo, é importante que você sincronize
        o número que a sua equipe utiliza para fazer contato com as partes, para que as respostas sejam capturadas
        pela plataforma.
      </p>
    </div>
    <div class="display-flex">
      <div v-loading="loading">
        <img src="@/assets/qrcode.svg" style="border: 1px solid #eee; margin-bottom: 20px;" @click="scanAction">
      </div>
      <div v-show="!scan" class="whatsapp-step--status-info">
        1. Abra o WhatsApp em seu telefone
        <br><br>
        2. Toque em Menu ou Configurações e selecione WhatsApp Web
        <br><br>
        3. Aponte seu telefone para esta tela para capturar o código
      </div>
      <div v-show="scan" class="whatsapp-step--status-info">
        Clique abaixo para enviar uma mensagem de teste para o número +55 12 91234 - 5678.
        <el-button type="primary">Testar</el-button><el-button type="">Alterar número</el-button>
      </div>
    </div>
    <div class="whatsapp-step--status">
      Status:
      <strong>{{ message }}</strong>
      <JusStatusDot :type="type"/>
    </div>
    <el-button :disabled="!scan" type="primary" @click="$emit('onboarding:step:next')">Próximo</el-button>
    <el-button type="text" @click="$emit('onboarding:step:next')">Pular</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      scan: false,
      loading: false
    }
  },
  computed: {
    message () {
      return this.scan ? 'ATIVO' : 'AGUARDANDO ESCANEAMENTO'
    },
    type () {
      return this.scan ? 'success' : 'warning'
    }
  },
  methods: {
    scanAction () {
      let self = this
      self.loading = true
      setTimeout(function () {
        self.scan = !self.scan
        self.loading = false
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.onboarding-whatsapp-step {
  .whatsapp-step--status {
    strong {
      margin: 0 10px;
    }
  }
  .whatsapp-step--status-info {
    margin: 20px 40px;
    .el-button {
      width: 48% !important;
    }
  }
  @media (max-width: 991px) {
    .whatsapp-step--status {
      text-align: center;
      strong {
        margin: 0 5px;
      }
    }
    .whatsapp-step--status-info {
      display: none;
    }
    .display-flex {
      justify-content: center;
    }
  }
}
</style>
