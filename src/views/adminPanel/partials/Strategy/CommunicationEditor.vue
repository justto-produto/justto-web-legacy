<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    :title="communicationData.name"
    width="750px"
  >
    <div class="communication-editor">
      <quill-editor
        ref="textEditor"
        v-model="communicationData.message"
        :options="editorOptions"
        class="communication-editor__quill"
      />
    </div>

    <JusVariablesCard :variables="variables" />
  </el-dialog>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'

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
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editorOptions: {
        placeholder: 'Escreva alguma coisa',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote'],
            ['clean'],
          ],
        },
      },
      variables: {
        teste1: 'teste 1',
        teste2: 'teste 2',
      },
    }
  },
  computed: {
    modalIsVisible() {
      return this.visible
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
</style>

<style lang="scss">
.el-dialog__body {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr auto;
}
</style>
