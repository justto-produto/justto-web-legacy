<template>
  <section class="whatsapp-views">
    <div class="whatsapp-views__status">
      <el-result
        :title="wallet.status"
        :sub-title="wallet.message || ''"
      >
        <template slot="icon">
          <h2>
            {{ wallet.balance | currency }}
          </h2>
        </template>
      </el-result>
    </div>

    <ul class="whatsapp-views__templates">
      <li
        v-for="(template, tIndex) in templatesFiltered"
        :key="`template-${tIndex}`"
        class="whatsapp-views__templates-item"
      >
        <el-descriptions
          :title="template.vertical"
          :column="2"
          border
        >
          <el-descriptions-item
            label="ID"
            :span="2"
          >
            {{ template.id }}
          </el-descriptions-item>

          <el-descriptions-item
            label="Criado"
            :span="template.modifiedOn ? 1 : 2"
          >
            {{ template.createdOn | moment('DD/MM/YY [ às ] HH:mm') }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="template.modifiedOn"
            label="Editado"
          >
            {{ template.modifiedOn | moment('DD/MM/YY [ às ] HH:mm') }}
          </el-descriptions-item>

          <el-descriptions-item label="Status">
            <el-tag size="small">
              {{ template.status }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="Categoria">
            {{ template.category }}
          </el-descriptions-item>

          <el-descriptions-item
            label="Template"
            :span="2"
          >
            {{ template.data }}
          </el-descriptions-item>

          <el-descriptions-item
            label="Exemplo"
            :span="2"
          >
            {{ getMeta(template.meta) }}
          </el-descriptions-item>
        </el-descriptions>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'WhatsappViews',

  computed: {
    ...mapGetters({
      templates: 'getTemplates',
      wallet: 'getWallet'
    }),

    templatesFiltered() {
      return this.templates?.templates.filter(({ status }) => !['REJECTED'].includes(status)).sort((a, b) => {
        return b.createdOn - a.createdOn
      })
    }
  },

  beforeCreate() {
    if (!this.$store.getters.isJusttoAdmin) {
      this.$router.go(-1)
    }
  },

  beforeMount() {
    this.getTemplates()
  },

  methods: {
    ...mapActions({
      getWhatsAppTemplates: 'getGupShupTemplates',
      getWhatsAppWallet: 'getGupShupWalletStatus'
    }),

    async getTemplates() {
      await this.getWhatsAppWallet()
      await this.getWhatsAppTemplates()
    },

    getMeta(text) {
      return JSON.parse(text || '{"exemple": ""}').example
    }
  }
}
</script>

<style lang="scss">
.whatsapp-views {
  width: 100%;
  padding-left: 16px;

  .whatsapp-views__status {
    text-align: center;

    .el-result {
      .el-result__icon {
        h2 {
          margin: 0;
        }
      }
    }
  }

  .whatsapp-views__templates {
    margin: 8px;
    padding: 0px;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 16px 8px;

    .whatsapp-views__templates-item {
      width: calc(50% - 8px);
      border: solid #ebeef5 thin;
      padding: 16px 8px;
      border-radius: 10px;

      .el-descriptions {
        .el-descriptions__header {
          justify-content: center;
        }
      }

      @media (max-width: 1200px) {
        width: calc(100% - 16px);
      }

      @media (min-width: 1920px) {
        width: 30%;
      }
    }
  }
}
</style>
