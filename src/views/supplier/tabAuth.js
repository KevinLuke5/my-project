import { srmAuth } from '@/api/supplier/pool'
const allTabs = [
  {
    key: 'relation',
    label: '关联关系',
    auth: 'relation_get',
    isSupplier: true
  },
  // {
  //   key: 'cooperation',
  //   label: '合作意向',
  //   auth: 'cooperation_get',
  //   isSupplier: true
  // },
  // {
  //   key: 'evaluate',
  //   label: '综合评价',
  //   auth: 'evaluate_get',
  //   isSupplier: true
  // },
  {
    key: 'info',
    label: '基本信息',
    auth: 'info_get'
  },
  {
    key: 'certificate',
    label: '企业证件',
    auth: 'certificate_get'
  },
  {
    key: 'structure',
    label: '组织架构',
    auth: 'structure_get'
  },
  {
    key: 'account',
    label: '银行资料',
    auth: 'account_get'
  },
  {
    key: 'licence',
    label: '认证及合规性',
    auth: 'licence_get'
  },
  {
    key: 'operate',
    label: '经营情况',
    auth: 'operate_get'
  },
  {
    key: 'supply',
    label: '供应能力',
    auth: 'supply_get'
  },
  {
    key: 'produce_address',
    label: '制造地址',
    auth: 'produce_address_get'
  },
  {
    key: 'factory',
    label: '工厂情况',
    auth: 'factory_get'
  },
  {
    key: 'self_made',
    label: '自制能力',
    auth: 'self_made_get'
  },
  {
    key: 'equipment',
    label: '设备清单',
    auth: 'equipment_get'
  },
  // {
  //   key: 'raw_material',
  //   label: '原材料供应',
  //   auth: 'raw_material_get'
  // },
  {
    key: 'quality_structure',
    label: '品质架构',
    auth: 'quality_structure_get'
  },
  {
    key: 'laboratory',
    label: '实验室',
    auth: 'laboratory_get'
  },
  {
    key: 'laboratory_licence',
    label: '实验室认证资质',
    auth: 'laboratory_licence_get'
  },
  {
    key: 'develop_structure',
    label: '研发架构',
    auth: 'develop_structure_get'
  },
  {
    key: 'patent',
    label: '专利证书',
    auth: 'patent_get'
  },
  {
    key: 'develop_experience',
    label: '产品开发经验',
    auth: 'develop_experience_get'
  }
]

export const handleTabs = (isSupplier) => {
  return new Promise((resolve, reject) => {
    srmAuth().then(res => {
      if (res && res.code === '0' && res.data) {
        sessionStorage.setItem('auths', JSON.stringify(res.data))
        const auths = res.data
        if (auths) {
          const result = []
          allTabs.forEach((tab) => {
            auths.forEach((auth) => {
              if (auth === tab.auth && (isSupplier ? true : !tab.isSupplier)) {
                result.push(tab)
              }
            })
          })
          console.log(result)
          // debugger
          sessionStorage.setItem('tabs', JSON.stringify(result))
          resolve()
        }
      } else {
        reject()
      }
    })
  })
}