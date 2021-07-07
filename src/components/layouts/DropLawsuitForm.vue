<template>
  <el-form
    ref="dropLawsuitForm"
    v-loading="loading"
    class="drop-lawsuit__form"
    :model="form"
    :rules="formRules"
    :disabled="loading"
    label-position="top"
  >
    <el-form-item
      class="drop-lawsuit__form-reason"
      label="Motivo do cancelamento:"
      prop="reason"
    >
      <el-select
        v-model="form.reason"
        placeholder="Escolha o motivo"
        style="width: 100%;"
      >
        <el-option
          v-for="(key, value) in dropLawsuitReasons"
          :key="key"
          :value="value"
          :label="key"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      class="drop-lawsuit__form-note"
      label="Nota:"
      prop="note"
    >
      <el-input
        v-model="form.conclusionNote"
        type="textarea"
        rows="4"
        :maxlength="255"
      />

      <div style="text-align: right;">
        {{ (form.conclusionNote || '').length }}/255
      </div>
    </el-form-item>

    <el-form-item class="drop-lawsuit__form-action">
      <el-button
        @click="onCancel()"
      >
        Cancelar
      </el-button>
      <el-button
        type="primary"
        :disabled="loading"
        :loading="loading"
        @click="onSubmit()"
      >
        Salvar
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    loading: {
      type: Boolean,
      default: () => false
    }
  },

  data: () => ({
    form: {
      conclusionNote: '',
      reason: ''
    },
    formRules: {
      reason: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),

  computed: {
    ...mapGetters({
      dropLawsuitReasons: 'getDropLawsuitReasons'
    })
  },

  beforeMount() {
    if (!Object.keys(this.dropLawsuitReasons).length) {
      this.getDropLawsuitReasons()
    }
  },

  methods: {
    ...mapActions(['getDropLawsuitReasons']),

    onSubmit() {
      this.$refs.dropLawsuitForm.validate(valid => {
        if (valid) this.$emit('submit', this.form)
      })
    },

    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.drop-lawsuit__form {
  .drop-lawsuit__form-action {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
