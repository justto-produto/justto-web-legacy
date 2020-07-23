<template>
  <div>
    <el-dialog
      v-if="visible"
      :visible.sync="isVisible"
      :title="communication.name"
      class="communication-editor__dialog"
      width="750px"
    >
      <div class="communication-editor show-toolbar">
        <quill-editor
          ref="messageEditor"
          v-model="communication.body"
          :options="editorOptions"
          class="communication-editor__quill"
          @change="autosave"
        />
      </div>

      <div>
        <JusVariablesCard
          v-if="variables"
          :variables="variables"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'CommunicationEditor',
  components: {
    JusVariablesCard: () => import('@/components/layouts/JusVariablesCard'),
    quillEditor,
  },
  props: {
    communicationTemplate: {
      type: Object,
      default: null,
    },
    communicationId: {
      type: Number,
      required: true,
    },
    strategyId: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      communication: {},
      editorOptions: {
        placeholder: 'Digite a mensagem aqui!',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
          ],
        },
      },
      saveDebounce: () => {},
    }
  },
  computed: {
    ...mapGetters({
      variables: 'getAvaliableVariablesToTemplate',
    }),

    isVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      },
    },
  },
  watch: {
    communicationTemplate(current) {
      if (current) {
        this.communication = current
        // this.$nextTick(() => {
        //   this.$refs.messageEditor.quill.setText(this.communication.body)
        // })
      }
    },
  },
  methods: {
    ...mapActions(['changeCommunicationTemplate']),

    autosave({ _, html, text }) {
      clearTimeout(this.saveDebounce)
      this.saveDebounce = setTimeout(() => {
        this.changeCommunicationTemplate({
          template: this.communication,
          communicationId: this.communicationId,
          strategyId: this.strategyId,
        })
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.communication-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;

  .communication-editor__quill {
    padding: 16px;
  }
}

.communication-editor__resize-icon {
  position: absolute;
  color: $--color-text-secondary;
  font-size: 16px;
  top: 31px;
  right: 53px;
  cursor: pointer;
  &:hover {
    color: $--color-primary
  }
}

</style>

<style lang="scss">
.communication-editor__dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px;
  .el-dialog__body {
    display: flex;
    height: 100%;
  }

  .el-dialog {
    width: 100% !important;
    .el-dialog__body {
      height: calc(100vh - 90px);
    }
  }
}

.show-toolbar {
  .ql-toolbar {
    display: inherit;
  }
}
</style>
