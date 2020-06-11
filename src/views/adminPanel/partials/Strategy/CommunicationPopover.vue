<template>
  <div class="communication-popover">
    <div class="communication-popover__drag-list">
      <el-tree
        :data="data"
        :allow-drop="allowDrop"
        node-key="id"
        default-expand-all
        draggable
      >
        <div
          slot-scope="{ data }"
          class="communication-popover__item"
        >
          <jus-icon icon="menu-hamburger" />
          <div class="communication-popover__item-text-container">
            <jus-icon
              :icon="translateTypeToIcon(data.communicationType)"
              class="communication-popover__message-icon"
            />
            <el-input
              v-if="editInput === data.id"
              :ref="`edit-input-${data.id}`"
              v-model="data.name"
              @keyup.native.enter="handleCloseInput"
              @blur="handleCloseInput"
            />
            <span v-else>
              {{ data.name }}
            </span>
          </div>
          <div class="communication-popover__item-actions">
            <jus-icon
              icon="edit"
              class="communication-popover__item-action-icon"
              @click.native="editCommunicationName(data.id)"
            />
          </div>
        </div>
      </el-tree>
    </div>

    <div class="communication-popover__message-types">
      <span class="communication-popover__title">
        Novo
      </span>
    </div>
  </div>
</template>

<script>
import { STRATEGY_COMMUNICATION_TYPES } from '@/constants/strategy'

export default {
  name: 'CommunicationPopover',
  data() {
    return {
      data: [
        {
          id: 1,
          name: '1º E-mail Advogado',
          communicationType: 'EMAIL',
        },
        {
          id: 2,
          name: 'Espera 3 horas',
          communicationType: 'DELAY',
        },
        {
          id: 3,
          name: 'Envia SMS para Advogado',
          communicationType: 'SMS',
        },
      ],
      editInput: null,
    }
  },
  methods: {
    allowDrop: (_draggingNode, _dropNode, type) => type !== 'inner',
    translateTypeToIcon: communicationType => STRATEGY_COMMUNICATION_TYPES[communicationType],

    editCommunicationName(communicationId) {
      this.editInput = communicationId

      // Await render input ¯\_(ツ)_/¯
      setTimeout(() => {
        this.$refs[`edit-input-${communicationId}`].$refs.input.focus()
      }, 200)
    },
    handleCloseInput() {
      this.editInput = null
    },
  },
}
</script>

<style lang="scss" scoped>
.communication-popover {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 150px;
  width: 600px;

  .communication-popover__drag-list {
    .communication-popover__item {
      align-items: center;
      display: grid;
      grid-template-columns: 32px 1fr 72px;
      gap: 24px;
      padding: 16px 0;
      padding-right: 24px;
      width: 100%;

      .communication-popover__item-text-container {
        align-items: center;
        display: flex;

        .communication-popover__message-icon {
          width: 18px;
          margin-right: 8px;
        }
      }

      .communication-popover__item-action-icon {
        cursor: pointer;
      }
    }
  }

  .communication-popover__message-types {
    .communication-popover__title {
      font-size: 18px;
      font-weight: 700;
      display: block;
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
