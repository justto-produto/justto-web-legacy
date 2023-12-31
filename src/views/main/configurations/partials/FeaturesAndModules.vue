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
            <span>
              {{ $tc('configurations.value', feature.free) | capitalize }}
            </span>
          </span>
        </header>

        <div class="features-modules-container__body">
          <div class="features-modules-container__body-title">
            {{ feature.name }}

            <el-switch
              v-show="!feature.alwaysActive"
              v-model="feature.active"
              :disabled="feature.alwaysActive"
              @change="handleToggleConfiguration($event, feature.id, feature.free)"
            />
          </div>

          <highlight
            :queries="[searchTerm]"
            class="features-modules-container__body-description"
            v-html="feature.description"
          />

          <a
            v-if="feature.active && hasConfiguration.includes(feature.code)"
            class="features-modules-container__body-button-link"
            @click="openConfigurationsDialog(feature.code)"
          >
            Configurar
          </a>

          <a
            v-else-if="hasConfiguration.includes(feature.code)"
            class="features-modules-container__body-button-link"
          >
            <el-tooltip
              content="Recurso não está habilitado!"
              placement="top"
              :open-delay="500"
            >
              <span>Configurar</span>
            </el-tooltip>
          </a>
        </div>
      </div>
    </article>

    <ApiIntegrationDialog
      v-if="getFeatureIdByCode('API_INTEGRATION')"
      ref="apiIntegrationDialog"
      :feature="getFeatureIdByCode('API_INTEGRATION')"
    />
    <AutomaticMessagesDialog ref="automaticMessagesDialog" />
    <CustomizeOdrAddressDialog ref="customizeOdrAddressDialog" />
    <BadFaithLitigantDialog ref="badFaithLitigantDialog" />
    <CommunicationBlockListDialog ref="communicationBlockListDialog" />
    <DraftManagementDialog ref="draftManagementDialog" />
    <PreNegotiationDialog ref="preNegotiationDialog" />
    <ClosingReasons ref="closingReasonsDialog" />
    <DraftNotifications ref="draftNotificationsDialog" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterByTerm } from '@/utils'

export default {
  name: 'FeaturesAndModules',
  components: {
    highlight: () => import('vue-text-highlight'),
    ApiIntegrationDialog: () => import('./FeaturesAndModulesDialogs/ApiIntegrationDialog'),
    AutomaticMessagesDialog: () => import('./FeaturesAndModulesDialogs/AutomaticMessagesDialog'),
    CustomizeOdrAddressDialog: () => import('./FeaturesAndModulesDialogs/CustomizeOdrAddressDialog'),
    BadFaithLitigantDialog: () => import('./FeaturesAndModulesDialogs/BadFaithLitigantDialog'),
    CommunicationBlockListDialog: () => import('./FeaturesAndModulesDialogs/CommunicationBlockListDialog'),
    DraftManagementDialog: () => import('./FeaturesAndModulesDialogs/DraftManagementDialog'),
    PreNegotiationDialog: () => import('./FeaturesAndModulesDialogs/PreNegotiationDialog'),
    ClosingReasons: () => import('./FeaturesAndModulesDialogs/ClosingReasons'),
    DraftNotifications: () => import('./FeaturesAndModulesDialogs/DraftNotificationsDialog')
  },

  data: () => ({
    searchTerm: ''
  }),

  computed: {
    ...mapGetters({
      featuresAndModules: 'getFeaturesAndModules',
      isJusttoAdmin: 'isJusttoAdmin'
    }),

    filteredFeatures() {
      return filterByTerm(this.searchTerm, this.featuresAndModules, 'name', 'description')
    },

    hasConfiguration() {
      return [
        ...[
          'CUSTOMIZE_ODR_ADDRESS',
          'CONFIGURE_CUSTOMIZATIONS',
          'BAD_FAITH_LITIGANT',
          'COMMUNICATION_BLOCK_LIST',
          'DRAFT_MANAGEMENT',
          'PRE_NEGOTIATION',
          'AUTOMATIC_MESSAGES',
          'CLOSING_REASONS',
          'DRAFT_NOTIFICATIONS'
        ],
        ...(this.isJusttoAdmin ? ['API_INTEGRATION'] : [])
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

    getFeatureIdByCode(code) {
      return this.filteredFeatures.find(item => item.code === code)?.id
    },

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
          type: 'warning'
        }).then(() => toggleConfiguration())
      } else toggleConfiguration()
    },

    openConfigurationsDialog(featureCode) {
      const featureCodeCamelCase = (str) => str.toLowerCase()
        .replace(/([_][a-z])/g, (group) => group.toUpperCase().replace('_', ''))

      const ref = featureCodeCamelCase(featureCode) + 'Dialog'

      if (this.$refs[ref]) {
        this.$refs[ref].openFeatureDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.features-modules-container {
  padding-bottom: 24px;

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

          width: 40px;
          height: 40px;
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
  }
}

@media (max-width: 900px) {
  .features-modules-container {
    .features-modules-container__header-input {
      margin-top: 0;
    }
  }
}
</style>
