<template>
  <article class="overview-resume__container">
    <el-collapse class="overview-resume__container-row">
      <el-collapse-item class="overview-resume__container-row-item info hide-arrows">
        <template slot="title">
          <img
            class="overview-resume__container-row-item-image"
            src="@/assets/logo-small.svg"
          >
          <div class="overview-resume__container-row-item-info">
            <div class="overview-resume__container-row-item-info-primary">
              Processo: {{ processNumber }}
            </div>
            <div class="overview-resume__container-row-item-info-secondary">
              <b>ID da disputa:</b>
              {{ disputeId }}
            </div>
          </div>
        </template>
      </el-collapse-item>
      <PartyResumed
        v-for="(item, itemIndex) in partiesToShow"
        :key="`partie-${itemIndex}`"
        :party="item"
        class="overview-resume__container-row-item"
        hide-arrows
      />
    </el-collapse>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    PartyResumed: () => import('./tabs/parties/PartyResumed')
  },

  computed: {
    ...mapGetters({
      ticket: 'getTicketOverview',
      ticketParties: 'getTicketOverviewParties'
    }),

    disputeId() {
      return '#' + this.$route.params.id
    },

    processNumber() {
      return this.ticket?.code || ''
    },

    partiesToShow() {
      return this.ticketParties.filter(({ polarity, roles }) => {
        return roles.includes('NEGOTIATOR') || (polarity === 'CLAIMANT' && (roles.includes('PARTY') || roles.includes('LAWYER')))
      })
    }

  }
}
</script>

<style lang="scss">
.hide-arrows {
  .el-collapse-item__header {
    i.el-collapse-item__arrow {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors';

.overview-resume__container {
  margin: 8px 16px;

  .overview-resume__container-row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    .overview-resume__container-row-item {
      &.info {
        div[role="tab"] {
          .el-collapse-item__header {
            display: flex;
            flex-direction: row;
            align-items: center;

            .overview-resume__container-row-item-image {
              margin-right: 10px;
            }

            .overview-resume__container-row-item-info {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-evenly;

              .overview-resume__container-row-item-info-primary {
                color: $--color-text-primary;
                font-size: 16px;
                line-height: normal;
              }

              .overview-resume__container-row-item-info-secondary {
                color: $--color-text-secondary;
                font-size: 12px;
                line-height: normal;
              }
            }
          }
        }
      }
    }
  }
}
</style>
