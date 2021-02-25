<template>
  <article class="info-classification">
    {{ value.name }}
    <div
      v-for="details in value.details"
      :key="details.id"
      class="info-classification__sub-classification"
    >
      <i class="el-icon-right" />
      {{ details.name }}
    </div>
  </article>
</template>

<script>
export default {
  name: 'InfoClassification',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.info-classification {
  .info-classification__sub-classification {
    margin-left: 6px;
    font-weight: 500;
  }
}
</style>
