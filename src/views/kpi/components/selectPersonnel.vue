<template>
  <j-dialog
    title="选择人员"
    :visible.sync="dialogVisible"
    width="999px"
    :before-close="handleClose"
  >
    <j-row :gutter="20">
      <j-col :span="24">
        <div style="padding: 0 10px">
          <j-input
            v-model="input"
            placeholder="输入关键字搜索"
            size="mini"
            style="width: 100%"
            @keyup.enter.native="handleSearch"
          >
            <j-button slot="append" icon="el-icon-search" @click="handleSearch">
              搜索
            </j-button>
          </j-input>
        </div>
      </j-col>
    </j-row>
    <j-row :gutter="5">
      <j-col :span="8">
        <j-card class="box-card" style="margin-top: 5px">
          <j-tabs v-model="activeName" stretch @tab-click="handleClick">
            <j-tab-pane label="部门" name="first">
              <!-- <div v-if="activeName == 'first'"> -->
              <j-scrollbar ref="myScroll" class="scroll">
                <j-tree
                  ref="tree"
                  class="tree-one"
                  :data="treeData"
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick"
                />
              </j-scrollbar>
              <!-- </div> -->
            </j-tab-pane>
            <j-tab-pane v-if="postTree.length !== 0" label="岗位" name="second">
              <!-- <div v-if="activeName == 'second'"> -->
              <j-scrollbar ref="myScroll" class="scroll">
                <j-tree
                  ref="tree"
                  class="tree-one"
                  :data="postTree"
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick2"
                />
              </j-scrollbar>
              <!-- </div> -->
            </j-tab-pane>
            <j-tab-pane v-if="rulesList.length !== 0" label="规则" name="third">
              <!-- <div v-if="activeName == 'third'"> -->
              <j-table
                ref="multipleTable"
                v-loading="loading"
                :data="rulesList"
                :show-header="false"
                highlight-current-row
                height="424px"
                style="width: 100%"
                @row-dblclick="handleAddRuleTo"
              >
                <j-table-column prop="name" />
              </j-table>
              <!-- </div> -->
            </j-tab-pane>
          </j-tabs>
        </j-card>
      </j-col>
      <j-col :span="8">
        <j-card class="box-card" style="margin-top: 5px">
          <div class="middle">
            <j-button-group
              style="margin-top: 5px; margin-left: 5px; margin-bottom: 5px"
            >
              <j-button size="mini" @click="handleThisDepartment">
                本部门
              </j-button>
              <j-button size="mini" @click="handleAdd">
                添加
              </j-button>
              <j-button size="mini" @click="handleAllAdd">
                全部添加
              </j-button>
            </j-button-group>
            <j-table
              ref="multipleTable"
              v-loading="loading"
              :data="selectUp"
              highlight-current-row
              height="424px"
              style="width: 100%"
              @row-click="handleRowClick1"
              @row-dblclick="handleAddTo"
            >
              <j-table-column prop="name" label="名称" />
            </j-table>
          </div>
        </j-card>
      </j-col>
      <j-col :span="8">
        <j-card class="box-card" style="margin-top: 5px">
          <div class="middle">
            <j-button-group
              style="margin-top: 5px; margin-left: 5px; margin-bottom: 5px"
            >
              <j-button size="mini" @click="handleRemove">
                移除
              </j-button>
              <j-button size="mini" @click="handleAllRemove">
                全部移除
              </j-button>
            </j-button-group>
            <j-table
              ref="multipleTable"
              v-loading="selectedLoading"
              :data="selectedUp"
              highlight-current-row
              height="424px"
              style="width: 100%"
              @row-click="handleRowClick2"
              @row-dblclick="handleRemoveTo"
            >
              <j-table-column prop="name" label="名称" />
            </j-table>
          </div>
        </j-card>
      </j-col>
    </j-row>
    <span slot="footer" class="dialog-footer">
      <j-button size="mini" @click="cancel">取 消</j-button>
      <j-button type="primary" size="mini" @click="submitForm">确 定</j-button>
    </span>
  </j-dialog>
</template>

<script>
export default {
  name: 'SelectPersonnel',
  props: {
    // 部门树
    treeData: {
      required: true,
      type: Array,
      default: () => []
    },
    // 岗位树
    postTree: {
      type: Array,
      default: () => []
    },
    // 规则数组
    rulesList: {
      type: Array,
      default: () => []
    },
    // 待选区数组
    tableData: {
      type: Array,
      default: () => []
    },
    // 已选区数据
    selectedDataUp: {
      type: Array,
      default: () => []
    },
    // 判断是否只能单选
    isSingle: {
      type: Boolean,
      default: false
    },
    // 标识符
    tag: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      dialogVisible: false,
      activeName: 'first',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      depId: '',
      input: '',
      loading: false,
      selectedLoading: false,
      // 待选区单击选中变量
      rowClick: [],
      // 已选区数据
      selectedData: [],
      // 待选区数据
      selectData: []
    }
  },
  computed: {
    selectedUp () {
      const datas = this.selectedData
      return datas
    },
    selectUp () {
      const datas = this.selectData
      return datas
    }
  },
  watch: {
    selectedDataUp: {
      handler: function (val, oldval) {
        this.selectedData = val
      },
      immediate: true,
      deep: true
    },
    tableData: {
      handler: function (val, oldval) {
        this.selectData = val
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {},
    handleSearch () {
      this.input = this.input.replace(/\s*/g, '')
      this.input = this.input.replace(/，/g, ',')
      let params = {}
      if (this.activeName === 'first') {
        params = {
          status: 1,
          searchText: this.input
        }
      } else if (this.activeName === 'second') {
        params = {
          status: 2,
          searchText: this.input
        }
      } else {
        params = {
          status: 3,
          searchText: this.input
        }
      }
      this.$emit('handleSearch', params)
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.cancel()
        })
        .catch((_) => {})
    },
    submitForm () {
      if (this.selectedData.length) {
        let arr = []
        arr = arr.concat(this.selectedData)
        if (this.isSingle) {
          if (arr.length > 1) {
            this.$notify({
              title: '只允许选择单个人员/岗位',
              type: 'error',
              duration: 2500
            })
            return false
          }
        }
        if (this.tag) {
          this.$emit('submitMan', arr, this.tag)
        } else {
          this.$emit('submitMan', arr)
        }
        this.cancel()
      } else {
        this.$notify({
          title: '请先选择人员',
          type: 'error',
          duration: 1000
        })
      }
    },
    cancel () {
      this.input = ''
      // 防止页面没渲染选择数据还显示
      this.$nextTick(() => {
        this.selectedData = []
        this.selectData = []
      })
      this.dialogVisible = false
    },
    // tabs标签点击事件
    handleClick () {},
    // 树节点过滤函数
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 选中部门,获取人员列表
    handleNodeClick (node) {
      this.depId = node.id
      // console.log(this.depId)
      this.$emit('handleNodeClick', this.depId)
    },
    // 选中部门，获取岗位列表
    handleNodeClick2 (node) {
      this.depId = node.id
      // console.log(this.depId)
      this.$emit('handleNodeClick2', this.depId)
    },
    // 获取本部门人员
    handleThisDepartment () {
      this.$emit('getDeptByUser')
    },
    // 添加进已选区
    handleAdd () {
      if (this.rowClick) {
        this.rowClick.forEach((e) => {
          this.selectedData = this.selectedData.filter((k) => k.id !== e.id)
        })
        this.selectedData = this.selectedData.concat(this.rowClick)
      }
      this.rowClick = []
    },
    // 将列表中的所有添加进已选区
    handleAllAdd () {
      this.tableData.forEach((e) => {
        this.selectedData = this.selectedData.filter((k) => k.id !== e.id)
      })
      this.selectedData = this.selectedData.concat(this.tableData)
    },
    // 待选区单击事件
    handleRowClick1 (val) {
      const arr = []
      if (val) {
        arr.push(val)
        this.rowClick = arr
      }
      // console.log(this.rowClick)
    },
    // 待选区双击添加到已选区
    handleAddTo (val) {
      const arr = this.selectedData.filter((v) => v.id === val.id)
      if (arr.length) {
        return
      } else {
        this.selectedData = this.selectedData.concat(val)
        // this.selectedData.push(val)
        // console.log(this.selectedData)
      }
    },
    // 规则双击添加到已选区
    handleAddRuleTo (val) {
      const arr = this.selectedData.filter((v) => v.id === val.id)
      if (arr.length) {
        return
      } else {
        this.selectedData = this.selectedData.concat(val)
      }
    },
    // 已选区移除事件
    handleRemove () {
      this.rowClick.forEach((e) => {
        this.selectedData = this.selectedData.filter((k) => k.id !== e.id)
      })
    },
    // 已选区全部移除事件
    handleAllRemove () {
      this.selectedUp.forEach((e) => {
        this.selectedData = this.selectedData.filter((k) => k.id !== e.id)
      })
    },
    // 已选区单击事件
    handleRowClick2 (val) {
      const arr = []
      if (val) {
        arr.push(val)
        this.rowClick = arr
      }
    },
    // 已选区双击移除事件
    handleRemoveTo (val) {
      this.selectedData = this.selectedData.filter((v) => v.id !== val.id)
      // this.selectedData.forEach((obj, i) => {
      //   if (obj.id == val.id) {
      //     this.selectedData.splice(i, 1)
      //   }
      // })
    }
  }
}
</script>

<style  lang="less" scoped>
.button {
  display: flex;
  justify-content: flex-start;
}
::v-deep .el-card__body {
  padding: 0px;
}
::v-deep .el-dialog__body {
  padding: 5px;
  height: 500px;
}

::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-tabs__item {
  font-size: 14px;
  height: 35px;
  line-height: 35px;
}
::v-deep .el-tabs__content {
  height: 413px;
}
.middle {
  height: 462px;
}
::v-deep .el-col {
  padding: 0 5px;
}
::v-deep .el-table th,
.el-table td {
  padding: 0;
}
.scroll {
  height: 413px;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
}
::v-deep .el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
::v-deep .el-scrollbar_bar.is-horizontal {
  height: 0;
}
</style>
