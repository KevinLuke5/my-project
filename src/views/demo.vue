<template>
  <div>
    <!-- v-viewer -->
    <button @click="showViewer">
      显示图片
    </button>
    <!-- vue-pdf -->
    <button @click="showPdf = !showPdf">
      显示PDF
    </button>
    <div v-show="showPdf" class="pdf">
      <pdf
        src="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf"
      />
    </div>
    <!-- vue-org-tree -->
    <button @click="initOrg">
      显示组织
    </button>
    <vue2-org-tree :data="orgData" :label-class-name="labelClassName" :render-content="renderContent" />
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'
import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from 'v-viewer'

export default {
  name: 'Demo',
  components: { pdf, Vue2OrgTree },
  data () {
    return {
      showPdf: false,
      orgData: {},
      labelClassName: 'bg-white'
    }
  },
  methods: {
    renderContent (h, data) {
      return data.label
    },
    onExpand (data) {
      // if ("expand" in data) {
      //   data.expand = !data.expand;
      //   if (!data.expand && data.children) {
      //     this.collapse(data.children);
      //   }
      // } else {
      //   this.$set(data, "expand", true);
      // }
    },
    onNodeClick (e, data) {
      alert(data.label)
    },
    showViewer () {
      viewerApi({
        options: {
          toolbar: false,
          navbar: false
        },
        images: ['https://picsum.photos/200/200']
      })
    },
    initOrg () {
      this.orgData = {
        id: 0,
        label: 'XXX科技有限公司',
        children: [
          {
            id: 2,
            label: '产品研发部',
            children: [
              {
                id: 5,
                label: '研发-前端'
              },
              {
                id: 6,
                label: '研发-后端'
              },
              {
                id: 9,
                label: 'UI设计'
              },
              {
                id: 10,
                label: '产品经理'
              }
            ]
          },
          {
            id: 3,
            label: '销售部',
            children: [
              {
                id: 7,
                label: '销售一部'
              },
              {
                id: 8,
                label: '销售二部'
              }
            ]
          },
          {
            id: 4,
            label: '财务部'
          },
          {
            id: 9,
            label: 'HR人事'
          }
        ]
      }
    }
  }
}
</script>
<style scoped>
.pdf {
  width: 500px;
  height: 300px;
}
.org-tree-node-label {
  white-space: nowrap;
}
.bg-white {
  background-color: white;
}
.bg-orange {
  background-color: orange;
}
.bg-gold {
  background-color: gold;
}
.bg-gray {
  background-color: gray;
}
.bg-lightpink {
  background-color: lightpink;
}
.bg-chocolate {
  background-color: chocolate;
}
.bg-tomato {
  background-color: tomato;
}
</style>