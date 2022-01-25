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
        @input="handleChangeModel"
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

  methods: {
    capitalize,

    handleChangeModel() {
      const endLine = this.model.endsWith('\n') ? '\n' : ''
      this.model = this.model.trim() + endLine
    }
  }
}
</script>
