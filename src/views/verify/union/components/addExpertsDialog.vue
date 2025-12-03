<template>
  <div class="app-container">
    <!-- 标签弹窗 -->
    <j-dialog
      v-loading="tagLoading"
      title="权限标签"
      :visible.sync="addExpertsVisible"
      :modal="false"
      :before-close="tagClose"
      width="900px"
      fullscreen
    >
      <div class="tag-container">
        <j-card shadow="always" class="child">
          <!-- 标签列表树 -->
          <j-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom: 10px;" />
          <j-tree
            ref="tree"
            :data="treeData"
            :props="treeProps"
            highlight-current
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </j-card>
        <!-- <j-card shadow="never" class="transfer-card"> -->
        <!-- 权限分配穿梭框 -->
        <!-- <j-transfer
            v-model="tagList"
            filterable
            :titles="titles"
            :props="centerProps"
            :data="tagTableData"
            @change="handleChange"
          />
        </j-card> -->
        <j-card shadow="always" class="child">
          <j-button-group style="margin-bottom: 10px">
            <j-button size="small" @click="addRoleToMap">
              添加
            </j-button>
            <!-- <j-button size="small" @click="addRoleToMap(1)">
              添加至可分发角色区
            </j-button> -->
          </j-button-group>
          <div class="dep-tree">
            <!-- <div class="head">
              <j-input
                v-model="toBeAllot.name"
                clearable
                style="width: 200px"
                size="mini"
                placeholder="角色名"
                @keyup.enter.native="getToBeAllot(1)"
              />
              <j-button-group>
                <j-tooltip content="搜索" placement="top" effect="light">
                  <j-button
                    size="mini"
                    type="primary"
                    icon="el-icon-search"
                    @click="getToBeAllot(1)"
                  />
                </j-tooltip>
              </j-button-group>
            </div> -->
            <j-table
              ref="tagTableData"
              v-loading="tagLoading"
              :data="tagTableData"
              :height="height"
              style="width: 100%"
              @selection-change="handletagTableChange"
            >
              <j-table-column type="selection" />
              <j-table-column prop="name" show-overflow-tooltip label="全部" />
              <!-- <j-table-column prop="type" show-overflow-tooltip label="角色类型">
                <template slot-scope="scope">
                  <span>{{ getDictLabel(scope.row.type, 'role-type') }}</span>
                </template>
              </j-table-column> -->
            </j-table>
          </div>
        </j-card>

        <j-card shadow="always" class="child">
          <div style="display: flex; justify-content: space-between">
            <!-- <label>已拥有角色区</label> -->
            <j-button-group style="margin-bottom: 15px">
              <j-button size="small" @click="removeRoleFromMap">
                移除
              </j-button>
            </j-button-group>
          </div>
          <div class="dep-tree">
            <!-- <div class="head">
              <j-input
                v-model="owned.name"
                clearable
                size="mini"
                placeholder="角色名"
              />
            </div> -->
            <j-table
              ref="selectTagData"
              v-loading="owned.loading"
              :data="selectTagData"
              :height="height"
              style="width: 100%"
              @selection-change="handleSelectTagChange"
            >
              <j-table-column type="selection" />
              <j-table-column prop="name" show-overflow-tooltip label="已添加" />
              <!-- <j-table-column prop="type" show-overflow-tooltip label="角色类型">
                <template slot-scope="scope">
                  <span>{{ getDictLabel(scope.row.type, 'role-type') }}</span>
                </template>
              </j-table-column> -->
            </j-table>
          </div>
        </j-card>
      </div>
      <span slot="footer">
        <j-button @click="tagClose">取消</j-button>
        <j-button :disabled="!tagSelectList.length" type="primary" @click="dataConfirm">确定</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as unionVerifyApi from '@/api/verify/unionVerify'

// import * as roleApi from '@/api/dataAuth/roleManage'

export default {
  name: 'AddExpertsDialog',
  props: {
    addExpertsVisible: Boolean
  },
  data () {
    return {
      ids: [],
      tagTableSelectList: [],
      tagSelectList: [],
      selectTagData: [],
      toBeAllot: {
        size: 15,
        page: 1,
        total: 0,
        name: '',
        loading: false,
        data: [],
        mutiSelection: []
      },
      owned: {
        name: '',
        loading: false,
        data: [],
        map: {},
        mutiSelection: []
      },
      idsList: [],
      factoryId: '',
      expertList: [],
      // 各系统结果返回 code 配置
      codeList: [0, '0', '000000'],
      // 全局搜索组件搜索内容
      searchContent: '',
      // 表格
      tableItems: [
        { label: '角色名称', value: 'roleName', disabled: false },
        { label: '应用', value: 'appName', disabled: false },
        { label: '状态', value: 'status', disabled: false },
        { label: '修改人', value: 'updName', disabled: false },
        { label: '修改时间', value: 'updTime', disabled: false }
      ],
      pagination: {
        pageSize: 15,
        currentPage: 1,
        total: 0
      },
      loading: false,
      height: null,
      tableData: [],
      selectList: [],  // 选中行
      // 新增、修改弹窗
      handleTitle: '新增',
      modifyVisible: false,
      modifyBtnLoading: false,
      modifyForm: {
        roleName: '',
        appId: ''
      },
      appList: [],  // 应用下拉列表
      // 表单验证
      required: { required: true, message: '必填字段未填', trigger: 'blur' },
      // 关联弹窗
      linkVisible: false,
      linkForm: {
        roleName: '',
        authLabel: ''
      },
      linkBtnLoading: false,
      // 标签弹窗
      tagLoading: false,
      curRow: {},  // 当前行
      curNode: {},  // 当前节点
      filterText: '',
      treeProps: {
        children: 'children',
        label: 'groupName'
      },
      centerProps: {
        key: 'id',
        label: 'professionNames'
      },
      treeData: [],  // 标签列表树数据
      titles: ['全部', '已添加'],
      tagList: [],  // 选中标签
      tagTableData: [],  // 所有标签
      authLabelList: []  // 权限关联关系
    }
  },
  computed: {
    endNum () {
      return Math.min(this.pagination.pageSize * this.pagination.currentPage, this.pagination.total)
    },
    // 新增时打开、修改时禁用
    isDisabled () {
      return this.handleTitle === '修改'
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.height = this.getHeight()
    this.init()
  },
  methods: {
    handletagTableChange (val) {
      this.tagTableSelectList = val
    },
    handleSelectTagChange (val) {
      this.tagSelectList = val
    },
    addRoleToMap () {
      this.tagTableSelectList.forEach(item => {
        this.selectTagData.push(item)
        this.selectTagData = this.selectTagData.filter((item, index) => {
          return this.selectTagData.indexOf(item) === index
        })
      })
    },
    getToBeAllot () {},
    removeRoleFromMap () {
      this.tagSelectList.forEach((item, index) => {
        this.selectTagData.forEach((val, i) => {
          if (item.id === val.id) {
            this.selectTagData.splice(i, 1)
          }
        })
      })
    },
    getAddExpertsDialogQuery (id) {
      this.factoryId = id
      unionVerifyApi.addExpertsDialogQuery({}).then(res => {
        if (res.code === '0') {
          this.treeData = res.data
        }
      })
    },
    
    // 查询按钮
    handleSearch (searchContent) {
      this.searchContent = searchContent
      this.pagination.currentPage = 1
      this.init(true)
    },
    // 查询
    init (isSearch) {
      // this.loading = true
      // const params = {
      //   keywords: this.searchContent,
      //   size: this.pagination.pageSize,
      //   page: this.pagination.currentPage
      // }
      // roleApi.search(params).then(res => {
      //   if (res.code === '0') {
      //     const dataList = res.data.content
      //     dataList.forEach(item => {
      //       // operateInfo 字符串转 JSON
      //       item.operateInfo = JSON.parse(item.operateInfo)
      //     })
      //     this.tableData = dataList
      //     this.pagination.total = res.data.totalElements
      //     if (isSearch) {
      //       this.showMessage('查询成功', 'success')
      //     }
      //   } else {
      //     this.showMessage(res.message)
      //   }
      //   this.loading = false
      // })
    },
    // 高级筛选
    handleFilter (filterForm) {
    },
    // 新增
    handleAdd () {
      this.handleTitle = '新增'
      this.modifyVisible = true
    },
    // 修改
    handleModify () {
      if (this.selectList.length !== 1) {
        this.showMessage('请选择一行数据进行操作')
        return
      }
      this.handleTitle = '修改'
      this.modifyVisible = true
      const { id, roleName, appId } = this.selectList[0]
      this.modifyForm = { id, roleName, appId }
    },
    // 保存 - 新增、修改
    modifySave () {
      // this.$nextTick(() => {
      //   this.$refs.modifyForm.validate((valid) => {
      //     if (valid) {
      //       this.modifyBtnLoading = true
      //       roleApi.modify(this.modifyForm).then(res => {
      //         if (res.code === '0') {
      //           this.showMessage('操作成功', 'success')
      //           this.init()
      //           this.modifyClose()
      //         } else {
      //           this.showMessage(res.message)
      //         }
      //         this.modifyBtnLoading = false
      //       })
      //     } else {
      //       return false
      //     }
      //   })
      // })
    },
    // 删除
    handleDelete () {
      // if (this.selectList.length !== 1) {
      //   this.showMessage('请选择一行数据进行操作')
      //   return
      // }
      // this.$confirm('确定删除这条数据？').then(() => {
      //   roleApi.del({ id: this.selectList[0].id }).then(res => {
      //     if (res.code === '0') {
      //       this.showMessage('操作成功', 'success')
      //       this.init()
      //     } else {
      //       this.showMessage(res.message)
      //     }
      //   })
      // })
    },
    // 开关
    statusChange (row) {
      // const params = {
      //   id: row.id,
      //   status: row.status
      // }
      // roleApi.enable(params).then(res => {
      //   if (res.code === '0') {
      //     this.init()
      //     this.showMessage('操作成功', 'success')
      //   } else {
      //     this.showMessage(res.message)
      //   }
      // })
    },
    // 新增弹窗打开
    open () {
      this.appSearch()
    },
    // 应用下拉查询
    appSearch () {
      // roleApi.appSearch({}).then(res => {
      //   if (res.code === '0') {
      //     const dataList = res.data
      //     this.appList = dataList
      //   } else {
      //     this.showMessage(res.message)
      //   }
      // })
    },
    // 关联标签
    handleLink (row) {
      this.curRow = row
      this.linkVisible = true
    },
    // 关联弹窗打开
    linkOpen () {
      this.linkForm = {
        roleName: this.curRow.roleName,
        authLabel: ''
      }
      if (!this.curRow.authLabelList) return
      // 若已关联标签执行下列操作
      const authLabelList = JSON.parse(JSON.stringify(this.curRow.authLabelList))
      authLabelList.forEach(item => {
        // 字符串转 JSON
        item.content = JSON.parse(item.content)
      })
      this.authLabelList = authLabelList
      // 获取标签中文 显示
      let labelContent = ''
      this.authLabelList.forEach(item => {
        const content = (item.content.authLabelContent || '').join(',')
        if (!content) return
        labelContent += content + ','
      })
      labelContent = labelContent.substring(0, labelContent.length - 1)
      this.linkForm.authLabel = labelContent
    },

    // 过滤标签树节点
    filterNode (val, treeData) {
      if (!val) return true
      return treeData.labelName.indexOf(val) !== -1
    },
    // 点击标签树节点进行查询
    handleNodeClick (val) {
      this.tagTableData = []
      this.tagList = []
      this.curNode = val
      this.tagLoading = true
      unionVerifyApi.addExpertsDialogExpert({ groupName: val.groupName }).then(res => {
        if (res.code === '0') {
          this.tagTableData = res.data
          this.tagLoading = false
        }
      })
      // 模版字段接口
      // if (val.linkUrl.indexOf('product-template/api/tpProjects/v1/queryFieldPro') !== -1) {
      //   requestType = 'GET'
      // }
      // urlSearch({}, val.linkUrl, requestType).then(res => {
      //   // 各平台接口调用
      //   if (this.codeList.includes(res.code)) {
      //     // 检测数据结构是否正确
      //     let isLack = false
      //     try {
      //       res.data.forEach(item => {
      //         if (!item.hasOwnProperty('code') || !item.hasOwnProperty('name')) {
      //           isLack = true
      //           return
      //         }
      //       })
      //     } catch (err) {
      //       this.tagLoading = false
      //       this.showMessage('接口返回数据结构不正确，请检查')
      //       return
      //     }
      //     if (isLack) {
      //       this.showMessage('缺少必要参数 code、name')
      //       this.tagLoading = false
      //       return
      //     }
      //     const dataList = res.data
      //     this.tagTableData = dataList
      //     // 若已有关联关系，将关联关系中的 relId 与选中节点的 id进行对比，找到正确关联关系中的穿梭框选中数组放入 tagList
      //     this.authLabelList.forEach(item => {
      //       // 找到操作节点的关联关系
      //       if (item.relId === this.curNode.id) {
      //         this.tagList = item.content.contentList
      //       }
      //     })
      //   } else {
      //     if (res.hasOwnProperty('msg')) {
      //       this.showMessage(res.msg)
      //     } else {
      //       this.showMessage(res.message)
      //     }
      //   }
      //   this.tagLoading = false
      // })
    },
    // 权限标签选择确认
    dataConfirm () {
      this.selectTagData.forEach(item => {
        item['factoryId'] = this.factoryId
        item['expertName'] = item['name'] 
        delete item.id
      })
      unionVerifyApi.addExpertsDialogSave(this.selectTagData).then(res => {
        if (res.code === '0') {
          this.showMessage('添加成功！', 'success')
        }
      })
      this.tagClose()
    },
    handleChange (val) {
      const arr = []
      val.forEach(i => {
        this.tagTableData.forEach(j => {
          if (i === j.id) {
            const { groupName, professionName, userId } = j
            const dept = j.department
            const expertName = j.name
            const factoryId = this.factoryId
            arr.push({ factoryId, groupName, professionName, userId, dept, expertName })
          }
        })
      })
      this.expertList = arr
    },
    // 穿梭框左右值改变时()
    tagChange (val, direction, movedKeys) {
      // 每次值改变重做关联关系
      this.authLabelList.forEach(item => {
        // 找到操作节点的对应关系
        if (item.relId === this.curNode.id) {
          // 保存对应关系
          if (direction === 'right') {
            // 自左向右添加
            movedKeys.forEach(key => {
              item.content.contentList.push(key)
              this.tagList = item.content.contentList
            })
          } else {
            // 自右向左删除
            item.content.contentList.forEach((key, index) => {
              if (movedKeys.includes(key)) {
                item.content.contentList.splice(index, 1)
              }
              this.tagList = item.content.contentList
            })
          }
          // 保存对应关系中文
          item.content.authLabelContent = []
          // 制作相应个数的中文空位
          this.tagList.forEach(_ => {
            item.content.authLabelContent.push('')
          })
          // 遍历所有标签
          this.tagTableData.forEach(i => {
            // 遍历选中标签
            this.tagList.forEach((j, index) => {
              // 找到选中标签对应中文
              if (j === i.code) {
                // 保存中文至对应位置
                item.content.authLabelContent.splice(index, 1, i.name)
              }
            })
          })
        }
      })
    },
    // 关闭 - 修改
    modifyClose () {
      this.modifyVisible = false
      this.modifyForm = {
        roleName: '',
        appId: ''
      }
      this.modifyBtnLoading = false
    },
    // 关闭 - 关联弹窗
    beforeClose () {
      this.$confirm('确认退出？尚未保存的数据将会丢失！').then(() => {
        this.linkVisible = false
        this.linkForm = {
          roleName: '',
          authLabel: ''
        }
        // 清空标签弹窗数据
        this.filterText = ''
        this.treeData = []
        this.tagList = []
        this.tagTableData = []
        this.authLabelList = []
      })
    },
    tagClose () {
      this.filterText = ''
      this.treeData = []
      this.tagList = []
      this.tagTableData = []
      this.$emit('addExpertsClose')
      this.selectTagData = []
      this.tagTableData = []
    },
    sizeChange (val) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = val
      this.init()
    },
    pageChange (e) {
      this.pagination.currentPage = e
      this.init()
    }
  }
}
</script>
<style lang="less">
  .tablescope .el-switch__label * {
    font-size: 12px !important;
  }
  .tablescope .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  /*打开时文字位置设置*/
  .tablescope .el-switch__label--right {
    z-index: 1;
    right: 7px;
  }
  /*关闭时文字位置设置*/
  .tablescope .el-switch__label--left {
    z-index: 1;
    left: 8px;
  }
  /*显示文字*/
  .tablescope .el-switch__label.is-active {
    display: block;
  }
  .tablescope.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 50px !important;
  }

  .tag-container {
    margin-top: 10px;
    display: flex;
    .child {
      width: 32%;
    // height: 72vh;
    border: 1px;
      // flex: 1;
      // margin-right: 10px;
    }
    .transfer-card {
      flex: 3;
    }
  }
</style>