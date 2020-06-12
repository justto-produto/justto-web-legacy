<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    :title="communicationData.name"
    :class="{
      'communication-editor__dialog--full': inFullScreen,
    }"
    width="750px"
  >
    <div class="communication-editor show-toolbar">
      <quill-editor
        ref="textEditor"
        v-model="communicationData.message"
        :options="editorOptions"
        class="communication-editor__quill"
      />
    </div>

    <div>
      <JusVariablesCard
        v-if="variables"
        :variables="variables"
      />

      <i
        :class="inFullScreen ? 'el-icon-bottom-left' : 'el-icon-top-right'"
        class="communication-editor__resize-icon"
        @click="resize()"
      />
    </div>
  </el-dialog>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'CommunicationEditor',
  components: {
    quillEditor,
    JusVariablesCard: () => import('@/components/layouts/JusVariablesCard'),
  },
  props: {
    communicationData: {
      type: Object,
      default: null,
    },
    variables: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editorOptions: {
        placeholder: 'Digite a mensagem aqui!',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote'],
          ],
        },
      },
      inFullScreen: false,
    }
  },
  computed: {
    modalIsVisible() {
      return this.visible
    },
  },
  methods: {
    resize() {
      this.inFullScreen = !this.inFullScreen
    },
  },
}
</script>

<style lang="scss" scoped>
.communication-editor {
  border: 1px solid #ccc;
  border-radius: 4px;

  .communication-editor__quill {
    padding: 16px;
  }
}

.communication-editor__resize-icon {
  color: #adadad;
  cursor: pointer;
  position: absolute;
  right: 56px;
  top: 32px;
}
</style>

<style lang="scss">
.el-dialog__body {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr auto;
  // super gamb for calc total height of dialog ¯\_(ツ)_/¯
  height: calc(100% - (60px + 57px));
}

.el-dialog {
  transition-duration: .2s;
}

.communication-editor__dialog--full > .el-dialog {
  width: 100% !important;
  height: 100%;
}

.show-toolbar {
  .ql-toolbar {
    display: inherit;
  }
}
</style>
