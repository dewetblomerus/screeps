var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      // console.log(`${creep.name} is now harvesting`);
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      console.log(`upgrader setting target: ${creep.room.controller.id}`);
      creep.memory.target = creep.room.controller.id;
      // console.log(`${creep.name} is now upgrading`);
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // console.log(`${creep.name} is now moving to the controller`);
        let target = Game.getObjectById(creep.memory.target);
        creep.moveTo(target, {
          // maxRooms: 1,
          visualizePathStyle: { stroke: '#ffffff' }
        });
      }
    } else {
      const source = creep.room.storage;
      // console.log(`upgrader withdrawing from: ${source}`);
      if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        // console.log('not in range');
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
};

module.exports = roleUpgrader;
