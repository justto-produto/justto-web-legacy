<template>
  <article
    v-loading="localLoading"
    class="edit-user-container"
  >
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

      <el-form-item
        label="Antiga senha"
        prop="oldPassword"
      >
        <el-input
          v-model="form.oldPassword"
          type="password"
          show-password
        />
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item
            label="Nova senha"
            prop="password"
          >
            <el-input
              v-model="form.password"
              show-password
              type="password"
              autocomplete="false"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="Confirmar senha"
            prop="confirmPassword"
          >
            <el-input
              v-model="form.confirmPassword"
              :disabled="!passwordIsValid"
              show-password
              type="password"
              autocomplete="false"
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
      localLoading: false,
      form: {
        name: '',
        oldPassword: '',
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
        oldPassword: [
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
      accountId: 'accountId',
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
      'changeMemberName',
      'changeLoggedPersonName',
      'changeAccountName',
      'changeLoggedPersonPhone'
    ]),

    emitClose() {
      this.localLoading = false
      this.$emit('close')
    },
    editName() {
      this.localLoading = true
      this.changeMemberName({
        updateWorkspace: false,
        updatePerson: true,
        accountId: this.accountId,
        name: this.form.name
      }).then(({ _ }) => {
        this.changeLoggedPersonName(this.form.name)
        this.changeAccountName(this.form.name)
        this.$jusSegment('Nome do usuário alterado na edição')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Nome alterado com sucesso.',
          type: 'success'
        })
      }).catch(error => this.$jusNotification({ error })).finally(this.emitClose)
    },

    editPhone() {
      this.localLoading = true
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
        } else {
          this.localLoading = false
        }
      })
    },

    editPassword() {
      this.localLoading = true
      // ['password', 'confirmPassword', 'oldPassword']
      this.$refs.editUserForm.validate(isValid => {
        const { password, oldPassword } = this.form

        if (isValid && password !== oldPassword) {
          this.updatePassword({
            password, oldPassword
          }).then(() => {
            // SEGMENT TRACK
            this.form.oldPassword = password
            this.$jusSegment('Senha do usuário alterada')
            this.$jusNotification({
              title: 'Yay!',
              message: 'Senha alterada com sucesso.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(this.emitClose)
        } else {
          this.localLoading = false
        }
      })
    }
  }
}
</script>
