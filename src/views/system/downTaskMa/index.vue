<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-folding-block
        ref="foldingBlock"
        :query-form="queryForm"
        @search="handleSearch"
        @reset="reset"
      />
      <j-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        size="small"
        height="65vh"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
      >
        <j-table-column prop="fileName" label="文件名称" />
        <!-- <j-table-column label="文件类型">
          <template slot-scope="scope">
            <div>{{ typeDic[scope.row.type] }}</div>
          </template>
        </j-table-column> -->
        <j-table-column label="状态">
          <template slot-scope="scope">
            <div>{{ staDic[scope.row.status] }}</div>
            <div v-show="scope.row.status === 3">
              原因：{{ scope.row.remark }}
            </div>
          </template>
        </j-table-column>
        <j-table-column prop="crtTime" label="创建时间" />
        <j-table-column prop="crtUserName" label="创建人" />
        <!-- 操作栏正常情况下保留，只展示信息页面注释下方代码 -->
        <j-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:flex-end;">
              <j-button
                v-if="scope.row.status === 2"
                type="text"
                size="mini"
                @click="downFile(scope.row)"
              >
                下载
              </j-button>
              <j-button type="text" size="mini" @click="handleDel(scope.row)">
                删除
              </j-button>
            </div>
          </template>
        </j-table-column>
      </j-table>
      <div class="page">
        <span
          style="
            line-height: 32px;
            font-size: 14px;
            color: #666;
            margin-right: 20px;
          "
        >
          <span>第</span>
          {{ pageSize * (currentPage - 1) + 1 }}
          <span>到</span>
          {{ endNum }}
          <span>项</span>
        </span>
        <j-pagination
          :current-page="currentPage"
          :page-sizes="[15, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </div>
    </j-card>
  </div>
</template>

<script>
import * as fileApi from '@/api/system/downCenter'
import { loadFileByUrl } from '@/utils/download'
export default {
  name: 'DownTaskMa',
  data () {
    return {
      queryForm: {
        fileName: {
          label: '文件名称',
          type: 'input',
          value: null,
          data: null
        }
      },
      pageSize: 15,
      currentPage: 1,
      total: 0,
      tableData: [],
      loading: false,
      height: null,
      staDic: {
        1: '下载中',
        2: '下载完成',
        3: '下载失败'
      }
    }
  },
  computed: {
    endNum () {
      return this.pageSize * this.currentPage > this.total
        ? this.total
        : this.pageSize * this.currentPage
    }
  },
  created () {
    this.init()
  },
  // mounted () {
  //   this.height = this.getHeight()
  // },
  methods: {
    init () {
      this.loading = true
      const params = {
        size: this.pageSize,
        page: this.currentPage,
        fileName: this.queryForm.fileName.value ? this.queryForm.fileName.value.trim() : ''
      }
      fileApi.fileQuery(params).then((res) => {
        if (res.code === '0') {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch (val) {
      this.currentPage = 1
      this.init()
    },
    downFile (row) {
      // console.log('uri', row.uri)
      loadFileByUrl(row.uri)
      // fileApi.fileDown({ id })
      //   .then((res) => {
      //     if (res.code === '0') {
      // 获取临时地址
      // fileApi.fileView({
      //   bucket: 'jy-srm',
      //   region: 'oss-cn-hangzhou',
      //   account: 'ramoss',
      //   objectName: row.uri // url
      // }).then((result) => {
      //   if (result.code === '0' && result.data.fileUrl) {
      //     // this.fileUrl = result.data.fileUrl
      //     console.log('url', result.data.fileUrl)
      //     // loadFileByUrl(result.data.fileUrl)
      //   } else {
      //     this.$message({
      //       message: result.message,
      //       type: 'warning'
      //     })
      //   }
      // })
      // } else {
      //   this.$message({
      //     message: res.message,
      //     type: 'warning'
      //   })
      // }
      // })
    },
    handleDel (row) {
      this.$confirm('确认删除该文件？删除后将无法恢复')
        .then((_) => {
          this.delFile(row)
        })
        .catch((_) => {})
    },
    delFile (row) {
      const params = {
        id: row.id
      }
      fileApi.fileDel(params).then((res) => {
        if (res.code === '0') {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.init()
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    reset (data) {
      this.queryForm = data
    },
    sizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.init()
    },
    pageChange (e) {
      this.currentPage = e
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  display: flex;
  justify-content: center;
  margin: 20px auto 0;
}
</style>