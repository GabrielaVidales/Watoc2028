export function createClosure<T>(removeFn: (index: T) => void, delay = 300) {
  let locked = false

  return (index: T) => {
    if (locked) return
    locked = true
    removeFn(index)

    setTimeout(() => {
      locked = false
    }, delay)
  }
}

export function createAwaitableClosure(callback: () => Promise<void>): () => Promise<void>;

export function createAwaitableClosure<T>(callback: (arg: T) => Promise<void>): (arg: T) => Promise<void>;

export function createAwaitableClosure<T>(callback: (arg?: T) => Promise<void>) {
  let locked = false

  return async (arg: T) => {
    if (locked) return

    locked = true
    await callback(arg)
      .catch(error => console.error(error))
      .finally(() => locked = false)
  }
}