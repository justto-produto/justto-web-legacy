<template>
  <section
    id="lawyer-datail"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <div
      v-for="(lawyer, index) in lawyers"
      :key="index"
      class="lawyer-datail__list">
      <span class="lawyer-datail__list-image">
        <img
          :src="`data:image/png;base64,${lawyer.photo}`"
          :alt="lawyer.name"
        >
      </span>
      <ul class="lawyer-datail__list-items">
        <li class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            Nome:
          </span>
          <span class="lawyer-datail__item-content">
            {{ lawyer.name.toLowerCase() }}
          </span>
        </li>
        <li
          v-if="lawyer.organization && lawyer.organization !== 'false'"
          class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            Organização:
          </span>
          <span class="lawyer-datail__item-content">
            {{ lawyer.organization.toLowerCase() }}
          </span>
        </li>
        <li
          v-if="lawyer.oab"
          class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            Nº da OAB:
          </span>
          <span class="lawyer-datail__item-content">
            {{ lawyer.oab }}
          </span>
        </li>
        <li
          v-if="lawyer.document"
          class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            CPF:
          </span>
          <span class="lawyer-datail__item-content">
            {{ lawyer.document }}
          </span>
          <el-tooltip content="Usar este CPF">
            <jus-icon
              class="lawyer-datail__item-icon"
              icon="use-field"
            />
          </el-tooltip>
        </li>
        <li
          v-if="lawyer.uf"
          class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            Estado:
          </span>
          <span class="lawyer-datail__item-content">
            {{ lawyer.uf }}
          </span>
        </li>
        <li
          v-if="lawyer.status"
          class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            Situação:
          </span>
          <span class="lawyer-datail__item-content">
            {{ lawyer.status }}
          </span>
        </li>
        <li
          v-if="lawyer.address"
          class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            Endereço:
          </span>
          <span class="lawyer-datail__item-content">
            {{ `${lawyer.address} - ${lawyer.addressNumber} - ${ lawyer.addressComplement }`.toLowerCase() }}
          </span>
        </li>
        <li
          v-if="lawyer.phones"
          class="lawyer-datail__list-item">
          <span class="lawyer-datail__item-title">
            Telefones:
          </span>
          <span class="lawyer-datail__item-content">
            {{ lawyer.phones }}
          </span>
          <el-tooltip content="Usar este telefone">
            <jus-icon
              class="lawyer-datail__item-icon"
              icon="use-field"
            />
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div v-if="!lawyers.length && !loading">
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

#lawyer-datail {
  background-color: $--color-white;

  .lawyer-datail__list {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 100%;
    grid-gap: 10px;

    .lawyer-datail__list-image {
      width: 100%;
      height: 100%;
      img {
        height: 100%;
        margin: auto auto;
        border-radius: 24px;
      }
    }

    .lawyer-datail__list-items {
      padding-inline-start: 0px;
      list-style-type: none;

      .lawyer-datail__list-item {
        .lawyer-datail__item-title {
          font-size: 14px;
          font-weight: bold;
        }

        .lawyer-datail__item-content {
          font-size: 14px;
          text-transform: capitalize !important;
          word-break: break-word;
        }

        .lawyer-datail__item-icon {
          cursor: pointer;
          height: 12px;
        }
      }
    }
  }
}
</style>
