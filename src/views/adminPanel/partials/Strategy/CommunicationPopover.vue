<template>
  <div class="communication-popover">
    <div class="communication-popover__drag-list">
      <el-tree
        :data="communications"
        :allow-drop="allowDrop"
        draggable
        @node-drop="handleSortCommunications"
      >
        <div
          slot-scope="{ data }"
          class="communication-popover__item"
        >
          <jus-icon icon="menu-hamburger" />

          <div class="communication-popover__item-text-container">
            <jus-icon
              :icon="translateTypeToIcon(data.type)"
              class="communication-popover__message-icon"
            />

            <el-input
              v-if="editInput === data.id"
              :ref="`edit-input-${data.id}`"
              v-model="data.name"
              @keyup.native.enter="handleCloseInput(data)"
              @blur="handleCloseInput(data)"
            />

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

            <el-tooltip content="Editar mensagem">
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
    recipient: {
      type: Object,
      default: null,
    },
    strategyId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editInput: null,
    }
  },
  computed: {
    communications: self => self.recipient.communications,
    communicationTypes: () => {
      const type = {}
      Object.assign(type, STRATEGY_COMMUNICATION_TYPES)
      delete type.EMAIL_CNA

      return Object.values(type)
    },
    emailCount: self => self.recipient.emails,
    recipientName: self => self.recipient.name,
    smsCount: self => self.recipient.sms,
  },
  methods: {
    ...mapActions([
      'addCommunication',
      'deleteCommunication',
      'editCommunicationName',
      'sortCommunications',
    ]),
    allowDrop: (_draggingNode, _dropNode, type) => type !== 'inner',
    translateTypeToIcon: communicationType =>
      STRATEGY_COMMUNICATION_TYPES[communicationType].icon,

    handleEditCommunicationName(communicationId) {
      this.editInput = communicationId
      this.$nextTick(() => this.$refs[`edit-input-${communicationId}`].$refs.input.focus())
    },
    handleCloseInput(communication) {
      this.editInput = null
      console.log(communication)
      this.editCommunicationName({ communication, strategyId: this.strategyId })
    },
    handleEditCommunication(communication) {
      this.$emit('edit-communication', communication.id)
    },
    // handleAddCommunication(communicationType) {
    //   const isDelay = communicationType === 'DELAY'
    //   const newCommunication = {
    //     name: isDelay ? 'Espera 3h' : 'Nova comunicação',
    //     active: true,
    //     duration: isDelay ? 10800 : null,
    //     recipients: [this.recipient.name],
    //     parties: ['CLAIMANT', 'RESPONDENT'],
    //     triggerType: 'ENGAGEMENT',
    //     communicationType,
    //   }

    //   this.addCommunication({ newCommunication, strategyId: this.strategyId }).then(response => {
    //     this.handleEditCommunicationName(response.id)
    //   })
    // },
    handleSortCommunications() {
      const sortedIds = this.recipient.communications.map(c => c.id)
      this.sortCommunications({ sortedIds, strategyId: this.strategyId })
    },
    handleDeleteCommunication(communicationId) {
      this.$confirm('Tem certeza que deseja fazer isso?', 'Excluir mensagem', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }).then(() => this.deleteCommunication({ communicationId, strategyId: this.strategyId }))
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.communication-popover {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 150px;
  width: 600px;
  overflow: hidden;

  .communication-popover__drag-list {
    max-height: calc(100vh - 80px);
    overflow: auto;

    .communication-popover__item {
      align-items: center;
      display: grid;
      grid-template-columns: 32px 1fr auto;
      gap: 24px;
      padding: 16px 0;
      padding-right: 24px;
      width: 100%;

      &:hover
      > .communication-popover__item-actions
      > .communication-popover__item-action-icon {
        display: block;
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
      }

      .communication-popover__item-actions {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(2, auto) 1fr;

        .communication-popover__item-action-icon {
          cursor: pointer;
          display: none;
          height: 18px;
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
