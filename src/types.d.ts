import { Role } from './config'
declare global {
  interface CreepMemory {
    depositing?: boolean
    homeRoom?: string
    role: Role
    site?: string
    sourceId?: string
    sourceStructure?: string
    target?: string
    targetSource?: string
    upgrading?: boolean
  }

  interface Memory {
    uuid: number
    log: any
  }
}
