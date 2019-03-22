<template>
  <div class="onboarding-step-content onboarding-welcome-step">
    <JusLogoCompany
      v-if="isGuest"
      src="shostners.jpg"
      shadow
      shape="circle"
      size="xl"/>
    <h1>
      {{ name }}, bem-vindo(a) à Justto<br>
      <span v-if="isGuest">
        Junte-se ao escritório Shostners & Shostners
      </span>
    </h1>
    <p>
      Para preparar o seu ambiente de trabalho na plataforma, adicione algumas informações básicas sobre
      quem irá operar o sistema (você e sua equipe). Se você não tiver todas as informações agora, você poderá pular
      e adicionar depois.
    </p>
    <el-button type="primary" @click="nextStep">Vamos começar</el-button>
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
  },
  computed: {
    name () {
      return this.$store.state.accountModule.name
    }
  },
  methods: {
    nextStep () {
      this.$emit('onboarding:step:next')
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
