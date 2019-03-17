<template>
  <el-header class="jus-header-main">
    <div class="jus-header-main__search">
      <jus-icon icon="search" class="el-menu__icon-search"/>
      <el-autocomplete
        v-model="disputeId"
        :trigger-on-focus="false"
        :fetch-suggestions="search"
        placeholder="Busque aqui os seus casos">
        <template slot-scope="{ item }">
          <router-link :to="'/management/case/' + item.disputeid">
            <div class="jus-header-main__result">
              <h4>
                Caso #{{ item.disputeid }} |
                Campanha: {{ item.campaignname }} |
                Processo: {{ item.disputecode }}
              </h4>
              <div>Estratégia: {{ item.strategyname }}</div>
              <div>Status: <span>{{ $t('occurrence.type.' + item.disputestatus) }}</span></div>
              <div v-for="(claiment, index) in item.claiments" :key="item.disputeid + claiment.f1 + index + 'claimant'">
                Parte contrária: {{ claiment.f1 }}
              </div>
              <div v-for="(lawyer, index) in item.claimentslawyer" :key="item.disputeid + lawyer.f1 + index + 'lawyer'">
                Advogado: {{ lawyer.f1 }}
              </div>
            </div>
          </router-link>
        </template>
      </el-autocomplete>
    </div>
    <div class="jus-header-main__notification">
      <el-dropdown trigger="click" placement="bottom">
        <jus-icon icon="notification"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="e">Sem novas notificações</el-dropdown-item>
          <!-- <el-dropdown-item command="e">Notificação importante 2</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 3</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 4</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 5</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 6</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="jus-header-main__info">
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
          <jus-avatar-user
            :name="name"
            size="sm"/>
          <div class="main-info__name">
            <div style="text-transform: capitalize;">
              {{ name }}
            </div>
            <span>{{ workspace }}</span>
          </div>
          <jus-icon icon="expand-dropdown"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile">
            <el-dropdown-item>
              Perfil
            </el-dropdown-item>
          </router-link>
          <!-- <router-link to="/profile/notifications">
            <el-dropdown-item>
              Notificações
            </el-dropdown-item>
          </router-link>
          <router-link to="/profile/activities">
            <el-dropdown-item>
              Minhas atividades
            </el-dropdown-item>
          </router-link> -->
          <a href="http://ajuda.justto.com.br/" target="_blank">
            <el-dropdown-item>
              Central de ajuda
            </el-dropdown-item>
          </a>
          <a href="#" @click="logout()">
            <el-dropdown-item divided>
              Sair
            </el-dropdown-item>
          </a>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'JusHeaderMain',
  data () {
    return {
      disputeId: ''
    }
  },
  computed: {
    name () {
      return this.$store.state.personModule.person.name
    },
    workspace () {
      return this.$store.state.workspaceModule.name
    }
  },
  methods: {
    getFields (term) {
      let fields = [
        'disputecode',
        'campaignname',
        'claiments.f1',
        'claiments.f2',
        'claimentslawyer.f1',
        'claimentslawyer.f2',
        'strategyname'
      ]
      if (!isNaN(term)) fields.push('disputeid')
      return fields
    },
    logout () {
      this.$store.dispatch('logout')
    },
    search (term, cb) {
      // var terms = term.split(' ')
      // terms = [...new Set(terms)]
      // var query = ''
      // for (let word of terms) {
      //   let w = '*' + word + '* OR ' + word
      //   if (terms[terms.length - 1] !== word) {
      //     w = w + ' AND '
      //   }
      //   query = query + w
      // }
      let query = term ? '*' + term + '* OR ' + term : '*'

      this.$store.dispatch('getDisputes', {
        query: {
          bool: {
            must: [{
              query_string: {
                fields: this.getFields(term),
                query: query
              }
            }, {
              match: {
                workspaceid: this.$store.state.workspaceModule.id
              }
            }]
          }
        }
      }).then(response => {
        cb(response)
      })
    }
  }
}
</script>

<style lang="scss">
.jus-header-main {
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 1;
  display: flex;
  &__result {
    line-height: 24px;
    margin: 10px 0;
    h4 {
      color: #9461f7;
      margin: 0;
      margin-bottom: 5px;
    }
    color: #adadad;
    span {
      text-transform: capitalize;
    }
  }
}
.jus-header-main__search {
  display: flex;
  width: 100%;
  .el-autocomplete {
    width: 100%;
    input {
      border: 0;
      outline: 0;
      height: 58px;
      font-size: 16px;
      opacity: .75;
    }
  }
}
.jus-header-main__notification {
  margin: auto;
  margin-right: 20px;
  cursor: pointer;
  .el-dropdown:after {
    // content: ' ';
    // min-width: 10px;
    // min-height: 10px;
    // background-color: #9f6cf8;
    // position: absolute;
    // border-radius: 50%;
    // bottom: 21px;
    // right: -1px;
  }
}
.jus-header-main__info {
  .el-dropdown-link {
    display: flex;
    align-items: center;
    margin: 8px 0;
    cursor: pointer;
  }
}
.main-info__name {
  margin: 0 20px 0 10px;
  div {
    white-space: nowrap;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: #666666;
    white-space: nowrap;
  }
}
</style>
