var towerManager = {
  run() {
    const tower = Game.getObjectById('5b3b0f61a36c2f5903b92cd4');

    // console.log(`tower: ${tower}`);
    if (tower) {
      const closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        {
          filter: structure =>
            structure.hits < structure.hitsMax && structure != tower
        }
      );
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

      if (closestHostile) {
        console.log('there is a hostile');
        const result = tower.attack(closestHostile);
        console.log(`attack result: ${result}`);
      } else if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }
    }
  }
};

module.exports = towerManager;
