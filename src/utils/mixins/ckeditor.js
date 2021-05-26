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
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Mention from '@ckeditor/ckeditor5-mention/src/mention'
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
      variables: 'getAvaliableVariablesToTemplate'
    }),

    editorConfig() {
      return {
        plugins: [
          Alignment,
          Autoformat,
          BlockQuote,
          Bold,
          Essentials,
          Highlight,
          Indent,
          Italic,
          List,
          Paragraph,
          PasteFromOffice,
          RemoveFormat,
          Table,
          TextTransformation,
          Underline,
          Mention,
          this.MentionCustomization
        ],
        mention: {
          feeds: [
            {
              marker: '{',
              feed: this.getFeedItems,
              minimumCharacters: 1,
              itemRenderer: this.customItemRenderer
            }
          ]
        },
        toolbar: {
          items: [
            'bold',
            'italic',
            'underline',
            'removeFormat',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'undo',
            'redo'
          ],
          viewportTopOffset: 30,
          shouldNotGroupWhenFull: true
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
    ...mapActions(['getAvaliableVariablesToTemplate']),

    MentionCustomization(editor) {
      // The upcast converter will convert view <a class='mention' href='' data-user-id=''>
      // elements to the model 'mention' text attribute.
      editor.conversion.for('upcast').elementToAttribute({
        view: {
          name: '',
          key: 'data-mention',
          classes: '',
          attributes: {
            href: true,
            'data-user-id': true
          }
        },
        model: {
          key: 'mention',
          value: viewItem => {
            // The mention feature expects that the mention attribute value
            // in the model is a plain object with a set of additional attributes.
            // In order to create a proper object use the toMentionAttribute() helper method:
            const mentionAttribute = editor.plugins
              .get('Mention')
              .toMentionAttribute(viewItem, {
                // Add any other properties that you need.
                link: viewItem.getAttribute('href'),
                userId: viewItem.getAttribute('data-user-id')
              })

            return mentionAttribute
          }
        },
        converterPriority: 'high'
      })

      // Downcast the model 'mention' text attribute to a view <a> element.
      editor.conversion.for('downcast').attributeToElement({
        model: 'mention',
        view: (modelAttributeValue, { writer }) => {
          // Do not convert empty attributes (lack of value means no mention).
          if (!modelAttributeValue) {
            return
          }
          const isImage = modelAttributeValue.type === 'image'

          return writer.createAttributeElement(
            isImage ? 'img' : 'span',
            {
              class: 'justto-variable',
              'data-mention': modelAttributeValue.id,
              src: modelAttributeValue.id
            },
            {
              // Make mention attribute to be wrapped by other attribute elements.
              priority: 20,
              // Prevent merging mentions together.
              id: modelAttributeValue.uid
            }
          )
        },
        converterPriority: 'high'
      })
    },

    customItemRenderer(item) {
      return item.name
    },

    getFeedItems(queryText) {
      function isItemMatching({ name, id }) {
        const searchString = normalizeString(queryText)

        return (
          normalizeString(name).includes(searchString) ||
          normalizeString(id).includes(searchString)
        )
      }

      return this.variablesList.filter(isItemMatching).slice(0, 10)
    },

    ckeditorFocus() {
      if (this.editorInstance) {
        this.editorInstance.$_instance.editing.view.focus()
      }
    }
  }
}
