<template>
  <div class="">
    <el-card>
      <div class="d-flex justify-content-between my-2">
        <div></div>
        <div>
          <el-button @click="goToAddNewPage()" type="primary" size="small">
            Tạo mới
          </el-button>
        </div>
      </div>

      <el-tree
        :data="tableData"
        node-key="_id"
        default-expand-all
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="ml-3">
            <el-button
              class="text-success"
              type="text"
              size="mini"
              @click="() => addChild(data)">
              Thêm
            </el-button>
            <el-button
              class="text-primary"
              type="text"
              size="mini"
              @click="() => gotoDetail(data)">
              Sửa
            </el-button>
            <el-button
              class="text-danger"
              type="text"
              size="mini"
              @click="() => confirmDelete(data)">
              Xóa
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'category';
import { getList, handleDelete } from '@/api/category';
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0
    };
  },
  created () {
    this.loadData()
  },
  methods: {
    addChild(data){
      this.$router.push({ name: `${ModelCode}_new`, query: { parent: data._id } })
    },
    /** some handle methods */

    /** default methods */
    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` })
    },
    gotoDetail(row) {
      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } })
    },
    confirmDelete(row) {
      this.$confirm(`Xác nhận xóa ${ModelCode} "${row.label}"?`, 'Warning', {
        confirmButtonText: 'Delete',
        type: 'warning'
      }).then(() => {
        handleDelete(row._id).then(({data}) => {
          if (data.code === 'success') {
            this.loadData()
          }
        }).finally(() => {
          this.$wrLoading(false)
        })
      }).catch()
    },
    loadData() {
      getList().then(({data}) => {
        if (data.code == 'success') {
          this.tableData = []
          let catalogs = data.data
          let refArray = []
          
          // load parent
          for (let item of catalogs) {
            if (!item.parent) {
              let parentItem = {
                _id: item._id,
                label: item.title,
                children: []
              }
              refArray.push(parentItem)
              this.tableData.push(parentItem)
              item.remove = true
            }
          }

          catalogs = catalogs.filter(item => !item.remove)
          // load 
          while (catalogs.length) {
            let founded = false
            for (let item of catalogs) {
              let parentOfItem = refArray.find(parent => parent._id == item.parent)

              if (!item.remove && parentOfItem) {
                let itemData = {
                  _id: item._id,
                  label: item.title,
                  children: []
                }
                refArray.push(itemData)
                parentOfItem.children.push(itemData)
                parentOfItem.remove = true
              }
            }

            catalogs = catalogs.filter(item => !item.remove)
            if (!founded) {
              break
            }
          }
        }
      })
    },
    handlePageSizeChange() {
      this.pagination.current_page = 1
      this.loadData()
    }
  }
}
</script>

<style>

</style>