<template>
  <div class="login" />
</template>

<script>
export default {
  name: "CasLogin",
  data () {
    return {
      ticket: "",
      redirect: ''
    }
  },
  created () {
    let url = location.href
    this.redirect = this.$route.query.redirect || ''
    url = url.split("?ticket=")[1]
    if (url) {
      url = url.split("#/")[0]
      this.ticket = url
    }

    if (this.ticket) {
      this.codeLog()
    } else {
      this.scanCode()
    }

  },
  methods: {
    // 跳转至扫码登录界面
    scanCode () {
      const src = location.href
      window.location.href = process.env.VUE_APP_CAS + src
    },
    // 二维码登录
    codeLog () {
      this.$store
        .dispatch("CodeLogin", this.ticket)
        .then(() => {
            // this.$router.replace({ path: this.redirect || '/' })

            const obj = this.$route.query
            delete obj.redirect
            let domain = location.href.replace(/[?].*$/, "#")
            if (this.redirect) {
              domain = domain + this.redirect + '?'
              let src = ''
              for (const i in obj) {
                src += i + '=' + obj[i] + '&'
              }
              if (src) {
                domain += src
              }
            }
            location.href = domain
            // this.$router.replace({ path: this.redirect ? this.redirect : '/', query: this.$route.query })
            // location.href = location.href.replace(/[?].*$/, "#") + this.redirect;
        })
        .catch((res) => {
          this.$notify.error({
            title: '登录令牌错误',
            message: '请重新点击跳转链接或点击二维码登录'
          })
          const src = location.href.replace(/(\?ticket[^#]*#)/, '#').replace('cas', 'login')
          window.location.href = src
        })
    }
  }
}
</script>
