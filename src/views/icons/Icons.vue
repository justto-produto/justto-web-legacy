<template>
  <section class="icons-view">
    <div class="icons-header">
      <h1>Icones JUSTTO</h1>
      <span class="icons-header__inputs">
        <el-switch v-model="isSvg" />
        <el-input
          v-model="searchTerm"
          placeholder="Busque um icone"
          prefix-icon="el-icon-search"
        />
      </span>
    </div>
    <article class="icons-list">
      <div
        v-for="icon in filteredIconsList"
        :key="icon"
        :class="{'icons-list__list-item--dark': icon.includes('white')}"
        class="icons-list__list-item"
        @click="copyIconName('ic-' + icon)"
      >
        <JusIcon
          v-if="isSvg"
          :icon="icon"
          class="icons-list__icon-svg"
        />
        <i
          v-else
          :class="`ic-ic-${icon}`"
          class="icons-list__icon-font"
        />
        <span class="icons-list__name">{{ `ic-${icon}` }}</span>
      </div>
    </article>
  </section>
</template>

<script>
import iconsSvg from '@/constants/iconsList'
import iconsFont from '@/constants/icons'

export default {
  name: 'Icons',
  data: () => ({
    searchTerm: '',
    isSvg: true
  }),
  computed: {
    replacedIconsList() {
      if (this.isSvg) {
        const replacedIconsList = iconsSvg.map(i =>
          i
            .replace('src/assets/icons/ic-', '')
            .replace('.svg', '')
        )
        return replacedIconsList
      } else {
        return Object.keys(iconsFont).map(i =>
          i
            .replace('ic-', '')
            .replace('.svg', '')
        )
      }
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
@import '@/styles/colors.scss';

.icons-view {
  padding: 12px 32px 32px;

  .icons-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    h1 { display: inline-block; }
    .el-input { flex: 1 }

    .icons-header__inputs {
      display: flex;
      gap: 24px;
      align-items: center;
      width: calc(40% + 52px)
    }
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
        border: 1px solid $--color-primary;
      }

      .icons-list__icon-svg {
        width: 40px;
      }

      .icons-list__icon-font {
        font-size: 32px;
        line-height: 1;
      }

      .icons-list__name {
        margin-top: 24px;
        color: #979797;
      }
    }
  }
}
</style>
