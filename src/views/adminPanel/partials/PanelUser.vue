<template lang="html">
  <div class="panel-user-view">
    <img
      src="./icon.png"
      alt="Em Desenvolvimento"
    >
  </div>
</template>

<script>
export default {
  name: 'PanelUser',
  data() {
    return {
      search: '',
      users: [{
        name: 'Usuario 1',
        status: 'Ativo'
      }, {
        name: 'Usiiario 2',
        status: 'Inativo'
      }]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(data => {
        return !this.search || data.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style lang="scss">
.panel-user-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
