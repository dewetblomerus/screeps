const targets = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER) &&
        structure.energy < structure.energyCapacity
      );
    }
  });
};

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.depositing && creep.carry.energy == 0) {
      console.log(`Stop Depositing`);
      creep.memory.depositing = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
      console.log(`Start Depositing`);
      creep.memory.depositing = true;
      creep.say('deposit');
    }

    if (creep.memory.depositing) {
      // creep.say(`deposit`);
      // creep.say(`harvester depositing: ${creep.memory.depositing}`);
      console.log(`${creep.name} finding structures`);
      if (targets(creep).length > 0) {
        // console.log('there are targets');
        if (
          creep.transfer(targets(creep)[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          console.log(`moving to ${targets(creep)[0].structureType}`);
          creep.moveTo(targets(creep)[0], {
            visualizePathStyle: { stroke: '#ffffff' }
          });
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      // creep.say(`gather`);
      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        // console.log(`${creep.name} moving to sources`);
        creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
};

module.exports = roleHarvester;
