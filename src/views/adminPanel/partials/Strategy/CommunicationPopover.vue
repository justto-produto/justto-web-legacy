<template>
  <div class="communication-popover">
    <div class="communication-popover__drag-list">
      <el-tree
        :data="data"
        :allow-drop="allowDrop"
        node-key="id"
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

            <jus-icon
              icon="doc"
              class="communication-popover__item-action-icon"
              @click.native="editCommunication(data)"
            />

            <jus-icon
              icon="trash"
              class="communication-popover__item-action-icon"
              @click.native="deleteCommunication(data.id)"
            />
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
          @click="addCommunication(item.key)"
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

export default {
  name: 'CommunicationPopover',
  data() {
    return {
      data: [
        {
          id: 1,
          name: '1º E-mail Advogado',
          communicationType: 'EMAIL',
          message: 'lorem ipsum dolor sit amet',
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
          message: 'lorem ipsum dolor sit amet',
        },
      ],
      editInput: null,
    }
  },
  computed: {
    communicationTypes: () => Object.values(STRATEGY_COMMUNICATION_TYPES),
  },
  methods: {
    allowDrop: (_draggingNode, _dropNode, type) => type !== 'inner',
    translateTypeToIcon: communicationType =>
      STRATEGY_COMMUNICATION_TYPES[communicationType].icon,

    editCommunicationName(communicationId) {
      this.editInput = communicationId

      // Await render input ¯\_(ツ)_/¯
      setTimeout(() => {
        this.$refs[`edit-input-${communicationId}`].$refs.input.focus()
      }, 200)
    },
    editCommunication(communication) {
      this.$emit('edit-communication', communication)
    },
    handleCloseInput() {
      this.editInput = null
    },
    addCommunication(communicationType) {
      // TODO: Remove id generation, when unmock API
      let id = 0
      this.data.map(message => {
        if (message.id >= id) id = message.id + 1
      })

      this.data.push({
        id,
        name: '',
        communicationType,
      })

      return this.editCommunicationName(id)
    },
    deleteCommunication(communicationId) {
      this.data.map((communication, index) => {
        if (communication.id === communicationId) {
          return this.data.splice(index, 1)
        }
      })
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

  .communication-popover__drag-list {
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
