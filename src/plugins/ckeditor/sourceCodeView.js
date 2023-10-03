import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import store from '@/store'

export default class SourceCodeViewPlugin extends Plugin {
  constructor(editor) {
    super(editor)

    this.editor = editor
    this.buttonView = null

    this.createButton()

    this.editor.ui.componentFactory.add('sourceCode', () => this.buttonView)
  }

  createButton() {
    const sourceCodeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="13.305" height="18"><g data-name="Grupo 39805"><g data-name="Grupo 39803"><path data-name="Caminho 13983" d="M10.163 0h-9.06a1.106 1.106 0 00-1.1 1.1v15.8a1.105 1.105 0 001.1 1.1h11.1a1.1 1.1 0 001.1-1.1V3.413zm2.214 16.9a.178.178 0 01-.177.177H1.1a.177.177 0 01-.177-.177V1.1A.177.177 0 011.1.924h8.392l2.881 3.147V16.9z"/></g><g data-name="Grupo 39804" stroke="#000" stroke-miterlimit="10" stroke-width=".5"><path data-name="Caminho 13984" d="M4.879 14.565l-3.141-3.142L4.88 8.281l.444.444-2.7 2.7 2.7 2.7z"/><path data-name="Caminho 13985" d="M8.425 8.281l3.141 3.142-3.142 3.142-.444-.444 2.7-2.7-2.7-2.7z"/></g></g></svg>'

    this.buttonView = new ButtonView()
    this.buttonView.set({
      label: 'Código Fonte',
      icon: sourceCodeIcon,
      tooltip: true,
      withText: true
    })

    this.buttonView.on('execute', () => {
      store.dispatch('toggleEditorSourcePreview')
    })
  }
}
