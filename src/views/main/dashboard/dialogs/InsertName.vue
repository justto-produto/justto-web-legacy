<template>
  <el-dialog
    title="Informe seu nome"
    :visible.sync="isDialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
  >
    <el-input
      v-model="name"
      placeholder="Seu nome"
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="confirm()"
      >
        Cadastrar
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'InsertName',
  props: {
    isDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: '',
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
  },
}
</script>
