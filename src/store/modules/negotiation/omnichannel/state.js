import EDITOR_CONSTANTS from '@/constants/editor'

const omnichannelMutations = {
  activeTab: EDITOR_CONSTANTS.MESSAGES,
  editor: {
    configs: {
      uiColor: '#FFFFFF',
      height: '12vh',
      toolbarGroups: [
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'links', groups: ['links'] },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Source,Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteFromWord,Find,Replace,SelectAll,Scayt,HiddenField,Button,Textarea,TextField,CreateDiv,Language,BidiRtl,BidiLtr,Anchor,Flash,Form,Smiley,SpecialChar,PageBreak,Iframe,BGColor,Maximize,About,ShowBlocks,HorizontalRule,TextColor,Indent,Outdent,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Styles,Format,Font,FontSize,Unlink,Link',
      removePlugins: 'elementspath,resize'
    },
    ready: false,
    text: 'Texto do editor',
    messageType: 'email'
  }
}

export default omnichannelMutations
