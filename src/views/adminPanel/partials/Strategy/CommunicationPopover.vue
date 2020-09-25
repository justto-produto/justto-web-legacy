<template>
  <div class="communication-popover">
    <div class="communication-popover__drag-list">
      <el-tree
        :data="communications"
        :allow-drop="allowDrop"
        draggable
        node-key="id"
        @node-drop="handleSortCommunications"
      >
        <div
          v-if="data"
          slot-scope="{ data }"
          class="communication-popover__item"
        >
          <jus-icon
            class="communication-popover__menu-hamburger"
            icon="menu-hamburger"
          />

          <div class="communication-popover__recipients">
            <el-tooltip
              v-if="data.type !== 'DELAY'"
              content="Autor"
            >
              <i
                :class="{ 'is-inactive-recipient': !isRecipient(data.recipients, 'PARTY') }"
                class="el-icon-user-solid"
                @click="handleCommunicationRecipient(data, 'PARTY')"
              />
            </el-tooltip>
            <el-tooltip
              v-if="data.type !== 'DELAY'"
              content="Advogado"
            >
              <i
                :class="{ 'is-inactive-recipient': !isRecipient(data.recipients, 'LAWYER') }"
                class="el-icon-s-custom"
                @click="handleCommunicationRecipient(data, 'LAWYER')"
              />
            </el-tooltip>
          </div>

          <div class="communication-popover__item-text-container">
            <jus-icon
              :icon="translateTypeToIcon(data.type)"
              class="communication-popover__message-icon"
            />

            <el-input
              v-if="editInput === data.id && data.type !== 'DELAY'"
              :ref="`edit-input-${data.id}`"
              v-model="data.name"
              @keyup.native.enter="handleCloseInput(data)"
              @blur="handleCloseInput(data)"
            />

            <div v-else-if="editInput === data.id && data.type === 'DELAY'">
              <span>Espera</span>

              <el-input
                :ref="`edit-input-${data.id}`"
                v-model="data.duration"
                :min="1"
                :step="1"
                type="number"
                class="communication-popover__delay-time-input"
                @keyup.native.enter="handleCloseInput(data)"
                @blur="handleCloseInput(data)"
              />

              <span>horas</span>
            </div>

            <span v-else>
              {{ data.name }}
            </span>
          </div>
          <div class="communication-popover__item-actions">
            <el-tooltip content="Editar título">
              <jus-icon
                icon="edit"
                class="communication-popover__item-action-icon"
                @click.native="handleEditCommunicationName(data.id)"
              />
            </el-tooltip>

            <el-tooltip
              v-if="data.type !== 'DELAY'"
              content="Editar mensagem"
            >
              <jus-icon
                icon="doc"
                class="communication-popover__item-action-icon"
                @click.native="handleEditCommunication(data)"
              />
            </el-tooltip>

            <el-tooltip content="Excluir mensagem">
              <jus-icon
                icon="trash"
                class="communication-popover__item-action-icon"
                @click.native="handleDeleteCommunication(data.id)"
              />
            </el-tooltip>
          </div>
        </div>
      </el-tree>
    </div>

    <div class="communication-popover__message-types">
      <span class="communication-popover__title">
        Novo
      </span>

      <ul class="communication-popover__message-types-list">
        <li
          v-for="(item, index) in communicationTypes"
          :key="index"
          class="communication-popover__message-types-item"
          @click="handleAddCommunication(item.key)"
        >
          <jus-icon
            :icon="item.icon"
            class="communication-popover__message-types-icon"
          />

          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { STRATEGY_COMMUNICATION_TYPES } from '@/constants/strategy'
import { mapActions } from 'vuex'

export default {
  name: 'CommunicationPopover',
  props: {
    triggers: {
      type: Object,
      default: null
    },
    strategyId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      editInput: null
    }
  },
  computed: {
    recipient() {
      if (this.triggers.ENGAGEMENT) {
        return {
          communications: this.triggers.ENGAGEMENT.communications
        }
      } else {
        return {
          communications: []
        }
      }
    },
    communications: self => self.recipient.communications,
    communicationTypes: () => {
      const type = {}
      Object.assign(type, STRATEGY_COMMUNICATION_TYPES)
      delete type.EMAIL_CNA
      delete type.WHATSAPP
      delete type.UNKNOW

      return Object.values(type)
    },
    emailCount: self => self.recipient.emails,
    recipientName: self => self.recipient.name,
    smsCount: self => self.recipient.sms
  },
  methods: {
    ...mapActions([
      'addCommunication',
      'deleteCommunication',
      'editCommunication',
      'sortCommunications'
    ]),

    isRecipient: (recipients, recipient) => recipients.includes(recipient),

    allowDrop: (_draggingNode, _dropNode, type) => type !== 'inner',

    translateTypeToIcon: communicationType => (STRATEGY_COMMUNICATION_TYPES[communicationType])
      ? STRATEGY_COMMUNICATION_TYPES[communicationType].icon
      : STRATEGY_COMMUNICATION_TYPES.UNKNOW.icon,

    handleEditCommunicationName(communicationId) {
      this.editInput = communicationId
      this.$nextTick(() => this.$refs[`edit-input-${communicationId}`].focus())
    },

    handleCloseInput(communication) {
      if (communication.type === 'DELAY') {
        const delay = communication.duration
        const days = parseInt((delay / 24).toFixed())
        const hours = delay % 24
        const daysText = `${days} dia${days > 1 ? 's' : ''}`
        const hoursText = `${hours} hora${hours > 1 ? 's' : ''}`
        communication.name = `Espera ${days ? daysText : ''} ${days && hours ? 'e' : ''} ${hours ? hoursText : ''}`
      }

      this.editInput = null
      this.editCommunication({ communication, strategyId: this.strategyId })
    },

    handleEditCommunication(communication) {
      this.$emit('edit-communication', communication)
    },

    handleAddCommunication(communicationType) {
      const isDelay = communicationType === 'DELAY'
      const newCommunication = {
        name: isDelay ? 'Espera 3h' : 'Nova comunicação',
        active: true,
        duration: isDelay ? 3 : null,
        recipients: [],
        parties: ['CLAIMANT'],
        triggerType: 'ENGAGEMENT',
        type: communicationType
      }

      this.addCommunication({ newCommunication, strategyId: this.strategyId }).then(response => {
        this.handleEditCommunicationName(response.id)
      })
    },

    handleCommunicationRecipient(communication, recipient) {
      if (this.isRecipient(communication.recipients, recipient)) {
        const recipientIndex = communication.recipients.findIndex(r => r === recipient)
        communication.recipients.splice(recipientIndex, 1)
      } else {
        communication.recipients.push(recipient)
      }
      this.editCommunication({ communication, strategyId: this.strategyId, trigger: 'ENGAGEMENT' })
    },

    handleSortCommunications() {
      const sortedIds = this.recipient.communications.map(c => c.id)
      this.sortCommunications({ sortedIds, strategyId: this.strategyId })
    },

    handleDeleteCommunication(communicationId) {
      this.$confirm('Tem certeza que deseja fazer isso?', 'Excluir mensagem', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => this.deleteCommunication({ communicationId, strategyId: this.strategyId, trigger: 'ENGAGEMENT' }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.communication-popover {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 150px;
  width: 700px;
  overflow: hidden;

  .communication-popover__drag-list {
    max-height: calc(100vh - 80px);
    overflow: auto;

    .communication-popover__item {
      align-items: center;
      display: grid;
      grid-template-columns: 18px 38px 1fr auto;
      gap: 16px;
      padding: 16px 0;
      padding-right: 24px;
      width: 100%;

      &:hover
      > .communication-popover__item-actions
      > .communication-popover__item-action-icon {
        display: block;
      }

      .communication-popover__menu-hamburger {
        width: 18px;
      }

      .communication-popover__recipients {
        .el-icon-user-solid, .el-icon-s-custom {
          cursor: pointer;
          font-size: 18px;
          margin-left: 2px;

          &.is-inactive-recipient {
            color: $--color-text-secondary;
          }
        }

      }

      .communication-popover__item-text-container {
        align-items: center;
        display: flex;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;

        .communication-popover__message-icon {
          width: 18px;
          margin-right: 8px;
        }

        .communication-popover__delay-time-input {
          margin: 0 8px;
          width: 150px;
        }

        .communication-popover__delay-unit-input {
          margin-left: 8px;
          width: 120px;
        }
      }

      .communication-popover__item-actions {
        display: flex;

        .communication-popover__item-action-icon {
          cursor: pointer;
          display: none;
          height: 18px;
          margin-left: 8px;

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }

  .communication-popover__message-types {
    .communication-popover__title {
      font-size: 18px;
      font-weight: 700;
      display: block;
      margin-bottom: 8px;
    }

    .communication-popover__message-types-list {
      list-style: none;
      margin: 0;
      padding: 0;

      .communication-popover__message-types-item {
        align-items: center;
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: auto 1fr;
        padding: 8px;

        &:hover {
          background-color: $--color-primary-light-9;
        }

        .communication-popover__message-types-icon {
          width: 18px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.communication-popover__drag-list {
  .el-tree-node {
    padding: 8px 0;

    &:hover {
      background-color: $--color-primary-light-8;

      .el-tree-node__content {
        background-color: $--color-primary-light-8;
      }
    }

    &:nth-child(odd) {
      background-color: $--color-primary-light-9;

      &:hover {
        background-color: $--color-primary-light-8;

        .el-tree-node__content {
          background-color: $--color-primary-light-8;
        }
      }

      .el-tree-node__content {
        background-color: $--color-primary-light-9;
      }
    }

    .el-tree-node__content {
      cursor: move;
    }
  }
}
</style>
