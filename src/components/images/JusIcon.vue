<template>
  <img
    v-if="iconPath"
    :src="iconPath"
    :style="{ width: size }"
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

    type: {
      type: String,
      default: 'ic'
    },

    svgFamily: {
      type: String,
      default: 'regular'
    },

    icon: {
      type: String,
      default: ''
    },

    size: {
      type: String,
      default: ''
    }
  },

  computed: {
    iconPath: function() {
      if (this.icon) {
        if (this.type === 'fa') {
          if (this.svgFamily) {
            return require(`@/assets/svgs/${this.svgFamily}/${this.icon}.svg`)
          }
        }

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
