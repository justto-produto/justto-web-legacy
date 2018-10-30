<template lang="html">
  <div class="onboarding-step-content onboarding-email-step">
    <div class="onboarding-step-content__title">
      <h2>Deseja sincronizar o seu e-mail com nossa plataforma?</h2>
      <p>
        Essa sincronização é para facilitar a sua rotina como negociador, essa ação permite que a Justto tenha acesso
        aos e-mails recebidos, em sua conta, relacionados às negociações em processo na plataforma. Mas, lembre-se,
        ao clicar no botão, você concorda que nosso robô tenha acesso a leitura desses e-mails. Se desejar, você pode
        configurar essa fase posteriormente.
      </p>
    </div>
    <el-checkbox v-model="checked1" border class="el-checkbox--active">
      <JusLogoCompany src="outlook.png" shape="square"/>
      <div class="el-checkbox__content">
        <h3>Microsoft</h3>
        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
      </div>
    </el-checkbox>
    <el-checkbox v-model="checked2" border class="el-checkbox--active">
      <JusLogoCompany src="inbox.png" shape="square"/>
      <div class="el-checkbox__content">
        <h3>Inbox</h3>
        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
      </div>
    </el-checkbox>
    <el-button :disabled="!checked1 && !checked2" type="primary" @click="$emit('onboarding:step:next')">Próximo</el-button>
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
.onboarding-email-step {
  @media (max-width: 991px) {
    p {
      display: none;
    }
    .el-checkbox__label {
      width: 100%;
    }
    img {
      width: 4rem !important;
      height: 4rem !important;
    }
  }
}
</style>
