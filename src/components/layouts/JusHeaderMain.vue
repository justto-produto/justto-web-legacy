<template>
  <el-header class="jus-header-main">
    <div class="jus-header-main__search">
      <jus-icon icon="search" class="el-menu__icon-search"/>
      <el-autocomplete
        v-model="disputeId"
        :trigger-on-focus="false"
        :fetch-suggestions="search"
        placeholder="Busque aqui as suas disputas">
        <template slot-scope="{ item }">
          <router-link v-if="item.id" :to="'/management/dispute/' + item.id">
            <jus-dispute-resume :dispute="item" />
          </router-link>
          <span v-else style="background-color: white;display: block;margin-left: -20px;margin-right: -20px;padding: 0 20px;">
            Não foram encontradas disputas para esta busca.
          </span>
        </template>
      </el-autocomplete>
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
          <div class="jus-header-main__version">
            Versão {{ appVersion }}
          </div>
          <router-link to="/profile">
            <el-dropdown-item divided>
              Perfil
            </el-dropdown-item>
          </router-link>
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
import JusDisputeResume from '@/components/layouts/JusDisputeResume'
import { fuseSearchDisputes } from '@/plugins/jusUtils'

export default {
  name: 'JusHeaderMain',
  components: {
    JusDisputeResume
  },
  data () {
    return {
      disputeId: ''
    }
  },
  computed: {
    name () {
      return this.$store.getters.currentPersonName
    },
    workspace () {
      return this.$store.state.workspaceModule.name
    },
    appVersion () {
      return process.env.VUE_APP_VERSION
    }
  },
  methods: {
    logout () {
      window.analytics.track('Logout realizado', {
        workspace: this.workspace,
        username: this.name
      })
      setTimeout(() => {
        this.$store.dispatch('logout')
      }, 500)
      const loading = this.$loading({
        lock: true
      })
      setTimeout(() => {
        loading.close()
      }, 1000)
    },
    search (term, cb) {
      let results = fuseSearchDisputes(this.$store.getters.disputes, term)
      setTimeout(function () {
        if (results && results.length) {
          cb(results)
        } else {
          cb([0])
        }
      }, 500)
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
  &__version {
    margin: 6px 20px 12px 20px;
    color: #adadad;
    font-size: 12px;
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
