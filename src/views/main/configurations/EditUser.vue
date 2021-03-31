<template>
  <article class="edit-user-container">
    <el-form
      ref="editUserForm"
      :model="form"
    >
      <el-form-item
        label="Nome"
        prop="name"
      >
        <el-input
          v-model="form.name"
        >
          <el-button
            slot="append"
            @click="editName()"
          >
            Alterar
          </el-button>
        </el-input>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="Alterar Senha"
            prop="password"
          >
            <el-input
              v-model="form.password"
              type="password"
              autocomplete="false"
              readonly
              onfocus="this.removeAttribute('readonly');"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="Confirmar Senha"
            prop="confirmPassword"
          >
            <el-input
              v-model="form.confirmPassword"
              :disabled="!passwordIsValid"
              type="password"
              autocomplete="false"
              readonly
              onfocus="this.removeAttribute('readonly');"
            >
              <input slot="preppend">
              <el-button
                slot="append"
                :disabled="!passwordIsValid || !confirmPasswordIsValid"
                @click="editPassword()"
              >
                Alterar
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="Telefone de contato"
        prop="phone"
      >
        <el-input
          v-model="form.phone"
          v-mask="['### (##) # ####-####',, '## (##) # ####-####', '(##) ####-####', '(##) #####-####']"
        >
          <el-button
            slot="append"
            @click="editPhone()"
          >
            Alterar
          </el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { validatePhone } from '@/utils/validations'

export default {
  data() {
    return {
      form: {
        name: '',
        password: '',
        confirmPassword: '',
        phone: ''
      },
      rules: {
        phone: [
          { required: true, message: 'Este campo obrigatório', trigger: 'submit' },
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'change' }
        ],
        password: [
          { required: true, message: 'Este campo obrigatório', trigger: 'submit' },
          { min: 6, max: 12, message: 'Este campo deve ter de 6 a 12 caracteres', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Este campo obrigatório', trigger: 'submit' },
          { min: 6, max: 12, message: 'Este campo deve ter de 6 a 12 caracteres', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    ...mapGetters({
      id: 'loggedPersonId',
      name: 'loggedPersonName',
      hasName: 'loggedPersonHasName',
      phone: 'loggedPersonPhone'
    }),

    passwordIsValid() {
      const length = this.form.password.trim().length
      return length >= 6 && length <= 12
    },

    confirmPasswordIsValid() {
      const length = this.form.confirmPassword.trim().length
      const equals = this.form.confirmPassword === this.form.password
      return length >= 6 && length <= 12 && equals
    }
  },

  mounted() {
    Object.assign(this.form, {
      name: this.hasName ? this.name : '',
      phone: this.phone?.number || ''
    })
    this.$nextTick().then(_ => this.$forceUpdate())
  },

  methods: {
    ...mapActions([
      'setMainPhone',
      'updatePassword',
      'changeLoggedPersonName',
      'changeLoggedPersonPhone'
    ]),

    emitClose() {
      this.$emit('close')
    },

    editName() {
      this.changeLoggedPersonName({
        id: this.id,
        name: this.form.name
      }).then((res) => {
        console.log(res)
        this.$jusSegment('Nome do usuário alterado')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Nome alterado com sucesso.',
          type: 'success'
        })
      }).catch(error => this.$jusNotification({ error })).finally(this.emitClose)
    },

    editPhone() {
      this.$refs.editUserForm.validateField('phone', hasError => {
        if (!hasError) {
          this.setMainPhone({
            phoneDTO: { number: this.form.phone },
            personId: this.id
          }).then(phoneDTO => {
            this.changeLoggedPersonPhone(phoneDTO)
            this.$jusNotification({
              title: 'Yay!',
              message: 'Telefone de contato alterado com sucesso.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(this.emitClose)
        }
      })
    },

    editPassword() {
      this.$refs.editUserForm.validateField(['password', 'confirmPassword'], hasError => {
        if (!hasError) {
          this.$prompt('Digite sua senha atual', 'Senha atual', {
            confirmButtonText: 'Alterar',
            cancelButtonText: 'Cancelar',
            inputPattern: /\s*^([a-zA-Z0-9_-]){6,12}$/,
            inputErrorMessage: 'Este campo deve ter de 6 a 12 caracteres'
          }).then(({ value: oldPassword }) => {
            this.updatePassword({
              password: this.form.password,
              oldPassword
            }).then(() => {
              // SEGMENT TRACK
              this.$jusSegment('Senha do usuário alterada')
              this.$jusNotification({
                title: 'Yay!',
                message: 'Senha alterada com sucesso.',
                type: 'success'
              })
            }).catch(error => {
              this.$jusNotification({ error })
            }).finally(this.emitClose)
          })
        }
      })
    }
  }
}
</script>
