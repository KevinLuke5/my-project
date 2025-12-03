import { Message } from '@base/jy-ui-plus'
import { getCodeDetailList } from '@/api/options'

export const getCodeList = code => {
  return new Promise((resolve, reject) => {
    getCodeDetailList({ code }).then((res) => {
      if (res && res.code === '0' && res.data) {
        resolve(res.data)
      }
    }).catch((res) => {
      Message.warning({
        message: res.message
      })
      reject(res)
    })
  })
}

export const timeDimensionList = [
  {
    value: 0,
    label: '周',
    children: [
      {
        value: '第一周',
        label: '第一周'
      },
      {
        value: '第二周',
        label: '第二周'
      },
      {
        value: '第三周',
        label: '第三周'
      },
      {
        value: '第四周',
        label: '第四周'
      }
    ]
  },
  {
    value: 1,
    label: '半月度',
    children: [
      {
        value: '上半月',
        label: '上半月'
      },
      {
        value: '下半月',
        label: '下半月'
      }
    ]
  },
  {
    value: 2,
    label: '月度',
    children: [
      {
        value: '1月',
        label: '1月'
      },
      {
        value: '2月',
        label: '2月'
      },
      {
        value: '3月',
        label: '3月'
      },
      {
        value: '4月',
        label: '4月'
      },
      {
        value: '5月',
        label: '5月'
      },
      {
        value: '6月',
        label: '6月'
      },
      {
        value: '7月',
        label: '7月'
      },
      {
        value: '8月',
        label: '8月'
      },
      {
        value: '9月',
        label: '9月'
      },
      {
        value: '10月',
        label: '10月'
      },
      {
        value: '11月',
        label: '11月'
      },
      {
        value: '12月',
        label: '12月'
      }
    ]
  },
  {
    value: 3,
    label: '季度',
    children: [
      {
        value: '一季度',
        label: '一季度'
      },
      {
        value: '二季度',
        label: '二季度'
      },
      {
        value: '三季度',
        label: '三季度'
      },
      {
        value: '四季度',
        label: '四季度'
      }
    ]
  },
  {
    value: 4,
    label: '半年度',
    children: [
      {
        value: '上半年',
        label: '上半年'
      },
      {
        value: '下半年',
        label: '下半年'
      }
    ]
  },
  {
    value: 5,
    label: '年度',
    children: [
      {
        value: '2022年',
        label: '2022年'
      },
      {
        value: '2023年',
        label: '2023年'
      },
      {
        value: '2024年',
        label: '2024年'
      },
      {
        value: '2025年',
        label: '2025年'
      }
    ]
  }
]