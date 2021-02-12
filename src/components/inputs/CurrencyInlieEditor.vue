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
      @blur.native="disableEdit"
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
    model: 0,
    feedback: ''
  }),
  computed: {
    vModel: {
      get() {
        return this.model || this.value
      },
      set(value) {
        this.model = value
      }
    }
  },
  watch: {
    'value'(newValue) {
      this.model = newValue
    }
  },
  methods: {
    enableEdit() {
      this.isEditing = true
      this.$nextTick(() => document.getElementById('currencyInput').focus())
    },
    disableEdit() {
      this.isEditing = false
      if (this.model !== this.value) this.$emit('change', this.vModel)
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
      background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 55%, rgba(255, 255, 255, 0) );
      position: absolute;
      opacity: 0;
      right: 0;
      padding-left: 6px;

      .currency-inline-editor__icon {
        transition: .2s ease-out all;
        cursor: pointer;
        margin-left: 3px;
        &:hover { color: $--color-primary; }
      }
    }
  }

  .currency-inline-editor__input {
    border: none;
    padding: 0;
    width: 100%;
    font-size: inherit;
    &--align-right { text-align: right; }
  }

  .request-succes {
    color: $--color-primary;
  }

  .request-fail {
    color: $--color-danger;
  }
}
</style>
