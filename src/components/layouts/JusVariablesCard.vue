<template lang="html">
  <el-card
    shadow="never"
    class="jus-variables-card">
    <div class="jus-variables-card__header">
      <h2 class="jus-variables-card__title">Variáveis disponíveis</h2>
      <el-input
        v-model="variableFilterTerm"
        placeholder="Buscar variável"
        size="small">
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
        />
      </el-input>
    </div>
    <div class="jus-variables-card__body">
      <div
        v-for="variable in filteredVariables"
        :key="variable.value"
        class="jus-variables-card__variable">
        <span>{{ variable.value }}</span>
        <div>
          <span>
            <span v-pre>{{</span>{{ variable.key }}<span v-pre>}}</span>
          </span>
          <el-tooltip content="Copiar para o clipboard">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-copy-document"
              @click="copy(variable.key)"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { filterByTerm } from '@/utils/jusUtils'

export default {
  name: 'JusVariablesCard',
  props: {
    variables: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      variableFilterTerm: '',
    }
  },
  computed: {
    convertedVariables() {
      const convertedVariables = []
      for (const [key, value] of Object.entries(this.variables)) {
        convertedVariables.push({
          key,
          value,
        })
      }
      return convertedVariables
    },
    filteredVariables() {
      return filterByTerm(this.variableFilterTerm, this.convertedVariables, 'key', 'value')
    },
  },
  methods: {
    copy(value) {
      navigator.clipboard.writeText(`{{${value}}}`)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-variables-card {
  border: 0;
  background-color: $--color-secondary-light-9;
  margin-left: 10px;
  width: 320px;
  font-size: 12px;
  .jus-variables-card__header {
    margin-bottom: 16px;
    .jus-variables-card__title {
      margin: 8px 0;
    }
  }
  .jus-variables-card__body {
    overflow-y: auto;
    height: calc(100% - 92px);
    .jus-variables-card__variable {
      margin: 4px 8px 4px 0;
      > span {
        font-weight: 600;
      }
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid $--color-cloudy-blue;
        margin-top: 3px;
        padding: 3px 6px;
        background-color: $--color-white;
        border-radius: 2px;
        .el-button {
          font-size: 20px;
          padding: 0;
        }
      }
    }
  }
  .el-card__body {
    height: 100%;
    padding: 14px;
  }
}
</style>
