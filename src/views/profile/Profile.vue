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
        <el-form-item label="Senha">
          <el-input v-model="profileForm.password"></el-input>
          <el-button @click="changePasswordDialog" type="text" class="el-button--input-float">Alterar senha</el-button>
          <el-dialog
            title="Alterar senha"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form class="external-view__form" label-position="top" ref="loginForm" :model="loginForm">
              <el-form-item label="Nova senha" prop="newPassword">
                <el-input v-model="loginForm.newPassword" type="password"></el-input>
              </el-form-item>
              <el-form-item label="Confirme a nova senha" prop="newPasswordConfirm">
                <el-input v-model="loginForm.newPasswordConfirm" type="password"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancelar</el-button>
              <el-button type="primary" :loading="loadingChangePassword" @click="success">
                {{ loadingChangePassword ? 'Salvando alterações' : 'Salvar alterações' }}
              </el-button>
            </span>
          </el-dialog>
        </el-form-item>
        <el-form-item label="Clientes">
          <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
            <user-avatar size="sm"></user-avatar>
            <span style="margin-left: 20px;">Nestlé</span>
            <el-popover
            style="margin-left: auto;"
            placement="top"
            title="Nestlé"
            width="300"
            trigger="hover"
            content="Chocolates, panetones, larvas e processos.">
            <el-button slot="reference" class="el-button--icon">
              <jus-icon icon="more-info-grey"></jus-icon>
            </el-button>
          </el-popover>
        </div>
        <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
          <user-avatar size="sm"></user-avatar>
          <span style="margin-left: 20px;">Embraer</span>
          <jus-icon icon="more-info-grey" style="margin-left: auto;"></jus-icon>
        </div>
        <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
          <user-avatar size="sm"></user-avatar>
          <span style="margin-left: 20px;">Embraer</span>
          <jus-icon icon="more-info-grey" style="margin-left: auto;"></jus-icon>
        </div>
        <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
          <user-avatar size="sm"></user-avatar>
          <span style="margin-left: 20px;">Embraer</span>
          <jus-icon icon="more-info-grey" style="margin-left: auto;"></jus-icon>
        </div>
        <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
          <user-avatar size="sm"></user-avatar>
          <span style="margin-left: 20px;">Embraer</span>
          <jus-icon icon="more-info-grey" style="margin-left: auto;"></jus-icon>
        </div>
        <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
          <user-avatar size="sm"></user-avatar>
          <span style="margin-left: 20px;">Embraer</span>
          <jus-icon icon="more-info-grey" style="margin-left: auto;"></jus-icon>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w100" @click="onSubmit">Salvar</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template slot="aside">
    <el-carousel :interval="5000" arrow="always" height="107px" :autoplay="false" trigger="click" class="el-carousel__container--profile">
      <el-carousel-item v-for="item in 3" :key="item">
        <div class="el-carousel__item-content">
          <h2>25</h2>
          <span>Metas cumpridas<br>no mês</span>
        </div>
      </el-carousel-item>
    </el-carousel>
    <h4>Performance mensal</h4>
    <el-row style="font-size: 12px;">
      <el-col :span="12">
        <span class="dot-test purple"></span>
        Acordos fechados
      </el-col>
      <el-col :span="12">
        <span class="dot-test orange"></span>
        Não fechados
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="8" v-for="data in dataSets" :key="data.id">
        <doughnut-chart :data="data" title="JUL" :width="75" :height="130"></doughnut-chart>
      </el-col>
    </el-row>
    <h4>Interação dos usuários</h4>
    <el-row style="font-size: 12px;">
      <el-col :span="12">
        <span class="dot-test purple"></span>
        Respondem
      </el-col>
      <el-col :span="12">
        <span class="dot-test orange"></span>
        Não interagem
      </el-col>
    </el-row>
    <br>
    <line-chart :data="data2" :options="options" :width="300" :height="130"></line-chart>
  </template>
</content-view>
</template>

<script>
import DoughnutChart from '@/components/charts/DoughnutChart'
import LineChart from '@/components/charts/LineChart'

export default {
  name: 'Profile',
  data () {
    return {
      profileForm: {
        name: '',
        email: '',
        password: ''
      },
      dataSets: [
        [36, 16, 48],
        [21, 23, 56],
        [41, 22, 37]
      ],
      data2: {
        labels: ['ABR', 'MAI', 'JUN', 'AGO', 'SET', 'OUT'],
        datasets: [
          {
            label: 'Respondem',
            backgroundColor: '#eF930066',
            borderColor: '#eF9300',
            pointBackgroundColor: '#eF9300',
            pointBorderColor: '#eF9300',
            data: [11, 13, 14, 12, 11, 12]
          },
          {
            label: 'Não interagem',
            backgroundColor: '#9461f766',
            borderColor: '#9461f7',
            pointBackgroundColor: '#9461f7',
            data: [15, 12, 16, 11, 13, 12]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        }
      },
      dialogVisible: false,
      loginForm: {},
      loadingChangePassword: false
    }
  },
  components: {
    DoughnutChart,
    LineChart
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    changePasswordDialog () {
      this.dialogVisible = true
    },
    success () {
      this.loadingChangePassword = true
      setTimeout(() => {
        this.dialogVisible = false
        this.$notify({
          title: 'Yay!',
          message: 'Sua senha foi alterada com sucesso!',
          position: 'bottom-right',
          duration: 2000,
          customClass: 'success'
        }, 2000)
        this.loadingChangePassword = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
.dot-test {
  content: ' ';
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
  margin-bottom: -1px;
  &.orange {
    background-color: #ff9300;
  }
  &.purple {
    background-color: #9461f7;
  }
}
</style>
