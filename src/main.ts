import spawnCreeps from './creep.spawner'
import statusUpdate from './status.update'
import manageCreeps from './creep.manager'
import towerManager from './tower.manager'
import clearMemory from './clearMemory'
import targetState from './creep.targetState'
import manageLinks from './manageLinks'

export const loop = () => {
  clearMemory()
  manageCreeps()

  const roomsArray = Object.values(Game.rooms)
  for (const room of roomsArray) {
    statusUpdate(targetState(room), room)
    spawnCreeps(targetState(room), room)
    towerManager.run(room)
    manageLinks(room)
  }
}
