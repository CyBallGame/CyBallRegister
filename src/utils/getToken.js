import { API_CYBALL } from 'config/constant'

export const getToken = async () => {
  try {
    const result = await axios.post(`${API_CYBALL}/token`, {
      client_id: 'ZkiY1dORT17jdIeY2qUcxGVDCWRw7M70',
      client_secret: '',
      grant_type: 'client_credentials',
    })

    return result
  } catch (error) {
    console.log(error, 'Fail to fetch token')
    return null
  }
}
