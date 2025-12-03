import {
  children
} from '@/api/system/dict'
export default {
  data() {
    return {
      dicts: {},
    }
  },
  methods: {
    initDicts(...names) {
      this.dicts = {}
      if (names.length == 0) {
        return
      }
      let _this = this
      let name = names.join(',')
      let fun = new Promise(function (resolve, reject) {
        children({
          labels: name
        }).then(res => {
          _this.dicts = res.data
          resolve(res.data)
        }).catch(err => {
          reject(false)
        })
      })
      return fun
    },
    getDictOptions(name) {
      return this.dicts[name]
    },
    getDictLabel(value, name) {
      // console.log('dict', this.dicts)
      let label = value
      if (this.dicts[name]) {
        this.dicts[name].some(dict => {
          if (dict.value == value) {
            label = dict.label
            return true
          }
          return false
        })
      }
      return label
    }
  }
}
