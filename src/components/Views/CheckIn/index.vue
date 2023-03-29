<template>
  <div class="">
    <el-card>
      <CheckIn/>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="createdAt" label="Thời gian">
          <template slot-scope="{row}">
            {{ new Date(row.time).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái"></el-table-column>
        <el-table-column prop="fullname" label="Nhân viên">
          <template slot-scope="{row}">
            {{ row.user.fullname }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Loại">
          <template slot-scope="{row}">
            <el-alert
              style="width: 110px;"
              :closable="false"
              :title="row.type == 'checkin'?'Check In':'Check Out'"
              :type="row.type == 'checkin'?'success':'warning'">
            </el-alert>
          </template>
        </el-table-column>
        
        <!-- <el-table-column :fixed="$isMobile?false:'right'" label="Thao tác" width="150">
          <template slot-scope="scope">
            <el-button @click.prevent="gotoDetail(scope.row)" type="success" size="mini">
              Xem
            </el-button>
          </template>
        </el-table-column> -->
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
const ModelCode = 'user_report';
import CheckIn from './CheckIn.vue'
import { getCollection } from '@/api/user_report';
export default {
  components: {CheckIn},
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0,
    };
  },
  created () {
    this.loadData()
  },
  methods: {
    /** some handle methods */

    /** default methods */
    // gotoDetail(row) {
    //   this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } })
    // },
    loadData() {
      getCollection({ pagination: this.pagination }).then(({data}) => {
        if (data.success) {
          this.tableData = data.data

          if (data.total) {
            this.totalData = data.total
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