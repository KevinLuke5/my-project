<template>
  <span>
    <j-dropdown v-if="companies.length > 1" @command="SelectCompanyID">
      <span class="el-dropdown-link">
        <span class="company"> <span class="companyName">{{ company.name }}</span></span><i class="el-icon-arrow-down el-icon--right" />
      </span>
      <j-dropdown-menu slot="dropdown">
        <j-dropdown-item
          v-for="(item,index) in companies"
          :key="index"
          :command="item.id"
          :disabled="item.id === companyId"
        >{{ item.name }}</j-dropdown-item>
      </j-dropdown-menu>
    </j-dropdown>
    <!-- <span class="company"> <span class="companyName">{{ company.name }}</span></span> -->
  </span>
</template>

<script>
import { setCompanyId } from '@/utils/auth'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: '',
  components: {},
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['company', 'companies', 'companyId'])
  },
  methods: {
    ...mapActions(['SelectCompany']),
    SelectCompanyID (coId) {
      setCompanyId(coId)
      this.SelectCompany(coId)
      this.$router.go(0)
    }
  }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 16px;
  font-weight: 700;
}
.company {
  font-size: 12px;
}
.companyName {
  font-size: 15px;
  font-weight: bold;
  padding: 5px;
  font-weight: 700;
  color: #333;
  border-radius: 2px;
}
</style>
