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
import { normalizeString, eventBus } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

import store from '@/store'

export default {
  data() {
    return {
      editor: ClassicEditor
    }
  },

  computed: {
    ...mapGetters({
      variables: 'getAvaliableVariablesToTemplate',
      members: 'workspaceMembers'
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
          ...(this.useImageAttachmentPlugin ? [this.ImageAttachmentPlugin] : []),
          ...(this.useSourceCodePlugin ? [this.SourceCodeViewPlugin] : []),
          ...(this.useMentionPlugin ? [Mention, this.MentionCustomization] : []),
          ...(this.usePreviewPlugin ? [this.PreviewPlugin] : [])
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
            ...(this.useSourceCodePlugin ? ['sourceCode', '|'] : []),
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
            const mentionAttribute = editor.plugins
              .get('Mention')
              .toMentionAttribute(viewItem, {
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
          const isMemberMention = modelAttributeValue.type === 'memberMention'

          return writer.createAttributeElement(
            isImage ? 'img' : (isMemberMention ? 'em' : 'span'),
            {
              class: 'justto-variable',
              'data-mention': modelAttributeValue.id,
              src: modelAttributeValue.id,
              ...(isMemberMention ? {
                // style: 'color: #9461f7;',
                class: 'justto-mention',
                'account-id': modelAttributeValue.accountId
              } : {})
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
            const { getSelectedIds: ids } = store.getters
            const disputeId = ids.length ? ids[0] : Number(location.href.split('/').pop())
            const template = editor.innerHTML

            eventBus.$emit('SEE-PREVIEW', { template, disputeId })
          }
        })

        return view
      })
    },

    SourceCodeViewPlugin(editor) {
      editor.ui.componentFactory.add('sourceCode', locale => {
        const view = new ButtonView(locale)
        const imageIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="13.305" height="18"><g data-name="Grupo 39805"><g data-name="Grupo 39803"><path data-name="Caminho 13983" d="M10.163 0h-9.06a1.106 1.106 0 00-1.1 1.1v15.8a1.105 1.105 0 001.1 1.1h11.1a1.1 1.1 0 001.1-1.1V3.413zm2.214 16.9a.178.178 0 01-.177.177H1.1a.177.177 0 01-.177-.177V1.1A.177.177 0 011.1.924h8.392l2.881 3.147V16.9z"/></g><g data-name="Grupo 39804" stroke="#000" stroke-miterlimit="10" stroke-width=".5"><path data-name="Caminho 13984" d="M4.879 14.565l-3.141-3.142L4.88 8.281l.444.444-2.7 2.7 2.7 2.7z"/><path data-name="Caminho 13985" d="M8.425 8.281l3.141 3.142-3.142 3.142-.444-.444 2.7-2.7-2.7-2.7z"/></g></g></svg>'

        view.set({
          label: 'Código Fonte',
          icon: imageIcon,
          tooltip: true,
          withText: true
        })

        view.on('execute', () => {
          store.dispatch('toggleEditorSourcePreview')
        })

        return view
      })
    },

    ImageAttachmentPlugin(editor) {
      editor.ui.componentFactory.add('imageAttachment', locale => {
        const view = new ButtonView(locale)
        const imageIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" style="margin-left: 10px !important;" height="18"><path data-name="Caminho 13974" d="M8.948 4.948a.611.611 0 10-1.222 0c0 .009.005.017.005.026V13.5a3.254 3.254 0 11-6.508 0V3.273a2.034 2.034 0 114.067 0v8.591a.813.813 0 11-1.626 0V4.942a.106.106 0 000-.017.611.611 0 10-1.222 0 .106.106 0 000 .017v6.922a2.034 2.034 0 104.068 0V3.273a3.254 3.254 0 10-6.508 0V13.5a4.474 4.474 0 108.948 0V4.974h-.005c-.002-.009.003-.017.003-.026z"/></svg>'

        view.set({
          label: 'Inserir Imagem',
          icon: imageIcon,
          tooltip: true,
          withText: false
        })

        view.on('execute', () => store.dispatch('toggleImageUploadDialog', true))

        return view
      })
    },

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
