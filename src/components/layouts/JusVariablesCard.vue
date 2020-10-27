<template lang="html">
  <el-card
    shadow="never"
    class="jus-variables-card"
  >
    <div class="jus-variables-card__header">
      <h2 class="jus-variables-card__title">
        Variáveis disponíveis
      </h2>
      <el-input
        v-model="variableFilterTerm"
        placeholder="Buscar variável"
        size="small"
        prefix-icon="el-icon-search"
        clearable
        class="jus-variables-card__filter-input"
      />
      <span
        :class="{ 'jus-variables-card__filter-length--active': variableFilterTerm.length }"
        class="jus-variables-card__filter-length"
      >
        {{ filteredVariables.length }}/{{ Object.keys(variables).length }}
      </span>
    </div>

    <div class="jus-variables-card__body">
      <div
        v-for="variable in filteredVariables"
        :key="variable.key"
        class="jus-variables-card__variable"
      >
        <span class="jus-variables-card__variable-description">
          {{ variable.value }}
        </span>
        <div class="jus-variables-card__variable-name">
          <span>
            <span v-html="`{{${variable.key}}}`" />
          </span>
          <el-tooltip content="Copiar para o clipboard">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-copy-document"
              class="jus-variables-card__copy-button"
              @click="copyVariable(variable.key)"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { filterByTerm } from '@/utils'

export default {
  name: 'JusVariablesCard',
  props: {
    variables: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      variableFilterTerm: ''
    }
  },
  computed: {
    convertedVariables() {
      const convertedVariables = []
      for (const [key, value] of Object.entries(this.variables)) {
        convertedVariables.push({
          key,
          value
        })
      }
      return convertedVariables
    },
    filteredVariables() {
      return filterByTerm(this.variableFilterTerm, this.convertedVariables, 'key', 'value')
    }
  },
  methods: {
    copyVariable(value) {
      navigator.clipboard.writeText(`{{${value}}}`)
      this.$jusNotification({
        title: 'Yay',
        message: 'Variável copiada para o clipboard',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-variables-card {
  border: 0;
  background-color: $--color-secondary-light-9;
  margin-left: 12px;
  width: 320px;
  font-size: 12px;

  .jus-variables-card__header {
    margin-bottom: 16px;

    .jus-variables-card__title {
      margin: 8px 0;
    }

    .jus-variables-card__filter-input {
      width: 230px;
    }

    .jus-variables-card__filter-length {
      font-size: 14px;
      margin-left: 2px;

      &--active {
        font-weight: bold;
      }
    }
  }

  .jus-variables-card__body {
    overflow-y: auto;
    height: calc(100% - 92px);

    .jus-variables-card__variable {
      margin: 8px 8px 4px 0;

      .jus-variables-card__variable-description {
        font-weight: 600;
      }

      .jus-variables-card__variable-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid $--color-cloudy-blue;
        margin-top: 3px;
        padding: 3px 6px;
        background-color: $--color-white;
        border-radius: 2px;

        .jus-variables-card__copy-button {
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
