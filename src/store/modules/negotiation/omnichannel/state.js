import EDITOR_CONSTANTS from '@/constants/editor'

const omnichannelMutations = {
  activeTab: EDITOR_CONSTANTS.MESSAGES,
  occurrences: {
    filter: {
      page: 0,
      size: 20
    },
    list: [],
    fullMessages: {}
  },
  editor: {
    configs: {
      uiColor: '#FFFFFF',
      height: '12vh',
      toolbarGroups: [
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'paragraph', groups: ['align', 'list', 'indent', 'blocks', 'bidi', 'paragraph'] },
        { name: 'document', groups: ['doctools', 'mode', 'document'] },
        { name: 'clipboard', groups: ['undo', 'clipboard'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Source,Save,NewPage,ExportPdf,Preview,Print,PasteFromWord,PasteText,Paste,Copy,Cut,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,BGColor,Maximize,About,Styles,ShowBlocks,Format,Font,FontSize,Iframe,PageBreak,SpecialChar,Smiley,HorizontalRule,Table,Flash,Image,Anchor,Unlink,Link,BidiLtr,BidiRtl,Language,CreateDiv,Blockquote,Outdent,NumberedList,BulletedList,CopyFormatting,Strike,Subscript,Superscript,Undo,Redo,Templates,Indent,Undo,Redo',
      removePlugins: 'elementspath,resize'
    },
    ready: false,
    messageText: '',
    noteText: '',
    messageType: 'email'
  }
}

export default omnichannelMutations
