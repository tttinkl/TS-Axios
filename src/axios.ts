import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
function createInstance(): AxiosInstance {
  const context = new Axios(defaults)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()
export default axios
