<template>
  <img :src="iconPath">
</template>

<script>
export default {
  name: 'JusIcon',
  props: [
    'active',
    'icon'
  ],
  computed: {
    iconPath: function () {
      return require(
        '@/assets/icons/ic-' +
        this.icon +
        '.svg'

      )
    }
  }
}
</script>
