<template>
  <article class="info-classification">
    <TextInlineEditor
      v-model="value.name"
      ref="classificationName"
      class="info-classification__infoline-data"
      @change="handleSetData($event, value.details)"
      @blur="$emit('blur')"
    />
    <div
      v-for="detail in value.details"
      :key="detail"
      class="info-classification__infoline-subdata"
    >
      <i class="el-icon-right" />
      {{ detail }}
    </div>
  </article>
</template>

<script>
export default {
  name: 'InfoClassification',
  components: {
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor')
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    enableEdit() {
      this.$refs.classificationName.enableEdit()
    },
    handleSetData(name, details) {
      this.$emit('change', { name, details })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-classification {
  .info-classification__infoline-subdata {
    margin-left: 6px;
    font-weight: 500;
  }
}
</style>
