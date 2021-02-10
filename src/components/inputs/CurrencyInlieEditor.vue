<template>
  <div class="currency-inline-editor">
    <span
      v-if="!isEditing"
      class="show-right-icon"
    >
      {{ vModel | currency }}
      <i
        class="el-icon-edit hidden-icon"
        @click="enebleEdit"
      />
      <!-- <i class="el-icon-check request-succes" /> -->
      <!-- <i class="el-icon-close request-fail" /> -->
    </span>
    <money
      v-else
      id="currencyInput"
      ref="currencyInput"
      v-model="vModel"
      class="currency-inline-editor__inner"
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
  methods: {
    enebleEdit() {
      this.isEditing = true
      this.$nextTick(() => document.getElementById('currencyInput').focus())
    },
    disableEdit() {
      this.isEditing = false
      this.updateValue()
    },
    updateValue() {
      // this.$emit('change', this.vModel)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.currency-inline-editor {
  display: flex;

  .currency-inline-editor__input {
    position: relative;

    .currency-inline-editor__icon {
      cursor: pointer;
      transition: .2s ease-out all;

    }
  }

  .currency-inline-editor__inner {
    border: none;
    padding: 0;
    width: calc(100% - 82px);
    font-size: inherit;
  }

  .request-succes {
    color: $--color-primary;
  }

  .request-fail {
    color: $--color-danger;
  }
}
</style>
