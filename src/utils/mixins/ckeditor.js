/* eslint-disable indent */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import List from '@ckeditor/ckeditor5-list/src/list'
import Link from '@ckeditor/ckeditor5-link/src/link'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Mention from '@ckeditor/ckeditor5-mention/src/mention'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Preview from '@/plugins/ckeditor/preview'
import ImageAttachment from '@/plugins/ckeditor/imageAttachment'
import MentionCustomization from '@/plugins/ckeditor/mentionCustomization'
import { normalizeString } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      editor: ClassicEditor
    }
  },

  computed: {
    ...mapGetters({
      variables: 'getAvaliableVariablesToTemplate',
      members: 'workspaceMembersByDispute'
    }),

    editorConfig() {
      return {
        plugins: [
          ...[
            Alignment,
            Autoformat,
            BlockQuote,
            Bold,
            Image,
            ImageToolbar,
            ImageStyle,
            Essentials,
            Highlight,
            Indent,
            Italic,
            List,
            Link,
            Paragraph,
            RemoveFormat,
            TextTransformation,
            Underline
          ],
          ...(this.dontUseTablePlugin ? [] : [Table, TableToolbar]),
          ...(this.useImageAttachmentPlugin ? [ImageAttachment] : []),
          ...(this.useMentionPlugin ? [Mention, MentionCustomization] : []),
          ...(this.usePreviewPlugin ? [Preview] : [])
        ],
        mention: this.useMentionPlugin ? {
          feeds: [
            {
              marker: '{',
              feed: this.getFeedItems,
              minimumCharacters: 1,
              itemRenderer: this.customItemRenderer
            },
            {
              marker: '@',
              feed: this.getFeedPersonItems,
              minimumCharacters: 0,
              itemRenderer: this.customMemberItemRenderer
            }
          ]
        } : {},
        toolbar: {
          items: [
            ...[
              'bold',
              'italic',
              'underline',
              'removeFormat',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'insertTable',
              '|',
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'undo',
              'redo',
              'imageStyle'
            ],
            ...(this.useImageAttachmentPlugin ? ['imageAttachment'] : []),
            ...(this.usePreviewPlugin ? ['preview'] : [])
          ],
          viewportTopOffset: 30,
          shouldNotGroupWhenFull: true
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
      }
    },

    variablesList() {
      const imgKeys = []
      const linkKeys = []

      return Object.keys(this.variables).map(key => {
        return {
          id: `{{${key}}}`,
          name: `${this.variables[key]}`,
          type: imgKeys.includes(key) ? 'img' : linkKeys.includes(key) ? 'link' : 'text'
        }
      })
    }
  },

  beforeMount() {
    this.getAvaliableVariablesToTemplate()
  },

  methods: {
    ...mapActions([
      'getAvaliableVariablesToTemplate'
    ]),

    setImgTag(src) {
      this.$nextTick(() => {
        const editor = document.querySelector('.ck-editor__editable').ckeditorInstance

        editor.model.change(writer => {
          const imageElement = writer.createElement('image', { src })
          editor.model.insertContent(imageElement, editor.model.document.selection)
        })
      })
    },

    customItemRenderer(item) {
      return item.name
    },

    customMemberItemRenderer(item) {
      return item.person?.name || item.accountEmail
    },

    getFeedItems(queryText) {
      function isItemMatching({ name, id }) {
        const searchString = normalizeString(queryText).replace(/{/g, '')

        return normalizeString(name).includes(searchString) || normalizeString(id).includes(searchString)
      }

      return this.variablesList.filter(isItemMatching)
    },

    getFeedPersonItems(queryText) {
      function isItemMatching({ name, person }) {
        const searchString = normalizeString(queryText).replace(/{/g, '')

        if (person) {
          return normalizeString(person.name).includes(searchString)
        } else {
          return normalizeString(name).includes(searchString)
        }
      }

      return this.members.filter(isItemMatching).map(member => ({
        ...member,
        type: 'memberMention',
        id: `@${this.customMemberItemRenderer(member)}`
      }))
    },

    ckeditorFocus(editorInstance) {
      // TODO: Rever foco do CKEditor.
      // if (editorInstance) {
      //   editorInstance.$_instance.editing.view.focus()
      // } else if (this.editorInstance) {
      //   this.editorInstance.$_instance.editing.view.focus()
      // }
    }
  }
}
