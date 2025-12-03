export const formRules = {
  id: [
    { required: true, message: '请选择供应商', trigger: 'change' }
  ],
  classify: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  receiptMoney: [
    { required: true, message: '请输入收款金额', trigger: 'change' }
  ],
  receiptDate: [
    { required: true, message: '请选择收款日期', trigger: 'change' }
  ],
  paymentDays: [
    { required: true, message: '请输入账期', trigger: 'blur' }
  ],
  timeRange: [
    { required: true, message: '请选择有效日期', trigger: 'change' }
  ]
}
