<template>
  <img :src="iconPath">
</template>

<script>
export default {
  name: 'JusIcon',
  props: [
    'isActive',
    'icon'
  ],
  computed: {
    iconPath: function () {
      return require(
        '@/assets/icons/ic-' +
        this.icon +
        (this.isActive ? '-active' : '') +
        '.svg'
      )
    }
  }
}
</script>
