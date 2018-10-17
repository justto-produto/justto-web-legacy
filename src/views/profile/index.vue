<template>
  <JusViewMain side-card>
    <template slot="title">Configurações do perfil</template>
    <template slot="main">
      <el-form ref="profileForm" :model="profileForm" class="profile-form" label-position="top">
        <jus-avatar-user size="lg" class="profile-form__avatar" src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"/>
        <span class="profile-form__edit-photo">
          Alterar foto
          <br>
          Remover foto
        </span>
        <el-form-item label="Nome">
          <el-input v-model="profileForm.name"/>
        </el-form-item>
        <el-form-item label="E-mail">
          <el-input v-model="profileForm.email"/>
        </el-form-item>
        <el-form-item label="Senha">
          <el-input v-model="profileForm.password"/>
          <el-button type="text" class="el-button--input-float" @click="changePasswordDialog">Alterar senha</el-button>
          <el-dialog :visible.sync="dialogVisible" title="Alterar senha" width="30%">
            <el-form ref="loginForm" :model="loginForm" class="external-view__form" label-position="top">
              <el-form-item label="Nova senha" prop="newPassword">
                <el-input v-model="loginForm.newPassword" type="password"/>
              </el-form-item>
              <el-form-item label="Confirme a nova senha" prop="newPasswordConfirm">
                <el-input v-model="loginForm.newPasswordConfirm" type="password"/>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancelar</el-button>
              <el-button :loading="loadingChangePassword" type="primary" @click="success">
                {{ loadingChangePassword ? 'Salvando alterações' : 'Salvar alterações' }}
              </el-button>
            </span>
          </el-dialog>
        </el-form-item>
        <el-form-item label="Clientes">
          <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
            <jus-avatar-user size="sm"/>
            <span style="margin-left: 20px;">Nestlé</span>
            <el-popover style="margin-left: auto;" placement="top" title="Nestlé" width="300" trigger="hover" content="Chocolates, panetones, larvas e processos.">
              <el-button slot="reference" class="el-button--icon">
                <jus-icon icon="more-info-grey"/>
              </el-button>
            </el-popover>
          </div>
          <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
            <jus-avatar-user size="sm"/>
            <span style="margin-left: 20px;">Embraer</span>
            <jus-icon icon="more-info-grey" style="margin-left: auto;"/>
          </div>
          <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
            <jus-avatar-user size="sm"/>
            <span style="margin-left: 20px;">Embraer</span>
            <jus-icon icon="more-info-grey" style="margin-left: auto;"/>
          </div>
          <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
            <jus-avatar-user size="sm"/>
            <span style="margin-left: 20px;">Embraer</span>
            <jus-icon icon="more-info-grey" style="margin-left: auto;"/>
          </div>
          <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
            <jus-avatar-user size="sm"/>
            <span style="margin-left: 20px;">Embraer</span>
            <jus-icon icon="more-info-grey" style="margin-left: auto;"/>
          </div>
          <div class="display-flex align-center" style="margin-top: 10px; line-height: 0;">
            <jus-avatar-user size="sm"/>
            <span style="margin-left: 20px;">Embraer</span>
            <jus-icon icon="more-info-grey" style="margin-left: auto;"/>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w100" @click="onSubmit">Salvar</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template slot="aside">
      <el-carousel :interval="5000" :autoplay="false" arrow="always" height="107px" trigger="click" class="el-carousel__container--profile">
        <el-carousel-item v-for="item in 3" :key="item">
          <div class="el-carousel__item-main">
            <h2>25</h2>
            <span>Metas cumpridas<br>no mês</span>
          </div>
        </el-carousel-item>
      </el-carousel>
      <h4>Performance mensal</h4>
      <el-row style="font-size: 12px;">
        <el-col :span="12">
          <span class="dot-test purple"/>
          Acordos fechados
        </el-col>
        <el-col :span="12">
          <span class="dot-test orange"/>
          Não fechados
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col v-for="data in dataSets" :span="8" :key="data.id">
          <JusChartDoughnut :data="data" :width="75" :height="130" title="JUL" />
        </el-col>
      </el-row>
      <h4>Interação dos usuários</h4>
      <el-row style="font-size: 12px;">
        <el-col :span="12">
          <span class="dot-test purple"/>
          Respondem
        </el-col>
        <el-col :span="12">
          <span class="dot-test orange"/>
          Não interagem
        </el-col>
      </el-row>
      <br>
      <JusChartLine :data="data2" :options="options" :width="300" :height="130"/>
    </template>
  </JusViewMain>
</template>

<script>
import JusChartDoughnut from '@/components/charts/JusChartDoughnut'
import JusChartLine from '@/components/charts/JusChartLine'

export default {
  name: 'Profile',
  components: {
    JusChartDoughnut,
    JusChartLine
  },
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

.profile-form{
  max-width: 400px;
  margin: 40px auto;
}

.profile-form__avatar{
  text-align: center;
  display: block;
}

.profile-form__edit-photo{
  font-size: 12px;
  color: #adadad;
  display: block;
  text-align: center;
  margin: 10px;
}

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
