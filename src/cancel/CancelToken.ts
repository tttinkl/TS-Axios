import { resolve } from 'dns'
import { CancelExecutor, CancelTokenSource } from '..'
import { Canceler } from '../types'

interface ResolvePromise {
  (reason?: string): void
}
export default class CancelToken {
  promise: Promise<string>
  reason?: string

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    this.promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = message
      resolvePromise(this.reason)
    })
  }
}
