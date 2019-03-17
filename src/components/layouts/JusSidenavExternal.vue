<template>
  <div class="jus-sidenav-external">
    <img class="jus-sidenav-external__logo" src="@/assets/logo.svg">
    <div v-if="showPlans" class="jus-sidenav-external__title">
      <div>
        <span>15</span>
        <span>dias de teste<br>gratuito</span>
      </div>
      <div>
        máximo de <br>100 casos
      </div>
    </div>
    <div v-if="showPlans" class="jus-sidenav-external__divider">
      Após período de teste
      <div />
    </div>
    <div v-if="showPlans" class="jus-sidenav-external__price">
      <span>R$ 250</span>
      <span>ao mês</span>
    </div>
    <div v-if="showPlans" class="jus-sidenav-external__plans">
      <el-button plain @click="showModal(1)">
        <div>+ R$ 18</div>
        por caso com interação<br>(carteira indenizatória)
      </el-button>
      <el-button plain @click="showModal(0)">
        <div>+ R$ 35</div>
        por caso com interação<br>(carteira de cobrança)
      </el-button>
    </div>
    <el-dialog
      v-if="showPlans"
      :title="modalType ? 'Indenizatório' : 'Cobrança'"
      :visible.sync="modal"
      width="600px">
      <span>
        Nós da JUSTTO queremos fazer a diferença na sua frente de acordos. Portanto,
        você pode inserir quantos casos quiser na plataforma e só cobraremos por aqueles
        casos em que houver interação.
      </span>
      <el-collapse class="el-collapse--bordered">
        <el-collapse-item title="O que consideramos como interação?">
          <b>WhatsApp:</b> Qualquer resposta ou clique em Link <br>
          <b>E-mail e CNA:</b> Qualquer resposta ou clique em Link <br>
          <b>Aplicativos Mobile JUSTTO:</b> Download ou Acesso ao Caso <br>
          <b>Aplicativo Web JUSTTO:</b> Acesso ao Caso <br>
          <b>Ações do Cliente / Negociador:</b> Mudança de Status do Ticket para "Em
          Engajamento", "Novos Acordos" ou "Ganho"
        </el-collapse-item>
        <el-collapse-item title="Como posso estimar quanto vou pagar?">
          Quanto exatamente você vai pagar depende do perfil da sua carteira, mas
          temos uma média de mercado para te dar uma ideia: <br><br>
          <span v-if="modalType">
            100 casos importados &rarr; 60 casos com interação &rarr; 40 acordos fechados
          </span>
          <span v-else>
            100 casos importados &rarr; 15 casos com interação &rarr; 10 acordos fechados
          </span>
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modal = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'JusSidenavexternal',
  props: {
    showPlans: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      modalType: 1
    }
  },
  methods: {
    showModal (type) {
      this.modalType = type
      this.modal = true
    }
  }
}
</script>

<style lang="scss">
.jus-sidenav-external {
  padding: 0 40px;
  height: 100%;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      font-size: 20px;
      &:first-child {
        color: #ff9300;
        span {
          font-size: 30px;
          display: inline-block;
          vertical-align: middle;
          &:first-child {
            font-size: 100px;
            font-weight: 500;
          }
          & + span {
            margin-left: 20px;
          }
        }
      }
    }
  }
  &__divider {
    width: 100%;
    display: flex;
    font-size: 20px;
    white-space: nowrap;
    margin: 60px 0;
    div {
      margin-left: 20px;
      position: relative;
      width: 100%;
      &:after {
        content: ' ';
        position: absolute;
        top: 12px;
        left: 0;
        right: 0;
        border-top: 2px solid #eeeeee;
      }
    }
  }
  &__price {
    width: 100%;
    color: #9461f7;
    span{
      font-size: 30px;
      font-weight: 500;
      &:first-child {
        font-size: 60px;
      }
      & + span {
        margin-left: 20px;
      }
    }
  }
  &__plans {
    width: 100%;
    margin-top: 40px;
    .el-button {
      border-radius: 6px;
      font-size: 16px;
      white-space: normal;
      background-color: transparent;
      padding: 20px;
      text-align: left;
      div {
        margin-bottom: 10px;
        font-size: 30px;
        font-weight: 500;
      }
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
  &__logo{
    margin: 40px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .el-collapse {
    margin: 20px 0;
  }
  .el-dialog {
    &__header {
      padding-top: 40px;
    }
    .el-button {
      min-width: 128px;
    }
  }
}
</style>
