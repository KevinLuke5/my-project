<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'info_update'" @click="handleEdit">
        {{ isLock ? '编辑' : '取消' }}
      </j-button>
      <j-button v-auth="'info_save'" type="primary" @click="handleSubmit">
        保存
      </j-button>
    </div>
    <j-form
      ref="infoForm"
      :inline="true"
      :rules="rules"
      :disabled="isLock"
      label-position="left"
      label-width="180px"
      :model="form"
      class="form-inline"
    >
      <j-row class="three-row">
        <j-col :span="8">
          <j-form-item label="企业编码">
            <j-input v-model="form.supplierCode" disabled />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="企业全称" prop="supplierName">
            <j-input v-model="form.supplierName" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="国家/地区" prop="country">
            <j-select v-model="form.country">
              <j-option label="中国" value="china" />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="主体类型" prop="subjectType">
            <j-select v-model="form.subjectType">
              <j-option label="有限责任公司" :value="0" />
              <j-option label="股份有限公司" :value="1" />
              <j-option label="合伙企业" :value="2" />
              <j-option label="全民所有制企业" :value="3" />
              <j-option label="集体所有制企业" :value="4" />
              <j-option label="农民专业合作社" :value="5" />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="企业英文全称" prop="supplierEnglishName">
            <j-input v-model="form.supplierEnglishName" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="省份">
            <j-select v-model="form.province" @change="initCity('clear')">
              <j-option
                v-for="item in provinceList"
                :key="item.adcode"
                :label="item.name"
                :value="item.name"
              />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="法人代表" prop="corporation">
            <j-input v-model="form.corporation" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="纳税人资格" prop="taxpayerQualification">
            <j-select v-model="form.taxpayerQualification">
              <j-option label="一般纳税人" :value="0" />
              <j-option label="小规模纳税人" :value="1" />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="城市">
            <j-select v-model="form.city">
              <j-option
                v-for="item in cityList"
                :key="item.adcode"
                :label="item.name"
                :value="item.name"
              />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="法人证件类型" prop="cardType">
            <j-select v-model="form.cardType">
              <j-option label="身份证" :value="0" />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="三证合一码" prop="mergeCode">
            <j-input v-model="form.mergeCode" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="注册详细地址" prop="address">
            <j-input v-model="form.address" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="法人证件号码" prop="cardCode">
            <j-input v-model="form.cardCode">
              <template slot="append">
                <div v-check="'getSupplierInfoById'">
                  <img
                    v-show="viewForm.cardCode.visible"
                    src="../../../assets/images/viewon.png"
                    width="22px"
                    @click="switchReal('cardCode',true)"
                  >
                  <img
                    v-show="!viewForm.cardCode.visible"
                    src="../../../assets/images/viewoff.png"
                    width="22px"
                    @click="switchReal('cardCode',false)"
                  >
                </div>
              </template>
            </j-input>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="企业成立时间" prop="establishDate">
            <j-date-picker
              v-model="form.establishDate"
              type="date"
              value-format="yyyy-MM-dd"
              :clearable="false"
            />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="公司网址">
            <j-input v-model="form.supplierUrl" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="注册资金" prop="registeredCapital">
            <j-input v-model.number="form.registeredCapital" placeholder="万元" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="企业性质" prop="enterpriseNature">
            <j-select v-model="form.enterpriseNature">
              <j-option label="民营" :value="0" />
              <j-option label="国有" :value="1" />
              <j-option label="外资" :value="2" />
              <j-option label="合资" :value="3" />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="主要联系人" prop="primaryLinkPerson">
            <j-input v-model="form.primaryLinkPerson" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="结算货币" prop="currency">
            <j-select v-model="form.currency">
              <j-option label="人民币RMB" :value="0" />
              <j-option label="美元USD" :value="1" />
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="管理人员数量" prop="managerNumber">
            <j-input v-model.number="form.managerNumber" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="联系人职务">
            <j-input v-model="form.linkPersonTitle" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="总经理/副总" prop="generalManager">
            <j-input v-model="form.generalManager" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="上年度员工平均人数" prop="employeesAverageNum">
            <j-input v-model.number="form.employeesAverageNum" placeholder="管理人员+工人" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="联系人手机" prop="linkPersonPhone">
            <j-input v-model="form.linkPersonPhone" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="总经理/副总联系方式" prop="contact">
            <j-input v-model="form.contact">
              <template slot="append">
                <img
                  v-show="viewForm.contact.visible"
                  src="../../../assets/images/viewon.png"
                  width="22px"
                  @click="switchReal('contact',true)"
                >
                <img
                  v-show="!viewForm.contact.visible"
                  src="../../../assets/images/viewoff.png"
                  width="22px"
                  @click="switchReal('contact',false)"
                >
              </template>
            </j-input>
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="企业电话" prop="telephone">
            <j-input v-model="form.telephone" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="联系人邮件" prop="linkPersonMail">
            <j-input v-model="form.linkPersonMail" />
          </j-form-item>
        </j-col>

        <j-col :span="8">
          <j-form-item label="三年营业额(万元)" prop="triennialTurnover">
            <j-input v-model.number="form.triennialTurnover" placeholder="万元" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="行业" prop="industry">
            <j-input v-model="form.industry" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="区域" prop="area">
            <j-input v-model="form.area" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="行业排名" prop="industryRanking">
            <j-input v-model="form.industryRanking" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="上年度内销占比" prop="domesticSalesRatio">
            <j-input v-model="form.domesticSalesRatio" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="上年度外销占比" prop="exportSalesRatio">
            <j-input v-model="form.exportSalesRatio" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="专利总数" prop="patentQty">
            <j-input v-model.number="form.patentQty" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="发明专利数" prop="inventionPatentQty">
            <j-input v-model.number="form.inventionPatentQty" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="实用新型专利数" prop="utilityPatentQty">
            <j-input v-model.number="form.utilityPatentQty" />
          </j-form-item>
        </j-col>
        <j-col :span="8">
          <j-form-item label="外观专利数" prop="designPatentQty">
            <j-input v-model.number="form.designPatentQty" />
          </j-form-item>
        </j-col>
        <j-col :span="24">
          <j-form-item label="近两年是否存在违法受罚情况" prop="isPunishment">
            <j-radio-group v-model="form.isPunishment" :disabled="isLock">
              <j-radio :label="1">
                是
              </j-radio>
              <j-radio :label="0">
                否
              </j-radio>
            </j-radio-group>
          </j-form-item>
          <!-- <j-form-item v-show="form.isPunishment" prop="punishment">
            <j-input v-model="form.punishment" />
          </j-form-item> -->
        </j-col>
        <j-col :span="24">
          <j-form-item v-show="form.isPunishment" label=" " prop="punishment">
            <j-input v-model="form.punishment" :rows="1" type="textarea" />
          </j-form-item>
        </j-col>
        <j-col :span="24">
          <j-form-item label="是否购买财产险及责任险" prop="isInsurance">
            <j-radio-group v-model="form.isInsurance" :disabled="isLock">
              <j-radio :label="1">
                是
              </j-radio>
              <j-radio :label="0">
                否
              </j-radio>
            </j-radio-group>
          </j-form-item>
          <j-form-item v-show="form.isInsurance" prop="accessory">
            <img-upload ref="imgUpload" text="上传图片" @getFiles="getFiles" />
          </j-form-item>
        </j-col>
      </j-row>

      <j-row class="one-row">
        <j-col :span="24">
          <j-form-item label="经营范围" prop="businessScope">
            <j-input v-model="form.businessScope" />
          </j-form-item>
        </j-col>
        <j-col :span="24">
          <j-form-item label="企业信息化系统" prop="informationSystem">
            <j-input v-model="form.informationSystem" style="width: 500px" placeholder="SRM\MES\QMS\ERP等" />
          </j-form-item>
        </j-col>
        <j-col :span="24">
          <j-form-item label="企业简介" prop="profile">
            <j-input v-model="form.profile" :rows="5" type="textarea" />
          </j-form-item>
        </j-col>
      </j-row>
    </j-form>
  </div>
</template>
<script>
import * as poolApi from '@/api/supplier/pool'
import { getRegion } from '@/api/region/region'
const urlType = 'info'

export default {
  data () {
    const checkPunish = (rule, value, callback) => {
      if (this.form.isPunishment) {
        if (this.form.punishment && this.form.punishment.trim()) {
          callback()
        } else {
          callback(new Error('请输入违法受罚情况'))
        }
      } else {
        callback()
      }
    }
    const checkFile = (rule, value, callback) => {
      if (this.form.isInsurance) {
        if (this.form.accessory && this.form.accessory.length) {
          callback()
        } else {
          callback(new Error('请上传图片'))
        }
      } else {
        callback()
      }
    }
    return {
      isLock: true,
      form: {
        supplierCode: '',
        supplierName: '',
        country: '',
        subjectType: '',
        supplierEnglishName: '',
        province: '',
        corporation: '',
        taxpayerQualification: '',
        city: '',
        cardType: '',
        mergeCode: '',
        address: '',
        cardCode: '',
        establishDate: '',
        supplierUrl: '',
        registeredCapital: '',
        enterpriseNature: '',
        primaryLinkPerson: '',
        currency: '',
        managerNumber: '',
        linkPersonTitle: '',
        generalManager: '',
        employeesAverageNum: '',
        linkPersonPhone: '',
        contact: '',
        telephone: '',
        linkPersonMail: '',
        businessScope: '',
        informationSystem: '',
        profile: '',
        triennialTurnover: '',
        industry: '',
        area: '',
        industryRanking: '',
        domesticSalesRatio: '',
        exportSalesRatio: '',
        patentQty: '',
        inventionPatentQty: '',
        utilityPatentQty: '',
        designPatentQty: '',
        isPunishment: '',
        punishment: '',
        isInsurance: '',
        accessory: []
      },
      tempForm: {},
      viewForm: {
        // 法人证件号码
        cardCode: {
          fake: '',
          real: '',
          visible: true
        },
        // 总经理/副总联系方式
        contact: {
          fake: '',
          real: '',
          visible: true
        }
      },
      provinceList: [],
      cityList: [],
      rules: {
        supplierName: [
          { required: true, message: '请输入企业全称', trigger: 'blur' }
        ],
        country: [
          { required: true, message: '请选择国家/地区', trigger: 'change' }
        ],
        subjectType: [
          { required: true, message: '请选择主体类型', trigger: 'change' }
        ],
        // supplierEnglishName: [
        //   { required: true, message: '请输入企业英文全称', trigger: 'blur' }
        // ],
        corporation: [
          { required: true, message: '请输入法人代表', trigger: 'blur' }
        ],
        taxpayerQualification: [
          { required: true, message: '请选择纳税人资格', trigger: 'change' }
        ],
        cardType: [
          { required: true, message: '请选择法人证件类型', trigger: 'change' }
        ],
        mergeCode: [
          { required: true, message: '请输入三证合一码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入注册详细地址', trigger: 'blur' }
        ],
        cardCode: [
          { required: true, message: '请输入法人证件号码', trigger: 'blur' }
          // {
          //   pattern:
          //     /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          //   message: '请输入合法身份证号',
          //   trigger: 'blur'
          // }
        ],
        establishDate: [
          { required: true, message: '请选择企业成立时间', trigger: 'change' }
        ],
        registeredCapital: [
          { required: true, message: '请输入注册资金', trigger: 'blur' }
          // { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        enterpriseNature: [
          { required: true, message: '请选择企业性质', trigger: 'change' }
        ],
        primaryLinkPerson: [
          { required: true, message: '请输入主要联系人', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '请选择结算货币', trigger: 'change' }
        ],
        managerNumber: [
          { required: true, message: '请输入管理人员数量', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        generalManager: [
          { required: true, message: '请输入总经理/副总', trigger: 'blur' }
        ],
        employeesAverageNum: [
          {
            required: true,
            message: '请输入上年度员工平均人数',
            trigger: 'blur'
          },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        linkPersonPhone: [
          { required: true, message: '请输入联系人手机', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: '请输入合法手机号', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: '请输入合法手机号', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入企业电话', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: '请输入合法企业电话', trigger: 'blur' }
        ],
        linkPersonMail: [
          {
            type: 'email',
            required: true,
            message: '请输入联系人邮件',
            trigger: 'blur'
          }
        ],
        businessScope: [
          { required: true, message: '请输入经营范围', trigger: 'blur' }
        ],
        informationSystem: [
          { required: true, message: '请输入企业信息化系统', trigger: 'blur' }
        ],
        profile: [
          { required: true, message: '请输入企业简介', trigger: 'blur' }
        ],
        triennialTurnover: [
          { required: true, message: '请输入三年营业额', trigger: 'blur' }
          // { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        industry: [{ required: true, message: '请输入行业', trigger: 'blur' }],
        area: [{ required: true, message: '请输入区域', trigger: 'blur' }],
        industryRanking: [
          { required: true, message: '请输入行业排名', trigger: 'blur' }
        ],
        domesticSalesRatio: [
          { required: true, message: '请输入上年度内销占比', trigger: 'blur' }
        ],
        exportSalesRatio: [
          { required: true, message: '请输入上年度外销占比', trigger: 'blur' }
        ],
        patentQty: [
          { required: true, message: '请输入专利总数', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        inventionPatentQty: [
          { required: true, message: '请输入发明专利数', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        utilityPatentQty: [
          { required: true, message: '请输入实用新型专利数', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        designPatentQty: [
          { required: true, message: '请输入外观专利数', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        isPunishment: [
          {
            required: true,
            message: '请选择是否存在违法受罚情况',
            trigger: 'change'
          }
        ],
        punishment: [{ validator: checkPunish, trigger: 'blur' }],
        isInsurance: [
          {
            required: true,
            message: '请选择是否购买财产险及责任险',
            trigger: 'change'
          }
        ],
        accessory: [
          { required: true, validator: checkFile, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.init('created')
    this.initProvince()
    setTimeout(() => {
      // 同时调用地址接口第二个会不成功，所以延迟一秒再调用
      this.initCity()
    }, 1000)
  },
  // beforeDestroy () {
  //   console.log('离开基础信息')
  //   if (!this.isLock) {
  //     console.log('基础信息保存一下')
  //     this.handleSubmit()
  //   }
  // },
  methods: {
    initProvince () {
      getRegion().then((res) => {
        if (res.code === '0') {
          this.provinceList = res.data.content[0].districts
        }
      })
    },
    initCity (clear) {
      if (clear) {
        // 重新选省份清空城市
        this.form.city = ''
      }
      getRegion({ keywords: this.form.province }).then((res) => {
        if (res.code === '0') {
          this.cityList = res.data.content[0].districts
        }
      })
    },
    getFiles (type, files) {
      if (type === 'img') {
        this.form.accessory = files
      }
      this.$refs.infoForm.validateField('accessory')
    },
    init (created) {
      poolApi
        .getSrmHandle({
          type: urlType,
          supplierId: this.$route.query.supplierId
        })
        .then((res) => {
          if (res && res.code === '0' && res.data && res.data[0]) {
            this.form = res.data[0]
            // 初始化图片
            this.$refs.imgUpload.fileList = this.form.accessory && this.form.accessory.length ? this.form.accessory : []
          }
        })
        .finally(() => {
          // 第一次填写没有供应商数据自动带过去
          if (
            created === 'created' &&
            !this.form.supplierCode &&
            !this.form.supplierName
          ) {
            this.form.supplierCode = this.$route.query.code
            this.form.supplierName = this.$route.query.name
          }
        })
    },
    handleEdit () {
      if (this.isLock) {
        this.isLock = false
        // 保存一下编辑前的数据
        this.tempForm = JSON.parse(JSON.stringify(this.form))
      } else {
        this.isLock = true
        // 恢复编辑前的数据
        this.form = JSON.parse(JSON.stringify(this.tempForm))
        // 清空校验
        this.$refs.infoForm.clearValidate()
      }
    },
    handleSubmit () {
      this.$refs.infoForm.validate((valid, obj) => {
        console.log(valid, obj)
        if (valid) {
          poolApi
            .saveSrmHandle(
              Object.assign(
                { type: urlType, supplierId: this.$route.query.supplierId },
                this.form
              )
            )
            .then((res) => {
              if (res.code === '0') {
                this.showMessage('保存成功!', 'success')
                this.init()
                this.isLock = true
              } else {
                this.showMessage(res.message)
              }
            })
        } else {
          this.showMessage('保存失败，请检查信息是否填写完整!')
          return false
        }
      })
    },
    switchReal (filed, isreal) {
      if (isreal) {
        poolApi.getSupplierInfoById({ id: this.form.id })
          .then((res) => {
            if (res.code === '0') {
              const real = res.data[filed]
              // console.log(res.data[filed])
              this.viewForm[filed].fake = this.form[filed]
              this.viewForm[filed].real = real
              this.form[filed] = real
              this.viewForm[filed].visible = false
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.form[filed] = this.viewForm[filed].fake
        this.viewForm[filed].visible = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.three-row {
  ::v-deep .el-input__inner {
    width: 200px;
  }
  ::v-deep .el-input-group__append {
    background-color: #fff;
    border: 0;
    padding: 0 10px;
  }
}
.one-row {
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    width: 610px;
  }
}
</style>