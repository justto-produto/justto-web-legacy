import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import store from '@/store'
import { eventBus } from '@/utils'

export default class Preview extends Plugin {
  constructor(editor) {
    super(editor)

    this.editor = editor
    this.buttonView = null

    this.createButton()

    this.editor.ui.componentFactory.add('preview', () => this.buttonView)
  }

  createButton() {
    const previewIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18.409" height="18"><path data-name="Retângulo 67" fill="none" d="M.204 0h18v18h-18z"/><g data-name="Grupo 3101"><g data-name="Grupo 26"><path data-name="Caminho 253" d="M9.205 12.018a3.043 3.043 0 10-3.019-3.043 3.031 3.031 0 003.019 3.043z" fill="none" stroke="#000" stroke-width=".8"/><path data-name="Caminho 254" d="M9.204 10.745a1.839 1.839 0 10-1.781-1.838 1.814 1.814 0 001.781 1.838z" fill="#191919" fill-rule="evenodd"/><path data-name="Caminho 11629" d="M9.761 9.397a1.032 1.032 0 10-1-1.032 1.019 1.019 0 001 1.032z" fill="#fff" fill-rule="evenodd"/><path data-name="Caminho 255" d="M17.909 8.902a10.174 10.174 0 00-17.409 0 10.174 10.174 0 0017.409 0z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>'

    this.buttonView = new ButtonView()
    this.buttonView.set({
      label: 'Visualizar Mensagem',
      icon: previewIcon,
      tooltip: true
    })

    this.buttonView.on('execute', () => {
      const editor = Array(...document.querySelectorAll('.ck-content')).pop()

      if (editor) {
        const { getSelectedIds: ids } = store.getters
        const disputeId = ids.length ? ids[0] : Number(location.href.split('/').pop())
        const template = editor.innerHTML

        eventBus.$emit('SEE-PREVIEW', { template, disputeId })
      }
    })
  }
}
