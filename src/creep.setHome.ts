const setHome = creep => {
  if (!creep.memory.homeRoom) {
    console.log('there is no homeRoom in the memory')
    creep.memory.homeRoom = creep.room.name
  }
}

export default setHome
