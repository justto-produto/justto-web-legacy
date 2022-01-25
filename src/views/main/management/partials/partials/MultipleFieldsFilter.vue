<template>
  <article class="multiple-fields">
    <div class="multiple-fields__radio-box">
      <el-radio
        v-model="field"
        label="id"
      >
        ID
      </el-radio>
      <el-radio
        v-model="field"
        label="code"
      >
        {{ capitalize($tc('dispute.code')) }}
      </el-radio>
      <el-radio
        v-model="field"
        label="externalId"
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
  data: () => ({
    field: 'id',
    model: ''
  }),

  watch: {
    field: {
      handler: 'handleEmitInput'
    },

    model: {
      handler: 'handleEmitInput',
      immediate: false,
      deep: true
    }
  },

  methods: {
    capitalize,

    handleEmitInput() {
      console.log('input', {
        field: this.field,
        value: this.model
      })

      // this.$emit('input', {
      //   field: this.field,
      //   value: this.model
      // })
    },

    handleChangeModel() {
      const endLine = this.model.endsWith('\n') ? '\n' : ''
      this.model = this.model.trim() + endLine

      this.handleEmitInput()
    }
  }
}
</script>
