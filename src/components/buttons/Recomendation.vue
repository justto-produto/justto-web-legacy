<template>
  <article class="recomendations-container">
    <el-popover
      placement="top-start"
      title="Titulo da recomendação aqui"
      width="200"
      trigger="hover"
    >
      <span slot="reference">
        <JusIcon icon="recomendation-lamp" />
      </span>

      <div>
        Recomendações aqui
      </div>
    </el-popover>
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    interactionId: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    recomendations: []
  }),

  mounted() {
    this.getRecomendations(this.interactionId).then(res => {
      console.log('mounted', this.interactionId)
      console.log(res)
    })
  },

  methods: {
    ...mapActions(['getRecomendations'])
  }
}
</script>

<style scoped>
.recomendations-container {
  cursor: pointer;
  margin: 8px 8px 0 -4px;
}
</style>
