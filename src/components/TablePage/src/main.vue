<template>
  <div>
    <j-table
      ref="table-page"
      v-loading="config.loading"
      :data="dataSource"
      :height="height"
      :stripe="config.stripe"
      :row-class-name="tableRowClassName"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!--selection选择框-->
      <j-table-column
        v-if="config.mutiSelect"
        type="selection"
        style="width: 50px"
        align="center"
      />
      <!--序号-->
      <j-table-column
        v-if="config.index"
        label="序号"
        type="index"
        width="50"
        align="center"
      />
      <!--数据列-->
      <template v-for="(column, index) in columns">
        <j-table-column
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align || 'center'"
          :width="column.width"
          :fixed="column.fixed"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              {{ scope.row[column.prop] }}
            </template>
            <!-- render -->
            <template v-else>
              <RenderDom :row="scope.row" :index="index" :render="column.render" />
            </template>
            <!-- render button -->
            <template v-if="column.button">
              <template v-for="(btn, i) in column.group">
                <!-- <j-link
                  :key="i"
                  :type="btn.type"
                  :icon="btn.icon"
                  :disabled="btn.disabled"
                  @click.stop="btn.onClick(scope.row, scope.$index)"
                >
                  {{ btn.name }}
                </j-link> -->
                <!-- 按钮支持绑定v-check -->
                <j-button
                  v-if="btn.vCheck"
                  :key="i"
                  v-check="btn.vCheck"
                  size="mini"
                  :type="btn.type"
                  :icon="btn.icon"
                  :disabled="btn.disabled"
                  @click.stop="btn.onClick(scope.row, scope.$index)"
                >
                  {{ btn.name }}
                </j-button>
                <j-button
                  v-else
                  :key="i"
                  size="mini"
                  :type="btn.type"
                  :icon="btn.icon"
                  :disabled="btn.disabled"
                  @click.stop="btn.onClick(scope.row, scope.$index)"
                >
                  {{ btn.name }}
                </j-button>
              </template>
            </template>
            <!-- slot 你可以其他常用项 -->
          </template>
        </j-table-column>
      </template>
    </j-table>
    <!-- 底部工具栏 -->
    <div v-if="config.toolbarBottom" ref="pagination" class="page">
      <span v-if="pagination.pageCompute" class="page-outer-span">
        <span>第</span>
        {{ pagination.pageSize * (pagination.pageNum - 1) + 1 }}
        <span>到</span>
        {{ endNum }}
        <span>项</span>
      </span>
      <j-pagination
        v-if="pagination"
        :current-page="pagination.pageNum"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :page-sizes="[15, 30, 50, 100]"
        :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
        class="pull-right"
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePage',
  components: {
    RenderDom: {
      functional: true, // 函数式组件 - 无 data 和 this 上下文 => better render
      props: {
        row: Object,
        index: Number,
        render: Function
      },
      /**
       * @param {Function} createElement - 原生创建dom元素的方法，弃用，推荐使用 jsx
       * @param {Object} ctx - 渲染的节点的this对象
       * @argument 传递参数 row index
       */
      render (createElement, ctx) {
        const { row, index } = ctx.props
        return ctx.props.render(createElement, row, index)
      }
    }
  },
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
    options: {
      type: Object,
      default: () => {}
    },
    height: {
      type: String,
      default: '400px'
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 获取数据的函数
    fetch: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 行样式
    getRowClass: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 分页，不传则不显示
    pagination: {
      type: Object,
      default: () => {
        return {
          total: 0,
          pageNum: 1,
          pageSize: 15,
          pageCompute: true,
          layout: 'total, sizes, prev, pager, next, jumper'
        }
      }
    },
    toolbarBottom: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    config () {
      return Object.assign(
        {
          loading: false, // 表格是否显示loading加载
          toolbarBottom: true, // 是否显示表格下方工具栏，包括分页
          height: 400, // 总的表格组件的高度
          stripe: false, // 是否为斑马纹
          mutiSelect: true, // 是否显示多选框
          index: false, // 是否显示表格序列
          initTable: true // 是否立即加载数据
        },
        this.options
      )
    },
    endNum: function () {
      return this.pagination.pageSize * this.pagination.pageNum >
        this.pagination.total
        ? this.pagination.total
        : this.pagination.pageSize * this.pagination.pageNum
    }
  },
  mounted () {
    if (this.config.initTable) this.doFetchData()
  },
  methods: {
    handleSizeChange (size) {
      // 切换每页显示的数量
      this.pagination.pageSize = size
      this.doFetchData()
    },
    handleIndexChange (current) {
      // 切换页码
      this.pagination.pageNum = current
      this.doFetchData()
    },
    doFetchData () {
      if (typeof this.fetch === 'function') this.fetch()
    },
    handleSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    handleRowClick (row, event, column) {
      this.$emit('row-click', row, event, column)
    },
    getTableSelectRows () {
      // 获取表格选择的行
      return this.$refs['table-page'].selection
    },
    tableRowClassName ({ row, rowIndex }) {
      return this.getRowClass(row, rowIndex)
    }
  }
}
</script>
<style>
.el-table .warning-row {
  /* background: oldlace; */
  color: #F66d36;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>
