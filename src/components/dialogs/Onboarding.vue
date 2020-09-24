<template>
  <div class="onboarding">
    <div class="onboarding__content">
      <el-row :gutter="24">
        <el-col :span="16" style="height: 100%;">
          <div class="content__carousel">
            <el-carousel
              ref="carousel"
              arrow="always"
              :height="carouselHeight"
              :autoplay="false"
              :loop="false"
              trigger="click"
              @change="carouselChanged"
            >
              <el-carousel-item
                v-for="(item, index) in steps"
                :key="index"
              >
                <div class="carousel__item">
                  <h2 class="item__title">
                    {{ item.title }}
                  </h2>
                  <p class="item__description">
                    {{ item.description }}
                  </p>
                  <el-button
                    type="primary"
                    class="item__cta"
                    @click="nextCarousel()"
                  >
                    {{ item.cta }}
                    <i
                      v-if="!isLastCarouselItem"
                      class="el-icon-arrow-right"
                    />
                  </el-button>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
        <el-col :span="8" style="height: 100%;">
          <img
            class="onboarding__justtine"
            src="@/assets/gifs/onboarding/dashboardJusttine.gif"
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { IS_SMALL_WINDOW } from '@/constants/variables'

export default {
  name: 'Onboarding',
  props: {
    steps: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      currentCarouselItem: '',
    }
  },
  computed: {
    isLastCarouselItem() {
      const lastItem = this.steps.length - 1
      return lastItem === this.currentCarouselItem
    },
    carouselHeight() {
      if (IS_SMALL_WINDOW) {
        return '450px'
      }
      return '550px'
    },
  },
  methods: {
    carouselChanged(currentItem) {
      this.currentCarouselItem = currentItem
    },
    nextCarousel() {
      if (this.isLastCarouselItem) {
        this.close()
      } else {
        this.$refs.carousel.next()
      }
    },
    close() {
      console.log('close')
      this.$emit('closeOnboarding')
    },
  },
}
</script>
<style lang="scss" scoped>
.onboarding {
  background: rgba(#9461F7, 0.7);
  backdrop-filter: blur(3px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;;

  &__content {
    width: 80%;
    height: 80%;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0px 3px 10px #00000045;

    @media (max-height: 680px) {
      height: 85%;
    }

    .content__carousel {
      padding: 15px 20px;

      .carousel__item {
        text-align: center;
        padding: 0 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;

        .item__title {
          color: #FF7300;
          font-size: 34px;
          font-weight: 700;

          @media (max-height: 680px) {
            margin: 0;
            font-size: 30px;
          }
        }

        .item__description {
          color: #606060;
          font-size: 20px;
          margin-top: 35px;
          line-height: 1.4;
        }

        .item__cta {
          margin-top: 30px;
          font-size: 16px;
        }
      }
    }
  }
  & /deep/ .el-carousel__indicators {
    .el-carousel__indicator {
      .el-carousel__button {
        width: 10px;
        height: 10px;
        border: 1px solid #FF7300;
      }

      &.is-active {
        .el-carousel__button {
          border: 1px solid #FF7300;
          background: #FF7300;
        }
      }
    }
  }

  &__justtine {
    width: 100%;
    padding: 0 20px;
  }
}
</style>
