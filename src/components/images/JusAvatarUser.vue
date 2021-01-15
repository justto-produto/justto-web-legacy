<template>
  <div
    :class="[
      `jus-avatar-user--${size}`,
      {
        'jus-avatar-user--shadow': shadow,
        'jus-avatar-user--purple': purple,
        'jus-avatar-user--online': online,
      }
    ]"
    class="jus-avatar-user"
  >
    <img
      v-if="showAvatar"
      :src="avatarSrc"
    >
    <span v-else>
      {{ nameInitials }}
    </span>
    <div
      v-if="status"
      class="circle"
      :class="`${status}`"
    />
  </div>
</template>

<script>
import { getStringInitials } from '@/utils'

export default {
  name: 'JusAvatarUser',
  props: {
    src: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'sm'
    },
    purple: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    },
    online: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    showAvatar() {
      if (this.src) return true
      else if (this.name && this.name.trim()) return false
      else return true
    },
    avatarSrc() {
      if (this.src) return this.src
      return require('@/assets/icons/ic-user.svg')
    },
    nameInitials() {
      return getStringInitials(this.name).toUpperCase() 
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.circle {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 1rem;
}

.ONLINE {
  border: solid white 1.5px;
  background-color: #5fc84b;
}

.OFFLINE {
  border: solid white 1.5px;
  background-color: #ec595a;
}

.jus-avatar-user {
  position: relative;
  display: inline-flex;
  border-radius: 50%;

  img {
    border-radius: 50%;
    object-fit: cover;
    background-color: #f2f2f2;
  }

  span {
    display: inline-flex !important;
    visibility: visible !important;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 400;
    border-radius: 50%;
    background-color: #ff9300;
  }

  &.jus-avatar-user--online:after {
    content: '';
    position: absolute;
    display: inline-block;
    width: 12px;
    height: 12px;
    bottom: 0;
    right: 0;
    background: green;
    border-radius: 50%;
    border: solid 1px #fff;
  }

  &.jus-avatar-user--xs {
    font-size: 8px;

    img, span {
      font-weight: normal;
      font-size: 10px;
      width: 1.75rem;
      height: 1.75rem;
    }
  }
  &.jus-avatar-user--sm {
    width: 3rem;
    height: 3rem;

    img, span {
      font-size: 14px;
      font-weight: 600;
      width: 100%;
      height: 100%
    }
  }
  &.jus-avatar-user--md {
    width: 3.5rem;
    height: 3.5rem;
    img, span {
      font-size: 14px;
      font-weight: 600;
      width: 5.75rem;
      height: 5.75rem;
    }
  }
  &.jus-avatar-user--lg {
    img, span {
      font-size: 14px;
      font-weight: 600;
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
      width: 100%;
      height: 100%;
    }
  }
  &.jus-avatar-user--mini {
    vertical-align: top;
    font-size: 9px;
    img, span {
      width: 1.4rem;
      height: 1.4rem;
    }
  }
  &.jus-avatar-user--purple span {
    background-color: $--color-primary;
  }
  &.jus-avatar-user--shadow {
    box-shadow: 0 0 8px 2px rgba(175, 175, 175, 0.4);
  }
}
</style>
