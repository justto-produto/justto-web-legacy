<template>
  <article class="api-integration__container">
    <el-row class="api-integration__fields">
      <el-col
        v-for="field in fields"
        :key="field.key"
        :span="24"
        class="api-integration__field"
      >
        {{ field }}
      </el-col>
    </el-row>

    <InitialIntegrationForm @submit="handleInitIntegration" />
  </article>
</template>

<script>
export default {
  name: 'ApiIntegrationForm',

  components: {
    InitialIntegrationForm: () => import('./partials/InitialIntegrationForm')
  },

  data: () => ({
    fields: []
  }),

  methods: {
    handleInitIntegration(url) {
      // const integrationType = (url.toLowerCase()).includes()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
