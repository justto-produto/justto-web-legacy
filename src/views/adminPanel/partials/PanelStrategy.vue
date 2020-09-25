<template lang="html">
  <div class="panel-strategy-view">
    <img src="./icon.png">
    <!-- <el-table :data="filteredStrategies" width="100%">
      <el-table-column prop="name" label="Nome"/>
      <el-table-column prop="status" label="Status"/>
      <el-table-column fixed="right" align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Buscar"/>
        </template>
        <template slot-scope="props">
          <el-tooltip content="Visualizar">
            <el-button size="mini" type="" icon="el-icon-search" />
          </el-tooltip>
          <el-tooltip content="Editar">
            <el-button size="mini" type="" icon="el-icon-edit" @click="editStrategy" />
          </el-tooltip>
          <el-tooltip content="Excluir">
            <el-button size="mini" type="danger" plain icon="el-icon-delete" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="Adicionar estratégia"
      width="40%">
      <el-form label-position="top">
        <el-form-item label="Nome">
          <el-input v-model="name" />
        </el-form-item>
      </el-form>
      <p>Estratégia de engajamento</p>
      <el-card shadow="never">
        <vue-nestable v-model="steps">
          <div slot="placeholder" />
          <vue-nestable-handle
            slot-scope="{ item }"
            :item="item">
            <i class="el-icon-s-grid" style="margin-right: 8px" />
            <b style="margin-right: 4px">{{ item.step }}</b>
            {{ ` - ${item.value}` }}
            <el-button size="mini" type="text" icon="el-icon-delete" style="color: #FF4B54" />
          </vue-nestable-handle>
        </vue-nestable>
        <div class="panel-strategy-view__add">
          <el-select v-model="selectedStep" @change="selectedValue = ''">
            <el-option v-for="step in strategySteps" :key="step.id" :label="step.name" :value="step.id" />
          </el-select>
          <el-select v-model="selectedValue">
            <el-option v-for="(value, index) in selectedValues" :key="index" :label="value" :value="value" />
          </el-select>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addStep" />
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="dialogVisible = false">Adicionar</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import { VueNestable, VueNestableHandle } from 'vue-nestable'

export default {
  name: 'PanelStrategy',
  components: {
    // VueNestable,
    // VueNestableHandle,
  },
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
@import '@/styles/nestable.scss';
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
    color: #adadad;
    margin-top: 0;
    font-size: 13px;
  }
}
</style>
