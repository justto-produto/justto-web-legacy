<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    status-icon
    class="new-integration__form"
  >
    <el-form-item prop="url">
      <el-input v-model="form.url">
        <span slot="prepend">
          URL
        </span>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        Avançar
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const trigger = 'blur'
const validateURL = (_rule, value, callback) => {
  if (typeof value !== 'string' || value.trim().length === 0) callback(new Error('URL inválida.'))

  try {
    const url = new URL(value)

    if (['http:', 'https:'].includes(url.protocol)) {
      callback()
    } else {
      callback(new Error('URL inválida.'))
    }
  } catch (error) { callback(error) }
}

export default {
  name: 'InitialIntegrationForm',

  data: () => ({
    form: { url: '' },
    rules: {
      url: [
        { required: true, message: 'Campo obrigatório!', trigger },
        { validator: validateURL, trigger }
      ]
    }
  }),

  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        this.$emit('submit', this.form.url)
      })
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.new-integration__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .el-form-item {
    width: 100%;
    margin: 0 !important;

    &:has(.el-button) {
      text-align: right;
    }

    &.is-error {
      .el-form-item__content {
        .el-input {
          .el-input-group__prepend, .el-input__inner {
            border-color: $--pj-color-light-red !important;
          }
        }

        .el-form-item__error {
          top: unset !important;
          right: unset !important;
        }
      }
    }
  }
}
</style>
