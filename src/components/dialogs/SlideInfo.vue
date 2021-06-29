<template>
  <el-dialog
    ref="slideInfo"
    :close-on-click-modal="false"
    :show-close="false"
    :visible.sync="isVisible"
    append-to-body
    width="40%"
  >
    <div class="info">
      <div class="info__title">
        {{ currentTitle }}
      </div>
      <el-carousel
        ref="slider"
        class="info__caurosel"
        height="450px"
        indicator-position="outside"
        trigger="click"
        :autoplay="false"
        @change="changeSlide"
      >
        <el-carousel-item
          v-for="item in images"
          :key="`${item.src}-${item.title}`"
          class="info__caurosel__item"
        >
          <div v-if="item.subtitle && item.subtitle.length !== 0">
            {{ item.subtitle }}
          </div>
          <img
            :src="item.src"
            class="info__caurosel__item-img"
          >
          <div v-if="item.footer && item.footer.length !== 0">
            {{ item.footer }}
          </div>
        </el-carousel-item>
      </el-carousel>
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
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: () => ''
    },
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    currentTitle() {
      return this.images.filter((_item, index) => index === this.currentIndex)[0].title
    }
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
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.info {
  height: 75%;
  .info__title {
    font-size: 21px;
    text-align: center;
    font-weight: 700;
    margin: 0 22%;
  }
  .info__caurosel {
    .info__caurosel__item {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }
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

</style>
