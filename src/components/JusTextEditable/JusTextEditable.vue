<template>
  <div class="jus-text-editable">
    <el-input
      v-show="isEditing"
      ref="textInput"
      v-model="inputValue"
      placeholder="Please input"
      @keydown.native.enter="editionHandler"
      @change.native="onChangeHandler"
    >
      <el-button
        slot="append"
        icon="el-icon-check"
        type="primary"
        @click="editionHandler"
      />
    </el-input>
    <span
      v-if="!isEditing"
      :class="{
        [`jus-text-editable__mask--${type}`]: type
      }"
      class="jus-text-editable__mask"
      @click="editionHandler"
    >
      {{ inputValue }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'JusTextEditable',
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'title'].includes(val),
    },
  },
  data: (self) => ({
    inputValue: self.value,
    isEditing: false,
  }),
  methods: {
    editionHandler(evt) {
      this.isEditing = !this.isEditing
    },
    onChangeHandler() {
      this.$emit('hasEdition', this.inputValue)
    },
  },
}
</script>

<style lang="scss" scoped>
$text-types:
  'default' inherit 400 inherit,
  'title' 24px 700 uppercase;

.jus-text-editable__mask {
  cursor: pointer;
  display: block;
  min-height: 16px;
  width: 100%;

  @each $name, $size, $weight, $style in $text-types {
    &.jus-text-editable__mask--#{$name} {
      font-size: $size;
      font-weight: $weight;
      text-transform: $style;
    }
  }
}
</style>
