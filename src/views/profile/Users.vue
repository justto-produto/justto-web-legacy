<template>
  <JusViewMain>
    <template slot="title">Gerenciamento de usuários</template>
    <template slot="main">
      usuários
    </template>
    <template slot="aside">
      Teste
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
