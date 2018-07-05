const sourceIndex = 0;
const targetTypes = [STRUCTURE_CONTAINER];
// const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];

const chooseSource = creep => {
  const sources = creep.room.find(FIND_SOURCES);
  return sources[sourceIndex];
};

const chooseTarget = creep => {
  // console.log(targets(creep));
  sortedTargetsRange = targets(creep).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b);
  });

  // console.log(`chooseTarget: ${sortedTargetsRange[0]}`);
  return sortedTargetsRange[0];
};

const targets = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        targetTypes.includes(structure.structureType) &&
        structure.store[RESOURCE_ENERGY] < structure.storeCapacity
      );
    }
  });
};

var roleWorker = {
  run(creep) {
    if (creep.memory.depositing && creep.carry.energy == 0) {
      console.log(`Start Harvesting`);
      creep.memory.depositing = false;
      let targetedSource = chooseSource(creep).id;
      console.log(targetedSource);
      creep.say('🔄 harvest');
    }
    if (!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
      console.log(`Start Depositing`);
      creep.memory.depositing = true;
      creep.say('deposit');
    }

    if (creep.memory.depositing) {
      console.log(`${creep.name} finding structures`);
      let target = chooseTarget(creep);
      if (target) {
        // console.log('there is a target');
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // console.log(`moving to target: ${target}`);
          const result = creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' }
          });
          // console.log(result);
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

module.exports = roleWorker;
