<template>
  <v-tour
    :name="name"
    :steps="steps"
    class="jus-tour">
    <template slot-scope="tour">
      <transition name="fade">
        <v-step
          v-if="tour.currentStep === index"
          v-for="(step, index) of tour.steps"
          :key="index"
          :step="step"
          :previous-step="tour.previousStep"
          :next-step="tour.nextStep"
          :finish="tour.finish"
          :stop="tour.stop"
          :skip="tour.skip"
          :is-first="tour.isFirst"
          :is-last="tour.isLast"
          :labels="tour.labels"
          :highlight="tour.highlight"
          :options="{ highlight }"
          class="jus-tour__step"
        >
          <!-- <div slot="header">
            <div v-if="ste.title"></div>
          </div> -->
          <div
            slot="content"
            class="jus-tour__step-content">
            <img class="jus-tour__step-justine"/>
            {{ step.description }}
          </div>
          <div
            slot="actions"
            class="jus-tour__step-actions">
            <!-- <el-button
              v-if="!isLast"
              size="mini"
              @click.prevent="tour.skip">
              Pular
            </el-button> -->
            <el-button
              v-if="!tour.isFirst"
              size="mini"
              @click.prevent="tour.previousStep">
              Voltar
            </el-button>
            <el-button
              v-if="!tour.isLast"
              size="mini"
              @click.prevent="tour.nextStep">
              Avançar
            </el-button>
            <el-button
              v-if="tour.isLast"
              size="mini"
              @click.prevent="finishTour(tour.finish)">
              Entendi
            </el-button>
          </div>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'JusTour',
  components: {},
  props: {
    name: {
      type: String,
      required: true,
    },
    steps: {
      type: Array,
      required: true,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(['updateUserPreferences']),

    finishTour(finishTour) {
      this.updateUserPreferences({ [this.name]: true })
      finishTour()
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-tour {
  .jus-tour__step {
    border-radius: 8px;
    background-color: $--color-white;
    filter: drop-shadow(0 3px 16px rgba(37,38,94, 0.15)) !important;
    
    .jus-tour__step-justine {
      // position: absolute;
      // top: 50%;
      // left: 0;
      // transform: translateY(-50%);
      // height: 100%;
      // background-color: yellow;
      // border: 12px solid $--color-primary;
      // border-radius: 50%;
    }

    .jus-tour__step-content {
      display: flex;
      color: $--color-text-secondary;
      font-weight: 600;
      text-align: left;
      font-size: 16px;
    }

    .jus-tour__step-actions {
      margin-top: 8px;
      display: flex;
      justify-content: flex-end;
    }

    .v-step__arrow {
      border-color: $--color-white;
    }
  }
}
</style>
