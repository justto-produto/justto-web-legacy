<template lang="html">
  <div class="onboarding-step-content onboarding-whatsapp-step">
    <div class="onboarding-step-content__title">
      <h2>Whatsapp</h2>
      <p>
        Cadastre o número que o seu escritório utiliza para fazer contato com as partes, utilizando o QR CODE abaixo:
      </p>
    </div>
    <div class="display-flex">
      <div v-loading="loading">
        <img src="@/assets/qrcode.svg" style="border: 1px solid #eee; margin-bottom: 20px;" @click="scanAction">
      </div>
      <transition name="fade">
        <p v-show="scan" class="whatsapp-step--status-info">
          Número +55 12 91234 - 5678 cadastrado com sucesso. Esse será o número que o seu escritório vai conversar com as partes dos seus casos.
        </p>
      </transition>
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
      return this.scan ? 'CONEXÃO ATIVA' : 'AGUARDANDO ESCANEAMENTO'
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
    margin: 20px;
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
