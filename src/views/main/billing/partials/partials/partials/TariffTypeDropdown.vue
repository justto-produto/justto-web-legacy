<template>
  <el-dropdown
    trigger="click"
    @command="handleCommand"
  >
    <el-button
      type="primary"
      size="mini"
    >
      Adicionar franquia
    </el-button>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="tariff in tariffs"
        :key="`dropdown-tariff#${tariff}`"
        :command="tariff"
      >
        {{ types[tariff].label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { FRANCHISE_TARIFF_TYPES, TARIFF_TYPES } from '@/constants/billing'

export default {
  name: 'TariffTypeDropdown',

  props: {
    tariffs: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    types: { ...FRANCHISE_TARIFF_TYPES, ...TARIFF_TYPES }
  }),

  methods: {
    handleCommand(value) {
      this.$emit('command', value)
    }
  }
}
</script>
