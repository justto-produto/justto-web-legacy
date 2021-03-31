<template>
  <article class="edit-user-container">
    <el-form :model="form">
      <el-form-item
        label="Nome"
        prop="name"
      >
        <el-input
          v-model="form.name"
        >
          <el-button slot="append">
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
          <el-button slot="append">
            Alterar
          </el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    form: {
      name: '',
      password: '',
      phone: ''
    }
  }),
  computed: {
    ...mapGetters({
      name: 'loggedPersonName',
      hasName: 'loggedPersonHasName',
      phone: 'loggedPersonPhone'
    })
  },

  mounted() {
    Object.assign(this.form, {
      name: this.hasName ? this.name : '',
      phone: this.phone
    })
  }
}
</script>
