<template>
  <header>
    <el-autocomplete
      v-model="searchTerm"
      :min="3"
      :trigger-on-focus="false"
      :fetch-suggestions="search"
      :debounce="800"
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

<style lang="sass" scoped>

</style>
