const pickup = creep => {
  // console.log('running pickup function')
  const dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
  if (dropped) {
    // console.log('there are dropped resources')
    if (dropped.amount > creep.carryCapacity || dropped.amount > 300) {
      // console.log('enough to get me out of bed')
      if (dropped) {
        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped)
        }
        return
      }
    }
  }
}

export default pickup
