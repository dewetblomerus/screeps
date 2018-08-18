const structureUtils = require('./structure.utils')

const runSourceLink = (link, storageLink, upgraderLink) => {
  const storageLinkResult = link.transferEnergy(storageLink)
  console.log(`storageLinkResult: ${storageLinkResult}`)
  const upgraderLinkResult = link.transferEnergy(upgraderLink)
  console.log(`upgraderLinkResult: ${upgraderLinkResult}`)
}

const manageLinks = room => {
  // console.log(`manage some links for room: ${room}`)
  const sourceLinks = structureUtils.sourceStructures(room, [STRUCTURE_LINK])
  // console.log(`sourceLinks: ${sourceLinks}`)

  const storageLink = structureUtils.storageLink(room)
  // console.log(storageLink)
  const upgraderLink = structureUtils.upgraderStructures(room, [
    STRUCTURE_LINK,
  ])[0]

  for (const link of sourceLinks) {
    runSourceLink(link, storageLink, upgraderLink)
  }
}

module.exports = manageLinks
