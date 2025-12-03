// cz-customizable 为本地修改过,主要增加了subjectDefault配置,满足不需要subjectDefault的情况
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     一个新增功能' },
    { value: 'fix', name: 'fix:      bug修复' },
    { value: 'docs', name: 'docs:     文档的修改' },
    { value: 'style', name: 'style:    纯ui的修改,js逻辑无变化' },
    { value: 'perf', name: 'perf:     代码格式化和优化逻辑' },
    { value: 'test', name: 'test:     无意义的测试代码' },
    { value: 'revert', name: 'revert:   代码回滚' }
  ],
  scopeOverrides: {
    fix: [
      {name: 'javascript'},
      {name: 'html'},
      {name: 'css'},
      {name: 'other'}
    ]
  },
  messages: {
    scope: 'bug影响范围(非必选):',
    type: '请选择提交的类型:',
    customScope: '影响范围(非必填):',
    subject: '请用简短的语句来描述你的更改(100字内):',
    confirmCommit: '确认按以上内容提交吗?'
  },

  allowCustomScopes: true,
  skipQuestions: ['body', 'breaking', 'footer'],
  subjectLimit: 100,
  subjectDefault: false
};