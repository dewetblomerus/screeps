const sourceIndex = 0;
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

  // console.log`unsorted: ${unsortedStructures.map(structure =>
  //   creep.pos.getRangeTo(structure)
  // )}`;

  sortedStructures = unsortedStructures.sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b);
  });

  // console.log`  sorted: ${sortedStructures.map(structure =>
  //   creep.pos.getRangeTo(structure)
  // )}`;
  return sortedStructures;
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
      // creep.say(`gather`);
      const source = chooseSource(creep);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // console.log(`${creep.name} moving to sources`);
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
};

module.exports = roleHarvester;
