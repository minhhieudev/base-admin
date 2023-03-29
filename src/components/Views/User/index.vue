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
        <el-table-column prop="fullname" label="Tên"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="phone" label="SĐT"></el-table-column>
        <!-- <el-table-column prop="address" label="Địa chỉ">
          <template slot-scope="{row}">
            <span>{{ `${row.address.home} ,${row.address.ward}, ${row.address.district}, ${row.address.city}` }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="role" label="Quyền">
          <template slot-scope="{row}">
            {{ roleMap[row.role] }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="verified" label="Verified">
          <template slot-scope="{row}">
            <el-switch v-model="row.verified" disabled/>
          </template>
        </el-table-column> -->
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
const ModelCode = 'user';
import { getCollection, handleDelete } from '@/api/user';
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0,
      roleMap: {
        admin: 'Quản trị',
        leader: 'Quản trị nhóm',
        employee: 'Thành viên',
      }
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
      this.$confirm(`Xác nhận xóa ${ModelCode}?`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning'
      }).then(() => {
        handleDelete(row._id).then(({data}) => {
          console.log(data);
          if (data.success) {
            this.loadData()
          }
        }).finally(() => {
          this.$wrLoading(false)
        })
      }).catch()
    },
    loadData() {
      getCollection({ pagination: this.pagination }).then(({data}) => {
        if (data.success) {
          this.tableData = data.docs

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