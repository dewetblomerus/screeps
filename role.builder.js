const sourceIndex = 0;

const chooseSource = creep => {
  const sources = creep.room.find(FIND_SOURCES);
  return sources[sourceIndex];
};

const harvest = creep => {
  source = chooseSource(creep);
  if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
  }
};

const findConstruction = creep => {
  return creep.room.find(FIND_CONSTRUCTION_SITES)[0];
};

const setTargetId = creep => {
  creep.memory.target = findConstruction(creep).id;
  console.log(`builder setting target: ${creep.memory.target}`);
};

const inProgress = site => site.progress < site.progressTotal;

const doneHarvesting = creep => {
  return !creep.memory.building && creep.carry.energy == creep.carryCapacity;
};

const doneBuilding = creep => {
  return creep.memory.building && creep.carry.energy == 0;
};

const chooseSite = creep => {
  if (Game.getObjectById(creep.memory.target)) {
    return Game.getObjectById(creep.memory.target);
  }
  return findConstruction(creep);
};

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (doneBuilding(creep)) {
      creep.memory.building = false;
      console.log('builder doneBuilding');
      creep.say('🔄 harvest');
    }

    if (doneHarvesting(creep)) {
      creep.memory.building = true;
      creep.memory.target = findConstruction.id;
      setTargetId(creep);
      console.log('builder doneHarvesting');
      creep.say('🚧 build');
    }

    if (creep.memory.building) {
      // console.log(`${target.progress}/${target.progressTotal}`);
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      let target = chooseSite(creep);
      // console.log(`in progress: ${target}`);
      // console.log(`builder target: ${creep.memory.target}`);
      if (targets.length) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          // target building code
          creep.moveTo(target, {
            // maxRooms: 1,
            visualizePathStyle: { stroke: '#ffffff' }
          });
          //normal code
          // creep.moveTo(targets[0], {
          //   visualizePathStyle: { stroke: '#ffffff' }
          // });
        }
      }
    } else {
      harvest(creep);
    }
  }
};

module.exports = roleBuilder;
