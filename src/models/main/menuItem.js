export default class MenuItem {
  constructor({
    index,
    title,
    icon,
    isVisible = true,
    action = () => {}
  }) {
    this.index = index
    this.title = title
    this.icon = icon
    this.isVisible = isVisible
    this.action = action
  }
}
