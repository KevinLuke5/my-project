<template>
  <j-dialog
    title="账号分配"
    :visible.sync="dialog"
    append-to-body
    fullscreen
    style="overflow: hidden"
    :before-close="handleCloseDrawer"
  >
    <div class="box">
      <!--待分配角色区域-->
      <j-card shadow="always" class="child">
        <j-button-group style="margin-bottom: 10px">
          <j-button size="small" @click="addRoleToMap(0)">
            添加至已拥有角色区
          </j-button>
          <j-button size="small" @click="addRoleToMap(1)">
            添加至可分发角色区
          </j-button>
        </j-button-group>
        <div class="dep-tree">
          <div class="head">
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
          </div>
          <j-table
            ref="toBeAllotTable"
            v-loading="toBeAllot.loading"
            :data="toBeAllot.data"
            :height="height"
            style="width: 100%"
            @selection-change="handletoBeAllotChange"
          >
            <j-table-column type="selection" />
            <j-table-column prop="name" show-overflow-tooltip label="角色名" />
            <j-table-column prop="type" show-overflow-tooltip label="角色类型">
              <template slot-scope="scope">
                <span>{{ getDictLabel(scope.row.type, 'role-type') }}</span>
              </template>
            </j-table-column>
          </j-table>
          <j-pagination
            :current-page="toBeAllot.page"
            :page-sizes="[15, 30, 50, 100]"
            small
            :page-size="toBeAllot.size"
            :total="toBeAllot.total"
            layout="total, prev, jumper, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </div>
      </j-card>
      <!-- 已拥有角色区域 -->
      <j-card shadow="always" class="child">
        <div style="display: flex; justify-content: space-between">
          <label>已拥有角色区</label>
          <j-button-group style="margin-bottom: 15px">
            <j-button size="small" @click="removeRoleFromMap(0)">
              移除
            </j-button>
          </j-button-group>
        </div>
        <div class="dep-tree">
          <div class="head">
            <j-input
              v-model="owned.name"
              clearable
              size="mini"
              placeholder="角色名"
            />
          </div>
          <j-table
            ref="ownedTable"
            v-loading="owned.loading"
            :data="ownedData"
            :height="tableHeight"
            style="width: 100%"
            @selection-change="handleOwnedChange"
          >
            <j-table-column type="selection" />
            <j-table-column prop="name" show-overflow-tooltip label="角色名" />
            <j-table-column prop="type" show-overflow-tooltip label="角色类型">
              <template slot-scope="scope">
                <span>{{ getDictLabel(scope.row.type, 'role-type') }}</span>
              </template>
            </j-table-column>
          </j-table>
        </div>
      </j-card>
      <!-- 可分发角色区域 -->
      <j-card shadow="always" class="child">
        <div style="display: flex; justify-content: space-between">
          <label>可分发角色区</label>
          <j-button-group style="margin-bottom: 15px">
            <j-button size="small" @click="removeRoleFromMap(1)">
              移除
            </j-button>
          </j-button-group>
        </div>
        <div class="dep-tree">
          <div class="head">
            <j-input
              v-model="allot.name"
              clearable
              size="mini"
              placeholder="角色名"
            />
          </div>
          <j-table
            ref="allotTable"
            v-loading="allot.loading"
            :data="allotData"
            :height="tableHeight"
            style="width: 100%"
            @selection-change="handleAllotChange"
          >
            <j-table-column type="selection" />
            <j-table-column prop="name" show-overflow-tooltip label="角色名" />
            <j-table-column prop="type" show-overflow-tooltip label="角色类型">
              <template slot-scope="scope">
                <span>{{ getDictLabel(scope.row.type, 'role-type') }}</span>
              </template>
            </j-table-column>
          </j-table>
        </div>
      </j-card>
    </div>
    <div class="bottom">
      <j-button type="primary" @click="save">
        保存
      </j-button>
      <j-button @click="cancel">
        取消
      </j-button>
    </div>
  </j-dialog>
</template>
<script>
import initDict from '@/mixins/initDict'
import { getRole } from '@/api/system/role'
import { getRelRole, bindRole } from '@/api/system/account'
export default {
  mixins: [initDict],
  // inject: ['init'],
  props: {},
  data () {
    return {
      // 固定表格高度
      height: null,
      // 固定已选区表格高度
      tableHeight: null,
      // 待分配角色区域变量
      toBeAllot: {
        size: 15,
        page: 1,
        total: 0,
        name: '',
        loading: false,
        data: [],
        mutiSelection: []
      },
      // 已拥有角色区域变量
      owned: {
        name: '',
        loading: false,
        data: [],
        map: {},
        mutiSelection: []
      },
      // 可分发角色区域变量
      allot: {
        name: '',
        loading: false,
        data: [],
        map: {},
        mutiSelection: []
      },
      // 选框展示与否
      dialog: false,
      // 按钮状态
      loading: false
    }
  },
  computed: {
    ownedData () {
      const search = this.owned.name.toLowerCase()
      const datas = this.owned.data
      if (search) {
        return datas.filter((data) => {
          return ['name'].some((key) => {
            return String(data[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return datas
    },
    allotData () {
      const search = this.allot.name.toLowerCase()
      const datas = this.allot.data
      if (search) {
        return datas.filter((data) => {
          return ['name'].some((key) => {
            return String(data[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return datas
    }
  },
  watch: {
    dialog (val) {
      if (!val) this.loading = false
    }
  },
  created () {
    this.initDicts('role-type')
  },
  mounted () {
    this.height = document.documentElement.clientHeight - 400
    this.tableHeight = document.documentElement.clientHeight - 370
  },
  methods: {
    initRole (accountId) {
      this.accountId = accountId
      this.getToBeAllot()
      this.getOwned()
      setTimeout(() => { // 同时调用角色接口第二个会不成功，所以延迟一秒再调用
        this.getAllot()
      }, 1000)
      this.dialog = true
    },

    // 获取待分配角色信息
    getToBeAllot (val) {
      this.toBeAllot.loading = true
      const params = {
        page: val ? val : this.toBeAllot.page,
        size: this.toBeAllot.size,
        type: 1,
        isDisable: 0
      }
      if (this.toBeAllot.name.trim()) {
        params.name = this.toBeAllot.name.trim()
      }
      getRole(params).then((res) => {
        this.toBeAllot.data = res.data.content
        this.toBeAllot.total = res.data.totalElements
        this.toBeAllot.loading = false
      })
    },
    // 获取已拥有角色信息
    getOwned () {
      this.owned.loading = true
      getRelRole({ type: 0, accountId: this.accountId }).then((res) => {
        res.data.forEach((role) => {
          this.owned.map[role.id] = {
            name: role.name,
            id: role.id,
            delFlag: role.delFlag,
            type: role.type
          }
        })
        const showList = Object.values(this.owned.map).filter(
          (role) => role.delFlag === 0
        )
        this.owned.data = showList
        this.owned.loading = false
      })
    },
    // 获取可分配角色信息
    getAllot () {
      this.allot.loading = true
      getRelRole({ type: 1, accountId: this.accountId }).then((res) => {
        if (res && res.data.length) {
          res.data.forEach((role) => {
            this.allot.map[role.id] = {
              name: role.name,
              id: role.id,
              delFlag: role.delFlag,
              type: role.type
            }
          })
        
          const showList = Object.values(this.allot.map).filter(
            (role) => role.delFlag === 0
          )
          this.allot.data = showList
          this.allot.loading = false 
        } else {
          this.allot.loading = false
        }
      })
    },
    /**
     * //将待分发区中的角色加入到已拥有/可分发角色映射表中
     * @param type 0:加入到已拥有角色映射 1:加入到可分发角色映射
     */
    addRoleToMap (type) {
      const map = type === 0 ? this.owned.map : this.allot.map
      this.toBeAllot.mutiSelection.forEach((role) => {
        map[role.id] = {
          name: role.name,
          id: role.id,
          delFlag: role.delFlag,
          type: role.type
        }
      })
      const showList = Object.values(map).filter((role) => role.delFlag === 0)
      if (type === 0) {
        this.owned.data = showList
      } else {
        this.allot.data = showList
      }

      this.toBeAllot.mutiSelection = []
      this.$refs.toBeAllotTable.clearSelection()
    },
    /**
     * 从已拥有/可分发角色映射表中移除相应的角色
     * @param type 0:从已拥有角色映射中移除 1:从可分发角色映射中移除
     */
    removeRoleFromMap (type) {
      const map = type === 0 ? this.owned.map : this.allot.map
      const list =
        type === 0 ? this.owned.mutiSelection : this.allot.mutiSelection
      list.forEach((role) => {
        map[role.id] = {
          name: role.name,
          id: role.id,
          delFlag: 1,
          type: role.type
        }
      })
      const showList = Object.values(map).filter((role) => role.delFlag === 0)
      if (type === 0) {
        this.owned.data = showList
      } else {
        this.allot.data = showList
      }
    },
    // 待分配角色区域选框
    handletoBeAllotChange (val) {
      this.toBeAllot.mutiSelection = val
    },
    // 已分配角色区域选框
    handleOwnedChange (val) {
      this.owned.mutiSelection = val
    },
    // 可分发角色区域选框
    handleAllotChange (val) {
      this.allot.mutiSelection = val
    },
    // 组件保存
    save () {
      const list = []
      this.loading = true

      Object.values(this.owned.map).forEach((role) => {
        const rel = {
          accountId: this.accountId,
          roleId: role.id,
          type: 0,
          delFlag: role.delFlag
        }
        list.push(rel)
      })
      Object.values(this.allot.map).forEach((role) => {
        const rel = {
          accountId: this.accountId,
          roleId: role.id,
          type: 1,
          delFlag: role.delFlag
        }
        list.push(rel)
      })
      bindRole(list).then((res) => {
        this.$notify({
          title: '绑定成功',
          message: '绑定成功',
          type: 'success'
        })
        this.cancel()
        this.loading = false
        // this.init()
      })
    },
    sizeChange (val) {
      this.toBeAllot.page = 1
      this.toBeAllot.size = val
      this.getToBeAllot()
    },
    pageChange (val) {
      this.toBeAllot.page = val
      this.getToBeAllot()
    },
    handleCloseDrawer (done) {
      this.$confirm('确定关闭吗')
        .then((_) => {
          this.cancel()
        })
        .catch((_) => {})
    },
    cancel () {
      this.dialog = false
      this.toBeAllot.name = ''
      this.owned.name = ''
      this.allot.name = ''
      this.toBeAllot.data = []
      this.owned.data = []
      this.allot.data = []
      this.owned.map = {}
      this.allot.map = {}
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  min-width: 1120px;
  display: flex;
  justify-content: space-around;
  .child {
    width: 32%;
    // height: 72vh;
    border: 1px;
  }
  .el-button--mini {
    padding: 5px 15px;
  }
}
.bottom {
  margin-top: 10px;
  padding: 0 20px;
  text-align: right;
}
.dep-tree {
  margin-top: 5px;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.el-card__body {
  padding: 20px 10px;
}
.head {
  margin-bottom: 10px;
  .el-input {
    width: 70%;
  }
  .el-button {
    margin-left: 5px;
  }
}

// 分页
.el-pagination {
  margin: 10px 0;
}
.el-pagination ::v-deep .el-pagination__jump {
  margin-left: 0;
}
</style>
