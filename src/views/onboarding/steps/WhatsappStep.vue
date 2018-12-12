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
    <div class="onboarding-whatsapp-step__content">
      <div v-loading="qrCode === ''" class="onboarding-whatsapp-step__qrcode">
        <img :src="qrCode" @click="scanAction">
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
  props: {
    active: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      scan: false
    }
  },
  computed: {
    message () {
      return this.scan ? 'ATIVO' : 'AGUARDANDO ESCANEAMENTO'
    },
    type () {
      return this.scan ? 'success' : 'warning'
    },
    qrCode () {
      return this.$store.state.socket.urlQrCode
    }
  },
  watch: {
    active () {
      if (this.active) {
        this.$stomp.subscribe(this.$store.state.workspace.subDomain)
        this.$store.dispatch('whatsappStart')
      } else {
        this.$stomp.unsubscribe()
      }
    }
  },
  methods: {
    scanAction () {
      let self = this
      this.$store.dispatch('showLoading')
      setTimeout(function () {
        self.scan = !self.scan
        self.$store.dispatch('hideLoading')
      }, 3000)
    },
    clickButton: function (data) {
      this.$socket.emit('emit_method', data)
    }
  }
}
</script>

<style lang="scss">
.onboarding-whatsapp-step {
  .whatsapp-step--status {
    strong {
      margin: 0 8px 0 4px;
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
.onboarding-whatsapp-step__content {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}
.onboarding-whatsapp-step__qrcode {
  width: 240px;
  height: 200px;
  img {
    width: 200px;
    height: 200px;
  }
}
</style>
