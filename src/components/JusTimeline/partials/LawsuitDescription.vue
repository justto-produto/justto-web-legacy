<template>
  <el-container class="lawsuit-description">
    <div class="lawsuit-description__container-info">
      <div
        v-if="state.date"
        class="lawsuit-description__info"
      >
        <strong class="lawsuit-description__info-title">Distribuído em</strong>
        <span class="lawsuit-description__info-text">{{ state.date }}</span>
      </div>

      <div
        v-if="state.area"
        class="lawsuit-description__info"
      >
        <strong class="lawsuit-description__info-title">Área</strong>
        <span class="lawsuit-description__info-text">{{ state.area }}</span>
      </div>

      <div
        v-if="state.source"
        class="lawsuit-description__info"
      >
        <strong class="lawsuit-description__info-title">Origem</strong>
        <span class="lawsuit-description__info-text">{{ state.source }}</span>
      </div>
      <div
        v-if="!!state.urlDocuments && state.urlDocuments.length"
        class="lawsuit-description__info"
      >
        <strong class="lawsuit-description__info-title">Documentos</strong>
        <el-link
          class="lawsuit-description__info-download"
          :href="state.urlDocuments[0]"
          :underline="false"
        >
          Baixar
          <jus-icon
            class="lawsuit-description__document-download"
            icon="download-sheet"
          />
        </el-link>
      </div>
    </div>

    <div class="lawsuit-description__container-parties">
      <div class="lawsuit-description__container-party">
        <div class="lawsuit-description__party-title">
          Parte(s)
        </div>
        <el-collapse class="lawsuit-description__party-collapse">
          <el-collapse-item
            v-for="(party, partyIndex) in state.parties"
            :key="`party-${partyIndex}`"
            class="lawsuit-description__party-items collapse-item__left-arrow"
          >
            <div
              slot="title"
              class="lawsuit-description__party-name"
            >
              {{ party.name }}
            </div>
            <ul class="lawsuit-description__party-list">
              <li
                v-if="party.type"
                class="lawsuit-description__party-info"
              >
                Tipo: {{ party.type }}
              </li>
              <li
                v-if="party.profile"
                class="lawsuit-description__party-info"
              >
                Polo: {{ party.profile }}
              </li>
              <li
                v-if="party.document"
                class="lawsuit-description__party-info"
              >
                Documento: {{ party.document }}
              </li>
              <a
                v-if="!isDisputePart(party) && !alreadyAdded(party)"
                class="jus-timeline__lawsuit-new-part"
                @click="addPart(party)"
              >
                Cadastrar parte
              </a>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="lawsuit-description__container-party">
        <div class="lawsuit-description__party-title">
          Advogado(s)
        </div>
        <el-collapse class="lawsuit-description__party-collapse">
          <el-collapse-item
            v-for="(lawyer, lawyerIndex) in state.lawyers"
            :key="`lawyer-${lawyerIndex}`"
            class="lawsuit-description__party-items collapse-item__left-arrow"
          >
            <div
              slot="title"
              class="lawsuit-description__party-name"
            >
              {{ lawyer.name }}
            </div>
            <ul class="lawsuit-description__party-list">
              <li
                v-if="lawyer.oab"
                class="lawsuit-description__party-info"
              >
                OAB: {{ lawyer.oab }}
              </li>
              <li
                v-if="lawyer.partyName"
                class="lawsuit-description__party-info"
              >
                Parte: {{ lawyer.partyName.toLowerCase() }}
              </li>
              <a
                v-if="!isDisputeLawyer(lawyer) && !alreadyAdded(lawyer)"
                class="jus-timeline__lawsuit-new-part"
                @click="addLawyer(lawyer)"
              >
                Cadastrar parte
              </a>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isSimilarStrings, normalizeString } from '@/utils'

import brazilianStates from '@/constants/brazilianStates'

export default {
  components: {
    jusIcon: () => import('@/components/images/JusIcon')
  },

  props: {
    lawsuitDispute: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    addedParts: []
  }),

  computed: {
    ...mapGetters({
      dispute: 'dispute',
      isRecovery: 'isWorkspaceRecovery',
      negotiationParts: 'getTicketOverviewParties'
    }),

    state() {
      return this.lawsuitDispute
    },

    disputeParts() {
      return window.location.href.includes('/negotiation') ? this.negotiationParts : this.dispute.disputeRoles
    }
  },

  methods: {
    ...mapActions([
      'setTicketOverviewParty'
    ]),

    addPart({ document = '', type = '', name }) {
      const disputeId = this.$route.params.id
      const polarity = this.isClaimant(type) ? 'CLAIMANT' : 'RESPONDENT'
      const data = {
        party: polarity,
        documentNumber: document,
        name,
        main: true,
        roles: ['PARTY']
      }
      this.setTicketOverviewParty({ disputeId, data, isNew: true }).then(part => {
        this.$emit('add:part', part)
        this.$jusNotification({
          title: 'Yay!',
          message: 'Parte cadastrada com sucesso!',
          type: 'success'
        })
        this.addedParts.push(data.name)
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },

    addLawyer({ name = '', document = '', oab = '', partyName = '' }) {
      const disputeId = this.$route.params.id
      const { type } = this.state.parties.find(p => isSimilarStrings(partyName, p.name, 75)) || {
        type: ['autor', 'ativo'].includes(normalizeString(partyName)) ? 'ATIVO' : 'PASSIVO'
      }

      // TODO: Inverter ternário para Workspace de cobrança;
      const party = this.isClaimant(type) ? 'CLAIMANT' : 'RESPONDENT'

      const state = brazilianStates.find(({ value: uf }) => (oab || '').includes(uf))?.value || null
      const [oabNumber] = oab?.length ? ((oab || '').replace(state, '').match(/[\dA-Z]+/g) || []).join('').match(/[\dABENP]+/g) : ''
      const number = oabNumber.length > 6 ? oabNumber.slice(oabNumber.length - 6) : oabNumber

      const data = {
        oabs: (oab === '' || !oab) ? [] : [{ number, state }],
        documentNumber: document || null,
        roles: ['LAWYER'],
        main: true,
        party,
        name
      }

      this.setTicketOverviewParty({ disputeId, data, isNew: true }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Parte cadastrada com sucesso!',
          type: 'success'
        })
        this.addedParts.push(data.name)
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },

    isClaimant(type) {
      const isAuthor = ['ATIVO', 'AUTOR', 'REQUERENTE'].includes(type.toUpperCase())

      return this.isRecovery ? !isAuthor : isAuthor
    },

    isDisputePart({ name = '', document = '' }) {
      const cleanDoc = (doc = '') => (doc || '').replace(/\D+/g, '')

      const isPart = (this.disputeParts || []).filter(disputePart => {
        return isSimilarStrings(disputePart.name?.toLowerCase(), name?.toLowerCase(), 75) ||
          (!!document && cleanDoc(disputePart.documentNumber) === cleanDoc(document))
      }).length > 0
      return isPart || false
    },

    isDisputeLawyer({ name = '' }) {
      const isDisputePart = (this.disputeParts || []).filter(disputePart => {
        return isSimilarStrings(name, disputePart.name, 75)
      }).length > 0
      return isDisputePart || false
    },

    alreadyAdded({ name }) {
      return this.addedParts.includes(name)
    }
  }
}
</script>

<style lang="scss">
.el-collapse-item__header {
  height: auto;
  margin: 8px;
}

.el-collapse-item__content {
  padding-bottom: 0px;
}

.lawsuit-description__document-download {
  height: 16px;
}

.lawsuit-description__party-collapse {
  margin: 0 !important;

  .collapse-item__left-arrow {
    div[role='tab'] {
      .el-collapse-item__header {
        margin: 8px 0 !important;
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;

        .el-collapse-item__arrow {
          margin: 0px;
          margin-right: 4px;
        }
      }
    }

    div[role='tabpanel'] {
      margin-left: 16px !important;
    }
  }
}

</style>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.lawsuit-description {
  width: 100%;
  border: solid lightgray thin;
  border-radius: 8px;
  padding: 16px;
  background-color: white;

  display: flex;
  flex-direction: column;

  .lawsuit-description__container-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .lawsuit-description__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 8px;
      width: 25%;

      .lawsuit-description__info-title {
        text-align: left;
        font-size: 14px;
        color: #424242;
      }

      .lawsuit-description__info-text {
        text-transform: capitalize;
        font-size: 14px;
        color: #a3a3a3;
      }

      .lawsuit-description__info-download {
        padding: 0px;
        justify-content: flex-start;

        .el-link--inner {
          .lawsuit-description__document-download {
            height: 16px;
          }
        }
      }
    }
  }

  .lawsuit-description__container-parties {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 900px) {
      flex-direction: column;
      gap: 18px;
    }

    .lawsuit-description__container-party {

      .lawsuit-description__party-title {
        font-size: 14px;
        font-weight: 700;
        color: $--color-text-primary;
      }

      .lawsuit-description__party-collapse {
        margin-left: 8px;
        .lawsuit-description__party-items {
          .lawsuit-description__party-name {
            font-size: 12px;
            line-height: 14px;
            font-weight: 600;
            color: $--color-text-primary;
          }

          .lawsuit-description__party-list {
            padding-left: 20px;

            .lawsuit-description__party-info {
              font-size: 12px;
              line-height: 14px;
              color: $--color-text-secondary;
            }
          }
        }
      }
    }
  }
}
</style>
