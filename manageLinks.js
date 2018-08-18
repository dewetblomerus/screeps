const structureUtils = require('./structure.utils')

const notEnoughStorage = (room, upgraderLink) =>
  room.storage.store[RESOURCE_ENERGY] < 10000 || upgraderLink.energy > 700

const linkNeedingEnergy = room => {
  const upgraderLink = structureUtils.upgraderStructures(room, [
    STRUCTURE_LINK,
  ])[0]

  if (room.storage) {
    if (notEnoughStorage(room, upgraderLink)) {
      return structureUtils.storageLink(room)
    }
  }

  if (upgraderLink.energy < upgraderLink.energyCapacity) {
    return upgraderLink
  }

  return structureUtils.storageLink(room)
}

const runSourceLink = link => {
  const result = link.transferEnergy(linkNeedingEnergy(link.room))
  // console.log(`result: ${result}`)
}

const runStorageLink = link => {
  const result = link.transferEnergy(linkNeedingEnergy(link.room))
  // console.log(`result: ${result}`)
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

  if (storageLink) {
    runStorageLink(storageLink)
  }
}

module.exports = manageLinks
