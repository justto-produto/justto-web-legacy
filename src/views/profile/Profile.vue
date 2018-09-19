<template>
  <content-view side-card>
    <template slot="title">Configurações do perfil</template>
    <template slot="main">

      <el-form class="profile-form" ref="profileForm" :model="profileForm" label-position="top">
        <user-avatar size="lg" class="profile-form__avatar" src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"></user-avatar>
        <span class="profile-form__edit-photo">
          Alterar foto
          <br>
          Remover foto
        </span>
        <el-form-item label="Nome">
          <el-input v-model="profileForm.name"></el-input>
        </el-form-item>
        <el-form-item label="E-mail">
          <el-input v-model="profileForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Alterar senha">
          <el-input v-model="profileForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Clientes">
          <user-avatar size="sm" src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"></user-avatar>
          <user-avatar size="sm"></user-avatar>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w100" @click="onSubmit">Salvar</el-button>
        </el-form-item>
      </el-form>

      <!-- <br><br><br><br><br><br><br>
      Role para baixo
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i>
      <br><br><br><br><br><br><br>
      <i class="el-icon-arrow-down"></i> -->
    </template>
    <template slot="aside">
      <jus-icon icon="best-practices"/>
      <h3>
        Melhores práticas para importar casoss
      </h3>
      <br>
      <p>Ao escolher uma opção para importação, certifique-se de que os dados estão inseridos corretamente. Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com informações complementares colhidas diretamente do TJ.<br><br> Não se esqueça de preencher os dados mínimos da planilha <br><br> • Número do processo<br> • Empresa<br> • Alçadas da negociação <br> • Nome e CPF das partes
      </p>
    </template>
  </content-view>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      profileForm: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang="scss">

</style>
