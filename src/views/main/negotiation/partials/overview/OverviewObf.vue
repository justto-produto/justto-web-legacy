<template>
  <section class="overview-obf">
    <label
      for="obf"
      class="overview-obf__label"
    >
      OBF:
    </label>

    <textarea
      id="obf"
      v-model="obf"
      class="overview-obf__textarea"
    />
    <span class="overview-obf__textarea--shadow" />
  </section>
</template>

<script>
export default {
  name: 'OverviewObf',
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    obf: 'Mussum Ipsum, cacilds vidis litro abertis. Tá deprimidis, eu conheço uma cachacis que pode alegrar sua vidis. Posuere libero varius. Nullam a nisl ut ante blandit hendrerit. Aenean sit amet nisi. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Diuretics paradis num copo é motivis de denguis.'
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-obf {
  position: relative;
  border: 1px solid $--color-secondary;
  border-radius: 6px;
  padding: 6px;
  height: auto;
  margin-top: 6px;

  .overview-obf__label {
    top: -10px;
    left: 20px;
    position: absolute;
    color: $--color-secondary;
    background-color: $--color-white;
    padding: 0 3px;
    font-size: 13px;

  }

  .overview-obf__textarea {
    border: none;
    width: 100%;
    height: 120px;
    line-height: 20px;
    color: $--color-text-regular;
    resize: none;
    padding: 3px;

    &:focus ~ .overview-obf__textarea--shadow {
      opacity: 0;
      visibility: hidden;
    }
  }

  .overview-obf__textarea--shadow {
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    border-radius: 6px;
    background-image: linear-gradient(to top, rgba(255, 255, 255, 85), rgba(255, 255, 255, 0) 60%);
    transition: .2s ease-out;
    opacity: 1;
  }

  &:hover {
    .overview-obf__textarea--shadow {
      opacity: 0;
      visibility: hidden;
    }
  }
}
</style>
