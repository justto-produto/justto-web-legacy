<template>
  <div class="user-avatar-image" :class="'user-avatar-image--'+size">
    <img :src="imagePath">
    <span v-if="notifications > 0 && size === 'sm'">{{notifications}}</span>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    src: String,
    notifications: Number,
    size: String
  },
  computed: {
    imagePath: function () {
      // try {
      // return require('@/assets/')
      // } catch (e) {
      return 'https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg'
      // }
    }
  }
}
</script>

<style lang="scss">
.user-avatar-image {
  position: relative;
  &.user-avatar-image--xs {
    img {
      width: 1.75rem;
      height: 1.75rem;
    }
  }
  &.user-avatar-image--sm {
    img {
      width: 3rem;
      height: 3rem;
    }
  }
  &.user-avatar-image--md {
    img {
      width: 5.75rem;
      height: 5.75rem;
    }
  }
  &.user-avatar-image--lg {
    img {
      width: 8.5rem;
      height: 8.5rem;
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
