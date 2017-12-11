export { NavigationActions } from 'react-navigation'

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

export const createAction = type => payload => ({ type, payload })

export const quotationSrc =
  'http://route.showapi.com/1211-1?showapi_appid=51856&showapi_sign=3d9c0bd00fb84342b61dc8aaafa131c3&count=5'

export const bingSrc =
  'http://route.showapi.com/1377-1?showapi_appid=51856&showapi_sign=3d9c0bd00fb84342b61dc8aaafa131c3'
