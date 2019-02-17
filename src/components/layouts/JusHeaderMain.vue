<template>
  <el-header class="jus-header-main">
    <div class="jus-header-main__search">
      <jus-icon icon="search" class="el-menu__icon-search"/>
      <!-- <input type="text" placeholder="Busque aqui os seus casos"> -->
      <el-autocomplete
        v-model="disputeId"
        :trigger-on-focus="false"
        :fetch-suggestions="search"
        placeholder="Busque aqui os seus casos">
        <template slot-scope="{ item }">
          <router-link :to="'/management/case/' + item._source.disputeid">
            <div class="jus-header-main__result">
              <h4>
                Caso #{{ item._source.disputeid }} |
                Campanha: {{ item._source.campaignname }} |
                Processo: {{ item._source.disputecode }}
              </h4>
              <div>Estratégia: {{ item._source.strategyname }}</div>
              <div>Status: <span>{{ $t('occurrence.type.' + item._source.disputestatus) }}</span></div>
              <div v-for="claiment in item._source.claiments">
                Parte contrária: {{claiment.f1}}
              </div>
              <div v-for="lawyer in item._source.claimentslawyer">
                Advogado: {{lawyer.f1}}
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
          <el-dropdown-item command="e">Notificação importante 1</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 2</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 3</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 4</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 5</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 6</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="jus-header-main__info">
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
          <jus-avatar-user
            size="sm"
            src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"/>
          <div class="main-info__name">
            <div>
              {{ name }}
            </div>
            <span>UX Designer</span>
          </div>
          <jus-icon icon="expand-dropdown"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/profile">Perfil</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/profile/notifications">Notificações</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/profile/activities">Minhas atividades</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <a href="http://ajuda.justto.com.br/" target="_blank">
              Central de ajuda
            </a>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <a href="#" @click="logout()">Sair</a>
          </el-dropdown-item>
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
      return this.$store.state.accountModule.name ? this.$store.state.accountModule.name : 'Mariana Rondino'
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    },
    search (term, cb) {
      var terms = term.split(' ')
      terms = [...new Set(terms)]
      var query = ''
      for (let word of terms) {
        let w = '*' + word + '*'
        if (terms[terms.length-1] !== word) {
          w = w + ' AND '
        }
        query = query + w
      }
      '*aaa* OR *bbb*'
      this.$store.dispatch('getDisputes',
        { query: { query_string: {
          fields: [
            'disputecode',
            'disputeid',
            'campaignname',
            'claiments.f1',
            'claiments.f2',
            'claimentslawyer.f1',
            'claimentslawyer.f2',
            'strategyname'
          ],
          query: query
        } } }
      ).then(response => {
        console.log(response)
        cb(response.hits.hits)
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
  margin-right: 32px;
  cursor: pointer;
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
  margin: 0 10px;
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
