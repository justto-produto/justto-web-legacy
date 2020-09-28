<template>
  <span
    :class="typeClass"
    class="jus-status-dot"
  />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info'
    }
  },
  computed: {
    typeClass() {
      if (this.type) {
        return 'jus-status-dot--' + this.type
      }

      return ''
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background-color: #9461f7;
  content: ' ';
  &.jus-status-dot--success{
    background-color: $--color-success;
  }
  &.jus-status-dot--warning{
    background-color: $--color-warning;
  }
  &.jus-status-dot--danger{
    background-color: $--color-danger;
  }
  &.jus-status-dot--info{
    background-color: $--color-info;
  }
}
</style>
