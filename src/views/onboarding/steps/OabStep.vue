<template lang="html">
  <div class="onboarding-oab-step">
    <div class="onboarding-step-content">
      <div class="onboarding-step-content__title">
        <h2>Para começar, qual a sua OAB?</h2>
      </div>
      <el-form ref="oabForm" :inline="true" :model="oabForm" :rules="oabFormRules" label-position="top" @submit.native.prevent="submitForm">
        <el-form-item label="OAB" prop="oab">
          <el-input v-model="oabForm.oab"/>
        </el-form-item>
        <el-form-item label="UF" prop="uf">
          <el-select v-model="oabForm.uf" placeholder="">
            <el-option v-for="uf in $store.state.ufList" :key="uf" :label="uf" :value="uf"/>
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
        uf: ''
      },
      oabFormRules: {
        oab: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        uf: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['oabForm'].validate((valid) => {
        if (valid) {
          this.$emit('onboarding:step:next')
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
    @media (min-width: 992px) {
      form {
        display: flex;
      }
      .el-form-item:first-child {
        width: 100%;
      }
      .el-form-item:last-child {
        width: 240px;
        margin-right: 0;
      }
    }
    @media (max-width: 991px) {
    }
  }
</style>
