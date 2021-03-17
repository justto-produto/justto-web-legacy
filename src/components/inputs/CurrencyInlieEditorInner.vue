<template>
  <div class="currency-inline-editor">
    <span
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
          class="currency-inline-editor__icon el-icon-edit hidden-icon"
          @click="enableEdit"
        />
      </span>
    </span>

    <money
      v-else
      id="currencyInput"
      ref="currencyInput"
      v-model="vModel"
      :class="{ 'currency-inline-editor__input--align-right': iconSide === 'left' }"
      class="currency-inline-editor__input"
      maxlength="16"
      @blur.native="confirmEdit"
      @keyup.native.enter="confirmEdit"
      @keyup.native.esc="cancelEdit"
    />
  </div>
</template>

<script>
export default {
  name: 'CurrencyInlieEditor',
  props: {
    value: {
      type: Number,
      default: 0
    },
    iconSide: {
      type: String,
      default: 'right'
    }
  },
  data: () => ({
    isEditing: false,
    model: 0
  }),
  computed: {
    vModel: {
      get() {
        return this.isEditing ? this.model : this.value
      },
      set(value) {
        this.model = value
      }
    }
  },
  methods: {
    enableEdit() {
      this.model = this.value || 0
      this.isEditing = true
      this.$nextTick(() => document.getElementById('currencyInput').focus())
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
@import '@/styles/colors.scss';

.currency-inline-editor {
  display: inline-block;

  .currency-inline-editor__value {
    position: relative;
    display: inline-block;
    border-bottom: 2px solid transparent;

    &:hover {
      .currency-inline-editor__inner { opacity: .25; }
      .currency-inline-editor__icons { opacity: 1; }
    }

    & > * { transition: .2s ease-out all; }

    .currency-inline-editor__inner {
      cursor: default;
      user-select: none;
    }

    .currency-inline-editor__icons {
      background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0) );
      position: absolute;
      opacity: 0;
      right: 0;
      padding-left: 10px;

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
    &--align-right { text-align: right; }
  }

  // .request-succes {
  //   color: $--color-primary;
  // }

  // .request-fail {
  //   color: $--color-danger;
  // }
}
</style>
