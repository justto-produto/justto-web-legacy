<template>
  <section class="features-modules-container">
    <el-input
      v-model="searchTerm"
      placeholder="Busque pela configuração que deseja, ex: 'minuta' ou 'ofensores'"
      class="features-modules-container__header-input"
    >
      <i
        slot="prefix"
        class="el-input__icon el-icon-search"
      />
    </el-input>
    <article class="features-modules-container__list">
      <div
        v-for="feature in filteredFeatures"
        :key="feature.id"
        class="features-modules-container__card"
      >
        <header class="features-modules-container__header">
          <JusIcon
            :icon="$t(`configurations.${feature.code}.icon`)"
            class="features-modules-container__header-icon"
          />
          <span class="features-modules-container__header-sub">
            {{ $tc('configurations.value', feature.free) | capitalize }}
          </span>
        </header>
        <div class="features-modules-container__body">
          <div class="features-modules-container__body-title">
            {{ feature.name }}
            <el-switch
              v-model="feature.active"
              :disabled="feature.alwaysActive"
              @change="handleToggleConfiguration($event, feature.id, feature.free)"
            />
          </div>
          <highlight
            :queries="[searchTerm]"
            class="features-modules-container__body-description"
          >
            {{ feature.description }}
          </highlight>
          <a
            v-if="hasConfiguration.includes(feature.code)"
            class="features-modules-container__body-button-link"
            @click="openConfigurationsDialog(feature.code)"
          >
            Configurar
          </a>
        </div>
      </div>
    </article>

    <!-- <ApiIntegrationDialog ref="apiIntegrationDialog" /> -->
    <!-- <AutomaticMessagesDialog ref="automaticMessagesDialog" /> -->
    <BadFaithLitigantDialog ref="badFaithLitigantDialog" />
    <CommunicationBlockListDialog ref="communicationBlockListDialog" />
    <DraftManagementDialog ref="draftManagementDialog" />
    <PreNegotiationDialog ref="preNegotiationDialog" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterByTerm } from '@/utils'

export default {
  name: 'FeaturesAndModules',
  components: {
    highlight: () => import('vue-text-highlight'),
    // ApiIntegrationDialog: () => import('./FeaturesAndModulesDialogs/ApiIntegrationDialog'),
    // AutomaticMessagesDialog: () => import('./FeaturesAndModulesDialogs/AutomaticMessagesDialog'),
    BadFaithLitigantDialog: () => import('./FeaturesAndModulesDialogs/BadFaithLitigantDialog'),
    CommunicationBlockListDialog: () => import('./FeaturesAndModulesDialogs/CommunicationBlockListDialog'),
    DraftManagementDialog: () => import('./FeaturesAndModulesDialogs/DraftManagementDialog'),
    PreNegotiationDialog: () => import('./FeaturesAndModulesDialogs/PreNegotiationDialog')
  },
  data: () => ({
    searchTerm: ''
  }),
  computed: {
    ...mapGetters({
      featuresAndModules: 'getFeaturesAndModules'
    }),
    filteredFeatures() {
      return filterByTerm(this.searchTerm, this.featuresAndModules, 'name', 'description')
    },
    hasConfiguration() {
      return [
        // 'API_INTEGRATION',
        // 'AUTOMATIC_MESSAGES',
        'BAD_FAITH_LITIGANT',
        'COMMUNICATION_BLOCK_LIST',
        'DRAFT_MANAGEMENT',
        'PRE_NEGOTIATION'
      ]
    }
  },
  beforeMount() {
    this.getFeaturesAndModules()
  },
  methods: {
    ...mapActions([
      'getFeaturesAndModules',
      'toggleConfiguration'
    ]),

    handleToggleConfiguration(value, featureId, isFree, isActive) {
      const toggleConfiguration = () => {
        this.toggleConfiguration({ value, featureId })
          .then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: `Funcionalidade ${value ? 'ativada' : 'desativada'} com sucesso.`,
              type: 'success'
            })
          }).catch(error => this.$jusNotification({ error }))
      }

      if (value && !isFree) {
        this.$confirm('Você será cobrado pelo uso dessa funcionalidade, tem certeza que deseja ativa-la?', 'Atenção', {
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          cancelButtonClass: 'is-plain',
          type: 'warning'
        }).then(() => toggleConfiguration())
      } else toggleConfiguration()
    },

    openConfigurationsDialog(featureCode) {
      const featureCodeCamelCase = (str) => str.toLowerCase()
        .replace(/([_][a-z])/g, (group) => group.toUpperCase().replace('_', ''))

      this.$refs[featureCodeCamelCase(featureCode) + 'Dialog'].openFeatureDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.features-modules-container {
  .features-modules-container__list {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    .features-modules-container__card {
      width: calc(33.33333% - (48px / 3));
      display: flex;
      flex-direction: column;
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      .features-modules-container__header {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 12px;
        background-color: mix($--color-light-gray, $--color-white, 50%);
        border-radius: 2px 2px 0 0;
        border-bottom: 1px solid #dcdfe6;

        .features-modules-container__header-icon {
          margin: 12px 0;
        }

        .features-modules-container__header-sub {
          position: absolute;
          bottom: 8px;
          right: 12px;
          color: $--color-text-secondary;
          font-weight: 600;
          font-size: 13px;
        }
      }

      .features-modules-container__body {
        padding: 12px;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 12px;
        border-radius: 0 0 2px 2px;

        .features-modules-container__body-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 16px;
        }

        .features-modules-container__body-description {
          color: $--color-text-secondary;
          font-size: 13px;
          flex: 1;
        }

        .features-modules-container__body-button-link {
          justify-content: center;
          display: flex;
          padding: 6px;
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-height: 1400px) {
  .features-modules-container {
    max-width: 1400px;
    margin: auto;
  }
}

@media (max-width: 900px) {
  .features-modules-container {
    .features-modules-container__list {
      gap: 12px;
      margin-top: 12px;

      .features-modules-container__card {
        width: calc(50% - (12px / 2));
      }
    }
  }
}

@media (max-width: 700px) {
  .features-modules-container {
    .features-modules-container__list {
      .features-modules-container__card {
        width: 100%;
      }
    }
  }
}
</style>

<style lang="scss">
.features-modules-container {
  .features-modules-container__header-input {
    margin-top: 3px;

    .el-input__inner {
      line-height: 50px;
      height: 50px;
    }
  }
}

@media (max-width: 900px) {
  .features-modules-container {
    .features-modules-container__header-input {
      margin-top: 0;

      .el-input__inner {
        line-height: 40px;
        height: 40px;
      }
    }
  }
}
</style>
