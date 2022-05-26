<template>
  <article
    class="notification__drawer__list-item"
    :class="{'notification__drawer__list-item-pendent': !notification.readDate}"
  >
    <span
      class="notification__drawer__list-item-name"
      @click="$emit('openMention', notification)"
    >
      <div :class="{'justtine-notification': notification.fromAccountId === null}">
        <span v-if="notification.fromAccountId === null">
          <jus-avatar-user
            name="Justtine"
            :src="justtineUrl"
            :purple="false"
            shape="circle"
            size="sm"
          />
        </span>
        {{ getMemberName(notification.fromAccountId) | resumedName }}
        mencionou você.
      </div>
    </span>

    <span class="notification__drawer__list-item-date">
      {{ parseDate(notification.createdAt) }}
    </span>

    <el-tooltip
      :open-delay="500"
      content="Marcar como lida"
      placement="bottom-start"
    >
      <div
        v-if="!notification.readDate"
        class="notification__drawer__list-item-status el-icon-pulse"
        @click="$emit('setReaded', notification.id)"
      />
    </el-tooltip>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import { approximateTime } from '@/utils'

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      members: 'workspaceMembers'
    }),

    justtineUrl() {
      return require('@/assets/justtine/profile.png')
    },

    getMemberName() {
      return (fromAccountId) => {
        if (fromAccountId === null) return 'JUSTTINE'
        const member = this.members.find(({ accountId }) => Number(accountId) === Number(fromAccountId))

        return member?.person?.name || member?.accountEmail || ''
      }
    },

    parseDate() {
      return (date) => approximateTime(date)
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.notification__drawer__list-item {
  padding: 8px 2%;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 4px;

  .notification__drawer__list-item-name {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
    color: $--color-text-secondary;

    * {
      flex-wrap: nowrap;
    }

    .justtine-notification {
      display: flex;
      align-items: center;
      gap: 8px;

      span {
        .jus-avatar-user {
          img {
            width: 24px;
          }
        }
      }

    }
  }

  &.notification__drawer__list-item-pendent {
    .notification__drawer__list-item-name {
      color: $--color-black;

      div {
        font-weight: bold;
      }
    }
  }

  .notification__drawer__list-item-status {
    background-color: $--color-primary;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  &:hover {
    background-color: $--color-light-gray;
  }

  .notification__drawer__list-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    .el-icon-success {
      color: $--color-success;
    }
  }

  .notification__drawer__list-item-label-gray {
    font-size: 14px;
    color: $--color-gray;
  }

  .notification__drawer__list-item-label-black {
    color: $--color-black;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
