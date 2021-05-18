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

export default {
  data() {
    return {
      editor: ClassicEditor,
      items: [
        {
          id: '{{dispute_provisioned_value}}',
          name: 'Valor provisionado (Formatado como 0,00)',
          type: 'text'
        },
        {
          id: '{{last_note}}',
          name: 'Última nota adicionada na disputa',
          type: 'text'
        },
        {
          id: '{{logo_url}}',
          name: 'Logo do escritório/empresa configurada na workspace',
          type: 'image'
        },
        {
          id: '{{negotiator_name}}',
          name: 'Nome do negociador da disputa',
          type: 'text'
        },
        {
          id: '{{import_date}}',
          name: 'Data em que a disputa foi importada no formato dd/MM/yyyy',
          type: 'text'
        },
        {
          id: '{{negotiation_duedate}}',
          name: 'Data limite da negociação',
          type: 'text'
        },
        {
          id: '{{dispute_value_of_claim}}',
          name: 'Valor do processo (Formatado como 0,00)',
          type: 'text'
        }
      ]
    }
  },
  computed: {
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
    }
  },
  methods: {
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
      // As an example of an asynchronous action, return a promise
      // that resolves after a 100ms timeout.
      // This can be a server request or any sort of delayed action.
      return new Promise(resolve => {
        setTimeout(() => {
          const itemsToDisplay = this.items
            // Filter out the full list of all items to only those matching the query text.
            .filter(isItemMatching)
            // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
            .slice(0, 10)

          resolve(itemsToDisplay)
        }, 100)
      })

      // Filtering function - it uses the `name` and `username` properties of an item to find a match.
      function isItemMatching(item) {
        // Make the search case-insensitive.
        const searchString = normalizeString(queryText)

        // Include an item in the search results if the name or username includes the current user input.
        return (
          normalizeString(item.name).includes(searchString) ||
          normalizeString(item.id).includes(searchString)
        )
      }
    },
    ckeditorFocus() {
      if (this.editorInstance) {
        this.editorInstance.$_instance.editing.view.focus()
      }
    }
  }
}
