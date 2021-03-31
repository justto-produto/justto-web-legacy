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
        >
          <el-button slot="append">
            Alterar
          </el-button>
        </el-input>
      </el-form-item>

      <el-form-item
        label="Telefone de contato"
        prop="phone"
      >
        <el-input v-model="form.phone">
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
  data: () => ({
    form: {
      name: '',
      password: '',
      phone: ''
    },
    rules: {
      phone: [
        { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }
      ],
      password: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      // newPasswordConfirm: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),

  computed: {
    ...mapGetters({
      id: 'loggedPersonId',
      name: 'loggedPersonName',
      hasName: 'loggedPersonHasName',
      phone: 'loggedPersonPhone'
    })
  },

  mounted() {
    Object.assign(this.form, {
      name: this.hasName ? this.name : '',
      phone: this.phone?.number || ''
    })
    // TODO: Adicionar mascara de telefone.
  },

  methods: {
    ...mapActions(['changeLoggedPersonName', 'changeLoggedPersonPhone']),

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
      }).catch(error => this.$jusNotification({ error }))
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
          })
        }
      })
    }
  }
}
</script>
