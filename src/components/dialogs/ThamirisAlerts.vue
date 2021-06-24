<template>
  <el-dialog
    ref="thamiresalerts"
    :close-on-click-modal="false"
    :visible.sync="isVisible"
    :before-close="closeDialog"
    :show-close="false"
    destroy-on-close
    append-to-body
    width="40%"
  >
    <div class="thamiris__alerts">
      <div class="thamiris__alerts__header">
        <img :src="coffee">
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
        <span class="thamiris__alerts__body-title">
          Hoje você tem:
        </span>
        <div class="thamiris__alerts__body-items">
          <div
            v-for="notification in notifications"
            :key="`${notification.quantity}-${notification.type}`"
            class="thamiris__alerts__body-items-item"
          >
            <div class="thamiris__alerts__body-items-item-circle">
              <div class="thamiris__alerts__body-items-item-circle-style">
                <div
                  class="thamiris__alerts__body-items-item-circle-style-al"
                  @click="applyFilters(notification)"
                >
                  <span class="thamiris__alerts__body-items-item-circle-style-al-num">{{ notification.quantity }}</span>
                  <span class="thamiris__alerts__body-items-item-circle-style-al-disp">disputas</span>
                </div>
              </div>
            </div>
            <span class="thamiris__alerts__body-items-item-message">
              {{ notification.name }}
            </span>
          </div>
        </div>
      </div>
      <div class="thamiris__alerts__confirm">
        <el-button @click="closeDialog">
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

  data: () => ({
    // isVisbible: true
  }),

  computed: {
    ...mapGetters({
      notifications: 'notificationsNotEmptyDisputes'
    }),

    coffee() {
      return require('@/assets/img/coffee.png')
    }
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

    applyFilters({ filter: { prescriptions, status }, tab }) {
      const filters = {
        prescriptions
      }

      if (status) {
        filters.status = status.split(',')
      }

      this.setTicketsActiveTab(tab.toLowerCase())

      this.setTicketsFilters({
        filters,
        hasFilters: true
      })

      this.getTickets()

      if (this.$route.name !== 'negotitation') {
        this.$router.push('/negotiation')
      }

      this.closeDialog()
    },

    closeDialog() {
      this.hideThamirisAlerts()
    },

    openDialogEditor() {
      this.isVisbible = true
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
    background-color: #FF9300;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 30px;
    .thamiris__alerts__header-title {
      color: white;
      font-weight: bold;
      padding-left: 40px;
      padding-right: 40px;
    }
    .thamiris__alerts__header-subtitle {
      color: white;
      font-size: 12px;
      padding-left: 55px;
      padding-right: 55px;
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
        flex: 0 0 20%;
        margin-bottom: 10px;

        .thamiris__alerts__body-items-item-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          .thamiris__alerts__body-items-item-circle-style {
            height: 55px;
            width: 55px;
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
                font-size: 23px;
                font-weight: bold;
                padding-top: 4px;
              }
              .thamiris__alerts__body-items-item-circle-style-al-disp {
                font-size: 10px;
              }
            }
          }
          .thamiris__alerts__body-items-item-circle-style:hover {
            background-color: $--color-primary-light-2;
          }
        }

        .thamiris__alerts__body-items-item-message {
          color:  $--color-primary;
          font-size: 10px;
        }
      }

    }
  }

  .thamiris__alerts__confirm {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (min-width: 1200px) {
  .thamiris__alerts__shadow {
    margin-bottom: 30px;
  }
}

</style>
