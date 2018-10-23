<template lang="html">
  <div class="onboarding-step-content onboarding-welcome-step">
    <JusLogoCompany v-if="isGuest" src="shostners.jpg" shadow shape="circle" size="xl"/>
    <h1>
      Bem-vindo(a), Mariana!<br>
      <span v-if="isGuest">
        Junte-se ao escritório Shostners & Shostners
      </span>
    </h1>
    <p>
      Para completar o seu cadastro precisamos de algumas informações.
    </p>
    <el-button type="primary" @click="$emit('onboarding:step:next')">Vamos começar</el-button>
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

<style lang="scss">
.onboarding-welcome-step {
  @media (max-width: 991px) {
    text-align: center;
  }
}
</style>
