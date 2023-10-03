import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import store from '@/store'

export default class ImageAttachment extends Plugin {
  constructor(editor) {
    super(editor)

    this.editor = editor
    this.buttonView = null

    this.createButton()

    this.editor.ui.componentFactory.add('imageAttachment', () => this.buttonView)
  }

  createButton() {
    const imageIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" style="margin-left: 10px !important;" height="18"><path data-name="Caminho 13974" d="M8.948 4.948a.611.611 0 10-1.222 0c0 .009.005.017.005.026V13.5a3.254 3.254 0 11-6.508 0V3.273a2.034 2.034 0 114.067 0v8.591a.813.813 0 11-1.626 0V4.942a.106.106 0 000-.017.611.611 0 10-1.222 0 .106.106 0 000 .017v6.922a2.034 2.034 0 104.068 0V3.273a3.254 3.254 0 11-6.508 0V13.5a4.474 4.474 0 108.948 0V4.974h-.005c-.002-.009.003-.017.003-.026z"/></svg>'

    this.buttonView = new ButtonView()
    this.buttonView.set({
      label: 'Inserir Imagem',
      icon: imageIcon,
      tooltip: true,
      withText: false
    })

    this.buttonView.on('execute', () => store.dispatch('toggleImageUploadDialog', true))
  }
}
