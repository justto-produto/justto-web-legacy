<template>
  <div
    v-loading="loading"
    class="omnichannel-configurations__container"
  >
    <div class="omnichannel-configurations__container-groupping">
      <label>
        Agrupamento de mensagens:
      </label>

      <el-radio-group
        v-model="groupingType"
        size="small"
      >
        <el-radio label="SUMMARIZED">
          <jus-icon
            icon="summarized-config"
            :is-active="groupingType === 'SUMMARIZED'"
          /> Resumido
        </el-radio>

        <el-radio label="GROUPED">
          <jus-icon
            icon="grouped-config"
            :is-active="groupingType === 'GROUPED'"
          /> Agrupado
        </el-radio>
      </el-radio-group>
    </div>

    <div class="omnichannel-configurations__container-coloring">
      <label>
        Coloração das mensagens:
      </label>

      <el-radio-group
        v-model="coloringType"
        size="small"
      >
        <el-radio label="MONOCHROME">
          <jus-icon
            icon="monochrome-config"
            :is-active="coloringType === 'MONOCHROME'"
          />
        </el-radio>

        <el-radio label="COLORFUL">
          <jus-icon
            icon="colorful-config"
            :is-active="coloringType === 'COLORFUL'"
          />
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({ loading: false }),

  computed: {
    ...mapGetters({ properties: 'userProperties' }),

    groupingType: {
      get() {
        return this.properties?.OMNICHANNEL_GROUPING_TYPE || 'SUMMARIZED'
      },

      set(value) {
        this.loading = true

        this.editProperties({ OMNICHANNEL_GROUPING_TYPE: value }).finally(() => { this.loading = false })

        // TODO [SAAS-5036] Limpar agrupamentos.
        if (value === 'SUMMARIZED') {
          this.clearGroupings()
        }
      }
    },

    coloringType: {
      get() {
        return this.properties?.OMNICHANNEL_COLORING_TYPE || 'MONOCHROME'
      },

      set(value) {
        this.loading = true

        this.editProperties({ OMNICHANNEL_COLORING_TYPE: value }).finally(() => { this.loading = false })
      }
    }
  },

  methods: {
    ...mapActions({
      editProperties: 'setAccountProperty',
      clearGroupings: 'clearAllGroupedOccurreces'
    })
  }
}
</script>

<style lang="scss">
.omnichannel-configurations__container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .omnichannel-configurations__container-groupping {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .el-radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .el-radio__input {
        display: none;
      }

      .el-radio__label {
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;

        img {
          width: 23px;
          height: 23px;
        }
      }
    }
  }

  .omnichannel-configurations__container-coloring {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .el-radio-group {
      text-align: center;
      .el-radio {
        .el-radio__input {
          display: none;
        }
      }
    }
  }
}
</style>
