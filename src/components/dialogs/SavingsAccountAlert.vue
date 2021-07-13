<template>
  <el-dialog
    ref="savingsAccountAlert"
    :visible.sync="isVisible"
    :show-close="false"
    destroy-on-close
    append-to-body
    :width="calcWidth"
  >
    <div class="savings__account__header">
      <i class="el-icon-warning" />
      <div>
        AVISO
      </div>
    </div>
    <div class="savings__account__body">
      Você está adicionando uma conta poupança.
      Mesmo sendo adicionada aos dados bancários
      ela não pode ser associada à disputa.
    </div>
    <div class="savings__account__footer">
      <el-button
        type="primary"
        size="small"
      >
        ADICIONAR CONTA
      </el-button>
      <el-button
        type="danger"
        size="small"
        plain
      >
        FECHAR
      </el-button>
    </div>
    <!-- :width="calcWidth" -->
  </el-dialog>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      innerWidth: window.innerWidth
    }
  },

  computed: {
    calcWidth() {
      console.log(this.innerWidth)
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

}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
.savings__account__header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: $--color-danger;
  font-size: 20px;
  font-weight: bold;
  & .el-icon-warning {
    margin-right: 8px;
  }
}

.savings__account__body {
  margin: 10px 1.5vw 20px 1.5vw;
  text-align: center;
  font-weight: bold;
  color: $--color-black;
  font-size: 15px;
}

.savings__account__footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
