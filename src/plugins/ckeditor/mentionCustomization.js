import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

export default class MentionCustomization extends Plugin {
  constructor(editor) {
    super(editor)

    this.editor = editor

    this.registerConverters()
  }

  registerConverters() {
    this.editor.conversion.for('upcast').elementToAttribute({
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
          const mentionAttribute = this.editor.plugins
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

    this.editor.conversion.for('downcast').attributeToElement({
      model: 'mention',
      view: (modelAttributeValue, { writer }) => {
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
              class: 'justto-mention',
              'account-id': modelAttributeValue.accountId
            } : {})
          },
          {
            priority: 20,
            id: modelAttributeValue.uid
          }
        )
      },
      converterPriority: 'high'
    })
  }
}
