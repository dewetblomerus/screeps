export type Role =
  | 'builder'
  | 'carrier'
  | 'harvester'
  | 'remoteCarrier'
  | 'remoteMiner'
  | 'upgrader'
  | 'worker'

export type RoleTarget = { amount: Number; priority: Number }

// export type TargetState = Record<Role, RoleTarget>;
export type TargetState = {
  [k in Role]?: RoleTarget
}

export type StructureStoringEnergy =
  | StructureContainer
  | StructureSpawn
  | StructureStorage

export type StructureNeedingEnergy =
  | StructureContainer
  | StructureExtension
  | StructureSpawn
  | StructureStorage
  | StructureTower

export type StructureWithStore = StructureStorage | StructureContainer
