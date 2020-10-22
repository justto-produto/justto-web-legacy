<template>
  <div
    :class="purpleClass + ' ' + sizeClass + ' ' + shapeClass + ' ' + activeClass"
    class="jus-avatar-user"
  >
    <img
      v-if="showAvatar"
      :src="avatarSrc"
    >
    <span v-else>
      {{ nameInitials.toUpperCase() }}
    </span>
    <span
      v-if="notifications > 0 && size === 'sm'"
      class="jus-avatar-user__notifications"
    >
      {{ notifications }}
    </span>
  </div>
</template>

<script>
import { getStringInitials } from '@/utils/jusUtils'

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
    name: {
      type: String,
      default: ''
    },
    purple: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showAvatar() {
      if (this.src) return true
      if (this.name && this.name.trim()) return false
      return true
    },
    avatarSrc() {
      if (this.src) return this.src
      return require('@/assets/icons/ic-user.svg')
    },
    nameInitials() {
      return getStringInitials(this.name)
    },
    shapeClass() {
      return 'jus-avatar-user--' + this.shape
    },
    sizeClass() {
      return 'jus-avatar-user--' + this.size
    },
    purpleClass() {
      return this.purple ? 'jus-avatar-user--purple' : ''
    },
    activeClass() {
      return this.active ? 'jus-avatar-user--active' : ''
    }
  }
}
</script>

<style lang="scss">
.jus-avatar-user {
  position: relative;
  display: inline-flex;
  border: 2px solid #ffffff00;

  &.jus-avatar-user--xs {
    font-size: 8px;
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
    border-radius: 4px;
    img, span {
      border-radius: 4px;
    }
  }
  &.jus-avatar-user--circle {
    border-radius: 50%;
    img, span {
      border-radius: 50%;
    }
  }
  &.jus-avatar-user--purple span {
    background-color: #9f6cf8;
  }
  &.jus-avatar-user--mini {
    vertical-align: top;
    font-size: 9px;
    img, span {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
    }
  }
  img {
    object-fit: cover;
    border-radius: 6px;
    background-color: #f2f2f2;
  }
  span {
    background-color: #ff9300;
    visibility: visible !important;
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
  &--active {
    border: 2px solid #9f6cf8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
}
</style>
