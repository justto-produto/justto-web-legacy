<template>
  <img class="company-logo-image" :src="require('@/assets/'+src)">
</template>

<script>
export default {
  name: 'CompanyLogoImage',
  props: [
    'src'
  ]
}
</script>

<style lang="scss">
.company-logo-image{
  width: 160px;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  border-radius: 50%;
  display: block;
}
</style>
