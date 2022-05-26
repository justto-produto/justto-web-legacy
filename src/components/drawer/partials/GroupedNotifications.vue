<template>
  <el-collapse
    v-if="notifications.length > 1"
    class="justtine-mentions-collapse"
  >
    <el-collapse-item>
      <template slot="title">
        <jus-avatar-user
          v-if="!notifications[0].fromAccountId"
          name="Justtine"
          :src="justtineUrl"
          :purple="false"
          shape="circle"
          size="sm"
        />

        <jus-avatar-user
          v-else
          :name="getMemberName(notifications[0].fromAccountId)"
          :purple="false"
          shape="circle"
          size="sm"
        />
        <span>{{ getMemberName(notifications[0].fromAccountId) | resumedName }} mencionou você.</span>
        <el-badge
          :value="notifications.length"
          type="primary"
        />
      </template>

      <div
        v-for="(notification, notificationIndex) in notifications"
        :key="`${notificationIndex}-${notification.type}`"
      >
        <SimpleNotification
          :notification="notification"
          @openMention="$emit('openMention', $event)"
          @setReaded="$emit('setReaded', $event)"
        />
      </div>
    </el-collapse-item>
  </el-collapse>

  <SimpleNotification
    v-else
    :notification="notifications[0]"
    @openMention="$emit('openMention', $event)"
    @setReaded="$emit('setReaded', $event)"
  />
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    SimpleNotification: () => import('./SimpleNotification')
  },

  props: {
    notifications: {
      type: Array,
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
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.justtine-mentions-collapse {
  .el-collapse-item {
    div[role="tab"] {
      .el-collapse-item__header {
        color: $--color-text-primary;
        font-weight: bold;
        border: none;
        border-radius: 4px;
        line-height: 24px;
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 0;
        padding: 4px 8px;

        .jus-avatar-user {
          width: 24px;
          height: 24px;

          img {
            width: 24px;
            height: 24px;
          }
        }

        span {
          line-height: 24px;
        }

        &:hover {
          background-color: $--color-light-gray;
        }
      }
    }

    div[role="tabpanel"] {
      border: none;
      margin-left: 16px;

      .el-collapse-item__content {
        .notification__drawer__list-item {
          .notification__drawer__list-item-name {
            article {
              .justtine-notification {
                span {
                  height: 24px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
