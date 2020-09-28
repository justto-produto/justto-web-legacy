<template>
  <div class="onboarding-step-content onboarding-welcome-step">
    <!-- <JusLogoCompany
      v-if="isGuest"
      src="shostners.jpg"
      shadow
      shape="circle"
      size="xl"/> -->
    <h1>
      <span v-if="name">{{ name }}, b</span><span v-else>B</span>em-vindo(a) a Justto!<br>
      <span v-if="isGuest">
        Junte-se ao escritório {{ companyName }}.
      </span>
    </h1>
    <p>
      Para preparar o seu ambiente de trabalho na plataforma, adicione algumas informações básicas sobre
      quem irá operar o sistema (você e sua equipe). Se você não tiver todas as informações agora, você poderá pular
      e adicionar depois.
    </p>
    <el-button
      type="primary"
      data-testid="lets-start"
      @click="nextStep"
    >
      Vamos começar
    </el-button>
  </div>
</template>

<script>
export default {
  components: {
    // JusLogoCompany: () => import('@/components/images/JusLogoCompany'),
  },
  props: {
    isGuest: {
      type: Boolean,
      default: false
    },
    companyName: {
      type: String,
      default: ''
    }
  },
  computed: {
    name() {
      return this.$store.getters.loggedPersonName
    }
  },
  methods: {
    nextStep() {
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
