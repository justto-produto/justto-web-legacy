<template>
  <article class="occurrences-container__occurrences-date">
    <span>
      {{ date | moment('DD/MM/YYYY') }}
    </span>
  </article>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    date() {
      const { dateTime } = this.value.createAt

      return dateTime.split('T')[0]
    }
  },
  updated() {
    this.$set(this.value, 'renderCompleted', true)
  },
  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  }
}
</script>

<style lang="scss" scoped>
.occurrences-container__occurrences-date {
  top: 10px;
  text-align: center;
  z-index: 10;
  position: -webkit-sticky;
  position: sticky;
  width: 80%;

  margin: 18px 10% 10px;

  span {
    background-color: #e3f5ff;
    padding: 10px;
  }
}
</style>
