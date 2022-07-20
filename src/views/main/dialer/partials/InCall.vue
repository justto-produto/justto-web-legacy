<template>
  <article
    v-if="call.id"
    class="dialer__in-call"
  >
    <el-tooltip
      class="cursor-pointer"
      :content="infosIsVisible ? 'Menos informações' : 'Mais informações'"
      :open-delay="500"
      placement="bottom-start"
    >
      <i
        :class="{
          'el-icon-arrow-left': !infosIsVisible,
          'el-icon-arrow-right': infosIsVisible,
        }"
        @click="$emit('toggle', $event)"
      />
    </el-tooltip>

    <i class="el-icon-mic el-icon-pulse" />

    <el-tag size="small">
      {{ $tc(`call.status.${call.status}`) }}
    </el-tag>

    <el-tooltip
      content="Encerrar chamada"
      :open-delay="500"
    >
      <el-button
        type="danger"
        icon="el-icon-phone"
        size="mini"
        circle
        plain
        @click="hangUp()"
      />
    </el-tooltip>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    infosIsVisible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      call: 'getCurrentCall',
      dialer: 'getDialer'
    })
  },

  methods: {
    ...mapActions({
      endCall: 'endCall'
    }),

    hangUp() {
      if (this.infosIsVisible) {
        this.$emit('toggle', {})
      }

      this.endCall({
        dialerId: this.dialer.id,
        callId: this.call.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialer__in-call {
  display: flex;
  align-items: center;
  margin-right: 8px;
  gap: 4px;

  cursor: auto;

  .cursor-pointer {
    cursor: pointer;
  }
}
</style>
