<template>
  <section>
    <el-dialog
      :visible.sync="toShow"
      :close-on-click-modal="false"
      custom-class="associate-contacts-dialog"
      destroy-on-close
      append-to-body
      title="Encontramos dados de contatos na inicial da disputa"
      width="50%"
      :before-close="handleBeforeClose"
    >
      <div
        v-if="toShow"
        v-loading="loading"
        class="dialog-body"
      >
        <div class="dialog-body__title">
          Associe os novos endereços de contato
        </div>
        <div class="dialog-body__content">
          <div
            v-if="phones && phones.length"
            class="dialog-body__content-items"
          >
            <span class="dialog-body__content-label">
              Telefones:
            </span>
            <div
              v-for="(phone, phoneIndex) in phones"
              :key="phoneIndex"
              class="dialog-body__content-item"
            >
              <span class="dialog-body__content-item-concainer">
                <el-popover
                  :ref="`popover-phone-${phoneIndex}`"
                  popper-class="popover__content"
                  class="popover__content-body"
                  placement="top"
                  trigger="click"
                >
                  <div
                    v-for="origin in phone.origins"
                    :key="origin.id"
                    class="popover__content-item"
                  >
                    <div class="popover__content-title">
                      Encontrado no anexo '{{ origin.name }}'
                    </div>
                    <a
                      :href="origin.url"
                      target="_blank"
                      class="popover__content-url"
                    >
                      Click aqui para ver o documento
                    </a>
                  </div>
                </el-popover>
                <i
                  v-popover="`popover-phone-${phoneIndex}`"
                  class="el-icon-question"
                />
                <span class="dialog-body__item-address">
                  {{ phone.address }}
                </span>
              </span>
              <span class="dialog-body__item-arow" />
              <div class="dialog-body__item-select">
                <el-select
                  v-model="phone.associateWith"
                  size="mini"
                >
                  <el-option
                    label="Ignorar"
                    :value="0"
                  >
                    Ignorar
                  </el-option>
                  <el-option
                    v-for="item in disputeRoles"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!-- E-mails -->
          <div
            v-if="emails && emails.length"
            class="dialog-body__content-items"
          >
            <span class="dialog-body__content-label">
              E-mails:
            </span>
            <div
              v-for="(email, emailIndex) in emails"
              :key="emailIndex"
              class="dialog-body__content-item"
            >
              <span class="dialog-body__content-item-concainer">
                <el-popover
                  :ref="`popover-email-${emailIndex}`"
                  popper-class="popover__content"
                  class="popover__content-body"
                  placement="top"
                  trigger="click"
                >
                  <div
                    v-for="origin in email.origins"
                    :key="origin.id"
                    class="popover__content-item"
                  >
                    <div class="popover__content-title">
                      Encontrado no anexo '{{ origin.name }}'
                    </div>
                    <a
                      :href="origin.url"
                      target="_blank"
                      class="popover__content-url"
                    >
                      Click aqui para ver o documento
                    </a>
                  </div>
                </el-popover>
                <i
                  v-popover="`popover-email-${emailIndex}`"
                  class="el-icon-question"
                />
                <span class="dialog-body__item-address">
                  {{ email.address }}
                </span>
              </span>
              <span class="dialog-body__item-arow" />
              <div class="dialog-body__item-select">
                <el-select
                  v-model="email.associateWith"
                  size="mini"
                >
                  <el-option
                    label="Ignorar"
                    :value="0"
                  >
                    Ignorar
                  </el-option>
                  <el-option
                    v-for="item in disputeRoles"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="skip('MAIS TARDE')">
          Associar mais tarde
        </el-button>
        <el-button
          v-if="hasAssociations"
          :disabled="loading"
          type="primary"
          @click="submit()"
        >
          Salvar associações
        </el-button>
        <el-button
          v-else
          :disabled="loading"
          type="primary"
          @click="skip('SIM')"
        >
          Ignorar
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'AssociateContactsModal',

  props: {
    value: {
      required: true,
      type: Boolean,
      default: false
    },
    current: {
      required: true,
      type: [String, Boolean],
      default: false
    },
    metadata: {
      type: Object,
      default: () => ({
        emails: [],
        phones: []
      })
    },
    parties: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      loading: false,
      emails: [],
      phones: []
    }
  },

  computed: {
    disputeRoles() {
      return (this.parties).filter(({ party, polarity, roles }) => {
        return (party === 'CLAIMANT' || polarity === 'CLAIMANT') && (roles.includes('PARTY') || roles.includes('LAWYER'))
      }).map(({ id, name, disputeRoleId }) => (id ? { id, name } : { id: disputeRoleId, name }))
    },
    toShow: {
      get() {
        return Boolean(this.value) && (this.emails?.length > 0 || this.phones?.length > 0)
      },
      set(value) {}
    },
    hasAssociations() {
      const phones = this.phones.filter(phone => {
        return !!phone.associateWith
      }).length
      const email = this.emails.filter(email => {
        return !!email.associateWith
      }).length
      return (phones + email) > 0
    }
  },

  watch: {
    metadata() {
      this.update()
    },

    toShow(value) {
      if (!value) this.loading = false
    }
  },

  mounted() {
    this.update()
  },

  beforeDestroy() {
    this.loading = false
  },

  methods: {
    ...mapActions([
      'setDisputeProperty',
      'addPhoneToDisputeRole',
      'addEmailToDisputeRole',
      'restartDisputeRoleEngagement'
    ]),

    handleBeforeClose(done) {
      new Promise((resolve, reject) => {
        if (!this.current) {
          resolve()
        } else {
          reject(new Error('Current is true'))
        }
      }).then(() => {
        this.skip('MAIS TARDE')
      }).catch(() => {
        this.skip('MAIS TARDE')
      }).finally(done)
    },

    update() {
      function setAssociated(contact) {
        return {
          associateWith: 0,
          ...contact
        }
      }
      this.emails = this.metadata.emails.map(setAssociated)
      this.phones = this.metadata.phones.map(setAssociated)
      this.$nextTick(() => {
        this.loading = false
      })
    },

    skip(label) {
      this.$emit('input', label)
      this.loading = true
    },

    handleAssociateContacts() {
      const { id: disputeId } = this.$route.params

      const promisses = []

      this.loading = true

      this.phones.filter(phone => {
        return !!phone.associateWith
      }).map(({ address, associateWith }) => {
        promisses.push(this.addPhoneToDisputeRole({
          disputeId,
          disputeRoleId: associateWith,
          value: address
        }))
      })

      this.emails.filter(email => {
        return !!email.associateWith
      }).map(({ address, associateWith }) => {
        promisses.push(this.addEmailToDisputeRole({
          disputeId,
          disputeRoleId: associateWith,
          value: address
        }))
      })

      return new Promise((resolve, reject) => {
        Promise.all(promisses).then(() => {
          this.loading = false
          this.$emit('input', 'SIM')
          resolve()
        }).catch(reject)
      })
    },

    submit() {
      const { id: disputeId } = this.$route.params

      const ids = [
        ...this.phones.filter(({
          associateWith: id
        }, i, phones) => !!id && phones.findIndex(({
          associateWith
        }) => associateWith === id) === i).map(({
          associateWith
        }) => associateWith),

        ...this.emails.filter(({
          associateWith: id
        }, i, emails) => !!id && emails.findIndex(({
          associateWith
        }) => associateWith === id) === i).map(({
          associateWith
        }) => associateWith)
      ]

      if (ids.length) {
        const msg = 'Detectamos alterações nos dados de contato. Quer reagendar as mensagens da(s) parte(s) para incluir o(s) novo(s) contato(s)?'

        this.$confirm(msg, 'Reengajar', {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false,
          center: true
        }).then(() => {
          this.handleAssociateContacts().then(() => {
            Promise.all(ids.map(disputeRoleId => this.restartDisputeRoleEngagement({
              disputeRoleId,
              disputeId
            })))
          })
        })
      } else {
        this.handleAssociateContacts()
      }
    }
  }
}
</script>

<style lang="scss">
.popover__content {
  padding: 10px 20px;
  max-width: 600px;
  max-height: 216px;
  overflow: auto;
}
.associate-contacts-dialog {
  .el-dialog__body {
    margin: 0px !important;
  }
}
</style>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.popover__content {
  .popover__content-item {
    margin: 10px 0px;

    .popover__content-title {
      font-weight: bold;
      word-wrap: break-word;
    }

    .popover__content-url {
      font-size: 12;
    }
  }
}

.el-dialog {
  .el-dialog__header {
    .dialog-title {
      color: $--color-primary;
      font: normal normal 800 20px/20px Montserrat;
    }
  }

  .el-dialog__body {
    .dialog-body {
      .dialog-body__title {
        display: flex;
        justify-content: flex-start;
        font-size: 16px;
      }
      .dialog-body__content {
        .dialog-body__content-items {
          margin-top: 16px;
          display: flex;
          flex-direction: column;

          .dialog-body__content-label {
            font-weight: bold;
          }
          .dialog-body__content-item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin: 4px 0px;

            .dialog-body__content-item-concainer {
              .el-icon-question {
                color: $--color-primary;
              }
              .dialog-body__item-address {
                font-size: 16px;
              }
            }

            .dialog-body__item-arow {
              background-color: $--color-primary;
              flex: 1;
              height: 2px;
              margin: 0px 8px;
              position: relative;
              &:after {
                content: '';
                right: -4px;
                top: -7px;
                position: absolute;
                display: inline-block;
                vertical-align: middle;
                width: 0;
                height: 0;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
                border-left: 8px solid $--color-primary;
              }
            }

            .dialog-body__item-select {
              width: 300px;
            }
          }
        }

      }
    }
  }

  .el-dialog__footer > span {
    display: flex;
    justify-content: center;
  }
}
</style>
