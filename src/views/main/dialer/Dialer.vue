<template>
  <article class="dialer">
    <el-button
      class="dialer__button"
      type="text"
      icon="el-icon-phone"
      round
      @click="visible = !visible"
    />

    <div
      v-if="visible"
      class="dialer__container"
      :style="{
        left: `${left}px`,
        top: `${top}px`
      }"
    >
      <div
        class="dialer__container-title"
        :class="{'without-border': !bodyVisible}"
      >
        <div class="dialer__container-title-text">
          Discador
        </div>

        <div class="dialer__container-title-actions">
          <i
            class="el-icon-rank"
            draggable="true"
            @drag="drag"
            @dragend="drag"
          />

          <i
            class="el-icon-minus"
            @click="bodyVisible = !bodyVisible"
          />

          <i
            class="el-icon-close"
            @click="visible = !visible"
          />
        </div>
      </div>

      <audio
        id="remoteAudio"
        class="dialer__container-audio"
        controls
        autoplay="autoplay"
      />

      <div
        v-if="bodyVisible"
        v-loading="loading"
        class="dialer__container-body"
      >
        <el-input
          v-model="number"
          size="small"
        />

        <div class="dialer__container-body-buttons">
          <!-- <div class="dialer__container-body-buttons-line">
            <el-button
              type="primary"
              size="small"
              round
              v-text="1"
            />

            <el-button
              type="primary"
              size="small"
              round
              v-text="2"
            />

            <el-button
              type="primary"
              size="small"
              round
              v-text="3"
            />
          </div> -->

          <!-- <div class="dialer__container-body-buttons-line">
            <el-button
              type="primary"
              size="small"
              round
              v-text="4"
            />

            <el-button
              type="primary"
              size="small"
              round
              v-text="5"
            />

            <el-button
              type="primary"
              size="small"
              round
              v-text="6"
            />
          </div> -->

          <!-- <div class="dialer__container-body-buttons-line">
            <el-button
              type="primary"
              size="small"
              round
              v-text="7"
            />

            <el-button
              type="primary"
              size="small"
              round
              v-text="8"
            />

            <el-button
              type="primary"
              size="small"
              round
              v-text="9"
            />
          </div> -->

          <div class="dialer__container-body-buttons-line">
            <el-button
              type="danger"
              size="small"
              round
              icon="el-icon-error"
              @click="clearCurrentCall"
            />

            <!-- <el-button
              type="primary"
              size="small"
              round
              v-text="0"
            /> -->

            <el-button
              type="success"
              size="small"
              round
              icon="el-icon-success"
              @click="call()"
            />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapActions } from 'vuex'

import SIPml from 'ecmascript-webrtc-sipml'
import DialerUserModel from '@/store/modules/dialer/model/DialerUserModel'

export default {
  data() {
    const user = new DialerUserModel()
    return {
      loading: false,
      visible: false,
      bodyVisible: true,
      top: 100,
      left: 600,
      number: '88996877608',
      configs: null,
      session: null,
      ua: null,
      sipStack: null,
      registerSession: null,
      user
    }
  },

  watch: {
    visible(current) {
      if (current) {
        this.init()
      }
    }
  },

  methods: {
    ...mapActions([
      'dialerLogin',
      'loadVoiceServer',
      'startServerStatus',
      'availableServerStatus',
      'refreshServiceStatus',
      'createNewCall',
      'clearCurrentCall',
      'deleteCurrentCall',
      'loadVoiceServer',
      'changeServerStatus',
      'startServerStatus',
      'availableServerStatus'
    ]),

    doLogin() {
      return this.dialerLogin(this.user)
    },

    async startConection() {
      this.loading = true

      this.configs = await this.loadVoiceServer()
      await this.startServerStatus()
      await this.availableServerStatus()

      this.loading = false

      // update debug level to be sure new values will be used if the user haven't updated the page
      SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') === 'Justto') ? 'error' : 'info')

      const self = this

      return SIPml.init(_ => {
        self.sipStack = new SIPml.Stack({
          realm: self.configs.rtcSignalingServer,
          impi: self.configs.rtcUAUsername,
          impu: self.configs.rtcURIAddr,
          password: self.configs.rtcUAPassword,
          display_name: 'Justto',
          websocket_proxy_url: self.configs.rtcWsServer,
          events_listener: {
            events: '*',
            listener: self.eventHub
          }
        })

        self.sipStack.start()
      })
    },

    drag(event) {
      const { x, y } = event

      this.top = (y - 15) > 0 ? (y - 15) : this.top
      this.left = (x - 140) > 0 ? (x - 140) : this.left
    },

    init() {
      this.loading = true

      Promise.all([
        this.doLogin()
      ]).then(this.startConection).finally(() => {
        this.loading = false
      })
    },

    login() {
      this.registerSession = this.sipStack.newSession('register', {
        events_listener: {
          events: '*',
          listener: this.eventHub
        }
      })

      this.registerSession.register()
    },

    acceptCall(e) {
      e.newSession.accept({
        audio_remote: document.getElementById('remoteAudio'),
        events_listener: {
          events: '*',
          listener: this.eventHub
        }
      })
    },

    makeCall(e) {
      console.log('makeCall')
      let callSession

      if (e.session === this.registerSession) {
        e.session.audioLocal = document.getElementById('localAudio')

        callSession = this.sipStack.newSession('call-audio', {
          audio_remote: document.getElementById('remoteAudio'),
          events_listener: { events: '*', listener: this.eventHub }
        })

        callSession.call('Justto')
      } else {
        console.log('Sessão errada')
      }
    },

    async call() {
      try {
        const callInfo = await this.createNewCall(`+55${this.destinationNumber}`)
        console.log(callInfo)
      } catch (error) {
        this.deleteCurrentCall()
      }
    },

    eventHub(e) {
      switch (e.type) {
        case 'started':
          this.login()
          break
        case 'i_new_call':
          this.acceptCall(e)
          break
        case 'connected':
          // this.makeCall(e)
          break
        case 'terminated':
          this.clearCurrentCall()
          break
        default:
          console.log(e)
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.dialer {
  .dialer__container {
    position: absolute;
    z-index: 100 !important;

    width: 200px;

    background-color: white;
    border: solid $--color-primary 2px;
    border-radius: 10px;

    display: flex;
    flex-direction: column;

    .dialer__container-title {
      width: 100%;
      padding: 8px;

      border-bottom: solid $--color-primary 2px;

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

      .dialer__container-body-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .dialer__container-body-buttons-line {
          display: flex;
          justify-content: space-between;

          .el-button {
            min-width: 48px;
          }
        }
      }
    }
  }
}
</style>
