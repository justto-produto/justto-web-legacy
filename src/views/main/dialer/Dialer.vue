<template>
  <article
    v-if="canAccessDialer"
    class="dialer"
  >
    <el-tooltip
      content="Top Left prompts info"
      placement="bottom-start"
      :open-delay="250"
    >
      <p
        v-if="enabledScheduledCalls"
        slot="content"
      >
        Estamos ligando automaticamente para você.
        <br>
        <br>
        Clique aqui para pausar a discagem automática!
      </p>

      <p
        v-else
        slot="content"
      >
        Não estamos ligando automaticamente pra você.
        <br>
        <br>
        Clique aqui para iniciar a discagem automática para disputas!
      </p>

      <div
        class="dialer__button"
        @click="clickInIcon"
      >
        <el-popover
          v-model="showPopover"
          trigger="manual"
          placement="left"
          popper-class="dialer-popover"
        >
          <div>
            <CallQueue
              ref="callsQueue"
              :loading="loading"
            />
          </div>

          <span
            slot="reference"
            class="reference"
          >
            <JusIcon
              :icon="dialerIcon"
              @hover="toggleShowPopover(true)"
            />

            <el-badge
              :hidden="!isPhoneActive"
              is-dot
              :class="{'el-icon-pulse': isPhoneActive}"
            />
          </span>
        </el-popover>
      </div>
    </el-tooltip>

    <div
      v-if="isActiveToCall"
      class="dialer__container"
    >
      <audio
        id="remoteAudio"
        class="dialer__container-audio"
        controls
        autoplay="autoplay"
      />

      <audio
        v-if="isActiveToCall"
        id="speakerAudio"
        :src="activeRingtone"
        class="dialer__container-audio"
        controls
        loop
        autoplay="autoplay"
      />
    </div>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { CALL_STATUS } from '@/constants/callStatus'
import { uuidv4 } from '@/utils'

import DialerUserModel from '@/store/modules/dialer/model/DialerUserModel'

export default {
  components: {
    CallQueue: () => import('./CallQueue.vue')
  },

  data() {
    const user = new DialerUserModel()

    return {
      loading: false,
      visible: false,
      showPopover: false,
      bodyVisible: true,
      top: 100,
      left: 450,
      number: '',
      configs: null,
      session: null,
      ua: null,
      sipStack: null,
      registerSession: null,
      user
    }
  },

  computed: {
    ...mapGetters({
      listCallQueue: 'getCallQueue',
      workspaceId: 'workspaceId',
      appInstance: 'getAppInstance',
      preferences: 'userPreferences',
      currentCall: 'getCurrentCallId',
      enabledScheduledCalls: 'canMakeScheduledCalls',
      isActiveToCall: 'isActiveToCall',
      canAccessDialer: 'canAccessDialer',
      currentActiveCall: 'getCurrentCall',
      workspaceTeamName: 'workspaceTeamName',
      scheduledCallsQueue: 'getScheduledCallsQueue',
      isPendingToAnswerCurrentCall: 'isPendingToAnswerCurrentCall'
    }),

    activeRingtone() {
      if ([CALL_STATUS.RECEIVING_CALL].includes(this.currentActiveCall)) {
        return 'https://storage.googleapis.com/justto_app/audio/justto_auto_answer_ring.wav'
      } else {
        return ''
      }
    },

    dialerIcon() {
      const activeAutoCall = this.preferences?.properties?.AVAILABLE_SCHEDULED_CALLS === 'AVAILABLE' && !this.listCallQueue.length

      if (activeAutoCall) {
        return 'phone-auto'
      } else if (!this.listCallQueue.length && !this.scheduledCallsQueue.length) {
        return 'phone-off'
      } else {
        return 'phone-active'
      }
      // return !this.isActiveToCall ? 'phone-off' : [CALL_STATUS.ACTIVE_CALL].includes(this.currentActiveCall?.status) ? 'phone-active' : 'tts'
    },

    isPhoneActive() {
      return this.dialerIcon === 'phone-active'
    },

    hasAcceptTerms() {
      return !!this.preferences.properties.ACCEPT_DIALER_TERMS
    },

    hasNotAcceptTerms() {
      return !!this.preferences.properties.REJECT_DIALER_TERMS
    }
  },

  watch: {
    visible(current) {
      if (current) {
        this.init()
      } else {
        this.activeAppToCall(true)
      }
    },

    isActiveToCall(is) {
      if (is) {
        this.showPopover = true
      }
    },

    listCallQueue: {
      deep: true,
      handler: 'handleQueueChange'
    }
  },

  created() {
    this.setAppInstance(uuidv4())
    window.removeEventListener('click', this.clickTracker, false)
    window.addEventListener('click', this.clickTracker, false)
  },

  methods: {
    ...mapActions([
      'addCall',
      'dialerLogin',
      'createNewCall',
      'activeAppToCall',
      'setAppInstance',
      'loadVoiceServer',
      'loadVoiceServer',
      'clearCurrentCall',
      'deleteCurrentCall',
      'startServerStatus',
      'startServerStatus',
      'changeServerStatus',
      'setAccountProperty',
      'loadAccountProperty',
      'refreshServiceStatus',
      'startDialerRequester',
      'availableServerStatus',
      'availableServerStatus'
    ]),

    clickTracker(event) {
      const dialerButton = document.querySelector('.dialer__button')
      const clickIn = event.path.includes(dialerButton) || event.path.filter(item => Array(...(item?.classList || [])).includes('dialer__button')).length > 0

      if (!clickIn && this.showPopover) {
        this.toggleShowPopover(false)
      }
    },

    open(number) {
      this.number = number
      this.visible = true
      this.showPopover = true
    },

    handleQueueChange(current, old) {
      const isBigger = current.length > old.length
      const isWaiting = current.length > 0 && ![CALL_STATUS.COMPLETED_CALL].includes(current[0]?.status)

      if (isBigger || isWaiting) this.open(current[0]?.number)
    },

    init() {
      this.activeAppToCall(true)
    },

    toggleShowPopover(value) {
      if (this.showPopover !== value) this.showPopover = value

      this.$emit('toggle', this.showPopover)
    },

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
@import '@/styles/colors.scss';

.dialer {
  .dialer__button {
    text-align: center;
    cursor: pointer;
    margin: 0 8px 2px;

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
  }

  .dialer__container {

    background-color: white;
    // border: solid $--color-primary 1px;
    border-radius: 10px;

    display: flex;
    flex-direction: column;

    .dialer__container-title {
      width: 100%;
      padding: 8px;

      // border-bottom: solid $--color-primary 2px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .dialer__container-title-actions {
        display: flex;
        align-items: center;

        gap: 8px;

        i {
          cursor: pointer;

          &.el-icon-rank {
            cursor: move;
          }
        }

      }

      &.without-border {
        border: none;
      }
    }

    .dialer__container-audio {
      display: none;
    }

    .dialer__container-body {
      margin: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .el-input {
        .el-input-group__prepend {
          padding: 0 8px;
        }

        .el-input__inner {
          text-align: right;
        }
      }

      .dialer__container-body-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .dialer__container-body-buttons-line {
          display: flex;
          justify-content: space-around;

          .el-button {
            min-width: 48px;
          }
        }
      }
    }

    .dialer__container-footer {
      .dialer__container-footer-alert {
        font-size: 12px;
        text-align: center;

        sup {
          color: $--color-danger;
        }
      }
    }
  }
}
</style>
