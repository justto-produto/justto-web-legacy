<template>
  <section
    id="lawyer-detail"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <div
      v-for="(lawyer, index) in lawyers"
      :key="index"
      class="lawyer-detail__list"
    >
      <span class="lawyer-detail__list-image">
        <img
          :src="`data:image/png;base64,${lawyer.photo}`"
          :alt="lawyer.name"
        >
      </span>
      <ul class="lawyer-detail__list-items">
        <li class="lawyer-detail__list-item">
          <span class="lawyer-detail__item-title">
            Nome:
          </span>
          <span class="lawyer-detail__item-content">
            {{ lawyer.name.toLowerCase() }}
          </span>
        </li>
        <li
          v-if="lawyer.organization && lawyer.organization !== 'false'"
          class="lawyer-detail__list-item"
        >
          <span class="lawyer-detail__item-title">
            Organização:
          </span>
          <span class="lawyer-detail__item-content">
            {{ lawyer.organization.toLowerCase() }}
          </span>
        </li>
        <li
          v-if="lawyer.document"
          class="lawyer-detail__list-item"
        >
          <span class="lawyer-detail__item-title">
            CPF:
          </span>
          <span class="lawyer-detail__item-content">
            {{ lawyer.document }}
          </span>
          <span @click="handleUseField('documentNumber', lawyer.document)">
            <el-tooltip content="Usar este CPF">
              <jus-icon
                class="lawyer-detail__item-icon"
                icon="use-field"
              />
            </el-tooltip>
          </span>
        </li>
        <li
          v-if="lawyer.oab"
          class="lawyer-detail__list-item"
        >
          <span class="lawyer-detail__item-title">
            Nº da OAB:
          </span>
          <span class="lawyer-detail__item-content">
            {{ lawyer.oab }}
            <span @click="handleUseField('oab', { number: lawyer.oab, state: lawyer.state })">
              <el-tooltip content="Usar esta OAB">
                <jus-icon
                  class="lawyer-detail__item-icon"
                  icon="use-field"
                />
              </el-tooltip>
            </span>
          </span>
        </li>
        <li
          v-if="lawyer.uf"
          class="lawyer-detail__list-item"
        >
          <span class="lawyer-detail__item-title">
            Estado:
          </span>
          <span class="lawyer-detail__item-content">
            {{ lawyer.uf }}
          </span>
        </li>
        <li
          v-if="lawyer.status"
          class="lawyer-detail__list-item"
        >
          <span class="lawyer-detail__item-title">
            Situação:
          </span>
          <span class="lawyer-detail__item-content">
            {{ lawyer.status }}
          </span>
        </li>
        <li
          v-if="lawyer.address"
          class="lawyer-detail__list-item"
        >
          <span class="lawyer-detail__item-title">
            Endereço:
          </span>
          <span class="lawyer-detail__item-content">
            <span>{{ lawyer.address }}</span>
            <span v-if="lawyer.addressNumber"> - {{ lawyer.addressNumber }}</span>
            <span v-if="lawyer.addressComplement"> - {{ lawyer.addressComplement }}</span>
          </span>
        </li>
        <li
          v-if="lawyer.phones.length"
          class="lawyer-detail__list-item"
        >
          <span class="lawyer-detail__item-title">
            Telefones:
          </span>
          <div class="lawyer-detail__list-content">
            <div
              v-for="(phone, phoneIndex) in lawyer.phones"
              :key="phoneIndex"
            >
              {{ phone }}
              <span @click="handleUseField('phone', phone)">
                <el-tooltip content="Usar este telefone">
                  <jus-icon
                    class="lawyer-detail__item-icon"
                    icon="use-field"
                  />
                </el-tooltip>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      v-if="!lawyers.length && !loading"
      class="lawyer-detail__error"
    >
      Não encontramos dados.
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loadingText: 'Estamos buscando os dados no CNA, por favor aguarde.'
    }
  },
  computed: {
    ...mapGetters({
      loading: 'searchLawyersLoading',
      lawyers: 'searchedLawyers'
    })
  },
  methods: {
    handleUseField(field, value) {
      this.$emit('update', { field, value })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

#lawyer-detail {
  background-color: $--color-white;
  padding: 0px 5px;

  min-height: 20vh;
  max-height: 35vh;
  overflow-y: auto;
  overflow-x: visible;

  .lawyer-detail__list {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 100%;
    grid-gap: 5px;

    .lawyer-detail__list-image {
      width: 100%;
      height: 100%;

      img {
        margin: auto 0px;
        width: 100%;
        border-radius: 8px;
      }
    }

    .lawyer-detail__list-items {
      padding-inline-start: 0px;
      list-style-type: none;

      .lawyer-detail__list-item {
        display: grid;
        grid-template-columns: 40% 60%;
        grid-template-rows: 100%;
        grid-gap: 5px;

        .lawyer-detail__item-title {
          font-size: 13px;
          font-weight: bold;
        }

        .lawyer-detail__item-content {
          font-size: 13px;
          text-transform: capitalize !important;
          word-break: break-word;

          div {
            img {
              cursor: pointer;
              height: 12px !important;
            }
          }
        }

        .lawyer-detail__item-icon {
          cursor: pointer;
          height: 12px !important;
        }
      }
    }
  }

  .lawyer-detail__error {
    width: 100%;
    height: 20vh;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
