import config from '@/config/defaultSettings'
import secret from '@/utils/secret'

interface storageOptType {
  namespace?: string
  storage?: string
  default_cache_time?: number
  isEncrypt?: boolean
}

const options = Object.assign({
  namespace: 'ls_', // key prefix
  storage: 'localStorage', // storage name session, local, memory
  default_cache_time: 60 * 60 * 24 * 7,
  isEncrypt: false
}, config.storage)

let hasSetStorage = false

export const storage = {
  getKey: (key: string) => {
    return options.namespace + key
  },
  setOptions: (opt: storageOptType) => {
    if (hasSetStorage) {
      console.error('Has set storage:', options)
      return
    }
    Object.assign(options, opt)
    hasSetStorage = true
  },
  set: (key: string,value:string, expire: number | null = options.default_cache_time) => {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null
    })
    window.localStorage.setItem(storage.getKey(key), options.isEncrypt ? secret.encrypt(stringData): stringData)
  },
  setObj: (key: string, newVal:any, expire: number | null = options.default_cache_time) => {
    const oldVal = storage.get(key)
    if (!oldVal) {
      storage.set(key, newVal, expire)
    } else {
      Object.assign(oldVal, newVal)
      storage.set(key, oldVal, expire)
    }
  },
  /**
   * 读取缓存
   * @param {string} key 缓存键
   * @param {*=} def 默认值
   */
  get: (key: string) => {
    let item = window.localStorage.getItem(storage.getKey(key))
    if (item) {
      try {
        if (options.isEncrypt) {
          item = secret.decrypt(item)
        }
        const data = JSON.parse(item)
        const { value, expire } = data
        // 在有效期内直接返回
        if (expire === null || expire >= Date.now()) {
          return value
        }
        storage.remove(storage.getKey(key))
      } catch (e) {
        console.error(e)
      }
    }
    return null
  },
  remove: (key: string) => {
    window.localStorage.removeItem(storage.getKey(key))
  },
  clear: (): void => {
    window.localStorage.storage.clear()
  }
}

export default storage
