<template>
  <div :class="sizeClass + ' ' + shapeClass" class="jus-avatar-user">
    <img :src="imagePath">
    <span v-if="notifications > 0 && size === 'sm'">{{ notifications }}</span>
  </div>
</template>

<script>
export default {
  name: 'JusAvatarUser',
  props: {
    src: {
      type: String,
      default: ''
    },
    notifications: {
      type: Number,
      default: undefined
    },
    size: {
      type: String,
      default: 'md'
    },
    shape: {
      type: String,
      default: 'square'
    },
    nameInitials: {
      type: String,
      default: ''
    }
  },
  computed: {
    imagePath: function () {
      // try {
      // return require('@/assets/')
      // } catch (e) {
      // }
      if (this.src) {
        return this.src
      } else if (this.nameInitials) {
        return 'https://via.placeholder.com/200/ff9300/ffffff?text=' + this.nameInitials
      }
      return 'https://via.placeholder.com/200/e2e2e2/ffffff?text=+'
    },
    shapeClass () {
      return 'jus-avatar-user--' + this.shape
    },
    sizeClass () {
      return 'jus-avatar-user--' + this.size
    }
  }
}
</script>

<style lang="scss">
.jus-avatar-user {
  position: relative;
  display: inline;
  &.jus-avatar-user--xs {
    img {
      width: 1.75rem;
      height: 1.75rem;
    }
  }
  &.jus-avatar-user--sm {
    img {
      width: 3rem;
      height: 3rem;
    }
  }
  &.jus-avatar-user--md {
    img {
      width: 5.75rem;
      height: 5.75rem;
    }
  }
  &.jus-avatar-user--lg {
    img {
      width: 8.5rem;
      height: 8.5rem;
    }
  }
  &.jus-avatar-user--square {
    img {
      border-radius: 4px;
    }
  }
  &.jus-avatar-user--circle {
    img {
      border-radius: 50%;
    }
  }
  img {
    object-fit: cover;
    border-radius: 6px;
    background-color: #f2f2f2;
  }
  span {
    min-width: 15px;
    min-height: 15px;
    line-height: 15px;
    padding: 1px;
    font-size: 12px;
    background-color: #ff4b54;
    position: absolute;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    top: 12px;
    left: -9px;
  }
}
</style>
