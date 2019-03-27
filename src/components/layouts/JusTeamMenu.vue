<template lang="html">
  <div class="jus-team-menu">
    <div class="jus-team-menu__members">
      <a
        v-for="member in members"
        :key="member.id"
        :class="activePersonId === member.person.id ? 'active' : ''"
        class="jus-team-menu__member"
        @click.prevent="setActivePersonId(member.person.id)">
        <el-tooltip :content="member.person.name" placement="right">
          <jus-avatar-user
            :name="member.person.name"
            size="sm"
            shape="circle"
            class="el-menu__avatar" />
        </el-tooltip>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusTeamMenu',
  computed: {
    members () {
      return this.$store.state.workspaceModule.members
    },
    activePersonId () {
      return this.$store.state.activePersonId
    }
  },
  methods: {
    setActivePersonId (id) {
      if (id === this.activePersonId) {
        this.$store.commit('setActivePersonId', 0)
      } else this.$store.commit('setActivePersonId', id)
    }
  }
}
</script>

<style lang="scss">
.jus-team-menu {
  text-align: center;
  &__title {
    text-align: center;
    margin: 80px 0 20px;
  }
  &__members {
    display: flex;
    flex-direction: column;
  }
  &__member {
    padding: 11px 0px;
    &.active {
      span {
        border: 2px solid #7c4cf3;
      }
    }
  }
}
</style>
