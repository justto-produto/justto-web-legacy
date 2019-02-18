<template lang="html">
  <div class="case-view__side-content">
    <el-steps
      v-if="false"
      :active="occurencies.length - 1"
      direction="vertical"
      process-status="wait"
      class="case-view__steps el-steps--dots">
      <el-step v-for="occurrence in occurencies" :key="occurrence.id">
        <template slot="title">{{ $t('occurrence.type.' + occurrence.name) }}</template>
        <template slot="description">
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover">
            <ul>
              <li v-for="(occurrences, item) in occurrence.items" :key="occurrences + item">
                {{ item }}: {{ occurrences }}
              </li>
            </ul>
            <el-button slot="reference" type="text">Ver detalhes</el-button>
          </el-popover>
        </template>
      </el-step>
    </el-steps>
    <el-steps
      v-loading="true"
      v-else
      :active="4"
      direction="vertical"
      process-status="wait"
      class="case-view__steps el-steps--dots">
      <el-step v-for="occurrence in 4" :key="occurrence">
        <template slot="title">Ocorrência</template>
        <template slot="description">Ver detalhes</template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'CaseSummary',
  props: {
    id: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      response: ''
    }
  },
  beforeMount() {
    // this.$store.dispatch('getDisputes').then(response => {
    //   this.response = response.hits.hits[0]._source
    // })
  }
}
</script>

<style lang="scss">
</style>
