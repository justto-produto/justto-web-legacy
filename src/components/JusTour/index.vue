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
            <div class="jus-tour__step-justine">
              <img src="@/assets/gifs/onboarding/dashboardJusttine.gif"/>
            </div>
            <div class="jus-tour__step-description">
              {{ step.description }}
            </div>
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
    display: flex;
    flex-direction: column;
    align-content: space-between;
    filter: drop-shadow(0 3px 16px rgba(37,38,94, 0.15)) !important;
    height: 160px !important;
    max-height: 160px !important;
    width: 380px !important;
    max-width: 380px !important;

    .jus-tour__step-content {
      display: flex;

      .jus-tour__step-justine {
        height: 95px;
        width: 95px;
        border: 8px solid $--color-primary;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        margin-right: 12px;

        // TODO: Refatorar esse pedacinho feio aqui
        img {
          position: absolute;
          width: 160%;
          top: -28px;
          left: -17px;
        }
      }

      .jus-tour__step-description {
        color: $--color-text-secondary;
        font-weight: 600;
        text-align: left;
        font-size: 16px;
        flex: 1;
      }
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
