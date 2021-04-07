<template lang="html">
  <div class="panel-strategy-view">
    <img src="./icon.png">
  </div>
</template>

<script>

export default {
  name: 'PanelStrategy',
  data() {
    return {
      dialogVisible: false,
      search: '',
      selectedStep: '',
      selectedValue: '',
      name: '',
      strategies: [{
        name: 'Estratégia 1',
        status: 'Ativo'
      }, {
        name: 'Estratégia 2',
        status: 'Inativo'
      }],
      strategySteps: [{
        id: 0,
        name: 'E-mail',
        values: ['Template 1', 'Template 2', 'Template 3']
      }, {
        id: 1,
        name: 'SMS',
        values: ['Template 1', 'Template 2', 'Template 3']
      }, {
        id: 2,
        name: 'Espera',
        values: ['30 min', '12 horas', '1 dia']
      }],
      steps: [
        {
          id: 0,
          step: 'E-mail',
          value: 'Template 1'
        }, {
          id: 1,
          step: 'Espera',
          value: '12 horas'
        }, {
          id: 2,
          step: 'SMS',
          value: 'Template 2'
        }
      ]
    }
  },
  computed: {
    filteredStrategies() {
      return this.strategies.filter(data => {
        return !this.search || data.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    selectedValues() {
      if (this.selectedStep !== '') {
        return this.strategySteps.find(s => s.id === this.selectedStep).values
      }
      return []
    }
  },
  methods: {
    editStrategy() {
      this.dialogVisible = true
      // this.steps = []
      this.selectedStep = ''
      this.selectedValue = ''
    },
    addStep() {
      this.steps.push({
        id: +new Date(),
        step: this.strategySteps.find(s => s.id === this.selectedStep).name,
        value: this.selectedValue
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.panel-strategy-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  &__add {
    display: flex;
    margin-top: 20px;
    > * + * {
      margin-left: 10px;
    }
    .el-select {
      width: 100%;
    }
  }
  p {
    color: $--color-text-secondary;
    margin-top: 0;
    font-size: 13px;
  }
}
</style>
