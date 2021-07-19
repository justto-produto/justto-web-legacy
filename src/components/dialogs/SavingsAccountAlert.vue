<template>
  <el-dialog
    ref="savingsAccountAlert"
    :visible.sync="isVisible"
    :show-close="false"
    destroy-on-close
    append-to-body
    :width="calcWidth"
    @closed="close()"
  >
    <div
      slot="title"
      class="savings__account__header"
    >
      <i class="el-icon-warning" />
      <div>
        AVISO
      </div>
    </div>

    <div class="savings__account__body">
      Esta disputa foi configurada para não aceitar depósito em conta poupança.
      Por favor, associe apenas conta corrente.
    </div>

    <div
      slot="footer"
      class="savings__account__footer"
    >
      <el-button
        type="danger"
        size="small"
        plain
        @click="close()"
      >
        Fechar
      </el-button>

      <!-- <el-button
        type="primary"
        size="small"
        @click="save()"
      >
        Adicionar conta
      </el-button> -->
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      innerWidth: window.innerWidth,
      transientModel: {},
      isVisible: false
    }
  },

  computed: {
    calcWidth() {
      if (this.innerWidth <= 600) return '98%'
      if (this.innerWidth >= 1000) return '35%'
      const pattern = 1300
      const porc = 55
      const x = 100 - (this.innerWidth * porc) / pattern
      return `${x}%`
    }
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth
    })
  },

  methods: {
    open(model) {
      this.transientModel = model
      this.isVisible = true
    },

    save() {
      this.$emit('save', this.transientModel)
      this.close()
    },

    close() {
      this.isVisible = false
      this.transientModel = {}
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.savings__account__header {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $--color-danger;
  font-size: 24px;
  font-weight: bold;

  & .el-icon-warning {
    margin-right: 8px;
  }
}

.savings__account__body {
  text-align: center;
  font-weight: bold;
  color: $--color-black;
  font-size: 15px;
  word-break: keep-all;
  margin: -30px 0;
}

.savings__account__footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
