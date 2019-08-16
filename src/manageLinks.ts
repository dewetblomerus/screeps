import structureUtils from './structure.utils'

const notEnoughInStorage = (room: Room, linkNearController: StructureLink) => {
  if (room.storage) {
    room.storage.store[RESOURCE_ENERGY] < 10000 ||
      linkNearController.energy > 700
  }
}

const linkNeedingEnergy = (room: Room) => {
  const upgraderLink = structureUtils.upgraderStructures(room, [
    STRUCTURE_LINK,
  ])[0]

  if (room.storage) {
    // @ts-ignore
    if (notEnoughInStorage(room, upgraderLink)) {
      return structureUtils.linkNearStorage(room)
    }
  }

  // @ts-ignore
  if (upgraderLink.energy < upgraderLink.energyCapacity) {
    return upgraderLink
  }

  return structureUtils.linkNearStorage(room)
}

const runLinkNearSource = (link: StructureLink) => {
  // @ts-ignore
  const result = link.transferEnergy(linkNeedingEnergy(link.room))
  // console.log(`result: ${result}`)
}

const runLinkNearStorage = (link: StructureLink) => {
  // @ts-ignore
  const result = link.transferEnergy(linkNeedingEnergy(link.room))
  // console.log(`result: ${result}`)
}

const manageLinks = (room: Room) => {
  // console.log(`manage some links for room: ${room}`)
  const linksNearSources = structureUtils.sourceStructures(room, [
    STRUCTURE_LINK,
  ])
  // console.log(`sourceLinks: ${sourceLinks}`)

  const linkNearStorage = structureUtils.linkNearStorage(room)
  const upgraderLink = structureUtils.upgraderStructures(room, [
    STRUCTURE_LINK,
  ])[0]

  for (const link of linksNearSources) {
    // @ts-ignore
    runLinkNearSource(link)
  }

  if (linkNearStorage) {
    // @ts-ignore
    runLinkNearStorage(linkNearStorage)
  }
}

export default manageLinks
