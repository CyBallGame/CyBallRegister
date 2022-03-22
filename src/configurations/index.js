import devConfigs from './dev'
import prodConfigs from './prod'

const env = process.env.REACT_APP_ENV
// If you add #dev at the end of the url, it will choose the dev configuartion
const configs = env === 'dev' || location.host.indexOf('localhost') === 0 || location.href.indexOf('dev') > 0 ? devConfigs : prodConfigs
export default Object.freeze({ ...configs })
