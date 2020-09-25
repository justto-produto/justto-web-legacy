<template>
  <div
    class="jus-button-back"
    @click="goTo"
  >
    <jus-icon icon="back" />
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'JusButtonBack',
  props: {
    to: {
      default: '',
      type: String
    },
    src: {
      default: '',
      type: String
    },
    back: {
      default: false,
      type: Boolean
    },
    text: {
      default: '',
      type: String
    }
  },
  methods: {
    goTo() {
      if (this.src) {
        window.location = this.src
      } else if (this.back) {
        this.$router.go(-1)
      } else this.$router.push(this.to)
    }
  }
}
</script>

<style lang="scss">
.jus-button-back {
  position: absolute;
  top: 40px;
  left: 20px;
  color: initial;
  cursor: pointer;
  img{
    vertical-align: middle;
    margin-right: 10px;
  }
}
</style>
