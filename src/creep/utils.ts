export const countCreeps = (role: string) => {
  return Object.values(Game.creeps).filter(
    creep =>
      creep.memory.role === role &&
      (creep.ticksToLive === undefined || creep.ticksToLive > 50)
  ).length
}
