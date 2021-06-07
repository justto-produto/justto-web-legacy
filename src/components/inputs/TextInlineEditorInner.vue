<template>
  <div class="text-inline-editor">
    <div
      v-if="!isEditing"
      class="text-inline-editor__value show-right-icon"
    >
      <span
        class="text-inline-editor__inner"
        @click="$emit('click')"
      >
        {{ filteredVModel }}
        <i
          v-if="isCopyble"
          class="hidden-icon el-icon-copy-document"
          @click="copyValue"
        />
        <i
          v-if="isEditable"
          class="hidden-icon el-icon-edit"
          @click="enableEdit"
        />
        <i
          v-if="isDeletable"
          class="hidden-icon el-icon-delete"
          @click="deletElement"
        />
      </span>
    </div>

    <el-input
      v-else
      ref="textInput"
      v-model="vModel"
      v-mask="{ mask: mask(vModel), tokens }"
      class="text-inline-editor__input"
      @blur="handleBlur"
    />
  </div>
</template>

<script>
import HandleKeys from './handleKeys'

export default {
  name: 'TextInlieEditor',

  mixins: [HandleKeys],

  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    filter: {
      type: String,
      default: ''
    },
    mask: {
      type: [Function, String],
      default: () => 'X'.repeat(255)
    },
    isCopyble: {
      type: Boolean,
      default: true
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    isDeletable: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    isEditingActive: false,
    model: '',
    escaping: false
  }),

  computed: {
    vModel: {
      get() {
        return this.isEditing ? this.model : this.value
      },
      set(value) {
        this.model = value
      }
    },
    isEditing: {
      get() {
        return this.isEditingActive
      },
      set(value) {
        this.isEditingActive = value
        if (!value) this.$emit('blur')
      }
    },
    tokens() {
      return {
        '#': { pattern: /\d/ },
        D: { pattern: /[ABDENPabdenp]/, transform: v => v.toUpperCase() },
        d: { pattern: /[0-9ABDENPabdenp]/, transform: v => v.toUpperCase() },
        Z: { pattern: /[0-9a-zA-Z]/, transform: v => v.toUpperCase() },
        z: { pattern: /[0-9a-zA-Z]/, transform: v => v.toLowerCase() },
        X: { pattern: /./ },
        A: { pattern: /[a-zA-Z]/, transform: v => v.toUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: v => v.toLowerCase() },
        '!': { escape: true }
      }
    },
    filteredVModel() {
      const { filter, vModel } = this

      return filter
        ? this.$options.filters[filter](vModel)
        : vModel
    }
  },

  watch: {
    isEditing(value) {
      if (value) {
        document.addEventListener('keyup', this.handleKeys)
      } else {
        document.removeEventListener('keyup', this.handleKeys)
      }
    }
  },

  mounted() {
    this.$emit('enableEdit')
  },

  methods: {
    handleEnter(event) {
      this.escaping = false
      event.target.blur()
    },

    handleEsc(event) {
      this.escaping = true
      this.handleBlur(event)
    },
    handleBlur(event) {
      if (event && !event.currentTarget.contains(event.relatedTarget)) {
        if (this.escaping) {
          this.cancelEdit()
        } else {
          this.confirmEdit()
        }
      }
    },
    enableEdit() {
      this.model = this.value || ''
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.textInput.focus()
        this.$forceUpdate()
      })
    },
    disableEdit() {
      this.isEditing = false
    },
    confirmEdit() {
      if (this.model !== this.value) {
        this.$emit('change', this.vModel)
      }
      this.disableEdit()
    },
    cancelEdit() {
      this.model = this.value || ''
      this.disableEdit()
    },
    copyValue() {
      navigator.clipboard.writeText(this.vModel)

      this.$message({
        message: 'Texto copiado para a área de transferência.',
        type: 'info',
        center: true,
        showClose: true
      })
    },
    deletElement() {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.text-inline-editor {
  .text-inline-editor__value {
    position: relative;

    & > * { transition: .2s ease-out all; }

    .text-inline-editor__inner {
      cursor: default;
      .hidden-icon.el-icon-delete:hover { color: $--color-danger; }
    }
  }

  // .request-succes {
  //   color: $--color-primary;
  // }

  // .request-fail {
  //   color: $--color-danger;
  // }
}
</style>

<style lang="scss">
.text-inline-editor {
  .text-inline-editor__input {
    .el-input__inner {
      border: none;
      border-bottom: 2px solid #e4e7ed;
      background: transparent;
      line-height: normal;
      height: auto;
      padding: 0;
      font-size: inherit;
    }
  }
}
</style>
