import request from './request'

const urls = {
  getInfo: {url: 'someUrl'},
  checkRename: {url: 'someUrl', method: 'post'}
}

let apiPackage = {}
Object.keys(urls).map(v => {
  apiPackage[v] = (data, MoreConfig) => {
    return request(urls[v].url, data, urls[v].method, MoreConfig).catch(function (err) {
      console.log(err, urls[v].url)
    })
  }
})
export default apiPackage
