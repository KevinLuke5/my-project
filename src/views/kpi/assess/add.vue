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
        <j-form-item label="业务类型" prop="smallTypeList">
          <j-select
            v-model="addForm.smallTypeList"
            value-key="smallTypeCode"
            multiple
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getSmallType"
            :loading="loading"
            style="width: 626px;"
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
        <div>
          <j-form-item label="模板名称" prop="templateItem">
            <j-select v-model="addForm.templateItem" value-key="id" @change="nameChange">
              <j-option
                v-for="item in nameList"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </j-select>
          </j-form-item>
          <j-form-item label="时间维度值" prop="timeType">
            <j-cascader
              :key="keyValue"
              v-model="addForm.timeType"
              :props="{ expandTrigger: 'hover' }"
              :options="timeOptions"
              @focus="checkTimeSelect"
              @change="handleTimeChange"
            />
          </j-form-item>
          <j-form-item label="考核周期" prop="timeRange">
            <j-date-picker
              v-model="addForm.timeRange"
              type="daterange"
              range-separator="~"
              value-format="yyyy-MM-dd"
              @change="handleRangeChange"
            />
          </j-form-item>
          <j-form-item label="BU" prop="department">
            <j-select v-model="addForm.department" value-key="lineNumber">
              <j-option
                v-for="item in buList"
                :key="item.id"
                :label="item.name"
                :value="item.lineNumber"
              />
            </j-select>
          </j-form-item>
        </div>
        <j-form-item label="供应商" prop="supplierNames">
          <!-- <j-input v-model="addForm.supplierNames" disabled>
            <j-button slot="append" @click="selectSupplier">
              选择
            </j-button>
          </j-input> -->
          <j-select
            v-model="addForm.supplierNames"
            value-key="id"
            multiple
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="searchSupplier"
            :loading="loading"
            style="width: 626px;"
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
      </j-form>
      <!-- 选择供应商 -->
      <!-- <j-dialog
        title="选择供应商"
        :visible.sync="supplierVisible"
        width="620px"
        :before-close="closeSupplier"
      >
        <j-transfer
          v-model="addForm.supplierName"
          :titles="['全部', '已添加']"
          filterable
          :filter-method="searchSupplier"
          filter-placeholder="请输入供应商关键词搜索"
          :data="supplierList"
        />
        <span slot="footer" class="dialog-footer">
          <j-button @click="closeSupplier">取 消</j-button>
          <j-button type="primary" @click="setSupplier">确 认</j-button>
        </span>
      </j-dialog> -->
    </j-card>
  </div>
</template>
<script>
import * as assessApi from '@/api/kpi/assess'
import { getCodeList, timeDimensionList } from '@/views/common/dic'
import _ from 'lodash'

export default {
  data () {
    return {
      fullscreenLoading: false,
      loading: false,
      addForm: {
        smallTypeList: [],
        templateItem: {},
        templateId: '',
        timeType: [],
        timeDimension: '',
        timeDimensionValue: '',
        timeRange: [],
        // accessPeriod: '',
        accessStartTime: '',
        accessEndTime: '',
        department: '',
        supplierNames: [],
        supplierIds: []
      },
      rules: {
        smallTypeList: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        templateItem: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        timeType: [
          { required: true, message: '请选择时间维度值', trigger: 'change' }
        ],
        timeRange: [
          { required: true, message: '请选择考核周期', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择BU', trigger: 'change' }
        ],
        supplierNames: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ]
      },
      keyValue: 0,
      timeOptions: [],
      // timeAll: [
      //   {
      //     value: 0,
      //     label: '周',
      //     children: [
      //       {
      //         value: '第一周',
      //         label: '第一周'
      //       },
      //       {
      //         value: '第二周',
      //         label: '第二周'
      //       },
      //       {
      //         value: '第三周',
      //         label: '第三周'
      //       },
      //       {
      //         value: '第四周',
      //         label: '第四周'
      //       }
      //     ]
      //   },
      //   {
      //     value: 1,
      //     label: '半月度',
      //     children: [
      //       {
      //         value: '上半月',
      //         label: '上半月'
      //       },
      //       {
      //         value: '下半月',
      //         label: '下半月'
      //       }
      //     ]
      //   },
      //   {
      //     value: 2,
      //     label: '月度',
      //     children: [
      //       {
      //         value: '1',
      //         label: '1月'
      //       },
      //       {
      //         value: '2',
      //         label: '2月'
      //       },
      //       {
      //         value: '3',
      //         label: '3月'
      //       },
      //       {
      //         value: '4',
      //         label: '4月'
      //       },
      //       {
      //         value: '5',
      //         label: '5月'
      //       },
      //       {
      //         value: '6',
      //         label: '6月'
      //       },
      //       {
      //         value: '7',
      //         label: '7月'
      //       },
      //       {
      //         value: '8',
      //         label: '8月'
      //       },
      //       {
      //         value: '9',
      //         label: '9月'
      //       },
      //       {
      //         value: '10',
      //         label: '10月'
      //       },
      //       {
      //         value: '11',
      //         label: '11月'
      //       },
      //       {
      //         value: '12',
      //         label: '12月'
      //       }
      //     ]
      //   },
      //   {
      //     value: 3,
      //     label: '季度',
      //     children: [
      //       {
      //         value: '一季度',
      //         label: '一季度'
      //       },
      //       {
      //         value: '二季度',
      //         label: '二季度'
      //       },
      //       {
      //         value: '三季度',
      //         label: '三季度'
      //       },
      //       {
      //         value: '四季度',
      //         label: '四季度'
      //       }
      //     ]
      //   },
      //   {
      //     value: 4,
      //     label: '半年度',
      //     children: [
      //       {
      //         value: '上半年',
      //         label: '上半年'
      //       },
      //       {
      //         value: '下半年',
      //         label: '下半年'
      //       }
      //     ]
      //   },
      //   {
      //     value: 5,
      //     label: '年度',
      //     children: [
      //       {
      //         value: '2022年',
      //         label: '2022年'
      //       },
      //       {
      //         value: '2023年',
      //         label: '2023年'
      //       },
      //       {
      //         value: '2024年',
      //         label: '2024年'
      //       },
      //       {
      //         value: '2025年',
      //         label: '2025年'
      //       }
      //     ]
      //   }
      // ],
      timeAll: [],
      nameList: [],
      buList: [],
      smallTypeList: [],
      supplierVisible: false,
      supplierList: []
    }
  },
  watch: {
    timeOptions () {
      this.keyValue++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    }
  },
  created () {
    this.initTime()
    this.getSelectData()
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
    },
    getSelectData () {
      assessApi.getTemplateNameList().then((res) => {
        if (res && res.code === '0') {
          this.nameList = res.data
        }
      })
      getCodeList('code00034').then((list) => {
        this.buList = list
      })
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
      console.log(val)
    },
    // 模板改变
    nameChange (item) {
      if (item.name) {
        this.addForm.templateId = item.id
        this.addForm.timeDimension = item.timeDimension
        this.getTimeOptions()
      }
    },
    // 根据选择的模板带出考核周期
    getTimeOptions () {
      if (this.addForm.templateId) {
        this.timeOptions = this.timeAll.filter(
          (item) => item.value === this.addForm.timeDimension
        )
      } else {
        this.showMessage('无法获取该模板对应的考核周期！')
      }
    },
    checkTimeSelect () {
      if (!this.addForm.templateId) this.showMessage('请先选择模板！')
    },
    handleTimeChange (timeType) {
      if (timeType && timeType.length) {
        this.addForm.timeDimension = timeType[0]
        this.addForm.timeDimensionValue = timeType[1]
      }
    },
    handleRangeChange (timeRange) {
      if (timeRange && timeRange.length) {
        // this.addForm.accessPeriod = timeRange.join(',')
        this.addForm.accessStartTime = timeRange[0]
        this.addForm.accessEndTime = timeRange[1]
      } else {
        // this.addForm.accessPeriod = ''
        this.addForm.accessStartTime = ''
        this.addForm.accessEndTime = ''
      }
    },
    // selectSupplier () {
    //   if (
    //     // 选择供应商前校验其他是否填写
    //     this.addForm.templateId &&
    //     this.addForm.timeDimensionValue &&
    //     this.addForm.timeRange.length &&
    //     this.addForm.department
    //   ) {
    //     this.supplierVisible = true
    //     assessApi.getSupplierByName().then((res) => {
    //       if (res && res.code === '0') {
    //         this.supplierList = this.formatSupplier(res.data)
    //       }
    //     })
    //   } else {
    //     this.showMessage('请先填写完整信息再选择供应商！')
    //   }
    // },
    // formatSupplier (list) {
    //   const data = []
    //   list.forEach((item, index) => {
    //     data.push({
    //       label: item.name,
    //       key: item.id,
    //       data: item
    //     })
    //   })
    //   return data
    // },
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
    setSupplier (suppliers) {
      this.addForm.supplierIds = suppliers.map((item) => item.id)
    },
    // 创建
    handleSubmit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          assessApi
            .insertBatchSrmAccessBill(Object.assign(this.addForm))
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
        smallTypeList: [],
        templateItem: {},
        templateId: '',
        timeType: [],
        timeDimension: '',
        timeDimensionValue: '',
        timeRange: [],
        // accessPeriod: '',
        accessStartTime: '',
        accessEndTime: '',
        department: '',
        supplierNames: [],
        supplierIds: []
      }
    }
    // closeSupplier () {
    //   this.supplierVisible = false
    // }
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