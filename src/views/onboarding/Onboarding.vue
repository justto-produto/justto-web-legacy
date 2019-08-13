<template>
  <el-row class="onboarding-view">
    <el-col :md="left" class="hidden-sm-and-down" style="transition: width ease 1s;">
      <jus-sidenav-external/>
    </el-col>
    <transition name="swiper-fade">
      <el-col v-if="right > 0" :md="right">
        <swiper
          v-loading="$store.state.loading"
          ref="swiper"
          :options="swiperOption"
          class="swiper-box"
          @slideChange="slideChange"
          @progress="updateProgress">
          <swiper-slide>
            <transition name="el-fade-in-linear">
              <welcome-step
                v-if="currentVisible === 'welcome'"
                :is-guest="isGuest"
                :company-name="$route.query.invitedBy"
                @onboarding:step:next="nextStep"/>
            </transition>
          </swiper-slide>
          <swiper-slide v-if="!isGuest">
            <transition name="el-fade-in-linear">
              <team-name-step v-if="currentVisible === 'teamname'" @onboarding:step:next="nextStep"/>
            </transition>
          </swiper-slide>
          <swiper-slide v-if="!isGuest">
            <transition name="el-fade-in-linear">
              <subdomain-step v-if="currentVisible === 'subdomain'" @onboarding:step:next="nextStep" @onboarding:createSubdomain="createSubdomain"/>
            </transition>
          </swiper-slide>
          <!-- <swiper-slide>
            <oab-step @onboarding:step:next="nextStep"/>
          </swiper-slide> -->
          <!-- <swiper-slide v-if="!isGuest">
            <LogoStep @onboarding:step:next="nextStep"/>
          </swiper-slide> -->
          <swiper-slide v-if="!isGuest">
            <transition name="el-fade-in-linear">
              <invite-step v-if="currentVisible === 'invite'" @onboarding:step:next="nextStep"/>
            </transition>
          </swiper-slide>
          <swiper-slide v-if="showWhatsapp">
            <transition name="el-fade-in-linear">
              <whatsapp-step v-if="currentVisible === 'whatsapp'" @onboarding:step:next="nextStep"/>
            </transition>
          </swiper-slide>
          <swiper-slide>
            <transition name="el-fade-in-linear">
              <final-step v-if="currentVisible === 'final'" :is-guest="isGuest"/>
            </transition>
          </swiper-slide>
        </swiper>
        <div class="onboarding-progress">
          {{ progressPercentage }}% completo
          <el-progress :width="400" :percentage="progressPercentage" text-inside/>
        </div>
      </el-col>
    </transition>
    <el-tooltip :open-delay="800" placement="left" content="Voltar">
      <el-button
        :disabled="currentStep === 0"
        class="el-button--previous-step"
        type="primary"
        icon="el-icon-arrow-up"
        @click="previousStep"/>
    </el-tooltip>
  </el-row>
</template>

<script>
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal'
import WelcomeStep from './steps/WelcomeStep'
import OabStep from './steps/OabStep'
import WhatsappStep from './steps/WhatsappStep'
import TeamNameStep from './steps/TeamNameStep'
import SubdomainStep from './steps/SubdomainStep'
import LogoStep from './steps/LogoStep'
import InviteStep from './steps/InviteStep'
import FinalStep from './steps/FinalStep'

export default {
  name: 'Onboarding',
  components: {
    JusSidenavExternal,
    WelcomeStep,
    OabStep,
    WhatsappStep,
    TeamNameStep,
    LogoStep,
    InviteStep,
    FinalStep,
    SubdomainStep
  },
  data () {
    return {
      responses: {},
      left: 12,
      right: 0,
      currentStep: 0,
      progressPercentage: 0,
      secondFase: false,
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 1,
        allowTouchMove: false,
        initialSlide: 0
      }
    }
  },
  computed: {
    isGuest () {
      return !!this.$route.query.invitedBy
    },
    showWhatsapp () {
      return this.$store.getters.whatsappStatus !== 'OFFLINE'
    },
    currentVisible () {
      if (this.isGuest) {
        switch (this.currentStep) {
          case 0:
            return 'welcome'
          case 1:
            return this.showWhatsapp ? 'whatsapp' : 'final'
          case 2:
            return 'final'
        }
      } else {
        switch (this.currentStep) {
          case 0:
            return 'welcome'
          case 1:
            return 'teamname'
          case 2:
            return 'subdomain'
          case 3:
            return 'invite'
          case 4:
            return this.showWhatsapp ? 'whatsapp' : 'final'
          case 5:
            return 'final'
        }
      }
    }
  },
  beforeCreate () {
    if (this.$store.state.workspaceModule.subdomain) {
      this.$store.dispatch('whatsappStart').then(() => {
        this.$socket.emit('subscribe', { headers, channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/whatsapp' })
      })
    }
  },
  created () {
    setTimeout(function () {
      this.left = 6
    }.bind(this), 400)
    setTimeout(function () {
      this.right = 18
    }.bind(this), 1200)
  },
  methods: {
    updateProgress (progress) {
      this.progressPercentage = Math.round((progress * 100) * 0.2) / 0.2
    },
    slideChange () {
      this.currentStep = this.$refs.swiper.swiper.activeIndex
    },
    nextStep (responseObj) {
      Object.assign(this.responses, responseObj)
      this.$refs.swiper.swiper.slideNext(800)
    },
    previousStep () {
      this.$refs.swiper.swiper.slidePrev(800)
    },
    createSubdomain (responseObj) {
      this.$store.dispatch('showLoading')
      Object.assign(this.responses, responseObj)
      this.$store.dispatch('createWorkpace', {
        name: this.responses.team,
        subDomain: this.responses.subdomain
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.$store.dispatch('myWorkspace').then(response => {
          if (response.length && response[response.length - 1].subDomain === this.responses.subdomain) {
            this.$refs.swiper.swiper.slideNext(800)
            this.$socket.emit('subscribe', { headers, channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/whatsapp' })
            this.$store.dispatch('whatsappStart')
          } else {
            this.$jusNotification({ type: 'error' })
          }
        }).finally(() => {
          this.$store.dispatch('hideLoading')
        })
      })
    }
  }
}
</script>

<style lang="scss">
.onboarding-view {
  height: 100%;
  background-color: #fff;
  >.el-col {
    height: 100%
  }
  .swiper-box {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .swiper-slide{
    display: flex;
    align-items: center;
    padding: 120px;
    >div {
      width: 100%;
    }
    .el-button--primary, .el-select, .el-form {
      width: 100%;
      max-width: 400px;
    }
    .el-button--text {
      margin-left: 40px;
    }
  }
  h1{
    margin-bottom: 10px;
    font-weight: bold;
  }
  .el-button--primary:not(.el-button--previous-step) {
    margin-top: 20px;
  }
  .onboarding-step-content {
    width: 100%;
    max-width: 586px;
    .onboarding-step-content__title {
      margin-bottom: 40px;
    }
  }
  .el-alert {
    max-width: 400px;
  }
  @media (max-width: 991px) {
    .swiper-slide {
      padding: 40px;
    }
    .el-form-item {
      width: 100%;
      margin-right: 0;
    }
    .el-button--text {
      width: 100%;
      margin: 10px 0 0 0 !important;
    }
  }
  .onboarding-progress{
    position: relative;
    bottom: 64px;
    width: 400px;
    margin-left: 120px;
    .el-progress-bar__innerText {
      display: none;
    }
  }
}

@media (max-width: 991px) {
  html, body{
    font-size: 13px !important;
  }
}
@media (max-width: 320px) {
  html, body{
    font-size: 12px !important;
  }
}
</style>
