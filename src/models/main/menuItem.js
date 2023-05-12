export default class MenuItem {
  constructor({
    index,
    refIndex,
    title,
    icon,
    family,
    iconType,
    customHome,
    isVisible = true,
    action = () => {}
  }) {
    this.index = index
    this.refIndex = refIndex || index
    this.title = title
    this.icon = icon
    this.family = family || ''
    this.iconType = iconType
    this.customHome = customHome || index
    this.isVisible = isVisible
    this.action = action
  }
}
