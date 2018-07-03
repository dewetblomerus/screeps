const sourceIndex = 1;
const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
// const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];

const chooseSource = creep => {
  const sources = creep.room.find(FIND_SOURCES);
  return sources[sourceIndex];
};

const targets = creep => {
  const unsortedStructures = creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        targetTypes.includes(structure.structureType) &&
        structure.energy < structure.energyCapacity
      );
    }
  });

  sortedStructures = unsortedStructures.sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b);
  });

  return sortedStructures;
};

var roleHarvester = {
  run(creep) {
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
      // console.log(`${creep.name} finding structures`);
      if (targets(creep).length > 0) {
        // console.log('there are targets');
        if (
          creep.transfer(targets(creep)[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          // console.log(`moving to ${targets(creep)[0].structureType}`);
          creep.moveTo(targets(creep)[0], {
            visualizePathStyle: { stroke: '#ffffff' }
          });
        }
      }
    } else {
      const source = chooseSource(creep);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
};

module.exports = roleHarvester;
