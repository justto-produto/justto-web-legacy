<template>
  <el-row class="onboarding-view">
    <el-col :md="left" class="hidden-sm-and-down" style="transition: width ease 1s;">
      <JusSidenavExternal/>
    </el-col>
    <transition name="swiper-fade">
      <el-col v-if="right > 0" :md="right">
        <swiper
          v-loading="$store.state.loading"
          ref="swiper"
          :options="swiperOption"
          class="swiper-box">
          <swiper-slide>
            <welcome-step :is-guest="isGuest" @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide v-if="!isGuest">
            <team-name-step @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide v-if="!isGuest">
            <subdomain-step @onboarding:step:next="nextStep" @onboarding:createSubdomain="createSubdomain"/>
          </swiper-slide>
          <swiper-slide>
            <oab-step @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <!-- <swiper-slide v-if="!isGuest">
            <LogoStep @onboarding:step:next="nextStep"/>
          </swiper-slide> -->
          <swiper-slide v-if="!isGuest">
            <invite-step @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide>
            <email-sync-step @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide v-if="showWhatsapp">
            <whatsapp-step @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide>
            <final-step :is-guest="isGuest"/>
          </swiper-slide>
        </swiper>
        <div class="onboarding-progress">
          {{ progressPercentage }}% completo
          <el-progress :width="400" :percentage="progressPercentage" text-inside/>
        </div>
      </el-col>
    </transition>
    <el-button
      :disabled="currentStep === 0"
      class="el-button--previous-step"
      type="primary"
      icon="el-icon-arrow-up"
      @click="previousStep"/>
  </el-row>
</template>

<script>
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal'
import WelcomeStep from './steps/WelcomeStep'
import OabStep from './steps/OabStep'
import EmailSyncStep from './steps/EmailSyncStep'
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
    EmailSyncStep,
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
      secondFase: false,
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 1,
        allowTouchMove: false
      }
    }
  },
  computed: {
    isGuest () {
      return !!this.$route.query.invitedBy
    },
    progressPercentage () {
      let slidesN = this.showWhatsapp ? 7 : 6
      return Math.round((this.currentStep * (100 / slidesN)) * 0.2) / 0.2
    },
    showWhatsapp () {
      return !this.$store.getters.isOffline
    }
  },
  beforeCreate () {
    if (this.$store.state.workspaceModule.subdomain) {
      this.$stomp.subscribe(this.$store.state.workspaceModule.subdomain)
      this.$store.dispatch('whatsappStart')
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
    nextStep (responseObj) {
      Object.assign(this.responses, responseObj)
      this.$refs['swiper'].swiper.slideNext(800)
      this.updateCurrentStep()
    },
    previousStep () {
      this.$refs['swiper'].swiper.slidePrev(800)
      this.updateCurrentStep()
    },
    updateCurrentStep () {
      this.currentStep = this.$refs['swiper'].swiper.activeIndex
    },
    createSubdomain (responseObj) {
      this.$store.dispatch('showLoading')
      Object.assign(this.responses, responseObj)
      this.$store.dispatch('createWorkpace', {
        name: this.responses.team,
        subDomain: this.responses.subdomain
      // }).then(() => {
        // this.$refs['swiper'].swiper.slideNext(800)
        // this.$stomp.subscribe(this.$store.state.workspaceModule.subdomain)
        // this.$store.dispatch('whatsappStart')
      // }).catch(error => {
        // console.error(error)
        // this.$jusNotification({
        //   title: 'Ops!',
        //   message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
        //   type: 'error'
        // })
      }).finally(() => {
        this.$store.dispatch('myWorkspace').then(response => {
          if (response.length && response[0].subDomain === this.responses.subdomain) {
            this.$refs['swiper'].swiper.slideNext(800)
            this.$stomp.subscribe(this.$store.state.workspaceModule.subdomain)
            this.$store.dispatch('whatsappStart')
          } else {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
              type: 'error'
            })
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
