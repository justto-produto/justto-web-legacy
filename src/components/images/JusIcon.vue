<template>
  <img
    v-if="iconPath"
    :src="iconPath"
    draggable="false"
    @click="$emit('click')"
    @mouseover="$emit('hover')"
  >
</template>

<script>
export default {
  name: 'JusIcon',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    isWhite: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconPath: function() {
      if (this.icon) {
        return require(
          '@/assets/icons/ic-' +
          this.icon +
          (this.isActive ? '-active' : '') +
          (this.isWhite ? '-white' : '') +
          '.svg'
        )
      }
      return false
    }
  }
}
</script>
