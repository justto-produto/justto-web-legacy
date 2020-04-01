<template lang="html">
  <div class="jus-tags">
    <el-tag
      v-for="tag in $store.getters.disputeTags"
      :key="tag.id"
      :color="tag.color"
      effect="dark">
      {{ tag.name }}
      <el-button type="text" icon="el-icon-close" @click="removeTag(tag.id)" />
    </el-tag>
    <el-popover
      width="300"
      title="Adicionar etiqueta"
      trigger="click">
      <div>
        <el-select v-model="value" filterable placeholder="">
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.label"
            :value="tag.name">
            <el-tag
              :color="tag.color"
              effect="dark">
              {{ tag.name }}
            </el-tag>
          </el-option>
        </el-select>
      </div>
      <el-button slot="reference" plain size="small">
        <i class="el-icon-plus" /> Adicionar
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'JusTags',
  data () {
    return {
      value: '',
      term: ''
    }
  },
  computed: {
    tags: {
      get () {
        return this.$store.getters.workspaceTags
      },
      set (tags) {
        this.$store.dispatch('editDisputeTags', {
          disputeId: 1,
          data: tags
        })
      }
    }
  },
  methods: {
    removeTag (tagId) {
      this.tags = this.tags.filter(t => t.id !== tagId)
    }
  }
}
</script>

<style lang="scss">
.jus-tags {
  display: flex;
  flex-direction: column;
  > * {
    margin-top: 5px;
  }
  .el-select {
    width: 100%
  }
}
</style>
