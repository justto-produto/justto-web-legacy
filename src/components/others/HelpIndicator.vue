<template>
  <article class="help-indicator__container">
    <el-popover
      v-if="visible"
      placement="top-end"
      trigger="hover"
      popper-class="help-indicator__popover"
    >
      <a
        href="https://enterprise.movidesk.com/Account/Login"
        target="_blank"
        rel="noopener noreferrer"
        class="help-indicator__popover-link"
      >
        Posso ajudar?
      </a>

      <img
        slot="reference"
        :src="justtinePath"
        alt="Suporte"
        class="help-indicator__img"
      >
    </el-popover>

    <i
      class="help-indicator__action"
      :class="visible ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"
      @click="() => { visible = !visible }"
    />
  </article>
</template>

<script>
const justtinePath = require('@/assets/justtine/profile.png')

export default {
  data: () => ({
    justtinePath,
    visible: true
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.help-indicator__container {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0 2rem 1rem 0;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  .help-indicator__img {
    height: 4.5rem;
    width: 4.5rem;
    border-radius: 100%;
    border: solid $--pj-color-blue 2px;
  }

  .help-indicator__action {
    color: $--pj-color-blue;
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.help-indicator__popover {
  background-color: $--pj-color-blue !important;

  .help-indicator__popover-link {
    display: block !important;
    width: 100% !important;
    color: white !important;
    text-align: center;
  }

  .popper__arrow::after {
    border-top-color: $--pj-color-blue !important;
  }
}
</style>
