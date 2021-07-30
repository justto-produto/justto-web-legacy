<template>
  <article class="recomendations-container">
    <el-dropdown
      v-if="recomendations.length"
      size="mini"
      @command="handleCommand"
    >
      <span class="el-dropdown-link">
        <el-popover
          v-model="showRecomendationPopover"
          :title="currentRecomendation ? $t(`recomendations.${currentRecomendation.type}.title`) : ''"
          popper-class="popover-recomendation"
          trigger="manual"
        >
          <span slot="reference">
            <JusIcon icon="recomendation-lamp" />
          </span>

          <div
            v-if="currentRecomendation !== null"
            class="popover-recomendation-container"
          >
            <div class="popover-recomendation-container__body">
              <div
                v-for="(value, key) of currentRecomendation.properties"
                :key="key"
                class="popover-recomendation-container__body-item"
              >
                <span
                  v-if="key === 'PHONE_NUMBER'"
                  class="popover-recomendation-container__body-item-container"
                >
                  <label class="popover-recomendation-container__body-item-container-label">
                    Contato:
                  </label>

                  <span class="popover-recomendation-container__body-item-container-value">
                    {{ value | phoneNumber }}
                  </span>
                </span>

                <span
                  v-if="key === 'MESSAGE_SUBJECT'"
                  class="popover-recomendation-container__body-item-container"
                >
                  <label class="popover-recomendation-container__body-item-container-label">
                    Assunto:
                  </label>

                  <span class="popover-recomendation-container__body-item-container-value">
                    {{ value }}
                  </span>
                </span>

                <span
                  v-if="key === 'MESSAGE_CONTENT'"
                  class="popover-recomendation-container__body-item-container"
                >
                  <label class="popover-recomendation-container__body-item-container-label">
                    Mensagem:
                  </label>

                  <span
                    class="popover-recomendation-container__body-item-container-value"
                    v-html="value"
                  />
                </span>

                <span
                  v-if="key === 'PERSON_NAME'"
                  class="popover-recomendation-container__body-item-container"
                >
                  <label class="popover-recomendation-container__body-item-container-label">
                    Nome:
                  </label>

                  <span
                    class="popover-recomendation-container__body-item-container-value"
                  >
                    {{ value || capitalize }}
                  </span>
                </span>

                <span
                  v-if="key === 'ROLE_NAME'"
                  class="popover-recomendation-container__body-item-container"
                >
                  <label class="popover-recomendation-container__body-item-container-label">
                    Função:
                  </label>

                  <span
                    class="popover-recomendation-container__body-item-container-value"
                  >
                    {{ $tc(`roles.${value}.CLAIMANT`) || capitalize }}
                  </span>
                </span>
              </div>
            </div>

            <div class="popover-recomendation-container__footer">
              <el-button
                v-if="$t(`recomendations.${currentRecomendation.type}.buttons.secondary`).length"
                type="secondary"
                size="mini"
                @click="handleSecondaryAction"
              >
                {{ $t(`recomendations.${currentRecomendation.type}.buttons.secondary`) }}
                <i class="el-icon-edit" />
              </el-button>

              <el-button
                type="success"
                size="mini"
                @click="handlePrimaryAction"
              >
                {{ $t(`recomendations.${currentRecomendation.type}.buttons.primary`) }}
                <i class="el-icon-s-promotion" />
              </el-button>
            </div>
          </div>
        </el-popover>
      </span>

      <el-dropdown-menu
        v-if="!showRecomendationPopover"
        slot="dropdown"
      >
        <el-dropdown-item
          v-for="(recomendation, recomendationIndex) in recomendations"
          :key="`recomendation-${recomendationIndex}`"
          :command="recomendation"
        >
          {{ $tc(`recomendations.${recomendation.type}.option`) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    interactionId: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    recomendations: [],
    showRecomendationPopover: false,
    currentRecomendation: null
  }),

  mounted() {
    this.getRecommendations(this.interactionId).then(res => {
      this.recomendations = res
    })
  },

  methods: {
    ...mapActions([
      'getRecommendations',
      'executeRecommendation'
    ]),

    clickOutOfPopover(_event) {
      this.closePopover()
    },

    handleCommand(recomendation) {
      this.showRecomendationPopover = true
      this.currentRecomendation = { ...recomendation }
      document.body.addEventListener('click', this.clickOutOfPopover)
    },

    closePopover() {
      this.showRecomendationPopover = false
      this.currentRecomendation = null
      document.body.removeEventListener('click', this.clickOutOfPopover)
    },

    handlePrimaryAction() {
      this.executeRecommendation(this.currentRecomendation).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Recomendação executada com sucesso!'
        })

        this.closePopover()
      }).catch(error => this.$jusNotification({ error }))
    },

    handleSecondaryAction() {
      // TODO: SAAS-4074 Implementar edição de mensagem e de contra proposta.
    }
  }
}
</script>

<style lang="scss" scoped>
.recomendations-container {
  cursor: pointer;
  margin: 8px 8px 0 -4px;
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.popover-recomendation {
  padding: 16px !important;

  .popover-recomendation-container {
    display: flex;
    flex-direction: column;
    gap: 16px;

    max-width: 30vw;

    .popover-recomendation-container__body {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .popover-recomendation-container__body-item {
        .popover-recomendation-container__body-item-container {
          .popover-recomendation-container__body-item-container-label {
            font-weight: 600;
            color: $--color-secondary;
          }

          .popover-recomendation-container__body-item-container-value {
            word-break: keep-all;
          }
        }
      }
    }

    .popover-recomendation-container__footer {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
