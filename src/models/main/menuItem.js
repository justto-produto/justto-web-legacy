export default class MenuItem {
  constructor({
    index,
    title,
    icon,
    customHome,
    isVisible = true,
    action = () => {}
  }) {
    this.index = index
    this.title = title
    this.icon = icon
    this.customHome = customHome || index
    this.isVisible = isVisible
    this.action = action
  }
}
