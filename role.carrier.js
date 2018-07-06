const targetPriorities = {
  extension: { slug: STRUCTURE_EXTENSION, priority: 0 },
  spawn: { slug: STRUCTURE_SPAWN, priority: 1 },
  tower: { slug: STRUCTURE_TOWER, priority: 2 },
  storage: { slug: STRUCTURE_STORAGE, priority: 3 },
  container: { slug: STRUCTURE_CONTAINER, priority: 4 }
};

const targetTypes = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
  STRUCTURE_STORAGE
];
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

const chooseStructureType = creep => {
  structures = targetsNeedingEnergy(creep);
  structureTypesNeedingEnergy = structures.map(
    structure => structure.structureType
  );
  console.log(structureTypesNeedingEnergy);
  if (structureTypesNeedingEnergy.length > 0) {
    // console.log('there are targets');
    const structureType = structureTypesNeedingEnergy.reduce((a, b) => {
      return targetPriorities[a].priority < targetPriorities[b].priority
        ? a
        : b;
    });

    console.log(`prioritized structureType: ${structureType}`);
    return structureType;
  }
};

const structuresOfType = (creep, structureType) => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        structure.structureType == structureType &&
        structure.energy < structure.energyCapacity
      );
    }
  });
};

const setTarget = creep => {
  if (creep.memory.target) {
    console.log('it has a target');
    target = Game.getObjectById(creep.memory.target);
    console.log(target);
    if (target.energy < target.energyCapacity) {
      return;
    } else {
      console.log('target is already full');
    }
  }
  creep.memory.target = chooseTarget(creep).id;
};

const chooseTarget = creep => {
  structureType = chooseStructureType(creep);

  sortedTargetsRange = structuresOfType(creep, structureType).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b);
  });

  console.log(`chooseTarget: ${sortedTargetsRange.length}`);
  const newTarget = sortedTargetsRange[0];
  return newTarget;
};

const targetsNeedingEnergy = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        targetTypes.includes(structure.structureType) &&
        structure.energy < structure.energyCapacity
      );
    }
  });
};

var roleCarrier = {
  run(creep) {
    if (creep.memory.depositing && creep.carry.energy == 0) {
      console.log(`Start Collecting`);
      creep.memory.depositing = false;
      creep.say('🔄 collect');
    }
    if (!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
      console.log(`Start Depositing`);
      creep.memory.depositing = true;
      console.log(chooseTarget(creep).id);
      creep.memory.target = chooseTarget(creep).id;
      creep.say('deposit');
    }

    if (creep.memory.depositing) {
      // console.log(`${creep.name} finding structures`);
      setTarget(creep);
      let target = Game.getObjectById(creep.memory.target);
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
        // console.log('not in range');
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
};

module.exports = roleCarrier;
