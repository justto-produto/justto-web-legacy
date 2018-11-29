<template lang="html">
  <div class="onboarding-step-content">
    <h1>
      Tudo pronto, {{ name }}!
    </h1>
    <p v-if="!isGuest">
      Parabéns! Você configurou seu ambiente de trabalho na JUSTTO. Simples, não é mesmo? O próximo passo é inserir
      novos casos na plataforma para negociação.
      <br><br>
      Durante seu período de teste de 15 dias, você e sua equipe poderão inserir até 20 casos para negociação.
      Para inserir mais casos você pode fazer o upgrade do seu plano a qualquer momento.
    </p>
    <el-button type="primary" @click="$emit('onboarding:step:finish')">Inserir primeiros casos</el-button>
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
      return this.$store.state.auth.user.name
    }
  }
}
</script>
