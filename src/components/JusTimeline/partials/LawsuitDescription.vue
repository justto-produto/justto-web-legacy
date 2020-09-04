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
            class="lawsuit-description__party-items"
          >
            <div
              slot="title"
              class="lawsuit-description__party-name">
              {{ party.name }}
            </div>
            <ul class="lawsuit-description__party-list">
              <li
                v-if="party.type"
                class="lawsuit-description__party-info">
                Tipo: {{ party.type }}
              </li>
              <li
                v-if="party.profile"
                class="lawsuit-description__party-info">
                Polo: {{ party.profile }}
              </li>
              <li
                v-if="party.document"
                class="lawsuit-description__party-info">
                Documento: {{ party.document }}
              </li>
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
            class="lawsuit-description__party-items"
          >
            <div
              slot="title"
              class="lawsuit-description__party-name">
              {{ lawyer.name }}
            </div>
            <ul class="lawsuit-description__party-list">
              <li
                v-if="lawyer.oab"
                class="lawsuit-description__party-info">
                OAB: {{ lawyer.oab }}
              </li>
              <li
                v-if="lawyer.partyName"
                class="lawsuit-description__party-info">
                Parte: {{ lawyer.partyName.toLowerCase() }}
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  components: {
    jusIcon: () => import('@/components/images/JusIcon'),
  },
  props: {
    lawsuitDispute: {
      type: Object,
      required: true,
    },
  },
  computed: {
    state() {
      return this.lawsuitDispute
    },
  },
}
</script>

<style>
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
</style>

<style lang="scss" scoped>

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

    .lawsuit-description__info {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
      width: 25%;

      .lawsuit-description__info-title {
        text-align: left;
        font: normal normal 800 14px/18px Montserrat;
        letter-spacing: 0.14px;
        color: #424242;
      }

      .lawsuit-description__info-text {
        text-transform: capitalize;
        font: normal normal medium 14px/26px Montserrat;
        letter-spacing: 0px;
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

    .lawsuit-description__container-party {
      min-width: 45%;
      .lawsuit-description__party-title {
        font: normal normal 800 14px/18px Montserrat;
        letter-spacing: 0.14px;
        color: #424242;
      }
      .lawsuit-description__party-collapse {
        margin-left: 8px;
        .lawsuit-description__party-items {
          .lawsuit-description__party-name {
            font: normal normal 600 12px/17px Montserrat;
          }
          .lawsuit-description__party-list {
            padding-left: 20px;
            .lawsuit-description__party-info {
              font: normal normal 600 12px/17px Montserrat;
              color: #A3A3A3;
              letter-spacing: 0px;
              text-transform: capitalize;

            }
          }
        }
      }
    }
  }
}
</style>