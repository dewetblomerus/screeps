var towerManager = {
  run(roomName) {
    // const tower = Game.getObjectById('5b3b0f61a36c2f5903b92cd4');
    const hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });

    // console.log(`towers: ${towers}`);
    for (const towerDynamic of towers) {
      // console.log(`towerDynamic: ${towerDynamic}`);
      // const tower = Game.getObjectById('5b41a75be18cc24347f2309b');
      const tower = towerDynamic;
      if (tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(
          FIND_STRUCTURES,
          {
            filter: structure =>
              structure.hits < structure.hitsMax &&
              structure != tower &&
              structure.structureType != STRUCTURE_WALL
          }
        );
        const closestHostile = tower.pos.findClosestByRange(
          FIND_HOSTILE_CREEPS
        );
        const roomName = tower.room.name;

        const damagedCreep = Game.rooms[roomName].find(FIND_MY_CREEPS, {
          filter: creep => {
            return creep.hits < creep.hitsMax;
          }
        });

        if (closestHostile) {
          console.log('there is a hostile');
          const result = tower.attack(closestHostile);
          console.log(`attack result: ${result}`);
        } else if (damagedCreep.name) {
          console.log(`healing: ${damagedCreep}`);
          tower.heal(damagedCreep);
        } else if (closestDamagedStructure) {
          tower.repair(closestDamagedStructure);
        }
      }
    }
  }
};

module.exports = towerManager;
