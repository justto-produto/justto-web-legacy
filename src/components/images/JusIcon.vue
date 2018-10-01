<template>
  <img :src="iconPath">
</template>

<script>
export default {
  name: 'JusIcon',
  props: {
    isActive: Boolean,
    icon: String
  },
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
