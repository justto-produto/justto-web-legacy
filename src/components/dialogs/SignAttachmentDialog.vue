<template>
  <article class="sign-attachment">
    <el-tooltip
      :open-delay="600"
      content="Assinar anexo"
    >
      <i
        class="overview-attachments__item-icon el-icon-document-checked"
        @click="openDialog"
      />
    </el-tooltip>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      custom-class="sign-attachment__dialog"
      append-to-body
      center
    >
      <div class="sign-attachment__dialog--body">
        <div
          v-if="screen === 0"
          class="sign-attachment__dialog--body__attachemnt-view"
        >
          <h3>
            {{ attachment.name }}
          </h3>
          <h4>
            de {{ attachment.updatedBy || attachment.createdBy }}
          </h4>
        </div>

        <div
          v-if="screen === 1"
          class="sign-attachment__dialog--body__attachemnt-view"
        >
          <pre>
            <!-- {{ roles }} -->
          </pre>
          <pre>
            {{ mappedSignes }}
          </pre>
        </div>
      </div>

      <span slot="footer">
        <el-button
          type="danger"
          plain
          @click="closeDialog"
        >
          Cancelar
        </el-button>

        <el-button
          v-if="screen === 0"
          type="primary"
          @click="nextScreen"
        >
          Escolher Assinantes
        </el-button>

        <el-button
          v-else-if="screen === 1"
          type="primary"
          @click="nextScreen"
        >
          Assinar
        </el-button>

        <el-button
          v-else
          type="primary"
          @click="nextScreen"
        >
          Avançar
        </el-button>

        <!-- <el-button
          type="primary"
          @click="visible = false"
        >
          Confirmar
        </el-button> -->
      </span>
    </el-dialog>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    attachment: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    visible: false,
    screen: 0
  }),

  computed: {
    ...mapGetters({
      roles: 'getCommonDisputeRoles',
      defaultSigners: 'availableSigners'
    }),

    dialogTitle() {
      if (this.screen === 0) {
        return 'Anexo'
      } else if (this.screen === 1) {
        return 'Escolher Assinantes'
      } else return 'Padrão'
    },

    mappedSignes() {
      return [
        ...this.roles.map(p => ({
          defaultSigner: false,
          name: p.name || '',
          emails: p.emails?.map(({ address }) => address) || p.emailsDto?.map(({ address }) => address) || [],
          documentNumber: p.documentNumber
        })),

        ...this.defaultSigners.map(p => ({
          defaultSigner: !!p.__defaultSigner,
          name: p.name || '',
          emails: p.emails || [],
          documentNumber: p.documentNumber
        }))
      ]
    }
  },

  methods: {
    ...mapActions([
      'getDefaultAssigners',
      'getTicketOverviewParty'
    ]),

    openDialog() {
      this.getDefaultAssigners()

      this.roles.forEach(({ disputeRoleId }) => {
        if (disputeRoleId) {
          this.getTicketOverviewParty({
            disputeId: this.$route.params.id,
            disputeRoleId
          })
        } else {
          console.error('disputeRoleId não definido')
        }
      })

      // TODO SAAS-2735 Adicionar validação de status pra saber qual tela iniciar
      this.screen = 0
      this.visible = true

      // 
    },

    closeDialog(event) {
      this.visible = false
    },

    nextScreen(event) {
      this.screen += this.screen >= 0 && this.screen < 2 ? 1 : 0
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-attachment {
  display: inline;
}
</style>
