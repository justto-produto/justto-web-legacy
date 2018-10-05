<template>
  <img :src="require('@/assets/'+src)" :class="sizeClass + ' ' + shapeClass" class="jus-logo-company">

</template>

<script>
export default {
  name: 'JusLogoCompany',
  props: {
    src: {
      type: String,
      default: ''
    },
    shape: {
      type: String,
      default: 'square'
    },
    size: {
      type: String,
      default: 'md'
    }
  },
  computed: {
    shapeClass () {
      return 'jus-logo-company--' + this.shape
    },
    sizeClass () {
      return 'jus-logo-company--' + this.size
    }
  }
}
</script>

<style lang="scss">
.jus-logo-company{
  object-fit: cover;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  &.jus-logo-company--square{
    border-radius: 3px;
  }
  &.jus-logo-company--circle{
    border-radius: 50%;
  }
  &.jus-logo-company--xs {
    width: 1.75rem;
    height: 1.75rem;
  }
  &.jus-logo-company--sm {
    width: 3rem;
    height: 3rem;
  }
  &.jus-logo-company--md {
    width: 5.75rem;
    height: 5.75rem;
  }
  &.jus-logo-company--lg {
    width: 8.5rem;
    height: 8.5rem;
  }
}
</style>
