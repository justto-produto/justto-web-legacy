/**
 * Finds a term and returns your value
 * @param {object} modifiers Directive modifiers
 * @param {string} term Term to find on modifiers
 * @returns {string} A value found with the association of terms
 */
const findModifierValue = (modifiers, term) =>
  modifiers.filter(modifier =>
    modifier.split('-')[0] === term)[0]
    .split('-')[1]

/**
 * @type {import('vue/types/umd').DirectiveOptions}
 */
export const GridItem = {
  bind: (el, binding) => {
    const modifiers = Object.keys(binding.modifiers)
    const col = findModifierValue(modifiers, 'col')
    const row = findModifierValue(modifiers, 'row')

    el.style.gridColumn = `span ${col}`
    el.style.gridRow = `span ${row}`
  }
}
