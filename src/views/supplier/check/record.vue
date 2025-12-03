<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <div v-for="(item, index) in allTabs" :key="item.key">
        <!-- 标题 -->
        <div class="record-title">
          {{ indexDic[index + 1] }}、{{ item.label }}
        </div>
        <!-- 基础信息表单 -->
        <j-form
          v-if="item.type === 'form'"
          :inline="true"
          :disabled="true"
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
                <j-select v-model="form.province">
                  <!-- <j-option
                  v-for="item in provinceList"
                  :key="item.adcode"
                  :label="item.name"
                  :value="item.adcode"
                /> -->
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
                  <!-- <j-option
                  v-for="item in cityList"
                  :key="item.adcode"
                  :label="item.name"
                  :value="item.adcode"
                /> -->
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
                <j-input v-model="form.cardCode" />
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
                <j-input v-model="form.registeredCapital" placeholder="万元" />
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
                <j-input v-model="form.managerNumber" />
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
                <j-input v-model="form.employeesAverageNum" placeholder="管理人员+工人" />
              </j-form-item>
            </j-col>
            <j-col :span="8">
              <j-form-item label="联系人手机" prop="linkPersonPhone">
                <j-input v-model="form.linkPersonPhone" />
              </j-form-item>
            </j-col>
            <j-col :span="8">
              <j-form-item label="联系方式" prop="contact">
                <j-input v-model="form.contact" />
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
                <j-input v-model="form.triennialTurnover" placeholder="万元" />
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
                <j-input v-model="form.patentQty" />
              </j-form-item>
            </j-col>
            <j-col :span="8">
              <j-form-item label="发明专利数" prop="inventionPatentQty">
                <j-input v-model="form.inventionPatentQty" />
              </j-form-item>
            </j-col>
            <j-col :span="8">
              <j-form-item label="实用新型专利数" prop="utilityPatentQty">
                <j-input v-model="form.utilityPatentQty" />
              </j-form-item>
            </j-col>
            <j-col :span="8">
              <j-form-item label="外观专利数" prop="designPatentQty">
                <j-input v-model="form.designPatentQty" />
              </j-form-item>
            </j-col>
            <j-col :span="24">
              <j-form-item label="近两年是否存在违法受罚情况" prop="isPunishment">
                <j-radio-group v-model="form.isPunishment">
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
                <j-radio-group v-model="form.isInsurance">
                  <j-radio :label="1">
                    是
                  </j-radio>
                  <j-radio :label="0">
                    否
                  </j-radio>
                </j-radio-group>
              </j-form-item>
              <j-form-item v-show="form.isInsurance" prop="accessory">
                <img-upload ref="imgUpload" :can-upload="false" />
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
        <!-- 架构 -->
        <template v-else-if="item.type === 'org'">
          <div class="org-tree-cont">
            <vue2-org-tree :data="tableToTree(docData[item.key])" :render-content="renderContent" />
          </div>
          <div class="org-tree-btn">
            <file-upload :ref="item.key + 'FileUpload'" :can-upload="false" />
          </div>
        </template>
        <!-- 表格类 -->
        <j-table-with-page
          v-else
          :columns="strToVar(item.key + 'Columns')"
          :data-source="docData[item.key]"
          :options="tableOptions"
        />
      </div>
    </j-card>
    <img-viewer ref="imgViewer" :can-download="canDownload" />
    <pdf-viewer ref="pdfViewer" :can-download="canDownload" />
    <file-viewer ref="fileViewer" :can-download="canDownload" />
  </div>
</template>
<script>
import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'
// import _ from 'lodash'
import { getCodeList } from '@/views/common/dic'
import { getRecord } from '@/api/supplier/check'

export default {
  components: { Vue2OrgTree },
  data () {
    return {
      canDownload: true,
      docData: {},
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
      orgData: {
        num: '',
        positionName: '',
        children: []
      },
      relationColumns: [
        {
          label: '干系人分类',
          // render: (h, row) => <span>{this.relation_typeDic[row.personType]}</span>
          render: (h, row) => (
            <span>
              {this.relation_typeList.length
                ? (this.relation_typeList.find((dic) => dic.lineNumber === row.personType) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'relation',
          label: '关系'
        },
        {
          prop: 'department',
          label: '部门'
        },
        {
          prop: 'duty',
          label: '职务'
        },
        {
          prop: 'userName',
          label: '姓名'
        },
        {
          prop: 'telephone',
          label: '联系电话'
        },
        {
          prop: 'cardId',
          label: '身份证号'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      cooperationColumns: [
        {
          prop: 'materialCode',
          label: '物料编码'
        },
        {
          prop: 'materialName',
          label: '物料描述'
        },
        {
          prop: 'orderConditions',
          label: '订货条件'
        },
        {
          prop: 'price',
          label: '单价（元）'
        },
        {
          prop: 'deliveryDate',
          label: '交期（天）'
        },
        {
          prop: 'payConditions',
          label: '付款条件'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      evaluateColumns: [
        {
          prop: 'dimension',
          label: '维度'
        },
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'score',
          label: '分值'
        },
        {
          prop: 'conclusion',
          label: '结论'
        },
        {
          prop: 'describe',
          label: '详情描述'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      certificateColumns: [
        {
          prop: 'certificateName',
          label: '证件名称'
        },
        {
          prop: 'certificateCode',
          label: '证件编号'
        },
        {
          prop: 'effectiveDate',
          label: '生效日期'
        },
        {
          prop: 'expirationDate',
          label: '失效日期'
        },
        {
          prop: 'certificateRemark',
          label: '备注'
        },
        {
          label: '照片',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.photograph
                ? row.picture.photograph.map((img) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showViewer(img.url, false)
                    }}
                  >
                    {img.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '文件',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.file
                ? row.picture.file.map((pdf) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showPdf(pdf.url, false)
                    }}
                  >
                    {pdf.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      accountColumns: [
        {
          prop: 'country',
          label: '银行国家'
        },
        {
          prop: 'province',
          label: '银行省份'
        },
        {
          prop: 'city',
          label: '银行城市'
        },
        {
          prop: 'accountName',
          label: '开户名称'
        },
        {
          prop: 'bankName',
          label: '开户行全称'
        },
        {
          prop: 'bankAccount',
          label: '银行账号'
        },
        {
          prop: 'ibanAccount',
          label: 'IBAN账号'
        },
        {
          label: '图片',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.photograph
                ? row.picture.photograph.map((img) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showViewer(img.url, false)
                    }}
                  >
                    {img.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '文件',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture.file
                ? row.picture.file.map((pdf) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showPdf(pdf.url, false)
                    }}
                  >
                    {pdf.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      licenceColumns: [
        {
          prop: 'licenseType',
          label: '证件类型',
          render: (h, row) => (
            <span>{row.licenseType ? '认证合规类' : '认证资质类'}</span>
          )
        },
        {
          prop: 'licenseName',
          label: '证件名称'
        },
        {
          prop: 'licenseCode',
          label: '证书编号'
        },
        {
          prop: 'supplierName',
          label: '公司名'
        },
        {
          prop: 'supplierAddress',
          label: '公司地址'
        },
        {
          prop: 'effectiveDate',
          label: '生效日期'
        },
        {
          prop: 'expirationDate',
          label: '失效日期'
        },
        {
          prop: 'licenseAuthority',
          label: '颁发机构'
        },
        {
          prop: 'licenseRemark',
          label: '备注'
        },
        {
          label: '照片',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.photograph
                ? row.picture.photograph.map((img) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showViewer(img.url, false)
                    }}
                  >
                    {img.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '文件',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.file
                ? row.picture.file.map((pdf) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showPdf(pdf.url, false)
                    }}
                  >
                    {pdf.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      operateColumns: [
        {
          prop: 'customerName',
          label: '客户名称'
        },
        {
          prop: 'product',
          label: '产品'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'cooperationYear',
          label: '合作年限'
          // width: '135'
        },
        {
          prop: 'lastYearTurnover',
          label: '上年度业务额(万元)'
          // width: '135'
        },
        {
          prop: 'businessProportion',
          label: '业务占比'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      supplyColumns: [
        {
          label: '类型',
          render: (h, row) => <span>{row.supplyType ? '配件' : '整机'}</span>
        },
        {
          prop: 'productLineName',
          label: '产品线'
        },
        {
          prop: 'generalCategoryName',
          label: '大类'
        },
        {
          prop: 'subclassCategoryName',
          label: '小类'
        },
        {
          prop: 'materials',
          label: '供应物资'
        },
        {
          prop: 'majorEquipment',
          label: '主要设备'
        },
        {
          prop: 'equipmentQty',
          label: '设备数量'
        },
        {
          prop: 'dailyCapacity',
          label: '日产能(台)'
        },
        {
          prop: 'supplyCycle',
          label: '供应周期(天)'
        },
        {
          label: '图片',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.photograph
                ? row.picture.photograph.map((img) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showViewer(img.url, false)
                    }}
                  >
                    {img.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '视频',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.video
                ? row.picture.video.map((video) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showVideo(video.url)
                    }}
                  >
                    {video.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '供应关系评级',
          render: (h, row) => <span>{this.supplyLevelDic[row.relationRate]}</span>
        },
        {
          label: '供应关系状态',
          render: (h, row) => <span>{this.supplyStatusDic[row.relationStatus]}</span>
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      produce_addressColumns: [
        {
          prop: 'addressCode',
          label: '地址编码'
        },
        {
          prop: 'addressName',
          label: '地址名称'
        },
        {
          prop: 'country',
          label: '国家'
        },
        {
          prop: 'province',
          label: '省'
        },
        {
          prop: 'city',
          label: '市'
        },
        {
          prop: 'district',
          label: '区'
        },
        {
          prop: 'address',
          label: '详细地址'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      factoryColumns: [
        {
          prop: 'factoryCode',
          label: '工厂编码'
        },
        {
          prop: 'factoryName',
          label: '工厂名称'
        },
        {
          prop: 'addressName',
          label: '地址名称'
        },
        {
          prop: 'majorProduct',
          label: '主要产品'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'floorArea',
          label: '占地面积(平方米)'
        },
        {
          prop: 'plantArea',
          label: '厂房面积(平方米)'
        },
        {
          prop: 'laboratoryArea',
          label: '实验室面积(平方米)'
        },
        {
          prop: 'inspectionArea',
          label: '验货室面积(平方米)'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      self_madeColumns: [
        {
          prop: 'partsType',
          label: '分类'
          // render: (h, row) => <span>{this.self_made_typeDic[row.partsType]}</span>
          // render: (h, row) => (
          //   <span>
          //     {this.self_made_typeList.length
          //       ? (this.self_made_typeList.find((dic) => dic.lineNumber === row.partsType) || { name: '' }).name
          //       : ''}
          //   </span>
          // )
        },
        {
          prop: 'addressName',
          label: '地址名称'
        },
        {
          prop: 'dailyCapacity',
          label: '日配套产能'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      equipmentColumns: [
        {
          prop: 'addressName',
          label: '地址名称'
        },
        {
          label: '设备类型',
          render: (h, row) => (
            <span>{this.equipment_typeDic[row.equipmentType]}</span>
          )
        },
        {
          prop: 'equipmentCode',
          label: '设备编号'
        },
        {
          prop: 'equipmentName',
          label: '设备名称'
        },
        {
          prop: 'brand',
          label: '品牌'
        },
        {
          prop: 'equipmentModel',
          label: '规格型号'
        },
        {
          prop: 'equipmentCode',
          label: '使用部门'
        },
        {
          prop: 'equipmentQty',
          label: '数量'
        },
        {
          label: '校验类型',
          render: (h, row) => <span>{row.checkType ? '外校' : '内校'}</span>
        },
        {
          prop: 'validityStartTime',
          label: '有效期限',
          render: (h, row) => (
            <span>
              {row.validityStartTime}至{row.validityEndTime}
            </span>
          )
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      raw_materialColumns: [
        {
          prop: 'rawMaterial',
          label: '原材料'
          // render: (h, row) => <span>{this.matDic[row.rawMaterial]}</span>
          // render: (h, row) => (
          //   <span>
          //     {this.matList.length
          //       ? (this.matList.find((dic) => dic.name === row.rawMaterial) || { name: '' }).name
          //       : ''}
          //   </span>
          // )
        },
        {
          prop: 'purchasingChannels',
          label: '采购渠道'
        },
        {
          prop: 'lastYearPurchaseQty',
          label: '上年采购量'
        },
        {
          prop: 'lastYearPurchaseAmount',
          label: '上年采购额(万元)'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      laboratoryColumns: [
        {
          prop: 'laboratoryName',
          label: '实验室名称'
        },
        {
          prop: 'describe',
          label: '能力描述'
        },
        {
          prop: 'testItem',
          label: '测试项'
        },
        {
          label: '是否已加入九阳协同测试',
          render: (h, row) => <div>{row.isJoined ? '是' : '否'}</div>
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      laboratory_licenceColumns: [
        {
          prop: 'licenseName',
          label: '证件名称'
        },
        {
          prop: 'licenseCode',
          label: '证书编号'
        },
        {
          prop: 'laboratoryName',
          label: '实验室名称'
        },
        {
          prop: 'laboratoryAddress',
          label: '地址'
        },
        {
          prop: 'effectiveDate',
          label: '生效日期'
        },
        {
          prop: 'expirationDate',
          label: '失效日期'
        },
        {
          prop: 'licenseAuthority',
          label: '颁发机构'
        },
        {
          prop: 'licenseRemark',
          label: '备注'
        },
        // todo: 添加图片文件上传
        // {
        //   label: '照片',
        //   // width: '200',
        //   render: (h, row) => (
        //     <div>
        //       {row.picture && row.picture.photograph
        //         ? row.picture.photograph.map((img) => (
        //           <j-button
        //             type="text"
        //             onClick={() => {
        //               this.showViewer(img.url, false)
        //             }}
        //           >
        //             {img.name}
        //           </j-button>
        //         ))
        //         : ''}
        //     </div>
        //   )
        // },
        // {
        //   label: '文件',
        //   // width: '200',
        //   render: (h, row) => (
        //     <div>
        //       {row.picture && row.picture.file
        //         ? row.picture.file.map((pdf) => (
        //           <j-button
        //             type="text"
        //             onClick={() => {
        //               this.showPdf(pdf.url, false)
        //             }}
        //           >
        //             {pdf.name}
        //           </j-button>
        //         ))
        //         : ''}
        //     </div>
        //   )
        // },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      patentColumns: [
        {
          prop: 'patentName',
          label: '发明专利名称'
        },
        {
          label: '照片',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.photograph
                ? row.picture.photograph.map((img) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showViewer(img.url, false)
                    }}
                  >
                    {img.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '文件',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.file
                ? row.picture.file.map((pdf) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showPdf(pdf.url, false)
                    }}
                  >
                    {pdf.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      develop_experienceColumns: [
        {
          prop: 'productName',
          label: '产品名称'
        },
        {
          label: '类型',
          render: (h, row) => <span>{row.productType ? '配件' : '整机'}</span>
        },
        {
          prop: 'productLineName',
          label: '产品线'
        },
        {
          prop: 'generalCategoryName',
          label: '大类'
        },
        {
          prop: 'subclassCategoryName',
          label: '小类'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'developeYears',
          label: '研发年限'
        },
        {
          prop: 'developeQty',
          label: '研发产品数量'
        },
        {
          prop: 'remark',
          label: '说明'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        }
      ],
      tableOptions: {
        toolbarBottom: false,
        mutiSelect: false,
        index: false,
        loading: false,
        initTable: false
      },
      allTabs: [
        {
          key: 'relation',
          label: '关联关系',
          auth: 'relation_get',
          columns: 'relationColumns'
        },
        // {
        //   key: 'cooperation',
        //   label: '合作意向',
        //   auth: 'cooperation_get',
        //   columns: 'cooperationColumns'
        // },
        // {
        //   key: 'evaluate',
        //   label: '综合评价',
        //   auth: 'evaluate_get',
        //   columns: 'evaluateColumns'
        // },
        {
          key: 'info',
          label: '基本信息',
          auth: 'info_get',
          type: 'form'
        },
        {
          key: 'certificate',
          label: '企业证件',
          auth: 'certificate_get',
          columns: 'certificateColumns'
        },
        {
          key: 'structure',
          label: '组织架构',
          auth: 'structure_get',
          type: 'org'
        },
        {
          key: 'account',
          label: '银行资料',
          auth: 'account_get',
          columns: 'accountColumns'
        },
        {
          key: 'licence',
          label: '认证及合规性',
          auth: 'licence_get',
          columns: 'licenceColumns'
        },
        {
          key: 'operate',
          label: '经营情况',
          auth: 'operate_get',
          columns: 'operateColumns'
        },
        {
          key: 'supply',
          label: '供应能力',
          auth: 'supply_get',
          columns: 'supplyColumns'
        },
        {
          key: 'produce_address',
          label: '制造地址',
          auth: 'produce_address_get',
          columns: 'produce_addressColumns'
        },
        {
          key: 'factory',
          label: '工厂情况',
          auth: 'factory_get',
          columns: 'factoryColumns'
        },
        {
          key: 'self_made',
          label: '自制能力',
          auth: 'self_made_get',
          columns: 'self_madeColumns'
        },
        {
          key: 'equipment',
          label: '设备清单',
          auth: 'equipment_get',
          columns: 'equipmentColumns'
        },
        // {
        //   key: 'raw_material',
        //   label: '原材料供应',
        //   auth: 'raw_material_get',
        //   columns: 'raw_materialColumns'
        // },
        {
          key: 'quality_structure',
          label: '品质架构',
          auth: 'quality_structure_get',
          type: 'org'
        },
        {
          key: 'laboratory',
          label: '实验室',
          auth: 'laboratory_get',
          columns: 'laboratoryColumns'
        },
        {
          key: 'laboratory_licence',
          label: '实验室认证资质',
          auth: 'laboratory_licence_get',
          columns: 'laboratory_licenceColumns'
        },
        {
          key: 'develop_structure',
          label: '研发架构',
          auth: 'develop_structure_get',
          type: 'org'
        },
        {
          key: 'patent',
          label: '专利证书',
          auth: 'patent_get',
          columns: 'patentColumns'
        },
        {
          key: 'develop_experience',
          label: '产品开发经验',
          auth: 'develop_experience_get',
          columns: 'develop_experienceColumns'
        }
      ],
      indexDic: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二',
        13: '十三',
        14: '十四',
        15: '十五',
        16: '十六',
        17: '十七',
        18: '十八',
        19: '十九',
        20: '二十',
        21: '二十一',
        22: '二十二'
      },
      matList: [],
      self_made_typeList: [],
      relation_typeList: [],
      equipment_typeDic: {
        0: '生产类',
        1: '测试类',
        2: '检验类'
      },
      supplyLevelDic: {
        0: '不合格',
        1: '潜在',
        2: '预备',
        3: '合格'
      },
      supplyStatusDic: {
        0: '冻结',
        1: '正常',
        2: '关闭'
      }
      
    }
  },
  created () {
    this.init()
  },
  methods: {
    getDicData () {
      getCodeList('code00012').then(list => {
        this.self_made_typeList = list
      })
      getCodeList('code00014').then(list => {
        this.matList = list
      })
      getCodeList('code00018').then(list => {
        this.relation_typeList = list
      })
    },
    strToVar (str) {
      return this[str]
    },
    // 表格转树形数据
    tableToTree (list, rootValue) {
      const treeData = []
      if (list && list.length) {
        list.forEach((item) => {
          if (item.parentNum === rootValue) {
            const children = this.tableToTree(list, item.num)
            if (children.length) {
              item.children = children
            }
            treeData.push(item)
          }
        })
      }
      if (treeData.length) {
        return treeData[0]
      } else {
        return {}
      }
    },
    init () {
      getRecord({ questionnaireId: this.$route.query.questionnaireId }).then((res) => {
        if (res && res.code === '0') {
          if (res.data && res.data.content) {
            this.docData = res.data.content
            if (res.data.content.info) {
              this.form = res.data.content.info[0]
              this.$refs.imgUpload.fileList = res.data.content.info[0].accessory && res.data.content.info[0].accessory.length ? res.data.content.info[0].accessory : []
            }
            if (res.data.content.up_file) {
              // ref动态绑定，获取时是数组[VueComponent]，需要用[0]获取
              this.$refs.structureFileUpload[0].fileList = res.data.content.up_file.structure
              this.$refs.quality_structureFileUpload[0].fileList = res.data.content.up_file.quality_structure
              this.$refs.develop_structureFileUpload[0].fileList = res.data.content.up_file.develop_structure
            }
          }
        }
      })
    },
    showViewer (url, canDownload) {
      this.canDownload = canDownload
      this.$refs.imgViewer.show(url)
    },
    showPdf (url, canDownload) {
      this.canDownload = canDownload
      this.$refs.pdfViewer.show(url)
    },
    renderContent (h, data) {
      if (data.positionName && data.employeesQty) {
        return `${data.positionName}：${data.employeesQty}人`
      } else {
        return '暂无数据'
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
}
.one-row {
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    width: 610px;
  }
}
.record-title {
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0;
}
</style>