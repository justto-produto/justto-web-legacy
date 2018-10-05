<template lang="html">
  <div class="onboarding-step-content">
    <div class="onboarding-step-content__title">
      <h2>Deseja sincronizar o seu e-mail com a plataforma?</h2>
      <p>
        Ao clicar no botão, você concorda em liberar o acesso de leitura dos emails de sua caixa de entrada para que a plataforma Justto realize leitura dos emails relacionados às negociações em processo na plataforma. Se desejar, você pode configurar isso depois.
      </p>
    </div>
    <el-checkbox v-model="checked1" border class="el-checkbox--content">
      <JusLogoCompany src="outlook.png" shape="square"/>
      <div class="el-checkbox__content">
        <h3>Microsoft</h3>
        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
      </div>
    </el-checkbox>
    <el-checkbox v-model="checked2" border class="el-checkbox--content">
      <JusLogoCompany src="inbox.png" shape="square"/>
      <div class="el-checkbox__content">
        <h3>Inbox</h3>
        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
      </div>
    </el-checkbox>
    <el-button type="primary" @click="$emit('onboarding:step:next')">Sincronize, por favor!</el-button>
    <el-button type="text" @click="$emit('onboarding:step:next')">Pular</el-button>
  </div>
</template>

<script>
import JusLogoCompany from '@/components/images/JusLogoCompany'

export default {
  components: {
    JusLogoCompany
  },
  data () {
    return {
      checked1: false,
      checked2: false
    }
  }
}
</script>

<style lang="scss">
</style>
