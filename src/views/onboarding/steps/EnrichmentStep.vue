<template>
  <div class="onboarding-step-content">
    <div
      data-testid="teamname-step"
      class="onboarding-step-content__title"
    >
      <h2>Enriquecimento</h2>
      <p>
        Marque abaixo caso queira enriquecer o endereço com informações adicionais como CEP, bairro, cidade e estado.
      </p>
    </div>

    <el-form
      ref="form"
      :model="form"
      label-position="left"
      @submit.native.prevent="submitForm"
    >
      <el-form-item
        label="Enriquecimento de endereço?"
        prop="name"
      >
        <el-switch
          :value="form.addressEnrichment"
          @input="handleEnrichment"
        />
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      data-testid="teamname-next"
      @click="submitForm"
    >
      Próximo
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        addressEnrichment: false
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('Enriquecimento:addressEnrichment', {
        addressEnrichment: this.form.addressEnrichment
      })
    },

    handleEnrichment(value) {
      if (value) {
        const message = 'O cliente está ciente que ele irá ter acesso ao dados pessoais sensíveis adicionais e que poderá, em algum momento, ter que justificar porque ele precisou ter acesso a estes dados?'

        this.$confirm(message, {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => { this.form.addressEnrichment = value }).catch(() => {})
      } else {
        this.form.addressEnrichment = value
      }
    }
  }
}
</script>
