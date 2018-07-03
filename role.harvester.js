const sourceIndex = 1;
// const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];

const chooseSource = creep => {
  const sources = creep.room.find(FIND_SOURCES);
  return sources[sourceIndex];
};

const chooseTarget = creep => {
  // console.log(`targets: ${targets(creep).map(target => target.structureType)}`);

  sortedTargets = targets(creep).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b);
  });

  // console.log(
  //   `sortedTargets: ${targets(creep).map(target => target.structureType)}`
  // );
  // console.log(sortedTargets.map(target => target.structureType));

  // console.log(`chooseTarget: ${sortedTargets[0]}`);
  return sortedTargets[0];
};

const targets = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        targetTypes.includes(structure.structureType) &&
        structure.energy < structure.energyCapacity
      );
    }
  });
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
      let target = chooseTarget(creep);
      if (target) {
        // console.log('there is a target');
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          console.log('moving to target');
          creep.moveTo(target, {
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
