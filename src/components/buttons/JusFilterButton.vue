<template lang="html">
  <div
    :class="{'jus-filter-button--collapse': isCollapsed}"
    class="jus-filter-button"
    @keyup.esc="toggle()"
  >
    <el-input
      ref="filterInput"
      v-model="term"
      @blur="blur()"
    >
      <el-button
        slot="prepend"
        @click="toggle()"
      >
        <jus-icon icon="search" />
      </el-button>
      <i
        v-if="!isCollapsed"
        slot="suffix"
        class="el-input__icon el-icon-close"
        @click="toggle()"
      />
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'JusFilterButton',
  data() {
    return {
      isCollapsed: true,
      debounce: ''
    }
  },
  computed: {
    term: {
      get() {
        return this.$store.getters.disputeQueryTerm
      },
      set(term) {
        this.$store.commit('updateDisputeQuery', { key: 'term', value: term })
      }
    }
  },
  watch: {
    term(term) {
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.$jusSegment('Busca de disputas na tabela do gerenciamento', { description: `Termo utilizado: ${term}` })
        this.$emit('getDisputes')
      }, 800)
    },
    isCollapsed(isCollapsed) {
      if (isCollapsed) {
        this.term = ''
        this.$refs.filterInput.blur()
      } else {
        this.focus()
      }
    }
  },
  beforeMount() {
    if (this.term) this.isCollapsed = false
  },
  methods: {
    toggle() {
      this.isCollapsed = !this.isCollapsed
    },
    blur() {
      setTimeout(() => {
        if (!this.term) this.isCollapsed = true
      }, 250)
    },
    focus() {
      this.$refs.filterInput.focus()
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-filter-button {
  display: inline-block;
  .el-input {
  }
  .el-input__inner {
    transition: width 0.5s ease, padding 0.5s ease;
    width: 180px;
    border-left: 0;
    &:hover {
      border-left: 1px solid $--color-text-regular;
    }
    &:focus {
      border-left: 1px solid $--color-primary;
    }
  }
  .el-input-group__prepend {
    border-right: 1px solid #dcdfe6;
    background-color: $--color-white;
    &:hover {
      border-color: $--color-primary;;
    }
  }
  &--collapse {
    .el-input__inner {
      width: 0px;
      padding: 0px;
      border: 0;
    }
    .el-input-group__prepend {
      pointer-events: all;
    }
  }
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
