// count.js
export function count(x, y) {
  return x - y
}

export function sum(...args) {
  return args.reduce((p, c) => p + c, 0)
}
export function sleep(delay) {
  return new Promise(resolve => {
    setTimeout(() => resolve(1), delay)
  })
}
