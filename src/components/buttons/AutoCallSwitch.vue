<template>
  <!-- Discagem automática -->
  <el-tooltip
    content="Top Left prompts info"
    placement="bottom-start"
    :open-delay="250"
  >
    <span
      v-if="enabledScheduledCalls"
      slot="content"
    >
      Estamos ligando automaticamente por você.
    </span>

    <span
      v-else
      slot="content"
    >
      Não estamos ligando automaticamente por você.
    </span>

    <div
      v-loading="loading"
      class="dialer__button"
      @click="clickInIcon"
    >
      <el-switch
        :value="enabledScheduledCalls"
        :width="30"
        active-color="#14CC30"
        inactive-color="#FF4B54"
        active-icon-class="el-icon-service"
      />
      <!-- active-icon-class="el-icon-service" -->
    </div>
  </el-tooltip>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    loading: false
  }),

  computed: {
    ...mapGetters({
      enabledScheduledCalls: 'canMakeScheduledCalls'
    })
  },

  methods: {
    ...mapActions([
      'setAccountProperty',
      'loadAccountProperty'
    ]),

    clickInIcon() {
      this.loading = true

      this.setAccountProperty({
        AVAILABLE_SCHEDULED_CALLS: { true: 'AVAILABLE', false: 'UNAVAILABLE' }[!this.enabledScheduledCalls]
      }).finally(() => {
        this.loadAccountProperty().finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .dialer__button {
    text-align: center;
    cursor: pointer;
    margin: 0 0 2px;

    span {
      .el-popover__reference-wrapper {
        display: flex;

        img {
          height: 20px;
          width: 20px;
        }

        .reference {
          display: flex;
        }
      }
    }

    .el-switch {
      position: relative;

      .el-switch__label {
        margin: 0;
        position: absolute;
        left: 3px;
        right: auto;

        &.is-active {
          right: 3px;
          left: auto;
        }
      }
    }
  }
</style>
