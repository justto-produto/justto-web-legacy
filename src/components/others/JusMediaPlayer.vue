<template>
  <article class="jus-video-player">
    <div
      v-if="!playing"
      class="jus-video-player__thumb"
      :class="type"
      @click="play"
    >
      <div class="jus-video-player__thumb-icon">
        <el-tooltip :open-delay="500">
          <div slot="content">
            {{ $tc(`negotiation.ticket.omnichannel.occurrence.COMMUNICATION.WHATSAPP.${type}`) }}
          </div>

          <JusIcon
            :icon="`whatsapp-${type.toLowerCase()}`"
          />
        </el-tooltip>
      </div>

      <div
        v-if="type === 'AUDIO'"
        class="jus-video-player__thumb-controls"
      >
        <i class="el-icon-video-play" />
        <el-slider
          :value="0"
          :max="0"
          :show-tooltip="false"
        />
      </div>
    </div>

    <div
      v-else
      class="jus-video-player__player"
    >
      <slot />
      <span
        v-if="type === 'VIDEO'"
        class="jus-video-player__player-shadow"
        :class="renderedModule"
        @click="handleClickInShadow"
      />
    </div>
  </article>
</template>

<script>
export default {
  props: {
    /**
     * Tipos:
     *
     * AUDIO,
     * VIDEO,
     */
    type: {
      type: String,
      default: () => 'VIDEO'
    }
  },

  data: () => ({
    playing: false
  }),

  computed: {
    renderedModule() {
      return location.href.includes('negotiation') ? 'negotiation' : location.href.includes('dispute') ? 'dispute' : 'unknow'
    }
  },

  methods: {
    play(_event) {
      document.querySelectorAll('.jus-video-player').forEach(({ __vue__ }) => {
        if (__vue__) __vue__.playing = __vue__ === this
      })
    },

    handleClickInShadow(event) {
      const video = document.querySelector('.jus-video-player__player video')

      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-video-player {
  .jus-video-player__thumb {
    .jus-video-player__thumb-controls {
      .el-slider {
        .el-slider__runway {
          .el-slider__button-wrapper {
            .el-slider__button {
              border-color: $--color-whatsapp !important;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-video-player {
  .jus-video-player__thumb {
    min-width: 100%;
    display: flex;
    border-radius: 10px;
    width: 240px;
    height: 120px;

    &.VIDEO {
      cursor: pointer;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;

      .jus-video-player__thumb-controls {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 24px;
        padding: 0 8px;
        width: 100%;
      }

      .jus-video-player__thumb-icon {
        img {
          width: 80px;
          margin-left: 24px;
        }
      }
    }

    &.AUDIO {
      cursor: pointer;
      height: 60px;
      gap: 16px;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      padding: 0 8px;

      .jus-video-player__thumb-icon {
        img {
          margin-bottom: 8px;
        }
      }

      .jus-video-player__thumb-controls {
        width: 100%;
        flex-direction: row;
        gap: 24px;
      }

    }

    .jus-video-player__thumb-controls {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .el-icon-video-play {
        font-size: 32px;
        color: $--color-whatsapp;
      }

      .jus-video-player__thumb-icon {
        cursor: pointer;
      }
    }

  }

  .jus-video-player__player {
    position: relative;

    video {
      border-radius: 10px;
    }

    .jus-video-player__player-shadow {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      cursor: pointer;

      &.dispute {
        box-shadow: inset 0px 0px 10px 10px rgb(138 230 152 / 75%);
      }

      &.negotiation {
        box-shadow: inset 0px 0px 10px 10px rgb(249 250 250 / 75%)
      }
    }
  }
}
</style>
