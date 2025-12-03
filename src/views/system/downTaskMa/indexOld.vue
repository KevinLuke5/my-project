<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <headModel :query="query" @handleSearch="handleSearch" />
      <j-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        size="small"
        :height="height"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
      >
        <j-table-column prop="originalFileName" label="文件名称" />
        <j-table-column prop="fileSize" label="文件大小" />
        <j-table-column prop="status" label="生成进度">
          <template slot-scope="scope">
            <span>{{
              getDictLabel(scope.row.status, "fileDownload-type")
            }}</span>
          </template>
        </j-table-column>
        <j-table-column prop="crtTime" label="创建时间">
          <template slot-scope="scope">
            {{ parseTime(scope.row.crtTime) }}
          </template>
        </j-table-column>
        <!-- 操作栏正常情况下保留，只展示信息页面注释下方代码 -->
        <j-table-column label="操作" width="120">
          <template slot-scope="scope">
            <j-button
              v-if="scope.row.status == 1"
              type="text"
              size="mini"
              @click="downFile(scope.row)"
            >
              下载
            </j-button>
            <j-button
              v-if="scope.row.status != 0"
              type="text"
              size="mini"
              @click="handleDel(scope.row)"
            >
              删除
            </j-button>
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
import { parseTime } from '@/utils/index'
import initDict from '@/mixins/initDict'
import headModel from './module/headModel'
import { mapGetters } from 'vuex'
import { getDownTaskList, del, fileIsExist } from '@/api/system/downTaskMa'
export default {
  name: 'DownTaskMa',
  components: { headModel },
  mixins: [initDict],
  data: function () {
    return {
      query: {
        originalName: ''
      },
      pageSize: 15,
      currentPage: 1,
      total: 0,
      tableData: [],
      loading: false,
      height: null
    }
  },
  computed: {
    endNum: function () {
      return this.pageSize * this.currentPage > this.total
        ? this.total
        : this.pageSize * this.currentPage
    },
    ...mapGetters(['baseApi'])
  },
  created () {
    this.initDicts('fileDownload-type').then((res) => {
      this.init()
    })
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    parseTime,
    init () {
      this.loading = true
      const params = {
        size: this.pageSize,
        page: this.currentPage
      }
      if (this.query.originalName.trim()) {
        params.originalName = this.query.originalName.trim()
      }
      getDownTaskList(params).then((res) => {
        this.tableData = res.data.content
        this.total = res.data.totalElements
        this.loading = false
      })
    },
    handleSearch (val) {
      this.currentPage = 1
      this.init()
    },
    downFile (row) {
      // window.open(row.fileUrl, '_parent')
      const params =
        'originalFileName=' +
        row.originalFileName +
        '&' +
        'fileName=' +
        row.fileName
      fileIsExist({
        originalFileName: row.originalFileName,
        fileName: row.fileName
      })
        .then((res) => {
          if (res.data) {
            window.location.href = `${this.baseApi}cloud-util/fileDownload/download?${params}`
          }
        })
        .catch((e) => {
        })
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
      del(params).then((res) => {
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
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
