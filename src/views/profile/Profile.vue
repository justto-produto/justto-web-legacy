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
          <div class="display-flex" style="margin-top: 10px;">
            <user-avatar size="sm"></user-avatar>
            <span style="margin-left: 20px;">Nestlé</span>
          </div>
          <div class="display-flex">
            <user-avatar size="sm"></user-avatar>
            <span style="margin-left: 20px;">Embraer</span>
          </div>
          <div class="display-flex">
            <user-avatar size="sm"></user-avatar>
            <span style="margin-left: 20px;">Embraer</span>
          </div>
          <div class="display-flex">
            <user-avatar size="sm"></user-avatar>
            <span style="margin-left: 20px;">Embraer</span>
          </div>
          <div class="display-flex">
            <user-avatar size="sm"></user-avatar>
            <span style="margin-left: 20px;">Embraer</span>
          </div>
          <div class="display-flex">
            <user-avatar size="sm"></user-avatar>
            <span style="margin-left: 20px;">Embraer</span>
          </div>
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
      <el-carousel :interval="5000" arrow="always" height="107px" :autoplay="false" trigger="click" class="el-carousel__container--profile">
        <el-carousel-item v-for="item in 3" :key="item">
          <div class="el-carousel__item-content">
            <h2>25</h2>
            <span>Metas cumpridas <br>no mês</span>
          </div>
        </el-carousel-item>
      </el-carousel>
      <h4>Performance mensal</h4>
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
