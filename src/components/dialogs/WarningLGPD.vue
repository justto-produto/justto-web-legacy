<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    :visible.sync="lgpdDialogVisible"
    append-to-body
    width="604px"
  >
    <div class="lgpd-header">
      <jusIcon
        class="lgpd-header__icon"
        icon="alert-active"
      />
      <div class="lgpd-header__label">
        ATENÇÃO
      </div>
    </div>
    <div class="lgpd-body">
      <span class="lgpd-body-item-alert">Alerta sobre Lei Geral de Proteção de Dados</span>
      <span class="lgpd-body-item">
        <span class="lgpd-body-item-person-name">
          {{ partyName.toLowerCase() }}
        </span>
        optou por não ser contatado nesse {{ isPhoneNumber ? 'telefone' : 'e-mail' }}!</span>
      <span class="lgpd-body-item">Ao realizar essa ação voce está violando as regras da LGPD.</span>
      <strong class="lgpd-body-item">Quer mesmo continuar?</strong>
    </div>
    <span class="lgpd-footer">
      <el-button
        :disabled="modalLoading"
        plain
        @click="$emit('click', false)"
      >
        Cancelar
      </el-button>
      <el-button
        :loading="modalLoading"
        type="primary"
        @click="$emit('click', true)"
      >
        Continuar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'WarningLGPD',

  props: {
    lgpdDialogVisible: {
      type: Boolean,
      default: false
    },
    isPhoneNumber: {
      type: Boolean,
      default: false
    },
    partyName: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      modalLoading: false
    }
  },

  methods: {
    openDialogEditor() {
      this.lgpdDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.lgpd-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
  .lgpd-header__icon {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }
  .lgpd-header__label {
    color: $--color-secondary;
    font-weight: bold;
    font-size: 22px;
  }
}

.lgpd-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  .lgpd-body-item {
    margin-bottom: 5px;

    .lgpd-body-item-person-name {
      text-transform: capitalize;
    }
  }
  .lgpd-body-item-alert {
    font-size: 18px;
    margin-bottom: 8px;
    font-weight: bold;
  }
}
.lgpd-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 12px;
}
</style>
