<template>
  <div
    :class="[
      `jus-avatar-user--${size}`,
      {
        'jus-avatar-user--shadow': shadow,
        'jus-avatar-user--active': active,
        'jus-avatar-user--secondary': purple,
        'jus-avatar-user--status': status,
        'jus-avatar-user--online': status === 'ONLINE',
      }
    ]"
    class="jus-avatar-user"
  >
    <img
      v-if="showAvatar"
      :src="avatarSrc"
      alt="Usuário"
    >
    <span v-else>
      {{ nameInitials }}
    </span>
    <div
      :class="{'communication-ticket-item-plaintiff-status-online': isOnline}"
    />
  </div>
</template>

<script>
import { getStringInitials } from '@/utils'
import { mapGetters } from 'vuex'

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
    active: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      isRecovery: 'isWorkspaceRecovery'
    }),

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
    },
    isOnline() {
      return this.status === 'ONLINE'
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.jus-avatar-user {
  position: relative;
  display: inline-flex;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
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
    width: 100%;
    height: 100%;
    font-weight: 500;
    border-radius: 50%;
    background-color: $--pj-color-blue;
  }

  &.jus-avatar-user--secondary {
    span {
      background-color: $--color-white;
      border: solid 2px $--pj-color-blue;
      color: $--pj-color-blue;
    }
  }

  &.jus-avatar-user--secondary.jus-avatar-user--recovery {
    span {
      // TODO: Validar como vai ficar quando for recovery.
      background-color: $--pj-color-light-blue;
      color: white;
      border: none;
    }
  }

  &.jus-avatar-user--recovery {
    span {
      background-color: $--pj-color-blue;
    }
  }

  &.jus-avatar-user--shadow {
    img, span {
      box-shadow: 0 0 8px 2px rgba(175, 175, 175, 0.4);
    }
  }

  &.jus-avatar-user--active {
    border: 2px solid $--pj-color-blue;
    box-shadow: 0 0 8px 2px rgba(175, 175, 175, 0.4);

    span {
      border: solid thin #fff;
    }
  }

  &.jus-avatar-user--status:after {
    content: '';
    position: absolute;
    display: inline-block;
    width: 12px;
    height: 12px;
    bottom: 0px;
    right: 0px;
    border-radius: 50%;
  }

  &.jus-avatar-user--online:after {
    border: solid 1px #fff;
    background: $--color-success;
  }

  &.jus-avatar-user--offline:after {
    border: solid 1px #fff;
    background: $--color-danger;
  }

  &.jus-avatar-user--xs {
    font-size: 10px;
    font-weight: normal;
    width: 1.75rem;
    height: 1.75rem;
  }
  &.jus-avatar-user--sm {
    width: 3rem;
    height: 3rem;
  }
  &.jus-avatar-user--md {
    width: 3.5rem;
    height: 3.5rem;
  }
  &.jus-avatar-user--small {
    vertical-align: top;
    font-size: 9px;
    width: 1.7rem;
    height: 1.7rem;
  }
  &.jus-avatar-user--mini {
    vertical-align: top;
    font-size: 9px;
    width: 1.4rem;
    height: 1.4rem;
  }

  &.use-padding {
    padding: 0.6rem;
  }

  .communication-ticket-item-plaintiff-status-online {
    position: absolute;
    bottom: 0;
    margin-bottom: 0px;
    margin-left: 28px;
    background-color: $--color-success;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    z-index: 5;
  }
}
</style>
