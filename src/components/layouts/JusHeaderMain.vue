<template>
  <div>
    <el-header class="jus-header-main">
      <div class="jus-header-main__search">
        <jus-icon v-if="!disputeId" icon="search" class="el-menu__icon-search" />
        <el-autocomplete
          v-if="!disputeId"
          v-model="dispute"
          :trigger-on-focus="false"
          :fetch-suggestions="search"
          :debounce="800"
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
        <h2 v-else class="jus-header-main__title">
          <router-link to="/management">
            <jus-icon icon="back"/>
          </router-link>
          Disputa #{{ disputeId }}
        </h2>
      </div>
      <div class="jus-header-main__whatsapp" @click="toggleWhatsapDialog">
        <el-tooltip>
          <div slot="content">
            <span v-if="!isWhatsappConnected">
              WhatsApp desconectado
            </span>
            <span v-else-if="!!whatsappNumber">
              Conectado via: {{ whatsappNumber | phoneMask }}
            </span>
            <span v-else>
              WhatsApp conectado
            </span>
          </div>
          <jus-icon :icon="'whatsapp-' + (!isWhatsappConnected ? 'disconnected' : 'connected')" />
        </el-tooltip>
        <i v-if="!isWhatsappConnected" class="el-icon-warning el-icon-pulse el-icon-danger" />
      </div>
      <div class="jus-header-main__info">
        <el-dropdown trigger="click" placement="bottom-start">
          <span class="el-dropdown-link">
            <jus-avatar-user :name="name" size="sm" />
            <div class="jus-header-main__name">
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
    <jus-whatsapp />
  </div>
</template>

<script>
export default {
  name: 'JusHeaderMain',
  components: {
    JusWhatsapp: () => import('@/components/layouts/JusWhatsapp'),
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume')
  },
  data () {
    return {
      dispute: '',
      disputeId: ''
    }
  },
  computed: {
    name () {
      return this.$store.getters.loggedPersonName
    },
    workspace () {
      return this.$store.state.workspaceModule.name
    },
    appVersion () {
      return process.env.VUE_APP_VERSION
    },
    isWhatsappConnected () {
      return this.$store.getters.whatsappStatus === 'CONNECTED'
    },
    whatsappNumber () {
      return this.$store.getters.whatsappNumber
    }
  },
  watch: {
    '$route.params.id': function (id) {
      this.disputeId = id
    }
  },
  beforeMount () {
    this.disputeId = this.$route.params.id
  },
  methods: {
    toggleWhatsapDialog () {
      this.$store.commit('toggleWhatsapDialog')
    },
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
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.$store.dispatch('searchDisputes', { key: 'term', value: term }).then(response => {
          cb(response)
        })
      }, 800)
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
  &__title {
    margin-left: 20px;
    font-weight: 500;
    a {
      margin-right: 20px;
    }
  }
  &__search {
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
  &__whatsapp {
    position: relative;
    margin: auto;
    margin-right: 14px;
    img {
      width: 28px;
      cursor: pointer;
    }
    .el-icon-warning {
      position: absolute;
      right: -4px;
      bottom: 1px;
    }
  }
  &__info {
    .el-dropdown-link {
      display: flex;
      align-items: center;
      margin: 8px 0;
      cursor: pointer;
    }
  }
  &__name {
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
}
</style>
