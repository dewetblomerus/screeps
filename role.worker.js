const sourceIndex = 0;
const targetTypes = [STRUCTURE_CONTAINER];
// const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];

const chooseSource = creep => {
  const sourceFromMemory = Game.getObjectById(creep.memory.targetSource);
  // console.log(`source from memory: ${sourceFromMemory}`);
  const sources = creep.room.find(FIND_SOURCES);
  let creeps = Game.creeps;
  console.log(creeps);
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    console.log(creep);
  }
  // let targetedSources = Game.creeps.map(creep =>
  //   Game.getObjectById(creep.memory.targetSource)
  // );
  // console.log(`sources: ${sources}`);
  // untargetedSources = sources.filter(source => {
  //   return !targetedSources.includes(source);
  // });
  // console.log(`untargeted: ${untargetedSources}`);
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
      console.log(`Start Harvesting`);
      console.log(`Start Harvesting`);
      console.log(`Start Harvesting`);
      creep.memory.depositing = false;
      let targetSource = chooseSource(creep).id;
      console.log('targetedSource');
      console.log(targetSource);
      creep.memory.targetSource = targetSource;
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