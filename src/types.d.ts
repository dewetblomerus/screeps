import { Role } from './config'
declare global {
  interface CreepMemory {
    role: Role
    targetSource?: string
  }

  interface Memory {
    uuid: number
    log: any
  }
}
