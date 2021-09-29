<template>
  <el-dialog
    title="Atenção - Ligação Ativa"
    custom-class="call-help-dialog"
    :visible="visible"
    :modal="false"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    :append-to-body="false"
    destroy-on-close
    center
  >
    <section
      v-loading="isLoading"
      class="call-help__container"
    >
      <el-carousel
        ref="carousel"
        class="call-help__carousel"
      >
        <el-carousel-item class="call-help__carousel-item">
          <h3 class="call-help__carousel-item-info">
            Se identifique e confirme com quem está falando!
          </h3>

          <div class="call-help__suggestion-balloon">
            <div class="call-help__suggestion-balloon-label">
              <span>
                Sugestão
              </span>
            </div>

            <ul class="call-help__suggestion-balloon-text">
              <li>Bom dia, meu nome é Thamiris</li>

              <li>Estou falando com o Dr. Cleyton?</li>

              <li>É sobre um debito em abento com a JUSTTO.</li>
            </ul>
          </div>

          <div class="call-help__carousel-item-actions">
            <el-popover
              ref="incorrectContactPopover"
              placement="bottom"
              trigger="click"
              title="Qual o problema com o contato?"
              popper-class="incorrect-contact__popover"
            >
              <el-select
                v-model="invalidNumberReason"
                class="incorrect-contact__select"
                size="small"
              >
                <el-option
                  :label="$tc('call.interaction.status.DIFFERENT_OWNER')"
                  value="DIFFERENT_OWNER"
                />
                <el-option
                  :label="$tc('call.interaction.status.NONEXISTENT')"
                  value="NONEXISTENT"
                />
              </el-select>

              <el-button
                type="danger"
                size="small"
                :disabled="!invalidNumberReason"
                @click="registerProblemWithNumber()"
              >
                Registrar problema
              </el-button>

              <el-button
                slot="reference"
                type="danger"
                size="small"
              >
                Contato incorreto
              </el-button>
            </el-popover>

            <el-button
              type="success"
              size="small"
              @click="next()"
            >
              Contato correto
            </el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
    invalidNumberReason: '',
    isLoading: false
  }),

  methods: {
    ...mapActions(['setInvalidNumberInCall']),

    next() {
      this.$refs.carousel.next()
    },

    registerProblemWithNumber() {
      this.isLoading = true

      this.setInvalidNumberInCall({ reason: this.invalidNumberReason }).then(() => {
        this.$emit('call:end')
        this.$refs.incorrectContactPopover.doClose()
      }).catch((error) => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.isLoading = false
        this.invalidNumberReason = ''
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.call-help-dialog {
  .el-dialog__body {
    .call-help__container {
      .call-help__carousel {
        .el-carousel__container {
          .el-carousel__item {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .call-help__carousel-item-info {
              padding: 0;
              text-align: center;
            }

            .call-help__suggestion-balloon {
              border: solid $--color-black 1px;
              border-radius: 10px;
              padding: 8px;

              .call-help__suggestion-balloon-label {
                text-align: center;
                margin-top: -18px;

                span {
                  padding: 0 8px;
                  background-color: white;
                  font-weight: 600;
                }
              }
            }

            .call-help__carousel-item-actions {
              display: flex;
              flex-direction: row;
              justify-content: space-around;
            }
          }
        }
      }
    }
  }
}

.incorrect-contact__popover {
  padding: 16px !important;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .el-popover__title {
    margin: 0;
    font-weight: 600;
  }
}
</style>
