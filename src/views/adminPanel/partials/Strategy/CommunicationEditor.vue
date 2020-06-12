<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    :title="communicationData.name"
  >
    <div class="communication-editor">
      <quill-editor
        ref="textEditor"
        v-model="communicationData.message"
        :options="editorOptions"
        class="communication-editor__quill"
      />
    </div>
  </el-dialog>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'CommunicationEditor',
  components: {
    quillEditor,
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
  display: grid;
  grid-template-columns: 1fr 300px;

  .communication-editor__quill {
    padding: 16px;
  }
}
</style>
