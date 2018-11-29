<template lang="html">
  <el-row class="onboarding-view">
    <el-col :md="left" class="hidden-sm-and-down" style="transition: width ease 1s;">
      <JusSidenavExternal/>
    </el-col>
    <transition name="fade">
      <el-col v-if="right > 0" :md="right">
        <swiper
          v-loading="loading"
          ref="swiper"
          :options="swiperOption"
          class="swiper-box">
          <swiper-slide>
            <welcome-step :is-guest="isGuest" @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide v-if="!isGuest && !secondFase">
            <team-name-step @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide v-if="!isGuest && !secondFase">
            <subdomain-step @onboarding:step:next="createSubdomain"/>
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
          <swiper-slide>
            <whatsapp-step @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide>
            <done-step :is-guest="isGuest" @onboarding:step:finish="finalStep"/>
          </swiper-slide>
        </swiper>
      </el-col>
    </transition>
    <!-- <el-button
      :disabled="currentStep === 0"
      class="el-button--previous-step"
      type="primary"
      icon="el-icon-arrow-up"
      @click="previousStep"/> -->
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
import DoneStep from './steps/DoneStep'

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
    DoneStep,
    SubdomainStep
  },
  data () {
    return {
      loading: false,
      responses: {},
      left: 12,
      right: 0,
      currentStep: 0,
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 1,
        allowTouchMove: false
      }
    }
  },
  computed: {
    isGuest: function () {
      return !!this.$route.query.invitedBy
    },
    secondFase: function () {
      if (this.$store.state.auth.workspace.status === 'CREATING') {
        return true
      }
      return false
    }
  },
  created: function () {
    setTimeout(function () {
      this.left = 6
    }.bind(this), 200)
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
      this.loading = true
      Object.assign(this.responses, responseObj)
      this.$store.dispatch('createWorkpace', {
        name: this.responses.team,
        subDomain: this.responses.subDomain
      }).then(() => {
        this.$refs['swiper'].swiper.slideNext(800)
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.loading = false
      })
    },
    finalStep (responseObj) {
      this.loading = true
      Object.assign(this.responses, responseObj)
      this.responses.workspace = this.$store.state.auth.workspace.subDomain
      this.$store.dispatch('finishWorkspace', this.responses)
        .then(() => {
          this.loading = false
          // this.$router.push('/')
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
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
