<template lang="html">
  <div class="jus-tags">
    <el-tag
      v-for="tag in disputeTags"
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
        <el-select
          v-model="selectedTag"
          filterable
          placeholder=""
          class="jus-tags__select"
          @change="addTag">
          <el-option
            v-for="tag in workspaceTags"
            :key="tag.id"
            :label="tag.label"
            :value="tag">
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
      selectedTag: null
    }
  },
  computed: {
    disputeTags: {
      get () {
        return this.$store.getters.disputeTags
      },
      set (tags) {
        this.$store.dispatch('editDisputeTags', {
          disputeId: 1,
          data: tags
        })
      }
    },
    workspaceTags () {
      return this.$store.getters.workspaceTags.filter(t => {
        return !this.disputeTags.map(t => t.id).includes(t.id)
      })
    }
  },
  methods: {
    addTag (tag) {
      let disputeTags = JSON.parse(JSON.stringify(this.disputeTags))
      disputeTags.push(tag)
      this.disputeTags = disputeTags
    },
    removeTag (tagId) {
      this.disputeTags = this.disputeTags.filter(t => t.id !== tagId)
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
  &__select {
    width: 100%;
  }
}
</style>
