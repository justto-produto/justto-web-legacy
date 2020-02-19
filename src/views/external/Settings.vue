<template lang="html">
  <el-row class="settings-view">
    <el-col :md="left" class="hidden-sm-and-down" style="transition: width ease 1s;">
      <jus-sidenav-external/>
    </el-col>
    <transition name="swiper-fade">
      <el-col v-if="right > 0" :md="right" class="content">
        <h1>Painel administrativo</h1>
        <el-tabs>
          <el-tab-pane label="Equipes">
            <el-table :data="workspaces" width="100%">
              <el-table-column type="expand" label="Usuários" width="90px">
                <template slot-scope="props">
                  <el-table :data="props.row.users" size="small" row-class-name="warning-row">
                    <el-table-column prop="name" label="Nome"/>
                    <el-table-column prop="email" label="E-mail"/>
                    <el-table-column align="right">
                      <el-button type="text" icon="el-icon-delete"/>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="Identificador"/>
              <el-table-column prop="teamName" label="Nome de exibição"/>
              <el-table-column label="Status" fixed="right" width="100px">
                <template slot-scope="props">
                  {{ props.row.status }}
                  <el-button type="text" icon="el-icon-edit"/>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Usuários">
            a
          </el-tab-pane>
          <el-tab-pane label="Estratégias">
            a
          </el-tab-pane>
          <el-tab-pane label="Minutas">
            a
          </el-tab-pane>
          <el-tab-pane label="Cobrança">
            a
          </el-tab-pane>
        </el-tabs>

        <!-- Listar workspace e permitir alterar seus status

        Listar usuários, controlar status, permitir reset de senha e alterar senha.

        Permitir vizualizar em quais workspace um usuário está

        Permitir configurar o plano e cobrança pra cada item nas Workspace

        Listar, editar nome, marcar como privada/publica as estratégias do sistema

        Permitir associar em workspaces

        Listar, editar nome, marcar como privada/publica os modelos de minutas do sistema

        Permitir associar em workspaces

        Criar função “impersonate” nos usuários. De simular o login do usuário. -->
      </el-col>
    </transition>
  </el-row>
</template>

<script>
export default {
  name: 'Settings',
  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal')
  },
  data () {
    return {
      left: 12,
      right: 0,
      workspaces: [{
        name: 'Workspace 1',
        teamName: 'Time 1',
        status: 'Ativo',
        users: [{ name: 'Conta 1', email: 'a@a.com' }, { name: 'Conta 2', email: 'a@a.com' }]
      }, {
        name: 'Workspace 2',
        teamName: 'Time 2',
        status: 'Inativo',
        users: [{ name: 'Conta 4', email: 'a@a.com' }, { name: 'Conta 5', email: 'a@a.com' }]
      }]
    }
  },
  created () {
    setTimeout(function () {
      this.left = 6
    }.bind(this), 400)
    setTimeout(function () {
      this.right = 18
    }.bind(this), 1200)
  },
  mounted () {
    // this.$alert('', 'PÁGINA EM CONSTRUÇÃO', {
    //   confirmButtonText: 'OK'
    // })
  }
}
</script>

<style lang="scss">
.settings-view {
  height: 100%;
  background-color: #fff;
  >.el-col {
    height: 100%
  }
  .el-col.content {
    padding: 60px;
  }
  h1 {
    margin-bottom: 60px;
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 10px 0px 10px 31px;
    th {
      background-color: #f7f7f7;
    }
  }
  .el-tabs__content {
    margin-top: 40px;
  }
}
</style>
