<template>
  <div class="">
    <el-card>
      <el-tabs v-model="currentTabCode" type="border-card">
        <el-tab-pane
          v-for="(item, index) in metas"
          :key="index"
          :label="item.title"
          :name="item.is_new ? 'new':item.code"
        >
          <div class="row">
            <div class="col-md-4">
              <el-card>
                <el-form
                  label-width="160px"
                  label-position="left"
                  :model="item"
                >
                  <el-form-item label="Title" required>
                    <el-input v-model="item.title" clearable/>
                  </el-form-item>
                  <el-form-item label="code" required>
                    <el-input v-model="item.code" />
                  </el-form-item>
                  <el-form-item label="slug" required>
                    <el-input v-model="item.slug" />
                  </el-form-item>
                  <el-form-item label="Hiển thị trong trang">
                    <el-switch v-model="item.show_in_product_page"></el-switch>
                  </el-form-item>
                  <el-form-item label="Kết hợp">
                    <el-switch v-model="item.is_multi_value"></el-switch>
                  </el-form-item>
                </el-form>
                
                <el-button v-if="item.is_new" @click="handleAddNewMeta" type="primary">Thêm mới</el-button>
                <div class="d-flex " v-else>
                  <el-button type="primary" @click="saveMeta">Lưu</el-button>
                  <el-button type="danger" @click="confirmDeleteMeta(item)">Xóa</el-button>
                </div>
                
              </el-card>
            </div>
            <div class="col-md-8">
              <el-card>
                <div class="text-right">
                  <router-link :to="{ name: 'meta_attribute_new', params: { meta_code: item.code } }"><el-button size="mini" v-if="!item.is_new" type="primary">Thêm mới</el-button></router-link>
                </div>
                <el-table
                  v-loading="loadingMetaAttribute"
                  :data="item.tableData"
                  style="width: 100%">
                  <el-table-column prop="value" label="Tên"></el-table-column>
                  <el-table-column prop="slug" label="Slug"></el-table-column>
                  <el-table-column prop="content" label="Content">
                    <template slot-scope="scope">
                      <div v-html="scope.row.content"></div>
                    </template>
                  </el-table-column>
                  
                  <el-table-column :fixed="$isMobile?false:'right'" label="Thao tác" width="150">
                    <template slot-scope="scope">
                      <el-button @click.prevent="gotoDetail(scope.row)" type="success" size="mini">
                        Xem
                      </el-button>
                      <el-button @click.prevent="confirmDeleteMetaAtt(scope.row)" type="danger" size="mini">
                        Xóa
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="mt-2">
                  <el-pagination
                    background layout="jumper, prev, pager, next, sizes, total" :page-sizes="[5, 25, 50, 100]" :pager-count="5"
                    :page-size.sync="pagination.page_size" :total="pagination.count" :current-page.sync="pagination.current_page"
                    @current-change="loadAttributeData(item.code)" @size-change="handlePageSizeChange(item.code)"
                  />
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import MediaPicker from '@/components/Widgets/MediaPicker'
const ModelCode = 'meta_attribute';
import * as metaApi from '@/api/meta';
import * as metaAttributeApi from '@/api/meta_attribute';
export default {
  components: { MediaPicker },
  data() {
    return {
      newMetaAttForm: {},
      isShowDialog: false,
      currentTabCode: '',
      metas: [
        
      ],
      tableData: [],
      pagination: {
        current_page: 1,
        page_size: 25
      },
      totalData: 0,
      loadingMetaAttribute: false
    };
  },
  created () {
    this.loadData()
    if (this.$route.query.meta_code) {
      this.currentTabCode = this.$route.query.meta_code
    }
  },
  watch: {
    'currentTabCode': function () {
      if (this.currentTabCode) {
        this.loadAttributeData(this.currentTabCode)
      }
    }
  },
  methods: {
    saveMeta() {
      let currentMeta = this.metas.find(meta => meta.code == this.currentTabCode)
      if (currentMeta) {
        metaApi.saveData(currentMeta, currentMeta._id).then(({data}) => {
          if (data.code == 'success') {
            this.loadData()
          }
        })
      }
    },
    handleAddNewMeta() {
      // todo: validate
      metaApi.addData(this.metas[0]).then(({data}) => {
        if (data.code == 'success') {
          this.loadData()
        }
      })
    },
    loadAttributeData(metaCode) {
      this.loadingMetaAttribute = true
      metaAttributeApi.getCollection({ filter: { meta_code: metaCode }, pagination: this.pagination }).then(({data}) => {
        if (data.code == 'success') {
          let currentMeta = this.metas.find(meta => meta.code == this.currentTabCode)
          if (currentMeta) {
            currentMeta.tableData = data.data
            if (data.total) {
              this.pagination.count = data.total
            }
          }
        }
      }).finally(() => {
        this.loadingMetaAttribute = false
      })
    },
    /** some handle methods */

    /** default methods */
    goToAddNewPage() {
      this.$router.push({ name: `${ModelCode}_new` })
    },
    gotoDetail(row) {
      this.$router.push({ name: `${ModelCode}_edit`, params: { id: row._id } })
    },
    confirmDeleteMeta(meta) {
      this.$confirm(`Xác nhận thuộc tính này ?`, 'Warning', {
        confirmButtonText: 'Delete',
        type: 'warning'
      }).then(() => {
        metaApi.handleDelete(meta._id).then(({data}) => {
          if (data.code === 'success') {
            this.currentTabCode = ''
            this.loadData()
          }
        }).finally(() => {
          this.$wrLoading(false)
        })
      }).catch()
    }, 
    confirmDeleteMetaAtt(row) {
      this.$confirm(`Xác nhận xóa dữ liệu này của thuộc tính "${this.currentTabCode}"?`, 'Warning', {
        confirmButtonText: 'Delete',
        type: 'warning'
      }).then(() => {
        metaAttributeApi.handleDelete(row._id).then(({data}) => {
          if (data.code === 'success') {
            this.loadAttributeData(this.currentTabCode)
          }
        }).finally(() => {
          this.$wrLoading(false)
        })
      }).catch()
    },
    loadData() {
      metaApi.getCollection({ pagination: this.pagination }).then(({data}) => {
        if (data.code == 'success') {
          this.metas = [
            {
              is_new: true,
              title: 'Thêm thuộc tính',
              code: '',
              slug: '',
              is_multi_value: false,
              show_in_product_page: true,
              tableData: []
            },
            ...data.data.map(item => {
              item.tableData = []
              return item
            })
          ]

          if (this.currentTabCode == 0 || !this.currentTabCode) {
            if (this.metas.length > 1) {
              this.currentTabCode = this.metas[1].code
            } else {
              this.currentTabCode = 'new'
            }
          }
        }
      })
    },
    handlePageSizeChange(metaCode) {
      this.pagination.current_page = 1
      this.loadAttributeData(metaCode)
    }
  }
}
</script>

<style>

</style>