<template>
  <div v-loading="$store.state.loading" class="onboarding-oab-step">
    <div class="onboarding-step-content">
      <div class="onboarding-step-content__title">
        <h2>Qual a sua OAB?</h2>
      </div>
      <el-form
        ref="oabForm"
        :inline="true"
        :model="oabForm"
        :rules="oabFormRules"
        label-position="top"
        @submit.native.prevent="submitForm">
        <el-form-item label="OAB" prop="oab">
          <el-input v-model="oabForm.oab"/>
        </el-form-item>
        <el-form-item label="UF" prop="state">
          <el-select v-model="oabForm.state" placeholder="">
            <el-option
              v-for="state in $store.state.stateList"
              :key="state"
              :label="state"
              :value="state"/>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="submitForm">Próximo</el-button>
    <el-button type="text" @click="skip">Pular</el-button>
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
  data () {
    return {
      oabForm: {
        oab: '',
        state: ''
      },
      oabFormRules: {
        oab: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        state: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['oabForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('showLoading')
          this.$store.dispatch('updateOab', this.oabForm)
            .then(() => {
              this.$emit('onboarding:step:next')
              this.$store.dispatch('hideLoading')
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    skip () {
      this.$emit('onboarding:step:next')
      this.$refs['oabForm'].resetFields()
    }
  }
}
</script>

<style lang="scss">
  .onboarding-oab-step {
    max-width: 586px;
    @media (min-width: 992px) {
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
