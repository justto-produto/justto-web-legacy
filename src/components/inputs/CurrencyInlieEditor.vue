<template>
  <div class="currency-inline-editor">
    <div
      v-if="!isEditing"
      class="currency-inline-editor__value"
    >
      <span class="currency-inline-editor__inner">
        {{ vModel | currency }}
      </span>
      <span class="currency-inline-editor__icons">
        <i
          class="currency-inline-editor__icon el-icon-copy-document"
          @click="copyValue"
        />
        <i
          v-if="isEditable"
          class="currency-inline-editor__icon el-icon-edit hidden-icon"
          @click="enableEdit"
        />
      </span>
    </div>

    <money
      v-else
      id="currencyInput"
      ref="currencyInput"
      v-model="vModel"
      class="currency-inline-editor__input"
      maxlength="16"
      @blur.native="confirmEdit"
    />
  </div>
</template>

<script>
import HandleKeys from './handleKeys'

export default {
  name: 'CurrencyInlieEditor',

  mixins: [HandleKeys],

  props: {
    value: {
      type: Number,
      default: 0
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    isEditingActive: false,
    model: 0,
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
      this.confirmEdit(event)
    },

    enableEdit() {
      this.model = this.value || 0
      this.isEditing = true
      this.$nextTick(() => document.getElementById('currencyInput').focus())
    },

    disableEdit() {
      this.isEditing = false
    },

    confirmEdit(event) {
      if (event && !event.currentTarget.contains(event.relatedTarget)) {
        if (this.escaping) {
          this.cancelEdit()
        } else {
          if (this.model !== this.value) {
            this.$emit('change', this.model)
          }
          this.disableEdit()
        }
      }
    },
    cancelEdit() {
      this.model = this.value || 0
      this.disableEdit()
    },
    copyValue() {
      const formattedValue = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(this.vModel)
      navigator.clipboard.writeText(formattedValue)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.currency-inline-editor {
  .currency-inline-editor__value {
    position: relative;
    border-bottom: 2px solid transparent;

    &:hover {
      .currency-inline-editor__inner { opacity: .85; }
      .currency-inline-editor__icons { opacity: 1; }
    }

    & > * { transition: .2s ease-out all; }

    .currency-inline-editor__inner {
      cursor: default;
    }

    .currency-inline-editor__icons {
      background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0) );
      position: absolute;
      opacity: 0;
      right: 0;
      top: 0;
      padding-left: 30px;

      .currency-inline-editor__icon {
        cursor: pointer;
        margin-left: 3px;
        transition: .2s ease-out all;
        &:hover { color: $--color-primary; }
      }
    }
  }

  .currency-inline-editor__input {
    border: none;
    padding: 0;
    width: 100%;
    font-size: inherit;
    border-bottom: 2px solid #e4e7ed;
  }
  // .request-succes {
  //   color: $--color-primary;
  // }

  // .request-fail {
  //   color: $--color-danger;
  // }
}
</style>
