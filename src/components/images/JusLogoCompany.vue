<template>
  <img class="jus-logo-company" :src="require('@/assets/'+src)">
</template>

<script>
export default {
  name: 'JusLogoCompany',
  props: {
    src: String
  }
}
</script>

<style lang="scss">
.jus-logo-company{
  width: 160px;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  border-radius: 50%;
}
</style>
