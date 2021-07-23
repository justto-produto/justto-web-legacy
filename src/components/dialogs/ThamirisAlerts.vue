<template>
  <el-dialog
    ref="thamiresalerts"
    :visible.sync="isVisible"
    :before-close="closeDialog"
    :show-close="false"
    destroy-on-close
    append-to-body
    :width="calcWidth"
  >
    <div class="thamiris__alerts">
      <div class="thamiris__alerts__header">
        <div class="thamiris__alerts__header-icon">
          <div class="thamiris__alerts__header-icon-red" />
          <i class="el-icon-bell" />
        </div>
        <h1 class="thamiris__alerts__header-title">
          Bom dia! Olha só as dicas que temos pra você :)
        </h1>
        <span class="thamiris__alerts__header-subtitle">
          Pegue o café e confira os alertas para ter um dia mais produtivo!
        </span>
      </div>
      <!-- Usado um css branco para poder deixar o cabeçalho laranja -->
      <div class="thamiris__alerts__shadow">
        <img :src="coffee">
        <h1 class="thamiris__alerts__shadow-title">
          Bom dia! Olha só as dicas que temos pra você :)
        </h1>
        <span class="thamiris__alerts__shadow-subtitle">
          Pegue o café e confira os alertas para ter um dia mais produtivo!
        </span>
      </div>
      <div class="thamiris__alerts__body">
        <span
          v-if="notifications.length !== 0"
          class="thamiris__alerts__body-title"
        >
          Você ainda tem:
        </span>
        <span
          v-else
          class="thamiris__alerts__body-title"
        >
          Você não tem alertas
        </span>
        <div class="thamiris__alerts__body-items">
          <div
            v-for="notification in notifications"
            :key="`${notification.quantity}-${notification.type}`"
            class="thamiris__alerts__body-items-item"
          >
            <div class="thamiris__alerts__body-items-item-circle">
              <div
                v-if="notification.quantity !== 0"
                class="thamiris__alerts__body-items-item-circle-style"
              >
                <div
                  class="thamiris__alerts__body-items-item-circle-style-al"
                  @click="applyFilters(notification)"
                >
                  <div class="thamiris__alerts__body-items-item-circle-style-al-num">
                    {{ handleQuantity(notification.quantity) }}
                  </div>

                  <!-- <div class="thamiris__alerts__body-items-item-circle-style-al-disp">
                    disputas
                  </div> -->
                </div>
              </div>
              <div
                v-else
                class="thamiris__alerts__body-items-item-circle-img"
              >
                <img src="https://storage.googleapis.com/justto_app/conteudos/Componente-27-1.png">
              </div>
            </div>
            <div
              v-if="notification.quantity !== 0"
              class="thamiris__alerts__body-items-item-message"
            >
              {{ notification.name }}
            </div>
            <div
              v-else
              class="thamiris__alerts__body-items-item-message-line-through"
            >
              {{ notification.name }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="thamiris__alerts__confirm"
      >
        <el-button
          class="thamiris__alerts__confirm-button"
          @click="closeDialog"
        >
          Fechar
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      innerWidth: window.innerWidth
    }
  },

  computed: {
    ...mapGetters({
      notifications: 'notifications'
    }),

    coffee() {
      return require('@/assets/img/coffee.png')
    },

    calcWidth() {
      if (this.innerWidth > 1300) return '40%'
      const pattern = 1300
      const porc = 55
      const x = 100 - (this.innerWidth * porc) / pattern
      return `${x}%`
    }
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth
    })
  },

  methods: {
    ...mapActions({
      setTicketsFilters: 'setTicketsFilters',
      setTicketsActiveTab: 'setTicketsActiveTab',
      getTickets: 'getTickets'
    }),

    ...mapMutations({
      hideThamirisAlerts: 'hideThamirisAlerts'
    }),

    applyFilters({ filter, tab }) {
      this.setTicketsActiveTab(tab.toLowerCase())

      this.setTicketsFilters({
        filters: {},
        hasFilters: true,
        preventFilters: true,
        preventSocket: true
      })

      this.setTicketsFilters({
        filters: Object.assign({}, filter),
        hasFilters: true,
        preventFilters: true,
        preventSocket: true
      })

      if (this.$route.name !== 'negotiation') {
        this.$router.push('/negotiation')
      } else {
        this.getTickets()
      }

      this.closeDialog()
    },

    closeDialog() {
      this.hideThamirisAlerts()
    },

    handleQuantity(num) {
      return num < 100 ? num : num >= 1000 ? '1k+' : '99+'
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.thamiris__alerts {
  display: flex;
  flex-direction: column;

  .thamiris__alerts__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: $--color-primary;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 30px;

    .thamiris__alerts__header-icon {
      font-size: 45px;
      background-color: white;
      color: $--color-primary;
      height: 55px;
      width: 55px;
      border-radius: 50px;
      position: relative;

      .thamiris__alerts__header-icon-red {
        position: absolute;
        top: 0;
        right: 0;
        height: 15px;
        width: 15px;
        border-radius: 50px;
        background-color: $--color-nps-detractor;
      }
    }

    .thamiris__alerts__header-title {
      color: white;
      font-weight: bold;
      padding-left: 40px;
      padding-right: 40px;
      word-break: break-word;
    }

    .thamiris__alerts__header-subtitle {
      color: white;
      font-size: 12px;
      padding-left: 55px;
      padding-right: 55px;
      word-break: break-word;
    }
  }

  .thamiris__alerts__shadow {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: white;
    width: 100%;
    padding: 30px 30px 0px 30px;
    color: white;

    .thamiris__alerts__shadow-title {
      color: white;
      font-weight: bold;
      padding-left: 38px;
      padding-right: 38px;
    }

    .thamiris__alerts__shadow-subtitle {
      color: white;
      font-size: 10px;
      padding-left: 48px;
      padding-right: 48px;
    }
  }

  .thamiris__alerts__body{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    .thamiris__alerts__body-title {
      color: $--color-primary;
      font-weight: bold;
      font-size: 24px;
      margin-top: 10px;
      margin-bottom: 16px;
    }

    .thamiris__alerts__body-items {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 15px;

      .thamiris__alerts__body-items-item {
        flex: 0 0 33%;
        margin-bottom: 10px;

        .thamiris__alerts__body-items-item-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;

          .thamiris__alerts__body-items-item-circle-img img {
            height: 80px;
          }

          .thamiris__alerts__body-items-item-circle-style {
            height: 65px;
            width: 65px;
            background-color: $--color-primary;
            border-radius: 100%;

            .thamiris__alerts__body-items-item-circle-style-al {
              cursor: pointer;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;

              .thamiris__alerts__body-items-item-circle-style-al-num {
                font-size: 30px;
                font-weight: bold;
                padding-top: 15px;
              }

              .thamiris__alerts__body-items-item-circle-style-al-disp {
                font-size: 8px;
                margin-top: -3px;
              }
            }
          }

          .thamiris__alerts__body-items-item-circle-style:hover {
            background-color: $--color-primary-light-2;
          }
        }

        .thamiris__alerts__body-items-item-message {
          color:  $--color-black;
          font-size: 12px;
          margin: 8px 20px 0px 20px;
          text-align: center;
          font-weight: 600;
          word-break: break-word;
        }

        .thamiris__alerts__body-items-item-message-line-through {
          font-size: 12px;
          margin: 8px 20px 0px 20px;
          text-align: center;
          font-weight: 600;
          text-decoration: line-through;
          color: $--color-gray;
          word-break: break-word;
        }
      }

    }
  }

  .thamiris__alerts__confirm {
    display: flex;
    align-items: center;
    justify-content: center;

    .thamiris__alerts__confirm-button {
      padding: 6px 30px;
      color: $--color-gray;
    }
  }
}

@media (min-width: 1200px) {
  .thamiris__alerts__shadow {
    margin-bottom: 30px;
  }
}

</style>
