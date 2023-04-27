export default class MenuItem {
  constructor({
    index,
    title,
    icon,
    family,
    iconType,
    customHome,
    isVisible = true,
    action = () => {}
  }) {
    this.index = index
    this.title = title
    this.icon = icon
    this.family = family || ''
    this.iconType = iconType
    this.customHome = customHome || index
    this.isVisible = isVisible
    this.action = action
  }
}
