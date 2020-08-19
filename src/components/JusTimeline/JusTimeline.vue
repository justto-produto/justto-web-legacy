<template>
  <section
    id="jus-timeline"
    class="el-container is-vertical">
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(date, indexDate) in Object.keys(disputeProgress)"
          :key="indexDate"
          placement="top"
          :timestamp="date">
          <el-card>
            {{ disputeProgress[date].title }}
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      disputeProgress: {
        '19/08/2020': { title: 'Titulo aqui...' },
        '18/08/2020': { title: 'Titulo aqui...' },
        '17/08/2020': { title: 'Titulo aqui...' },
      },
    }
  },
}
</script>

<style>

</style>
