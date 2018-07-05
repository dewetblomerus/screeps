const sourceIndex = 1;
const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
const sourceTypes = [STRUCTURE_CONTAINER];
// const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];

const sources = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        sourceTypes.includes(structure.structureType) &&
        structure.store[RESOURCE_ENERGY] > 0
      );
    }
  });
};

const chooseSource = creep => {
  return sources(creep).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b);
  })[0];
};

const chooseTarget = creep => {
  sortedTargetsRange = targets(creep).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b);
  });

  const filteredTargets = sortedTargetsRange.filter(
    target => target.structureType != STRUCTURE_TOWER
  );

  if (filteredTargets.length > 0) {
    // console.log(`filteredTargets: ${filteredTargets}`);
    return filteredTargets[0];
  }

  // console.log(`chooseTarget: ${sortedTargetsRange[0]}`);
  return sortedTargetsRange[0];
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
      console.log(`Start Collecting`);
      creep.memory.depositing = false;
      creep.say('🔄 collect');
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
          // console.log(`moving to target: ${target}`);
          const result = creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' }
          });
          // console.log(result);
        }
      }
    } else {
      const source = chooseSource(creep);
      if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        console.log('not in range');
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
};

module.exports = roleHarvester;
