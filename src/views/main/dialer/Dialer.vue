<template>
  <article class="dialer">
    <!-- <el-button
      class="dialer__button"
      type="text"
      icon="el-icon-phone"
      round
      @click="visible = !visible"
    /> -->

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
            @click="close"
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
          v-mask="['(##) 9 ####-####']"
          :disabled="!!currentCall"
          size="small"
        >
          <template slot="prepend">
            +55
          </template>
        </el-input>

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
              v-if="!!currentCall"
              type="danger"
              size="small"
              round
              icon="el-icon-error"
              @click="shutdownCall"
            />

            <!-- <el-button
              type="primary"
              size="small"
              round
              v-text="0"
            /> -->

            <el-button
              v-if="!currentCall"
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
import { mapActions, mapGetters } from 'vuex'

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
      currentCall: 'getCurrentCallId',
      preferences: 'userPreferences'
    }),

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
      'availableServerStatus',
      'setAccountProperty'
    ]),

    open(number) {
      this.number = number
      this.visible = true
    },

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

        this.$nextTick(() => {
          if (this.number.length === 16) {
            this.call()
          }
        })
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

    acceptedCallConditions() {
      this.setAccountProperty({
        ACCEPT_DIALER_TERMS: this.$moment().toISOString()
      }).then(() => this.setAccountProperty({
        REJECT_DIALER_TERMS: null
      }))
    },

    rejectedCallConditions() {
      this.setAccountProperty({
        ACCEPT_DIALER_TERMS: null
      }).then(() => this.setAccountProperty({
        REJECT_DIALER_TERMS: this.$moment().toISOString()
      }))
    },

    validateCallTerms() {
      const text = 'Todas as ligações realizadas pela plataforma são gravadas e são disponibilizadas para os participantes da disputa e para os administradores dos times.<br><br>Você entende e concorda que a JUSTTO grave todas as suas ligações com as partes da disputa para auditorias futuras da negociação?'

      return this.$confirm(text, 'Iniciando ligação', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showClose: false,
        center: true
      }).then(() => {
        this.acceptedCallConditions()
        this.startCall()
      }).catch(() => this.rejectedCallConditions())
    },

    revalidateCallTerms() {
      const rejectDate = this.$moment(this.preferences.properties.REJECT_DIALER_TERMS).format('DD/MM/YYYY')
      const text = `Não é possível realizar ligações porque em ${rejectDate} você não concordou em ter suas conversas gravadas e o sistema não oferece ligações sem monitoramento.`

      return this.$confirm(text, 'Ops! Você não pode fazer ligações.', {
        confirmButtonText: 'Ok, entendo',
        cancelButtonText: 'Quero aceitar',
        showClose: false,
        center: true
      })
    },

    call() {
      if (!this.hasAcceptTerms && !this.hasNotAcceptTerms) {
        this.validateCallTerms()
      } else if (this.hasNotAcceptTerms) {
        this.revalidateCallTerms().then(this.close).catch(() => {
          this.validateCallTerms()
        })
      } else if (this.hasAcceptTerms) {
        this.startCall()
      }
    },

    startCall() {
      this.loading = true

      this.createNewCall(`+55${this.number}`).then(callInfo => {
        this.$jusSegment('ligação', {
          numebr: this.number,
          ...callInfo
        })
      }).catch(() => {
        this.deleteCurrentCall()
      }).finally(() => {
        this.loading = false
      })
    },

    shutdownCall() {
      this.deleteCurrentCall()
    },

    eventHub(e) {
      switch (e.type) {
        case 'started':
          this.login()
          break
        case 'i_new_call':
          this.acceptCall(e)
          break
        case 'terminated':
          this.clearCurrentCall()
          break
        default:
          if (process.env.NODE_ENV === 'development') {
            console.log(e)
          }
          break
      }
    },

    close() {
      return new Promise((resolve) => {
        this.visible = false
        resolve()
      })
    }
  }
}
</script>

<style lang="scss">
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
  }
}
</style>
