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
      <div
        v-loading="isStarting"
        :class="{'is-connected' : isConnected}"
        class="onboarding-whatsapp-step__qrcode">
        <img :src="urlQrCode" class="qrcode">
        <jus-icon v-if="!isReady && !isStarting" icon="check" class="check"/>
      </div>
      <div v-show="isReady || isStarting" class="whatsapp-step--status-info">
        1. Abra o WhatsApp em seu telefone
        <br><br>
        2. Toque em Menu ou Configurações e selecione WhatsApp Web
        <br><br>
        3. Aponte seu telefone para esta tela para capturar o código
        <br><br>
        4. Aguarde a sincronização
      </div>
      <div v-show="isConnected" class="whatsapp-step--status-info">
        <p>
          Clique abaixo para enviar uma mensagem de teste.
        </p>
        <el-form
          ref="numberForm"
          :model="numberForm"
          label-position="top"
          @submit.native.prevent="sendMessage">
          <el-form-item label="Número" prop="number">
            <el-input
              v-mask="['(##) ####-####', '(##) #####-####']"
              v-model="numberForm.number"
              name="number"/>
          </el-form-item>
          <div>
            <el-button
              v-loading="sending"
              :disabled="!validNumber"
              type="primary"
              native-type="submit">
              Testar
            </el-button>
            <el-button @click="restart">Alterar número</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="whatsapp-step--status">
      Status:
      <strong>{{ status.message }}</strong>
      <jus-status-dot :type="status.type"/>
    </div>
    <el-button :disabled="!isConnected" type="primary" @click="$emit('onboarding:step:next')">Próximo</el-button>
    <el-button type="text" @click="$emit('onboarding:step:next')">Pular</el-button>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  directives: { mask },
  data () {
    return {
      sending: false,
      numberForm: {
        number: ''
      }
    }
  },
  computed: {
    urlQrCode () {
      return this.$store.state.socketModule.urlQrCode
    },
    status () {
      if (this.isStarting) {
        return { type: 'info', message: 'ATUALIZANDO QRCODE' }
      }
      if (this.isReady) {
        return { type: 'warning', message: 'AGUARDANDO ESCANEAMENTO' }
      }
      if (this.isConnected) {
        return { type: 'success', message: 'ATIVO' }
      }
    },
    isReady () {
      return false
    },
    isStarting () {
      return false
    },
    isConnected () {
      return true
    },
    validNumber () {
      if (this.rawNumber.length > 9) {
        return true
      }
      return false
    },
    rawNumber () {
      if (this.numberForm.number.length > 1) {
        return this.numberForm.number.match(/\d+/g).join([])
      }
      return ''
    }
  },
  methods: {
    sendMessage () {
      this.$refs['numberForm'].validate(valid => {
        if (this.validNumber) {
          this.sending = true
          this.$store.dispatch('whatsappSend', {
            number: '55' + this.rawNumber,
            message: 'Bem vindo à Justto!'
          }).then(() => {
            this.sending = false
            this.$jusNotification({
              title: 'Pronto!',
              message: 'Mensagem enviada com sucesso.',
              type: 'success'
            })
          }).catch(() => {
            this.sending = false
            this.$jusNotification({
              title: 'Ops!',
              message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
              type: 'error'
            })
          })
        }
      })
    },
    restart () {
      this.$store.commit('setMessage', { status: 'STARTING' })
      this.$store.dispatch('whatsappStop').then(() => {
        this.$store.dispatch('whatsappStart')
      })
    }
  }
}
</script>

<style lang="scss">
.onboarding-whatsapp-step {
  .whatsapp-step--status {
    margin-bottom: 20px;
    strong {
      margin: 0 8px 0 4px;
    }
  }
  .whatsapp-step--status-info {
    margin: 20px 40px;
    max-width: 290px;
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
  width: 200px;
  height: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding: 6px;
  img {
    width: 100%;
    height: 100%;
  }
  &.is-connected {
    position: relative;
    img {
      &.qrcode {
        opacity: 0.08;
      }
      &.check {
        position: absolute;
        left: 1px;
        padding: 40px;
      }
    }
  }
}
</style>
