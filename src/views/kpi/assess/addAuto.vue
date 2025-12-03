<template>
  <div class="app-container">
    <j-card v-loading.fullscreen.lock="fullscreenLoading" class="box-card" shadow="never">
      <div class="right-top-btn">
        <j-button type="primary" @click="handleSubmit">
          创建
        </j-button>
        <j-button @click="reset">
          重置
        </j-button>
        <j-button @click="goback">
          返回
        </j-button>
      </div>
      <j-form
        ref="addForm"
        :inline="true"
        :rules="rules"
        label-position="left"
        label-width="81px"
        :model="addForm"
      >
        <j-form-item label="时间维度值" prop="timeType">
          <j-cascader
            :key="keyValue"
            v-model="addForm.timeType"
            :props="{ expandTrigger: 'hover' }"
            :options="timeOptions"
            @change="handleTimeChange"
          />
        </j-form-item>
        <j-form-item label="考核周期" prop="timeRange">
          <j-date-picker
            v-model="addForm.timeRange"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleRangeChange"
          />
        </j-form-item>
      </j-form>
    </j-card>
  </div>
</template>
<script>
import * as assessApi from '@/api/kpi/assess'
import { timeDimensionList } from '@/views/common/dic'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      fullscreenLoading: false,
      loading: false,
      addForm: {
        timeType: [],
        timeDimension: '',
        timeDimensionValue: '',
        timeRange: [],
        accessStartTime: '',
        accessEndTime: ''
      },
      rules: {
        timeType: [
          { required: true, message: '请选择时间维度值', trigger: 'change' }
        ],
        timeRange: [
          { required: true, message: '请选择考核周期', trigger: 'change' }
        ]
      },
      keyValue: 0,
      timeOptions: [],
      timeAll: []
    }
  },
  watch: {
    timeOptions () {
      this.keyValue++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    }
  },
  created () {
    this.initTime()
  },
  methods: {
    initTime () {
      this.timeAll = timeDimensionList
      const year = new Date().getFullYear()
      this.timeAll[5].children = [
        {
          value: year - 3 + '年',
          label: year - 3 + '年'
        },
        {
          value: year - 2 + '年',
          label: year - 2 + '年'
        },
        {
          value: year - 1 + '年',
          label: year - 1 + '年'
        },
        {
          value: year + '年',
          label: year + '年'
        },
        {
          value: year + 1 + '年',
          label: year + 1 + '年'
        },
        {
          value: year + 2 + '年',
          label: year + 2 + '年'
        },
        {
          value: year + 3 + '年',
          label: year + 3 + '年'
        }
      ]
      this.timeOptions = this.timeAll
    },
    handleTimeChange (timeType) {
      // console.log(timeType)
      this.formatInitRange(timeType)
      if (timeType && timeType.length) {
        this.addForm.timeDimension = timeType[0]
        this.addForm.timeDimensionValue = timeType[1]
      }
    },
    formatInitRange (timeDimension) {
      const timeHandlers = {
        0: this.getWeek,
        1: this.getHalfMonth,
        2: this.getMonth,
        3: this.getQuarter,
        4: this.getHalfYear,
        5: this.getYear
      }

      const [dimension, time] = timeDimension
      const handler = timeHandlers[dimension]
      const res = handler(time)

      this.addForm.timeRange = res
      this.handleRangeChange(res)
    },
    getWeek (time) {
      const weekRanges = {
        '第一周': [0, 6],
        '第二周': [7, 13],
        '第三周': [14, 20],
        '第四周': [21, -1]
      }

      const [start, end] = weekRanges[time]
      const firstDay = dayjs().startOf('month').add(start, 'day').format('YYYY-MM-DD 00:00:00')
      const lastDay = end === -1 ? dayjs().endOf('month').format('YYYY-MM-DD 00:00:00') : dayjs().startOf('month').add(end, 'day').format('YYYY-MM-DD 00:00:00')
  
      return [firstDay, lastDay]
    },
    getHalfMonth (time) {
      const halfMonthRanges = {
        '上半月': [0, 14],
        '下半月': [15, -1]
      }

      const [start, end] = halfMonthRanges[time]
      const firstDay = start === 0 ? dayjs().startOf('month').format('YYYY-MM-DD 00:00:00') : dayjs().startOf('month').add(start, 'day').format('YYYY-MM-DD 00:00:00')
      const lastDay = end === -1 ? dayjs().endOf('month').format('YYYY-MM-DD 00:00:00') : dayjs().startOf('month').add(end, 'day').endOf('day').format('YYYY-MM-DD 00:00:00')
  
      return [firstDay, lastDay]
    },
    getMonth (time) {
      const monthRanges = {
        '1月': 0,
        '2月': 1,
        '3月': 2,
        '4月': 3,
        '5月': 4,
        '6月': 5,
        '7月': 6,
        '8月': 7,
        '9月': 8,
        '10月': 9,
        '11月': 10,
        '12月': 11
      }

      const monthIndex = monthRanges[time]
      const firstDayOfMonth = dayjs().startOf('year').add(monthIndex, 'month').format('YYYY-MM-DD 00:00:00')
      const lastDayOfMonth = dayjs().startOf('year').add(monthIndex, 'month').endOf('month').format('YYYY-MM-DD 00:00:00')
  
      return [firstDayOfMonth, lastDayOfMonth]
    },
    getQuarter (time) {
      const quarterRanges = {
        '一季度': 0,
        '二季度': 1,
        '三季度': 2,
        '四季度': 3
      }

      const quarterIndex = quarterRanges[time]
      const firstDayOfQuarter = dayjs().startOf('year').add(quarterIndex * 3, 'month').format('YYYY-MM-DD 00:00:00')
      const lastDayOfQuarter = dayjs().startOf('year').add(quarterIndex * 3 + 2, 'month').endOf('month').format('YYYY-MM-DD 00:00:00')
  
      return [firstDayOfQuarter, lastDayOfQuarter]
    },
    getHalfYear (time) {
      const halfYearRanges = {
        '上半年': [0, 5],
        '下半年': [6, -1]
      }

      const [start, end] = halfYearRanges[time]
      const firstDay = start === 0 ? dayjs().startOf('year').format('YYYY-MM-DD 00:00:00') : dayjs().startOf('year').add(start, 'month').format('YYYY-MM-DD 00:00:00')
      const lastDay = end === -1 ? dayjs().endOf('year').format('YYYY-MM-DD 00:00:00') : dayjs().startOf('year').add(end, 'month').endOf('month').format('YYYY-MM-DD 00:00:00')
  
      return [firstDay, lastDay]
    },
    getYear (time) {
      const year = time.substring(0, 4)
      const firstDayOfYear = dayjs(year).startOf('year').format('YYYY-MM-DD 00:00:00')
      const lastDayOfYear = dayjs(year).endOf('year').format('YYYY-MM-DD 00:00:00')
  
      return [firstDayOfYear, lastDayOfYear]
    },
    handleRangeChange (timeRange) {
      if (timeRange && timeRange.length) {
        this.addForm.accessStartTime = timeRange[0]
        this.addForm.accessEndTime = timeRange[1]
      } else {
        this.addForm.accessStartTime = ''
        this.addForm.accessEndTime = ''
      }
    },
    // 创建
    handleSubmit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          assessApi
            .insertBatchSrmAccessBillNew(Object.assign(this.addForm))
            .then((res) => {
              if (res && res.code === '0') {
                this.showMessage('操作成功!', 'success')
                this.reset()
                // 关闭当前标签并跳转考核主页
                this.$store.dispatch('tagsView/delView', this.$route).then(() => {
                  this.$router.replace({
                    path: '/kpi/assess/index'
                  }).then(() => {
                    // 进入考核主页并强制刷新
                    this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
                      const { fullPath } = this.$route
                      this.$nextTick(() => {
                        this.$router.replace({
                          path: '/redirect' + fullPath
                        })
                      })
                    })
                  })
                })
              } else {
                // this.showMessage(res.message)
                this.$message({
                  showClose: true,
                  duration: 0,
                  message: res.message,
                  type: 'warning'
                })
              }
            })
        } else {
          return false
        }
      })
    },
    goback () {
      this.$router.push({
        path: '/kpi/assess/index',
        query: { type: this.type, handle: 'add' }
      })
    },
    reset () {
      this.addForm = {
        timeType: [],
        timeDimension: '',
        timeDimensionValue: '',
        timeRange: [],
        accessStartTime: '',
        accessEndTime: ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.right-top-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>