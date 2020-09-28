<template>
  <div class="float-actions">
    <div
      v-for="action in actions"
      :key="action.name"
      class="float-actions__action-wrapper"
    >
      <el-tooltip
        v-if="action.condition(scope)"
        :content="action.label"
      >
        <el-button
          type="text"
          @click="emitAction(action.trigger)"
        >
          <jus-icon
            :icon="action.icon"
            class="float-actions__action-icon"
          />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusFloatActions',
  props: {
    actions: {
      type: Array,
      required: true
    },
    scope: {
      type: Object,
      required: true
    }
  },
  computed: {

  },
  methods: {
    emitAction(trigger) {
      this.$emit('floatAction', {
        eventName: 'JusFloatAction',
        eventProps: {
          trigger,
          customProps: this.scope
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.float-actions {
  background: linear-gradient(to right, transparent 0%, rgba(246,246,246,1) 24px);
  padding: 0 20px 0 28px;
  position: absolute;
  display: flex;
  height: 100%;
  right: 0;
  top: 0;

  .float-actions__action-wrapper {
    margin-left: 8px;
    display: flex;
    align-items: center;

    &:first-child {
      margin-left: 0;
    }
  }

  .float-actions__action-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
