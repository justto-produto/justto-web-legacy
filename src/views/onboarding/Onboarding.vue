<template>
  <el-row class="onboarding-view">
    <el-col
      :md="left"
      class="hidden-sm-and-down"
      style="transition: width ease 1s;"
    >
      <jus-sidenav-external />
    </el-col>
    <transition name="swiper-fade">
      <el-col
        v-if="right > 0"
        :md="right"
      >
        <swiper
          ref="swiper"
          v-loading="$store.state.loading"
          :options="swiperOption"
          class="swiper-box"
          @slideChange="slideChange"
          @progress="updateProgress"
        >
          <swiper-slide>
            <transition name="el-fade-in-linear">
              <welcome-step
                v-if="currentVisible === 'welcome'"
                :is-guest="isGuest"
                :company-name="$route.query.invitedBy"
                @onboarding:step:next="nextStep"
              />
            </transition>
          </swiper-slide>
          <swiper-slide v-if="!isGuest">
            <transition name="el-fade-in-linear">
              <team-name-step
                v-if="currentVisible === 'teamname'"
                @onboarding:createSubdomain="createSubdomain"
              />
            </transition>
          </swiper-slide>
          <!-- <swiper-slide v-if="!isGuest">
            <transition name="el-fade-in-linear">
              <subdomain-step v-if="currentVisible === 'subdomain'" @onboarding:step:next="nextStep" />
            </transition>
          </swiper-slide> -->
          <!-- <swiper-slide>
            <oab-step @onboarding:step:next="nextStep"/>
          </swiper-slide> -->
          <!-- <swiper-slide v-if="!isGuest">
            <LogoStep @onboarding:step:next="nextStep"/>
          </swiper-slide> -->
          <swiper-slide v-if="!isGuest">
            <transition name="el-fade-in-linear">
              <invite-step
                v-if="currentVisible === 'invite'"
                @onboarding:step:next="nextStep"
              />
            </transition>
          </swiper-slide>
          <swiper-slide>
            <transition name="el-fade-in-linear">
              <final-step
                v-if="currentVisible === 'final'"
                :is-guest="isGuest"
              />
            </transition>
          </swiper-slide>
        </swiper>
        <div class="onboarding-progress">
          {{ progressPercentage }}% completo
          <el-progress
            :width="400"
            :percentage="progressPercentage"
            text-inside
          />
        </div>
      </el-col>
    </transition>
    <el-tooltip
      :open-delay="800"
      content="Voltar"
    >
      <el-button
        :disabled="currentStep === 0"
        class="el-button--previous-step"
        type="primary"
        icon="el-icon-arrow-up"
        @click="previousStep"
      />
    </el-tooltip>
  </el-row>
</template>

<script>
import { uuidv4 } from '@/utils/jusUtils'

export default {
  name: 'Onboarding',
  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal'),
    WelcomeStep: () => import('./steps/WelcomeStep'),
    TeamNameStep: () => import('./steps/TeamNameStep'),
    InviteStep: () => import('./steps/InviteStep'),
    FinalStep: () => import('./steps/FinalStep')
  },
  data() {
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
    isGuest() {
      return !!this.$route.query.invitedBy
    },
    currentVisible() {
      if (this.isGuest) {
        switch (this.currentStep) {
          case 0:
            return 'welcome'
          case 1:
            return 'final'
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
            return 'invite'
          case 3:
            return 'final'
          case 4:
            return 'final'
        }
      }

      return ''
    }
  },
  beforeCreate() {
    this.$store.commit('redirectNewWorkspaceFalse')
  },
  created() {
    setTimeout(function() {
      this.left = 6
    }.bind(this), 400)
    setTimeout(function() {
      this.right = 18
    }.bind(this), 1200)
  },
  methods: {
    updateProgress(progress) {
      this.progressPercentage = Math.round((progress * 100) * 0.2) / 0.2
    },
    slideChange() {
      this.currentStep = this.$refs.swiper.swiper.activeIndex
    },
    nextStep(responseObj) {
      Object.assign(this.responses, responseObj)
      this.$refs.swiper.swiper.slideNext(800)
    },
    previousStep() {
      this.$refs.swiper.swiper.slidePrev(800)
    },
    createSubdomain(responseObj) {
      if (!this.$store.getters.creatingWorkspace) {
        this.$store.dispatch('showLoading')
        Object.assign(this.responses, responseObj)
        this.$store.dispatch('createWorkpace', {
          name: this.responses.team,
          subDomain: uuidv4()
        }).then(() => {
          this.$store.dispatch('refreshToken').then(() => {
            this.$refs.swiper.swiper.slideNext(800)
            this.$socket.emit('subscribe', {
              headers: {
                Authorization: this.$store.getters.accountToken,
                Workspace: this.$store.getters.workspaceSubdomain
              },
              channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/whatsapp'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(() => {
            this.$store.dispatch('hideLoading')
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.$store.dispatch('hideLoading')
        })
      } else {
        this.$refs.swiper.swiper.slideNext(800)
      }
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
  .swiper-slide {
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
  @media (max-width: 1080px) {
    .swiper-slide {
      padding: 60px;
    }
  }
  @media (max-width: 991px) {
    .el-button--previous-step {
      z-index: 9 !important;
      border-radius: 50% !important;
      padding: 19px !important;
      position: absolute !important;
      bottom: 100px !important;
      right: 20px !important;
    }
    .swiper-slide {
      justify-content: center;
      padding: 40px;
      .el-button--primary, .el-form {
        width: 100%;
        max-width: 100%;
      }
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
