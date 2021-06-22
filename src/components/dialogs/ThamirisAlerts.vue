<template>
  <el-dialog
    ref="thamiresalerts"
    :close-on-click-modal="false"
    :visible.sync="isVisible"
    :before-close="closeDialog"
    destroy-on-close
    append-to-body
    width="40%"
  >
    <div>
      <h1>Aqui estão suas tarefas de hoje!</h1>
      <span>
        Para alcançar ainda mais sucesso nas suas negociações, dedique
        uma atenção especial à algumas disputas que estão pendentes.
      </span>
    </div>
    <div>
      <span>Com até 20% de alçada máxima</span>
      <el-button>TRATAR</el-button>
    </div>
    <el-button @click="closeDialog">AGORA NÃO</el-button>
    <el-button @click="closeDialog">TRATAR TODAS</el-button>
  </el-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
    // isVisbible: true
  }),

  methods: {
    ...mapMutations({
      changeThamirisAlertsVisibility: 'changeThamirisAlertsVisibility'
    }),

    closeDialog() {
      this.changeThamirisAlertsVisibility({ payload: { flag: false } })
    },

    openDialogEditor() {
      this.isVisbible = true
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

</style>
