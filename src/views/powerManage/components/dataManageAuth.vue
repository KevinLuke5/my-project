<template>
  <j-dialog
    title="数据角色分配"
    :visible.sync="dialog"
    append-to-body
    fullscreen
    style="overflow: hidden"
    :before-close="handleCloseDrawer"
  >
    <div class="box">
      <!--待分配角色区域-->
      <j-card shadow="always" class="child">
        <div style="display: flex; justify-content: space-between">
          <label>角色汇总</label>
          <j-button-group style="margin-bottom: 15px">
            <j-button size="small" @click="addRoleToMap">
              添加
            </j-button>
          </j-button-group>
        </div>
        <div class="dep-tree">
          <j-table
            ref="toBeAllotTable"
            v-loading="toBeAllot.loading"
            :data="toBeAllot.data"
            :height="height"
            style="width: 100%"
            @selection-change="handletoBeAllotChange"
          >
            <j-table-column type="selection" />
            <j-table-column prop="roleName" show-overflow-tooltip label="角色名" />
          </j-table>
        </div>
      </j-card>
      <!-- 结果角色区域 -->
      <j-card shadow="always" class="child">
        <div style="display: flex; justify-content: space-between">
          <label>可管理角色区</label>
          <j-button-group style="margin-bottom: 15px">
            <j-button size="small" @click="removeRoleFromMap">
              移除
            </j-button>
          </j-button-group>
        </div>
        <div class="dep-tree">
          <j-table
            ref="ownedTable"
            v-loading="selected.loading"
            :data="selected.data"
            :height="tableHeight"
            style="width: 100%"
            @selection-change="handleOwnedChange"
          >
            <j-table-column type="selection" />
            <j-table-column prop="roleName" show-overflow-tooltip label="角色名" />
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
import * as authApi from '@/api/powerManage/dataAuth'
import { parseTime } from '@/utils/index'
import _ from 'lodash'

export default {
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 固定表格高度
      height: null,
      // 固定已选区表格高度
      tableHeight: null,
      // 待分配角色区域变量
      toBeAllot: {
        loading: false,
        data: [],
        mutiSelection: []
      },
      // 已选择角色区域变量
      selected: {
        loading: false,
        data: [],
        mutiSelection: []
      },
      dialog: false,
      loading: false,
      appId: '12',
      logUserInfo: {},
      selectUserId: ''
    }
  },
  watch: {
    dialog (val) {
      if (!val) this.loading = false
    }
  },
  mounted () {
    this.height = document.documentElement.clientHeight - 400
    this.tableHeight = document.documentElement.clientHeight - 370
  },
  methods: {
    init (userId) {
      this.dialog = true
      this.logUserInfo = JSON.parse(localStorage.getItem('userInfo')) // 获取当前登录人
      this.selectUserId = userId // 获取被分配人id
      this.getToBeAllot()
      this.getSelected()
    },
    // 获取登录人可管理角色信息
    getToBeAllot () {
      this.toBeAllot.loading = true
      authApi.getManagerRoles({ userId: this.logUserInfo ? this.logUserInfo.userOaId : '', appId: this.appId }).then((res) => {
        if (res && res.code === '0') {
          this.toBeAllot.data = res.data
        }
      }).finally(() => {
        this.toBeAllot.loading = false
      })
    },
    // 获取被分配人可管理角色信息
    getSelected (userId) {
      this.selected.loading = true
      authApi.getManagerRoles({ userId: this.selectUserId, appId: this.appId }).then((res) => {
        if (res && res.code === '0') {
          this.selected.data = res.data
        }
      }).finally(() => {
        this.selected.loading = false
      })
    },
    // 将待分发区中的角色加入到结果角色映射表中
    addRoleToMap () {
      this.selected.data = _.unionBy(this.selected.data, this.toBeAllot.mutiSelection, 'id')
      this.toBeAllot.mutiSelection = []
      this.$refs.toBeAllotTable.clearSelection()
    },
    // 从结果角色映射表中移除相应的角色
    removeRoleFromMap () {
      this.selected.data = _.difference(this.selected.data, this.selected.mutiSelection)
    },
    // 待分配角色区域选框
    handletoBeAllotChange (val) {
      this.toBeAllot.mutiSelection = val
    },
    // 已分配角色区域选框
    handleOwnedChange (val) {
      this.selected.mutiSelection = val
    },
    // 保存
    save () {
      this.loading = true
      const roleIdList = this.selected.data.map((item) => item.id)
      authApi.insertBatchManager({
        roleIdList,
        userId: this.selectUserId,
        appId: this.appId,
        startTime: parseTime(new Date(), '{y}-{m}-{d}'),
        endTime: '2099-12-31'
      }).then((res) => {
        if (res && res.code === '0') {
          this.$notify({
            title: '绑定成功',
            message: '绑定成功',
            type: 'success'
          })
          this.cancel()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleCloseDrawer () {
      this.$confirm('确定关闭吗')
        .then(() => {
          this.cancel()
        })
        .catch(() => {})
    },
    cancel () {
      this.dialog = false
      this.toBeAllot.data = []
      this.selected.data = []
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
    // width: 32%;
    width: 45%;
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
</style>
