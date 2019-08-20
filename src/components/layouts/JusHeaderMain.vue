<template>
  <el-header class="jus-header-main">
    <div class="jus-header-main__search">
        <jus-icon icon="search" class="el-menu__icon-search" v-if="!disputeId"/>
        <el-autocomplete
          v-model="disputeId"
          v-if="!disputeId"
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
        <h2 v-else class="jus-header-main__title">Disputa #{{ disputeId }}</h2>
      </div>
      <div class="jus-header-main__whatsapp" @click="whatsappVisible = true">
        <el-tooltip>
          <div slot="content">
            <span v-if="!isWhatsappconnected">
              WhatsApp desconectado
            </span>
            <span v-else-if="!!whatsappNumber">
              Conectado via: {{ whatsappNumber | phoneMask }}
            </span>
            <span v-else>
              WhatsApp conectado
            </span>
          </div>
          <jus-icon :icon="'whatsapp-' + (!isWhatsappconnected ? 'disconnected' : 'connected')" />
        </el-tooltip>
        <i v-if="!isWhatsappconnected" class="el-icon-warning" />
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
      <el-dialog :visible.sync="whatsappVisible" width="400" style="padding-top: 40px;">
        <span slot="title">
          <h2>Whatsapp</h2>
        </span>
        <jus-whatsapp v-if="$store.getters.whatsappStatus !== 'OFFLINE'" />
        <div v-else>
          <h2>Desculpe :(</h2>
          <p>
            Nosso servidor Whatsapp encontra-se instável neste momento.<br>
            Tente novamente mais tarde ou entre em contato com nosso suporte técnico.
          </p>
        </div>
        <span slot="footer">
          <el-button plain @click="whatsappVisible = false">Fechar</el-button>
        </span>
      </el-dialog>
    </el-header>
  </div>
</template>

<script>
import JusDisputeResume from '@/components/layouts/JusDisputeResume'
import { fuseSearchDisputes } from '@/plugins/jusUtils'

export default {
  name: 'JusHeaderMain',
  components: {
  },
  data () {
    return {
      disputeId: '',
      whatsappVisible: false,
      disputeId: null
    }
  },
  watch: {
    '$route.params.id': function (id) {
      this.disputeId = id
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
  },
  beforeMount() {
    this.disputeId = this.$route.params.id
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
      background-color: #fff;
      border-radius: 50%;
      color: #FF4B54;
      position: absolute;
      right: -4px;
      bottom: 1px;
      font-size: 18px;
      animation-delay: .2s;
      animation-duration: 1.5s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: throbber-pulse,throbber-fade;
      animation-timing-function: ease-in-out;
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
