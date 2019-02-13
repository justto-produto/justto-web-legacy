<template>
  <div :class="sizeClass + ' ' + shapeClass" class="jus-avatar-user">
    <img v-if="avatarSrc" :src="avatarSrc">
    <span v-else>
      {{ nameInitials.toUpperCase() }}
    </span>
    <span v-if="notifications > 0 && size === 'sm'" class="jus-avatar-user__notifications">
      {{ notifications }}
    </span>
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
    avatarSrc () {
      if (this.src) {
        return this.src
      } else if (!this.nameInitials) {
        return require('@/assets/icons/ic-user.svg')
      } else return ''
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
  display: inline-block;
  &.jus-avatar-user--xs {
    img, span {
      width: 1.75rem;
      height: 1.75rem;
    }
  }
  &.jus-avatar-user--sm {
    width: 3rem;
    height: 3rem;
    img, span {
      width: 100%;
      height: 100%
    }
  }
  &.jus-avatar-user--md {
    img, span {
      width: 5.75rem;
      height: 5.75rem;
    }
  }
  &.jus-avatar-user--lg {
    img, span {
      width: 8.5rem;
      height: 8.5rem;
    }
  }
  &.jus-avatar-user--square {
    img, span {
      border-radius: 4px;
    }
  }
  &.jus-avatar-user--circle {
    img, span {
      border-radius: 50%;
    }
  }
  img {
    object-fit: cover;
    border-radius: 6px;
    background-color: #f2f2f2;
  }
  span {
    visibility: visible !important;
    background-color: #ff9300;
    color: white;
    display: inline-flex !important;
    justify-content: center;
    align-items: center;
    font-weight: 400;
  }
  &__notifications {
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
