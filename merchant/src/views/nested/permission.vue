<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">权限管理</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.roleName" placeholder="角色名" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="mainTable.filter.rolePinyin" placeholder="角色拼音" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="mainTable.pager.index = 1;getMainTableData()">
                  <i class="el-icon-search" />
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <!-- <el-row style="margin-bottom: 10px">
          <el-button size="mini" type="primary" style="float:right">新增</el-button>
        </el-row> -->
        <el-table
          v-loading="mainTable.loading"
          class=""
          :data="mainTable.array"
          element-loading-text="加载中，请稍候"
          element-loading-spinner="el-icon-loading"
          border
          stripe
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="角色名称" prop="roleName" />
          <el-table-column align="center" label="角色拼音" prop="rolePinyin" />
          <el-table-column align="center" label="添加时间" prop="createTime" />
          <el-table-column align="center" label="更新时间" prop="updateTime" />
          <el-table-column align="center" label="操作" width="260px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="mainTable.dialogVisible = true;getSelfTreeData(scope.row.id)">分配</el-button>

            </template>
          </el-table-column>

        </el-table>

        <pagination
          :pager-size="mainTable.pager.size"
          :pager-index="mainTable.pager.index"
          :pager-total="mainTable.pager.total"
          @pagination-change="handlePagerChange"
        />
      </el-card>

      <el-dialog width="500px" top="3vh" style="height:80%" center title="分配权限" :visible.sync="mainTable.dialogVisible">
        <div>
          <el-tree
            ref="tree"
            v-loading="mainTable.treeLoading"
            element-loading-text="加载中，请稍候"
            element-loading-spinner="el-icon-loading"
            node-key="key"
            :default-checked-keys="mainTable.defaultMenu"
            :data="mainTable.tree"
            :props="{
              label:'title'
            }"
            :expand-on-click-node="false"
            accordion
            show-checkbox
          />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="mainTable.dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getMenu, getSelfRoleList, addRoleMenu } from '@/api/menu'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      mainTable: {
        loading: false,
        treeLoading: false,
        dialogVisible: false,
        roleId: '',
        row: {},
        filter: {
          roleName: '',
          rolePinyin: ''
        },
        form: {
          commercialNumber: '',
          ips: ''
        },
        array: [],
        tree: [],
        defaultMenu: [],
        pager: {
          index: 1,
          total: 0,
          size: 10
        }
      }
    }
  },
  created() {
    this.getTreeData()
    this.getMainTableData()
  },
  methods: {
    getMainTableData() {
      this.mainTable.loading = true
      const _form = {
        roleName: this.mainTable.filter.roleName,
        rolePinyin: this.mainTable.filter.rolePinyin,
        pageNo: this.mainTable.pager.index,
        pageize: this.mainTable.pager.size
      }
      getRoleList(_form).then(response => {
        this.mainTable.pager.total = response.data || 0
        this.mainTable.array = response.rows || []
      }).finally(_ => {
        this.mainTable.loading = false
      })
    },
    handlePagerChange(val) {
      this.mainTable.pager = val
      this.getMainTableData()
    },
    getTreeData() {
      getMenu().then(response => {
        // if (response.code !== 200) return
        const { result } = response
        this.mainTable.tree = result.treeList
      })
    },
    getSelfTreeData(roleId) {
      this.mainTable.treeLoading = true
      this.mainTable.roleId = roleId
      getSelfRoleList({ roleId }).then(response => {
        this.$refs.tree.setCheckedKeys([])
        this.mainTable.defaultMenu = response.result || []
      }).finally(_ => {
        this.mainTable.treeLoading = false
      })
    },
    handleSubmit() {
      const checkNode = this.$refs.tree.getCheckedKeys()

      const _form = {
        newMenuIds: checkNode.join(','),
        lastMenuIds: this.mainTable.defaultMenu.join(','),
        roleId: this.mainTable.roleId
      }
      addRoleMenu(_form).then(response => {
        if (response.code !== 200) return

        this.$message.success(response.message)
        this.mainTable.dialogVisible = false
      })
    }
  }
}
</script>
