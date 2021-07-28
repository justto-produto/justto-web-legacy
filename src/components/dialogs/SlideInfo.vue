<template>
  <el-dialog
    ref="slideInfo"
    :visible.sync="isVisible"
    append-to-body
    custom-class="slide-info__container"
    :width="calcWidth"
    @close="close"
  >
    <div class="info">
      <div class="info__title">
        {{ currentTitle }}
      </div>
      <div
        v-if="currentSubtitle.length !== 0"
        class="info__subtitle"
      >
        {{ currentSubtitle }}
      </div>
      <el-carousel
        ref="slider"
        class="info__caurosel"
        height="450px"
        indicator-position="outside"
        trigger="click"
        :arrow="arrow"
        :autoplay="false"
        @change="changeSlide"
      >
        <el-carousel-item
          v-for="item in images"
          :key="`${item.src}-${item.title}`"
          class="info__caurosel__item"
        >
          <img
            :src="item.src"
            class="info__caurosel__item-img"
          >
        </el-carousel-item>
      </el-carousel>
      <div
        v-if="currentFooter.length !== 0"
        class="info__footer__message"
      >
        {{ currentFooter }}
      </div>
      <div
        class="info__footer"
      >
        <el-button
          v-if="currentIndex > 0"
          class="info__footer__prev"
          @click="prev"
        >
          <i class="el-icon-caret-left" />
          ANTERIOR
        </el-button>
        <el-button
          v-if="currentIndex < images.length - 1"
          class="info__footer__next"
          @click="next"
        >
          PRÓXIMO
          <i class="el-icon-caret-right" />
        </el-button>
        <el-button
          v-if="currentIndex === images.length - 1"
          class="info__footer__ok"
          @click="close"
        >
          OK, ENTENDI
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    images: {
      type: Array,
      required: true
    },
    arrow: {
      type: String,
      default: () => 'never'
    }
  },
  data() {
    return {
      currentIndex: 0,
      innerWidth: window.innerWidth
    }
  },
  computed: {
    currentTitle() {
      return this.images.filter((_item, index) => index === this.currentIndex)[0].title
    },
    currentSubtitle() {
      return this.images.filter((_item, index) => index === this.currentIndex)[0].subtitle || ''
    },
    currentFooter() {
      return this.images.filter((_item, index) => index === this.currentIndex)[0].footer || ''
    },
    calcWidth() {
      if (this.innerWidth > 1300) return '42%'
      if (this.innerWidth <= 800) return '95%'
      const pattern = 1300
      const porc = 55
      const x = 100 - (this.innerWidth * porc) / pattern
      return `${x}%`
    }
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth
    })
  },

  methods: {
    changeSlide(newIndex, _oldIndex) {
      this.currentIndex = newIndex
    },
    next() {
      this.$refs.slider.next()
    },
    prev() {
      this.$refs.slider.prev()
    },
    close() {
      this.clear()
      this.$emit('close')
    },
    clear() {
      this.$refs.slider.setActiveItem(0)
      this.currentIndex = 0
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.slide-info__container {
  .el-dialog__body {
    .info {
      display: flex;
      flex-direction: column;
      height: 72vh;
      justify-content: space-between;

      .info__title {
        font-size: 21px;
        text-align: center;
        font-weight: 700;
        margin: 0 12%;
        word-break: keep-all;
      }

      .info__subtitle {
        text-align: center;
        font-weight: 200;
        margin: 10px 12% 0px 12%;
      }

      .info__caurosel {
        .info__caurosel__item {
          display: flex;
          align-items: center;
          align-content: center;
          justify-content: center;

          &img {
            height: 55vh;
          }
        }
      }

      .info__footer__message {
        text-align: center;
        font-weight: bold;
        margin: 12px 18% 24px 18%;
        color: $--color-secondary;
        font-size: 13px;
      }

      .info__footer {
        display: flex;
        align-items: center;
        justify-content: center;

        .info__footer__prev {
          border-color: white;
          color: white;
          font-weight: 600;
          background-color: $--color-gray;
          border-radius: 10px;

          &:hover {
            background-color: $--color-gray-light-1;
          }
        }

        .info__footer__next {
          background-color: $--color-secondary;
          border-color: white;
          color: white;
          font-weight: 600;
          border-radius: 10px;

          &:hover {
            background-color: $--color-secondary-light-1;
          }
        }

        .info__footer__ok {
          border-color: white;
          background-color: $--color-success;
          color: white;
          font-weight: 600;
          border-radius: 10px;

          &:hover {
            background-color: $--color-success-light-1;
          }
        }
      }
      img {
        height: 81%;
      }
    }
  }
}

</style>
