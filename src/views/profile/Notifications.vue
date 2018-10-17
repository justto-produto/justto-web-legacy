<template>
  <JusViewMain>
    <template slot="title">
      <h1>
        Notificações
        <el-dropdown trigger="click" placement="bottom-start" style="margin-left: 10px">
          <span class="el-dropdown-link">
            <jus-icon icon="settings-grey"/>
          </span>
          <el-dropdown-menu slot="dropdown" class="el-dropdown-menu--notifications">
            <el-row class="el-dropdown-menu__header">
              <el-col :span="12">Notificar quando:</el-col>
              <el-col :span="4">SMS</el-col>
              <el-col :span="4">E-mail</el-col>
              <el-col :span="4">WebApp</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Receber mensagem das partes ou dos advogados das partes</el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Receber contraproposta</el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Integrante do time fechar um acordo</el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Uma estretégia utilizada por você for modificada</el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Se algum dado for acrescentado em conflitos que você acompanha</el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Status do conflito mudar</el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Feedback de desempenho semanal</el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
              <el-col :span="4"><el-checkbox/></el-col>
            </el-row>
          </el-dropdown-menu>
        </el-dropdown>
      </h1>
    </template>
    <template slot="main">
      <el-tabs type="card" class="el-tabs--centered el-tabs--notifications">
        <el-tab-pane label="Recentes">
          <br><br>
          <JusNotificationCard
            title="Mariana Rondino"
            content="Alterou a estretégia: Negociação 1"
            date="19 Set às 16:10"
            complement="Enviar SMS Enviar Whatsapp"/>
          <JusNotificationCard
            title="Parte: Rogégio (Maurício) do nome comprido"
            content="Enviou contraproposta"
            date="18 Set às 14:15"
            complement="R$10.000 Conflito: 123456"/>
          <JusNotificationCard
            title="Advogado da parte: Geraldo da Silva"
            content="Te enviou uma mensagem"
            date="17 Set às 12:30"
            complement="Conflito: 789012"/>
          <JusNotificationCard
            title="Mariana Rondino"
            content="Alterou a estretégia: Negociação 1"
            date="18 Set às 16:10"
            complement="Enviar SMS Enviar Whatsapp"/>
        </el-tab-pane>
        <el-tab-pane label="Antigas">
          <br><br>
          <JusNotificationCard
            title="Mariana Rondino"
            content="Alterou a estretégia: Negociação 1"
            date="18 Set às 16:10"
            complement="Enviar SMS Enviar Whatsapp"/>
        </el-tab-pane>
      </el-tabs>
    </template>
  </JusViewMain>
</template>

<script>
import JusNotificationCard from '@/components/layouts/JusNotificationCard.vue'

export default {
  name: 'Notifications',
  components: {
    JusNotificationCard
  }
}
</script>

<style lang="scss">
  .el-tabs--notifications {
    max-width: 410px;
    margin: 20px auto;
  }
</style>
