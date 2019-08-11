
/**
 * Helper function to create mutation query string from a list of cards
 *
 * @param {string} listId - ID of list to push cards to
 * @param {Object[]} cards - list of card objects
 */
export default function createCardsQuery(listId, cards) {

  const cardsStr = cards.map(({name}) => {
    return `
      addCard(withName: "${name}") {
        id
        name
      }
    `
  }).join('')

  return `
  {
    getList(byId: "${listId}") {
      ${cardsStr}
    }
  }
  `
}

