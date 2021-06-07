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
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
// import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Mention from '@ckeditor/ckeditor5-mention/src/mention'
import { normalizeString, eventBus } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

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
          Link,
          Paragraph,
          RemoveFormat,
          Table,
          TextTransformation,
          Underline,
          Mention,
          this.useMenstionPlugin ? this.MentionCustomization : () => {},
          this.usePreviewPlugin ? this.PreviewPlugin : () => {}
        ],
        mention: this.useMenstionPlugin ? {
          feeds: [
            {
              marker: '{',
              feed: this.getFeedItems,
              minimumCharacters: 1,
              itemRenderer: this.customItemRenderer
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
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'undo',
              'redo'
            ],
            ...(this.usePreviewPlugin ? ['preview'] : [])
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
    ...mapActions([
      'getAvaliableVariablesToTemplate'
    ]),

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

    PreviewPlugin(editor) {
      editor.ui.componentFactory.add('preview', locale => {
        const view = new ButtonView(locale)

        view.set({
          label: 'Visualizar Mensagem',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18.409" height="18"><path data-name="Retângulo 67" fill="none" d="M.204 0h18v18h-18z"/><g data-name="Grupo 3101"><g data-name="Grupo 26"><path data-name="Caminho 253" d="M9.205 12.018a3.043 3.043 0 10-3.019-3.043 3.031 3.031 0 003.019 3.043z" fill="none" stroke="#000" stroke-width=".8"/><path data-name="Caminho 254" d="M9.204 10.745a1.839 1.839 0 10-1.781-1.838 1.814 1.814 0 001.781 1.838z" fill="#191919" fill-rule="evenodd"/><path data-name="Caminho 11629" d="M9.761 9.397a1.032 1.032 0 10-1-1.032 1.019 1.019 0 001 1.032z" fill="#fff" fill-rule="evenodd"/><path data-name="Caminho 255" d="M17.909 8.902a10.174 10.174 0 00-17.409 0 10.174 10.174 0 0017.409 0z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>',
          tooltip: true
        })

        view.on('execute', () => {
          const editor = Array(...document.querySelectorAll('.ck-content')).pop()

          if (editor) {
            const disputeId = this.disputeId || Number(location.href.split('/').pop())
            const template = editor.innerHTML

            eventBus.$emit('SEE-PREVIEW', { template, disputeId })
          }
        })

        return view
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
