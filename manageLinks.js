const structureUtils = require('./structure.utils')

const runSourceLink = (link, upgraderLink) => {
  link.transferEnergy(upgraderLink)
}

const manageLinks = room => {
  // console.log(`manage some links for room: ${room}`)
  const sourceLinks = structureUtils.sourceStructures(room, [STRUCTURE_LINK])
  // console.log(`sourceLinks: ${sourceLinks}`)

  const upgraderLink = structureUtils.upgraderStructures(room, [
    STRUCTURE_LINK,
  ])[0]

  for (const link of sourceLinks) {
    runSourceLink(link, upgraderLink)
  }
}

module.exports = manageLinks
