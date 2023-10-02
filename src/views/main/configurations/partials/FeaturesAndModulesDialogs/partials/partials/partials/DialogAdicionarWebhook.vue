<template>
  <el-dialog
    title="Receber eventos em"
    :visible.sync="visible"
    width="50%"
    append-to-body
    destroy-on-close
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      v-if="visible"
      ref="form"
      :model="formulario"
      :rules="regras"
    >
      <el-form-item
        label="URL:"
        prop="url"
      >
        <el-input v-model="formulario.url" />
      </el-form-item>

      <el-form-item
        label="Usar autenticação:"
        prop="authType"
      >
        <el-switch
          v-model="useAuth"
          :active-text="$tc('boolean', true)"
          :inactive-text="$tc('boolean', false)"
          style="text-transform: capitalize;"
        />
      </el-form-item>

      <el-tabs
        v-if="useAuth"
        v-model="formulario.authType"
      >
        <el-tab-pane
          :label="$tc(`configurations.authorization.type.${authTypes.BASIC_AUTH}`)"
          :name="authTypes.BASIC_AUTH"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                label="Usuário:"
                prop="username"
              >
                <el-input v-model="formulario.username" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="Senha:"
                prop="password"
              >
                <el-input v-model="formulario.password" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane
          :label="$tc(`configurations.authorization.type.${authTypes.API_KEY}`)"
          :name="authTypes.API_KEY"
        >
          <el-form-item
            label="Chave da API:"
            prop="token"
          >
            <el-input v-model="formulario.token" />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane
          :label="$tc(`configurations.authorization.type.${authTypes.BEARER_TOKEN}`)"
          :name="authTypes.BEARER_TOKEN"
        >
          <el-form-item
            label="Token:"
            prop="token"
          >
            <el-input v-model="formulario.token" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button @click="close">
          Cancelar
        </el-button>

        <el-button
          type="primary"
          @click="save"
        >
          Adicionar
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
const authTypes = {
  API_KEY: 'API_KEY',
  BEARER_TOKEN: 'BEARER_TOKEN',
  BASIC_AUTH: 'BASIC_AUTH'
}

const formularioBase = {
  url: '',
  authType: authTypes.BASIC_AUTH,
  username: '',
  password: '',
  token: ''
}

export default {
  data() {
    return {
      authTypes,
      visible: false,
      formulario: formularioBase,
      regras: {
        url: [{
          required: true,
          message: 'URL é obrigatória',
          trigger: 'blur',
          validator: this.validarCampoUrl
        }],
        authType: [{ required: false, message: 'Tipo de autenticação é obrigatório', trigger: 'change' }],
        username: [{
          required: true,
          message: 'Usuário é obrigatório',
          trigger: 'blur',
          validator: this.validarCampoUsername
        }],
        password: [{
          required: true,
          message: 'Senha é obrigatória',
          trigger: 'blur',
          validator: this.validarCampoPassword
        }],
        token: [{
          required: true,
          message: 'Token é obrigatório',
          trigger: 'blur',
          validator: this.validarCampoToken
        }]
      },
      action: () => {}
    }
  },

  computed: {
    useAuth: {
      get() {
        return Object.values(authTypes).includes(this.formulario.authType)
      },

      set(value) {
        this.formulario.authType = value ? authTypes.BASIC_AUTH : ''
      }
    }
  },

  methods: {
    open(callback) {
      this.reset()
      this.visible = true
      this.action = callback
    },

    close() {
      this.visible = false
      this.reset()
    },

    reset() {
      this.formulario = formularioBase
      if (this.$refs?.form) this.$refs.form.resetFields()
      this.action = () => {}
    },

    save() {
      this.$refs.form.validate(valido => {
        if (valido) {
          this.action({ ...this.formulario })
          this.$emit('save', { ...this.formulario })
          this.close()
        }
      })
    },

    validarCampoUrl(rule, value, callback) {
      if (!value) {
        callback(new Error(rule.message))
      } else {
        try {
          const url = new URL(value)
          if (!url.protocol || !url.hostname) {
            callback(new Error('URL inválida'))
          } else callback()
        } catch (error) {
          callback(new Error('URL inválida'))
        }
      }
    },

    validarCampoUsername(rule, value, callback) {
      if (this.formulario.authType === authTypes.BASIC_AUTH && !value) {
        callback(new Error(rule.message))
      } else callback()
    },

    validarCampoPassword(rule, value, callback) {
      if (this.formulario.authType === authTypes.BASIC_AUTH && !value) {
        callback(new Error(rule.message))
      } else callback()
    },

    validarCampoToken(rule, value, callback) {
      if (this.formulario.authType !== authTypes.BASIC_AUTH && !value) {
        callback(new Error(rule.message))
      } else callback()
    }
  }
}
</script>
