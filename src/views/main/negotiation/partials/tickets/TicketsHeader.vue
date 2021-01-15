<template>
  <header class="tickets-header-container">
    <el-autocomplete
      v-model="searchTerm"
      :min="3"
      :trigger-on-focus="false"
      :fetch-suggestions="search"
      :debounce="800"
      size="small"
      class="tickets-header-container__input"
      prefix-icon="el-icon-search"
      popper-class=""
      placeholder="Busque suas disputas"
    >
      <template slot-scope="{ item }">
        <jus-dispute-resume
          v-if="item.id"
          :dispute="item"
        />
        <span v-else>
          Não foram encontradas disputas para esta busca. Tente buscar pelo número do processo.
        </span>
      </template>
    </el-autocomplete>
  </header>
</template>

<script>
export default {
  name: 'TicketsHeader',
  data: () => ({
    searchTerm: ''
  }),
  methods: {
    handleInput() {

    }
  }
}
</script>

<style lang="scss" scoped>
.tickets-header-container {
  padding: 18px;

  .tickets-header-container__input {
    width: 100%;
  }
}
</style>
