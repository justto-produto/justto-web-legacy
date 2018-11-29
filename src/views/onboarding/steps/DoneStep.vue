<template lang="html">
  <div class="onboarding-step-content">
    <h1>
      Tudo pronto, Mariana!
    </h1>
    <p v-if="!isGuest">
      Você tem 15 dias gratuitos para experimentar a nossa plataforma.
      Faça upgrade do seu plano para ter livre acesso após esse período.
    </p>
    <el-button type="primary" @click="$emit('onboarding:step:finish')">Vamos começar</el-button>
  </div>
</template>

<script>
import JusLogoCompany from '@/components/images/JusLogoCompany'

export default {
  components: {
    JusLogoCompany
  },
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  }
}
</script>
