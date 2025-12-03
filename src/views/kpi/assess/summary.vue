<template>
  <div class="app-container">
    <j-card v-loading.fullscreen.lock="fullscreenLoading" class="box-card" shadow="never">
      <j-form
        ref="searchForm"
        class="head-container"
        :inline="true"
        :rules="rules"
        label-position="left"
        label-width="81px"
        :model="searchForm"
      >
        <j-form-item label="供应商" prop="supplierNameList">
          <j-select
            v-model="searchForm.supplierNameList"
            value-key="id"
            multiple
            collapse-tags
            filterable
            clearable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="searchSupplier"
            :loading="loading"
            @change="setSupplier"
          >
            <j-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="业务类型" prop="smallTypeList">
          <j-select
            v-model="searchForm.smallTypeList"
            value-key="smallTypeCode"
            multiple
            collapse-tags
            filterable
            clearable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getSmallType"
            :loading="loading"
            @change="typeChange"
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.smallTypeCode"
              :label="item.smallTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="BU">
          <j-select
            v-model="searchForm.buCodeList"
            filterable
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in buList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线">
          <j-select
            v-model="searchForm.lineCodeList"
            filterable
            clearable
            multiple
            collapse-tags
            @change="lineChange"
          >
            <j-option
              v-for="item in pdtLineList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="时间维度" prop="timeType">
          <j-select
            v-model="searchForm.timeType"
            clearable
            multiple
            collapse-tags
            @change="timeChange"
          >
            <j-option
              v-for="(value, key) in timeDic"
              :key="key"
              :label="value"
              :value="key"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="年度" prop="year">
          <j-date-picker
            v-model="searchForm.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          />
        </j-form-item>
        <j-form-item label="汇总维度">
          <j-select v-model="searchForm.summaryDimension">
            <j-option
              v-for="(value, key) in summaryDic"
              :key="key"
              :label="value"
              :value="key"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 10px">
          <j-button type="primary" @click="handleSearch">
            生成数据
          </j-button>
          <j-button @click="download">
            下载
          </j-button>
        </j-form-item>
      </j-form>
      <j-table
        border
        :data="tableData"
        style="width: 100%; margin-bottom: 10px"
        :header-cell-style="getHeadStyle"
        :cell-style="getCellStyle"
      >
        <!-- <j-table-column prop="category" label="品类" />
        <j-table-column prop="totalRank" label="品类总分排名" width="95" /> -->
        <j-table-column prop="supplierName" label="供应商" />
        <j-table-column prop="businessType" label="业务类型" />
        <j-table-column prop="buName" label="BU" />
        <j-table-column prop="lineName" label="产品线" />
        <!-- <j-table-column label="一月">
          <j-table-column prop="businessType" label="业务类型" />
          <j-table-column prop="quality" label="质量" />
          <j-table-column prop="qualityRank" label="质量排名" />
          <j-table-column prop="deliveryDate" label="交期" />
          <j-table-column prop="deliveryDateRank" label="交期排名" />
          <j-table-column prop="employ" label="服务" />
          <j-table-column prop="employRank" label="服务排名" />
          <j-table-column prop="totalScore" label="总得分" />
          <j-table-column prop="supplierName" label="月度排名" />
          <j-table-column label="红黄绿评价">
            <template slot-scope="scope">
              <span>{{ colorDic[scope.row.colourGrade] }}</span>
            </template>
          </j-table-column>
        </j-table-column> -->
        <j-table-column v-for="head in resHeader" :key="head.label" :label="head.label">
          <j-table-column label="业务类型">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'businessType') }}</span>
            </template>
          </j-table-column>
          <j-table-column label="质量">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'quality') }}</span>
            </template>
          </j-table-column>
          <j-table-column label="质量排名">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'qualityRank') }}</span>
            </template>
          </j-table-column>
          <j-table-column label="交期">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'deliveryDate') }}</span>
            </template>
          </j-table-column>
          <j-table-column label="交期排名">
            <template slot-scope="scope">
              <span>{{
                loopData(scope.row, head.label, 'deliveryDateRank')
              }}</span>
            </template>
          </j-table-column>
          <j-table-column label="服务">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'employ') }}</span>
            </template>
          </j-table-column>
          <j-table-column label="服务排名">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'employRank') }}</span>
            </template>
          </j-table-column>
          <j-table-column v-if="!head.label.includes('月')" label="成本">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'cost') }}</span>
            </template>
          </j-table-column>
          <j-table-column v-if="!head.label.includes('月')" label="成本排名">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'costRank') }}</span>
            </template>
          </j-table-column>
          <j-table-column v-if="!head.label.includes('月')" label="技术">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'technology') }}</span>
            </template>
          </j-table-column>
          <j-table-column v-if="!head.label.includes('月')" label="技术排名">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'technologyRank') }}</span>
            </template>
          </j-table-column>
          <j-table-column label="总得分">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'totalScore') }}</span>
            </template>
          </j-table-column>
          <j-table-column :label="timeDic[head.type] + '排名'">
            <template slot-scope="scope">
              <span>{{ loopData(scope.row, head.label, 'currentRank') }}</span>
            </template>
          </j-table-column>
          <j-table-column label="红黄绿评价" width="90">
            <template slot-scope="scope">
              <div :style="'width:100%;height:100%;position:absolute;top:0;left:0;bottom:0;right:0;vertical-align:middle;background-color:' + colorCss[loopData(scope.row, head.label, 'colourGrade')]">
                <div style="position: relative;top: 50%;transform: translateY(-50%);">
                  {{
                    colorDic[loopData(scope.row, head.label, 'colourGrade')]
                  }}
                </div>
              </div>
            </template>
          </j-table-column>
        </j-table-column>
      </j-table>
      <j-pagination
        :current-page="page"
        :page-sizes="[20, 50, 100]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </j-card>
  </div>
</template>
<script>
import * as assessApi from '@/api/kpi/assess'
import { getPdtLineList } from '@/api/supplier/pool'
import { getCodeList } from '@/views/common/dic'
import _ from 'lodash'

export default {
  name: 'SupplierSummary',
  data () {
    return {
      fullscreenLoading: false,
      loading: false,
      searchForm: {
        supplierNameList: [],
        supplierCode: '',
        smallTypeList: [],
        businessType: '',
        timeType: [],
        timeDimensions: '',
        year: new Date().getFullYear().toString(),
        buCodeList: [],
        lineCodeList: [],
        summaryDimension: ''
      },
      rules: {
        // smallTypeList: [
        //   { required: true, message: '请选择业务类型', trigger: 'change' }
        // ],
        // timeType: [
        //   { required: true, message: '请选择时间维度值', trigger: 'change' }
        // ],
        // supplierNameList: [
        //   { required: true, message: '请选择供应商', trigger: 'change' }
        // ]
      },
      timeDimensionList: [],
      timeAll: [],
      timeHeader: [
        {
          type: 2,
          label: '1月'
        },
        {
          type: 2,
          label: '2月'
        },
        {
          type: 2,
          label: '3月'
        },
        {
          type: 2,
          label: '4月'
        },
        {
          type: 2,
          label: '5月'
        },
        {
          type: 2,
          label: '6月'
        },
        {
          type: 2,
          label: '7月'
        },
        {
          type: 2,
          label: '8月'
        },
        {
          type: 2,
          label: '9月'
        },
        {
          type: 2,
          label: '10月'
        },
        {
          type: 2,
          label: '11月'
        },
        {
          type: 2,
          label: '12月'
        },
        {
          type: 3,
          label: '一季度'
        },
        {
          type: 3,
          label: '二季度'
        },
        {
          type: 3,
          label: '三季度'
        },
        {
          type: 3,
          label: '四季度'
        },
        {
          type: 5,
          label: '年'
        }
      ],
      timeDic: {
        2: '月度',
        3: '季度',
        5: '年度'
      },
      colorDic: {
        0: '红牌',
        1: '黄牌',
        2: '绿牌',
        '': ''
      },
      colorCss: {
        0: '#F56C6C',
        1: '#FAAD14',
        2: '#40AA0B'
      },
      summaryDic: {
        0: '产品线',
        1: 'BU',
        2: '业务类型'
      },
      smallTypeList: [],
      buList: [],
      pdtLineList: [],
      supplierVisible: false,
      supplierList: [],
      tableData: [],
      page: 1,
      size: 100,
      total: 0
    }
  },
  computed: {
    // 根据选择数据筛选月、季、年
    resHeader () {
      if (!this.searchForm.timeType.length) {
        return this.timeHeader
      }
      const newList = []
      this.timeHeader.forEach((head) => {
        if (this.searchForm.timeType.includes(head.type.toString())) newList.push(head)
      })
      return newList
    }
  },
  created () {
    this.getSelectData()
    this.getPdtLineData()
  },
  methods: {
    getSelectData () {
      getCodeList('code00034').then((list) => {
        this.buList = list
      })
    },
    // 获取产品线下拉
    getPdtLineData () {
      getPdtLineList().then((res) => {
        if (res && res.code === '0') {
          this.pdtLineList = res.data.records
        } else {
          this.showMessage(res.message)
        }
      })
    },
    lineChange (item) {
      this.searchForm.lineCode = item.code
      this.searchForm.lineName = item.name
    },
    getSmallType: _.debounce(function (keyword) {
      if (keyword) {
        this.loading = true
        assessApi
          .getSmallClassByName({ name: keyword })
          .then((res) => {
            if (res && res.code === '0') {
              this.smallTypeList = res.data.map((item) => ({
                smallTypeCode: item.smallTypeCode,
                smallTypeName: item.smallTypeName
              }))
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }, 500),
    // 业务类型改变
    typeChange (val) {
      this.searchForm.businessType = val
        .map((item) => item.smallTypeCode)
        .join(',')
    },
    timeChange (val) {
      this.searchForm.timeDimensions = val.join(',')
    },
    searchSupplier (name) {
      if (name) {
        this.loading = true
        assessApi
          .getSupplierByName({ name })
          .then((res) => {
            if (res && res.code === '0') {
              this.supplierList = res.data
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.supplierList = []
      }
    },
    setSupplier (val) {
      this.searchForm.supplierCode = val.map((item) => item.code).join(',')
    },
    // 搜索
    handleSearch () {
      // 设定年数据为选中年
      this.timeHeader[16].label = this.searchForm.year + '年'
      this.fullscreenLoading = true
      // this.$refs.searchForm.validate((valid) => {
      //   if (valid) {
      assessApi
        .getBillOverviewNew({
          supplierCode: this.searchForm.supplierCode,
          businessType: this.searchForm.businessType,
          timeDimensions: this.searchForm.timeDimensions,
          year: this.searchForm.year,
          buCode: this.searchForm.buCodeList.join(','),
          lineCode: this.searchForm.lineCodeList.join(','),
          summaryDimension: this.searchForm.summaryDimension,
          page: this.page,
          size: this.size
        })
        .then((res) => {
          if (res && res.code === '0') {
            if (res.data) {
              this.total = res.data.total
              this.tableData = res.data.records
            } else {
              this.showMessage('未查找到数据！')
            }
          } else {
            this.showMessage(res.message)
          }
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
      // } else {
      //   return false
      // }
      // })
    },
    handleSizeChange (val) {
      this.page = 1
      this.size = val
      this.handleSearch()
    },
    handleCurrentChange (val) {
      this.page = val
      this.handleSearch()
    },
    loopData (row, head, key) {
      const res = row.overviewList.filter(
        (item) => item.timeDimensionValue === head
      )
      return res.length ? res[0][key] : ''
    },
    download () {
      assessApi.billOverviewExport({
        supplierCode: this.searchForm.supplierCode,
        businessType: this.searchForm.businessType,
        timeDimensions: this.searchForm.timeDimensions,
        year: this.searchForm.year,
        buCode: this.searchForm.buCodeList.join(','),
        lineCode: this.searchForm.lineCodeList.join(','),
        summaryDimension: this.searchForm.summaryDimension
      })
    },
    getHeadStyle ({ row, column, rowIndex, columnIndex }) {
      const type =
        column.label.includes('月') && column.label.length <= 3
          ? 2
          : column.label.includes('季') && column.label.length === 3
            ? 3
            : column.label.includes('年') && column.label.length === 5
              ? 5
              : ''
      const colorDic = {
        2: '#fbbd43',
        3: '#f5b1f5',
        5: '#1890ff',
        '': '#fff0eb'
      }
      return `background:${colorDic[type]};font-weight:bold;text-align:center;`
    },
    getCellStyle ({ row, column, rowIndex, columnIndex }) {
      if (column.label === '红黄绿评价') {
        return 'cell-padding:0;padding:0;font-weight:bold;text-align:center;'
      }
    }
  }
}
</script>