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
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="title" label="Tên"></el-table-column>
        <el-table-column prop="sale" label="Người bán"></el-table-column>
        <el-table-column prop="phone" label="SĐT"></el-table-column>
        <el-table-column prop="address" label="Địa chỉ"></el-table-column>
        <el-table-column :fixed="$isMobile?false:'right'" label="Thao tác" width="150">
          <template slot-scope="scope">
            <el-button @click.prevent="gotoDetail(scope.row)" type="success" size="mini">
              Xem
            </el-button>
            <el-button @click.prevent="confirmDelete(scope.row)" type="danger" size="mini">
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination
          background layout="jumper, prev, pager, next, sizes, total" :page-sizes="[25, 50, 100]" :pager-count="5"
          :page-size.sync="pagination.page_size" :total="pagination.count" :current-page.sync="pagination.current_page"
          @current-change="loadData" @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'vendor';
import { getCollection, handleDelete } from '@/api/vendor';
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
    /** some handle methods */

    /** default methods */
    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` })
    },
    gotoDetail(row) {
      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } })
    },
    confirmDelete(row) {
      this.$confirm(`Xác nhận xóa ${ModelCode} "${row.title}"?`, 'Warning', {
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
      getCollection({ pagination: this.pagination }).then(({data}) => {
        if (data.code == 'success') {
          this.tableData = data.data

          if (data.total) {
            this.pagination.count = data.total
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