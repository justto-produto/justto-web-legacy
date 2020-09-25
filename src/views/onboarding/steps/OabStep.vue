<template>
  <div class="onboarding-oab-step">
    <div class="onboarding-step-content">
      <div class="onboarding-step-content__title">
        <h2>Qual a sua OAB?</h2>
      </div>
      <el-form
        ref="oabForm"
        :inline="true"
        :model="oabForm"
        label-position="top"
        @submit.native.prevent="submitForm"
      >
        <el-form-item
          label="OAB"
          prop="oab"
        >
          <el-input
            v-model="oabForm.oab"
            name="oab"
          />
        </el-form-item>
        <el-form-item
          label="UF"
          prop="state"
        >
          <el-select
            v-model="oabForm.state"
            filterable
            placeholder=""
          >
            <el-option
              v-for="state in $store.state.brazilianStates"
              :key="state.value"
              :label="state.value"
              :value="state.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-alert
      v-if="showError"
      title="Houve uma falha de conexão com o servidor.
      Tente novamente ou entre em contato com o administrador do sistema."
      type="error"
    />
    <el-button
      :disabled="!oabForm.oab || !oabForm.state"
      type="primary"
      @click="submitForm"
    >
      Próximo
    </el-button>
    <el-button
      type="text"
      @click="skip"
    >
      Pular
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showError: false,
      oabForm: {
        oab: this.$store.state.workspaceModule.oabNumber ? this.$store.state.workspaceModule.oabNumber : '',
        state: this.$store.state.workspaceModule.oabState ? this.$store.state.workspaceModule.oabState : ''
      }
    }
  },
  methods: {
    submitForm() {
      this.showError = false
      this.$refs.oabForm.validate((valid) => {
        if (valid) {
          if (this.hasChanges()) {
            this.$store.dispatch('showLoading')
            this.$store.dispatch('addOab', this.oabForm)
              .then(() => {
                this.$store.dispatch('myAccount')
                this.$emit('onboarding:step:next')
              })
              .catch(() => {
                this.showError = true
              }).finally(() => {
                this.$store.dispatch('hideLoading')
              })
          } else this.$emit('onboarding:step:next')
        } else return false
      })
    },
    skip() {
      this.$emit('onboarding:step:next')
      this.$refs.oabForm.resetFields()
    },
    hasChanges() {
      if (this.$store.state.accountModule.oabNumber !== this.oabForm.oab ||
      this.$store.state.accountModule.oabState !== this.oabForm.state) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
  .onboarding-oab-step {
    max-width: 586px;
    @media (min-width: 991px) {
      form {
        display: flex;
      }
      .el-form-item:first-child {
        width: 100%;
      }
      .el-form-item:last-child {
        width: 280px;
        margin-right: 0;
      }
    }
    @media (max-width: 991px) {
    }
  }
</style>
