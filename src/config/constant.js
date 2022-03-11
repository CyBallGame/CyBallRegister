export const API_CYBALL = location.href.indexOf('dev') > 0 ? 'https://dev-auth.cyball.com/auth/realms//protocol/openid-connect' : 'https://app-api.cyball.com/api'
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const PASSWORD_REG = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
