<template>
  <article class="multiple-fields">
    <div class="multiple-fields__radio-box">
      <el-radio
        v-model="field"
        label="ID"
      >
        ID
      </el-radio>
      <el-radio
        v-model="field"
        label="CODE"
      >
        {{ capitalize($tc('dispute.code')) }}
      </el-radio>
      <el-radio
        v-model="field"
        label="EXTERNAL_ID"
      >
        {{ capitalize($tc('dispute.externalId')) }}
      </el-radio>
    </div>

    <div class="multiple-fields__text-area">
      <el-input
        v-model="model"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 8}"
      />
    </div>
  </article>
</template>

<script>
import { capitalize } from '@/filters/capitalize'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    field: 'CODE',
    model: ''
  }),

  watch: {
    field: {
      handler: 'handleEmitInput'
    },

    model: {
      handler: 'handleChangeModel',
      immediate: false,
      deep: true
    }
  },

  methods: {
    capitalize,

    handleEmitInput() {
      this.$emit('input', {
        ...this.value,
        textSearchType: this.field,
        textSearch: this.model
      })
    },

    handleChangeModel() {
      const endLine = this.model.endsWith('\n') ? '\n' : ''
      this.model = this.model.trim() + endLine

      const tempModel = this.model.split('\n')
      const re = /[A-Za-z0-9]+/g

      this.model = tempModel.map(model => (model.match(re).join(''))).join('\n')
      this.handleEmitInput()
    },

    clear() {
      this.field = 'CODE'
      this.model = ''
      this.handleEmitInput()
    }
  }
}
</script>
