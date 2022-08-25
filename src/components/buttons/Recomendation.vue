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
          :title="currentRecomendation && !loading ? $t(`recomendations.${currentRecomendation.type}.title`) : ''"
          popper-class="popover-recomendation"
          trigger="manual"
        >
          <img
            slot="reference"
            src="https://blog.maxieduca.com.br/wp-content/uploads/2020/02/Repert%C3%B3rio.gif"
            class="recomendation-icon el-icon-swing"
          >
          <!-- <span slot="reference">
            <JusIcon
              icon="recomendation-lamp"
              class="el-icon-pulse"
            />
          </span> -->

          <div
            v-if="currentRecomendation !== null"
            v-loading="loading"
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
                  v-if="key === 'EMAIL_ADDRESS'"
                  class="popover-recomendation-container__body-item-container"
                >
                  <label class="popover-recomendation-container__body-item-container-label">
                    E-mail:
                  </label>

                  <span class="popover-recomendation-container__body-item-container-value">
                    {{ value }}
                  </span>
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
                    {{ value | capitalize }}
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
                    {{ $tc(`roles.${value}.CLAIMANT`, isRecovery) | capitalize }}
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
              </div>

              <div
                v-if="currentRecomendation.type === 'NEW_CONTACT' && currentRecomendation.properties"
                class="popover-recomendation-container__body-item"
              >
                <span class="popover-recomendation-container__body-item-container">
                  <label
                    for="newContactParty"
                    class="popover-recomendation-container__body-item-container-label"
                  >
                    Parte:
                  </label>

                  <el-select
                    id="newContactParty"
                    v-model="currentRecomendation.properties.ROLE_ID"
                    placeholder="Selecionar parte"
                    size="mini"
                    class="popover-recomendation-container__body-item-container-value"
                  >
                    <el-option
                      v-for="({ disputeRoleId, name }) in parties"
                      :key="`${disputeRoleId}-${name}`"
                      :label="name"
                      :value="disputeRoleId"
                    />
                  </el-select>
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
                :disabled="disablePrimaryAction"
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
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    interactionId: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    loading: false,
    recomendations: [],
    showRecomendationPopover: false,
    currentRecomendation: null
  }),

  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients',
      isRecovery: 'isWorkspaceRecovery',
      parties: 'getCommonDisputeRoles'
    }),

    disablePrimaryAction() {
      return this.currentRecomendation?.type === 'NEW_CONTACT' && !(this.currentRecomendation?.properties?.ROLE_ID)
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions([
      'addRecipient',
      'setSignature',
      'setEditorText',
      'getRecommendations',
      'getDisputeOccurrences',
      'executeRecommendation',
      'getTicketOverviewParties'
    ]),

    init() {
      this.getRecommendations(this.interactionId).then(res => {
        this.recomendations = res
      }).finally(() => {
        this.loading = false
      })
    },

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
      this.loading = true

      this.executeRecommendation(this.currentRecomendation).then(() => {
        this.$jusSegment('EXECUTE_RECOMENDATION', { ...this.currentRecomendation })

        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Recomendação executada com sucesso!'
        })

        const id = this.$route?.params?.id

        this.getDisputeOccurrences(id)
        this.getTicketOverviewParties(id)

        this.closePopover()
      }).catch(error => this.$jusNotification({ error })).finally(() => {
        this.init()
      })
    },

    handleEditDisputeMassage({ EMAIL_ADDRESS, MESSAGE_CONTENT, PHONE_NUMBER }) {
      if (this.recipients?.map(({ value }) => value).includes(EMAIL_ADDRESS)) {
        this.setEditorText(MESSAGE_CONTENT)
        this.setSignature()
      } else {
        const isEmail = Object.keys(this.currentRecomendation?.properties).includes('EMAIL_ADDRESS')

        this.setEditorText('')

        this.addRecipient({
          value: isEmail ? EMAIL_ADDRESS : PHONE_NUMBER,
          type: isEmail ? 'email' : 'whatsapp',
          key: 'address'
        }).then(() => {
          this.setEditorText(MESSAGE_CONTENT)
          this.setSignature()
        })
      }
    },

    handleSecondaryAction() {
      // TODO: SAAS-4074 de contra proposta.
      const { type, properties } = this.currentRecomendation

      if (type === 'DISPUTE_MESSAGE') {
        this.handleEditDisputeMassage({ ...properties })
      }

      this.clickOutOfPopover()
    }
  }
}
</script>

<style lang="scss" scoped>
.recomendations-container {
  cursor: pointer;
  margin: 0 4px 0 -4px;

  .recomendation-icon {
    height: 20px;
    background-color: transparent;
  }
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
          display: flex;
          align-items: baseline;
          gap: 8px;

          .popover-recomendation-container__body-item-container-label {
            font-weight: 600;
            color: $--color-secondary;
          }

          .popover-recomendation-container__body-item-container-value {
            word-break: keep-all;

            &.el-select {
              flex: 1;

              .el-input {
                overflow: hidden;
              }
            }
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
