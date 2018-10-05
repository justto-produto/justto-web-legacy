<template lang="html">
  <el-row class="onboarding-view">
    <el-col :md="left" class="hidden-sm-and-down" style="transition: width ease 1s;">
      <JusSidenavExternal/>
    </el-col>
    <transition name="fade">
      <el-col v-if="right > 0" :md="right">
        <swiper ref="swiper" :options="swiperOption" class="swiper-box">
          <swiper-slide>
            <WelcomeStep :is-guest="isGuest" @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide>
            <OabStep @onboarding:step:next="nextStep"/>
          </swiper-slide>
          <swiper-slide>
            <EmailStep @onboarding:step:next="nextStep"/>
          </swiper-slide>
        </swiper>
      </el-col>
    </transition>
    <el-button :disabled="currentStep === 0" class="el-button--previous-step" type="primary" icon="el-icon-arrow-up" @click="previousStep"/>
  </el-row>
</template>

<script>
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal'
import WelcomeStep from './steps/WelcomeStep'
import OabStep from './steps/OabStep'
import EmailStep from './steps/EmailStep'

export default {
  name: 'Onboarding',
  components: {
    JusSidenavExternal,
    WelcomeStep,
    OabStep,
    EmailStep
  },
  data () {
    return {
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
    nextStep () {
      this.$refs['swiper'].swiper.slideNext(800)
      this.updateCurrentStep()
    },
    previousStep () {
      this.$refs['swiper'].swiper.slidePrev(800)
      this.updateCurrentStep()
    },
    updateCurrentStep () {
      this.currentStep = this.$refs['swiper'].swiper.activeIndex
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
    font-size: 40px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .onboarding-step-content {
    width: 100%;
    max-width: 586px;
    .el-button--primary {
      margin-top: 40px;
    }
  }
}
</style>
