<template>
  <el-dialog
    :visible.sync="visible"
    custom-class="jus-confirm-dialog"
    width="50%"
    append-to-body
  >
    <span
      slot="title"
      class="jus-confirm-dialog__header"
    >
      <h2>Encontramos divergências em alguns dados.</h2>
      <h3>Gostaria de substituílos?</h3>
    </span>

    <el-row
      v-for="(value, key) in infos"
      :key="key"
    >
      <el-col :span="12">
        <h3>{{ $t('person.' + key) | capitalize }} atual:</h3>
        <span style="margin-left: 8px;">
          {{ party[key] | applyFilter(key) }}
        </span>
      </el-col>
      <el-col :span="12">
        <h3>{{ $t('person.' + key) | capitalize }} novo:</h3>
        <span style="margin-left: 8px;">
          {{ value | applyFilter(key) }}
        </span>
      </el-col>
    </el-row>

    <span
      slot="footer"
      class="jus-confirm-dialog__footer"
    >
      <el-button
        :size="btnSize"
        @click="doAction('update', keys)"
      >
        Substituir tudo
      </el-button>
      <el-button
        v-if="missingKeys.length"
        type="secondary"
        :size="btnSize"
        @click="doAction('update', missingKeys)"
      >
        Somente dados faltantes
      </el-button>
      <el-button
        type="primary"
        :size="btnSize"
        @click="doAction('update', [])"
      >
        Não utilizar novos dados
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  filters: {
    applyFilter: function(value, key) {
      if (!value) {
        return '-'
      } else if (key === 'documentNumber') {
        return Vue.options.filters.cpfCnpj(value)
      } else if (key === 'name') {
        return Vue.options.filters.capitalize(value)
      } else {
        return value
      }
    }
  },

  props: {
    infos: {
      type: Object,
      required: true
    },
    party: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    keys: [],
    visible: false
  }),

  computed: {
    ...mapGetters({
      width: 'getWindowWidth'
    }),

    missingKeys() {
      return this.keys.filter(key => !this.party[key])
    },

    btnSize() {
      return this.width <= 1400 ? 'small' : 'normal'
    }
  },

  methods: {
    doAction(action, params) {
      this.$emit(action, params)
      this.hide()
    },

    show() {
      this.keys = Object.keys(this.infos)

      if (this.keys.length > 0) {
        this.visible = true
      } else {
        this.doAction('update', [])
      }
    },

    hide() {
      this.visible = false
      this.keys = []
    }
  }
}
</script>
