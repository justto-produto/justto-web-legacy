<template lang="html">
  <div class="jus-team-menu">
    <div class="jus-team-menu__members">
      <a
        v-for="member in members"
        :key="member.id"
        :class="filterPersonId === member.person.id ? 'active' : ''"
        class="jus-team-menu__member"
        @click.prevent="setFilterPersonId(member.person.id)">
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
    filterPersonId () {
      return this.$store.getters.filterPersonId
    }
  },
  methods: {
    setFilterPersonId (id) {
      if (this.$route.name !== 'management') {
        this.$router.push('/management')
      }
      if (id === this.filterPersonId) {
        this.$store.commit('setFilterPersonId', 0)
      } else this.$store.commit('setFilterPersonId', id)
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
