import {
  initDataFormData
} from '@/api/data'

export default {
  data() {
    return {
      loading: true,
      data: [],
      page: 1,
      size: 15,
      total: 0,
      url: '',
      params: {},
      query: {},
      time: 50
    }
  },
  methods: {
    async init(param) {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        Object.assign(this.params, param)
        initDataFormData(this.url, this.params).then(res => {
          if (this.addloading) {
            this.addloading = false
          }
          this.data = []
          this.total = res.data.totalElements
          res.data.content.map((o, i) => {
            Object.assign(o, {
              index: i + 1
            })
            this.data.push(o)
          })
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e
      this.init()
    },
    sizeChange(e) {
      this.page = 1
      this.size = e
      this.init()
    }
  }
}
