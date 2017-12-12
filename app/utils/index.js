export { NavigationActions } from 'react-navigation'

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

export const createAction = type => payload => ({ type, payload })

export const quotationSrc =
  'http://route.showapi.com/1211-1?showapi_appid=51856&showapi_sign=3d9c0bd00fb84342b61dc8aaafa131c3&count=5'

export const bingSrc =
  'http://route.showapi.com/1377-1?showapi_appid=51856&showapi_sign=3d9c0bd00fb84342b61dc8aaafa131c3'

export const articleSrc=(index)=>{
  return `http://m.wenzhangba.com/lizhiwenzhang/list_9_${index}.html`
}

export const movieSrc=(index)=>{
  return `http://www.vmovier.com/cate/getbycate?cate=7&tab=new&page=${Math.ceil(index/3)}&pagepart=${index%3}`
}
