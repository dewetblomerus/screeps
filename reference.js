Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester1')
Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester2')

if (Object.keys(Game.creeps).length < 2) {
  console.log('we have less than two creeps')
  Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Worker1', {
    memory: { role: 'harvester' },
  })
} else {
  console.log('we have more than one screep')
}
