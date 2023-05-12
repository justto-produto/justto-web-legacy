<template>
  <div class="conteiner-illustration">
    <img
      :src="outlineProjurisSrc"
      class="conteiner-illustration__outline"
      alt="ProJuris Acordos"
    >

    <svg
      class="conteiner-illustration__triangle"
      viewBox="0 0 1145 1145"
      preserveAspectRatio="none"
    >
      <polygon
        points="0,0 30,0 1145,1145 0,1145"
        fill="white"
      />
    </svg>

    <img
      class="conteiner-illustration__illustration"
      :src="illustrationSrc"
      alt="ProJuris Acordos"
    >

    <img
      class="conteiner-illustration__logo"
      :src="logoProjurisWhiteSrc"
      alt="ProJuris Acordos"
    >
  </div>
</template>

<script>
export default {
  name: 'ProjusrisSidenavExternal',

  data: () => ({
    illustrationSrc: require('@/assets/login-screen.svg'),
    outlineProjurisSrc: require('@/assets/outline-projuris.svg'),
    logoProjurisWhiteSrc: require('@/assets/logo-projuris-white.svg')
  })
}
</script>

<style lang="scss">
.conteiner-illustration {
  background: linear-gradient(135deg,#280ba0 0%,#0756e4 100%);
  position: relative;
  width: 100%;
  height: 100vh;
  flex: auto;
  overflow: hidden;
  padding: 0!important;

  .conteiner-illustration__outline {
    position: absolute;
    height: 130%;
    top: 9%;
    left: 0;
    z-index: 0;
    opacity: .15;
  }

  .conteiner-illustration__triangle {
    height: 100vh;
    max-width: 80%;
    z-index: 1;
    position: relative;
  }

  .conteiner-illustration__illustration {
    position: absolute;
    top: 10%;
    height: 80%;
    max-width: 90%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 2;
  }

  .conteiner-illustration__logo {
    position: absolute;
    right: 5rem;
    top: 1rem;
    width: 13.5rem;
  }
}
</style>
