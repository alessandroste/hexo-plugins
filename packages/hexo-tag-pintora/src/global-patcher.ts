/* eslint-disable @typescript-eslint/no-explicit-any */

export class GlobalPatcher {
    private records: any = {}
    set<K extends keyof typeof globalThis>(k: K, v: any) {
      const prevValue = globalThis[k]
      this.records[k] = {
        prevValue,
        value: v,
      }
  
      globalThis[k] = v
    }
  
    restore() {
      for (const k in this.records) {
        if ((globalThis as any)[k] === this.records[k].value) {
          ; (globalThis as any)[k] = this.records[k].prevValue
        }
      }
    }
  }