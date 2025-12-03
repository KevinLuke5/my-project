// 导入组件，组件必须声明 name
import TablePage from './src/main'

// 为组件添加 install 方法，用于按需引入
TablePage.install = (Vue) => {
  Vue.component(TablePage.name, TablePage)
}

export default TablePage
