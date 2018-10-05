<template>
  <img :src="iconPath">
</template>

<script>
export default {
  name: 'JusIcon',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
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
