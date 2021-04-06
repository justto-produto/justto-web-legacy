<template>
  <section class="icons-view">
    <div class="icons-header">
      <h1>Icones JUSTTO</h1>
      <el-input
        v-model="searchTerm"
        placeholder="Busque um icone"
        prefix-icon="el-icon-search"
      />
    </div>
    <article class="icons-list">
      <div
        v-for="icon in filteredIconsList"
        :key="icon"
        :class="{'icons-list__list-item--dark': icon.includes('white')}"
        class="icons-list__list-item"
        @click="copyIconName(icon)"
      >
        <JusIcon
          :icon="icon"
          class="icons-list__icon"
        />
        <span class="icons-list__name">{{ icon }}</span>
      </div>
    </article>
  </section>
</template>

<script>
import iconsList from '@/constants/iconsList'

export default {
  name: 'Icons',
  data: () => ({
    searchTerm: ''
  }),
  computed: {
    replacedIconsList() {
      const replacedIconsList = iconsList.map(i =>
        i
          .replace('src/assets/icons/ic-', '')
          .replace('.svg', '')
      )

      return replacedIconsList
    },
    filteredIconsList() {
      return this.replacedIconsList.filter(i => i.includes(this.searchTerm))
    }
  },
  methods: {
    copyIconName(icon) {
      navigator.clipboard.writeText(icon)
      this.$jusNotification({
        type: 'success',
        title: 'Yay!',
        message: `<b>${icon}</b> copiado .`,
        dangerouslyUseHTMLString: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-view {
  padding: 12px 32px 32px;

  .icons-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    h1 { display: inline-block; }
    .el-input { width: calc(40% - 12px); }
  }

  .icons-list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    .icons-list__list-item {
      padding: 24px 12px;
      border: 1px solid rgb(220, 223, 230);
      border-radius: 4px;
      width: calc(20% - 20px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: .2s ease-in-out;
      cursor: pointer;

      &--dark {
        background-color: #979797;
        .icons-list__name { color: #fff !important; }
      }

      &:hover {
        border: 1px solid #9461f7;
      }

      .icons-list__icon {
        width: 40px;
      }

      .icons-list__name {
        margin-top: 24px;
        color: #979797;
      }
    }
  }
}
</style>
