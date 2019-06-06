<template>
  <div class="jus-whatsapp">
    <div class="jus-whatsapp__container">
      <div
        v-loading="isWhatsappStarting"
        :class="{'is-connected' : isWhatsappConnected}"
        class="jus-whatsapp__qrcode">
        <img :src="qrCode" class="qrcode">
        <jus-icon v-if="!isWhatsappReady && !isWhatsappStarting" icon="check" class="check"/>
      </div>
      <div v-show="isWhatsappReady || isWhatsappStarting" class="jus-whatsapp__status-info">
        1. Abra o WhatsApp em seu telefone
        <br><br>
        2. Toque em Menu ou Configurações e selecione WhatsApp Web
        <br><br>
        3. Aponte seu telefone para esta tela para capturar o código
        <br><br>
        4. Aguarde a sincronização, esse processo pode levar alguns minutos
      </div>
      <div v-show="isWhatsappConnected" class="jus-whatsapp__status-info">
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
          <div class="jus-whatsapp__actions">
            <el-button
              v-loading="sending"
              :disabled="!validNumber"
              type="primary"
              native-type="submit">
              Testar
            </el-button>
            <el-button plain @click="restart">Alterar número</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div v-if="status" class="jus-whatsapp__status">
      Status:
      <strong>{{ status.message }}</strong>
      <jus-status-dot :type="status.type"/>
    </div>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  name: 'JusWhatsapp',
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
    qrCode () {
      return this.$store.state.socketModule.whatsapp.qrCode
    },
    status () {
      if (this.isWhatsappStarting) {
        return { type: 'info', message: 'ATUALIZANDO QRCODE' }
      }
      if (this.isWhatsappReady) {
        return { type: 'warning', message: 'AGUARDANDO ESCANEAMENTO' }
      }
      if (this.isWhatsappConnected) {
        return { type: 'success', message: 'ATIVO' }
      }
    },
    isWhatsappReady () {
      return this.$store.getters.whatsappStatus === 'READY'
    },
    isWhatsappStarting () {
      return this.$store.getters.whatsappStatus === 'STARTING'
    },
    isWhatsappConnected () {
      return this.$store.getters.whatsappStatus === 'CONNECTED'
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
  watch: {
    '$store.state.socketModule.whatsapp.status': function () {
      if (this.$store.state.socketModule.whatsapp.status === 'CONNECTED') {
        window.analytics.track('Whatsapp sincronizado')
      }
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
              title: 'Yay!',
              message: 'Mensagem enviada com sucesso.',
              type: 'success'
            })
          }).catch(() => {
            this.sending = false
            this.$jusNotification({ type: 'error' })
          })
        }
      })
    },
    restart () {
      this.$store.commit('SOCKET_refresh', { status: 'STARTING', qrCode: '' })
      this.$store.dispatch('whatsappStop').then(() => {
        this.$store.dispatch('whatsappStart')
      })
    }
  }
}
</script>

<style lang="scss">
.jus-whatsapp {
  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__qrcode {
    width: 200px;
    min-width: 200px;
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
  &__status-info {
    margin-left: 20px;
    width: 100%;
  }
  &__status {
    margin-top: 20px;
    strong {
      margin: 0 8px 0 4px;
    }
  }
  &__actions {
    display: flex;
    .el-button {
      width: 100%;
    }
  }
}
</style>
