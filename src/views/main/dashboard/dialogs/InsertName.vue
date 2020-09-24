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
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['loggedPersonId']),
  },
  methods: {
    ...mapActions([
      'changePersonName',
    ]),
    confirm() {
      this.changePersonName({
        person: {
          id: this.loggedPersonId,
          name: this.name,
        },
        isEditingLoggedPerson: true,
      }).then(() => {
        this.$jusSegment('[Modal de nome] Nome do usuário alterado')
        this.$emit('confirm')
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },
  },
}
</script>
