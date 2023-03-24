<template>
  <div>
    <el-card>
      <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
      <div class="mt-3">
        <div class="row">
          <div class="col-md-6">
            <div class="field-box" style="max-width: 550px;">
              <h2>Thông tin đặt hàng</h2>
              <div class="info-item">
                <b>Họ tên</b>
                <span>{{ order.shipping.full_name }}</span>
              </div>
              <div class="info-item">
                <b>Địa chỉ</b>
                <span>{{ order.shipping.address }}</span>
              </div>
              <div class="info-item">
                <b>Tỉnh thành phố</b>
                <span>{{ order.shipping.city }}</span>
              </div>
              <div class="info-item">
                <b>Số điện thoại</b>
                <span>{{ order.shipping.telephone }}</span>
              </div>
              <div class="info-item">
                <b>Email</b>
                <span>{{ order.shipping.email }}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="field-box" style="max-width: 550px;">
              <h2>Thông tin đơn hàng</h2>
              <div class="info-item">
                <b>Trạng thái</b>
                <el-select
                  v-model="order.status"
                  placeholder="Select">
                  <el-option
                    v-for="key in Object.keys(statusMapped)"
                    :key="key"
                    :label="statusMapped[key]"
                    :value="key">
                  </el-option>
                </el-select>
              </div>
              <div class="info-item">
                <b>Hình thức thanh toán</b>
                <span>{{ paymentTypes[order.payment_type] }}</span>
              </div>
              <div class="info-item">
                <b>Tổng số tiền</b>
                <span>{{ formatPrice(order.subtotal_price) }}</span>
              </div>
              <div class="info-item">
                <b>Thời gian đặt</b>
                <span>{{ new Date(order.createdAt).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <el-table
          :data="order.order_items"
          style="width: 100%">
          <el-table-column prop="name" label="Tên sản phẩm"></el-table-column>
          <el-table-column prop="sku" label="Mã"></el-table-column>
          <el-table-column prop="price" label="Giá"></el-table-column>
          <el-table-column prop="qty" label="Số lượng"></el-table-column>
          <el-table-column label="Tổng" width="150">
            <template slot-scope="scope">
              {{ scope.row.price * scope.row.qty }}
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'order'

import { saveData, getDetail } from "@/api/order";
export default {
  data: function () {
    return {
      order: {
        shipping: {}
      },
      hasChange: false,
      statusMapped: {
        hold: 'Tạm giữ',
        confirmed: 'Đã xác nhận',
        shipped: 'Đã gửi hàng',
        complete: 'Đã giao'
      },
      paymentTypes: {
        cash: 'Thanh toán tiền mặt',
        transfer: 'Chuyển khoản ngân hàng'
      }
    }
  },
  watch: {
    'order.status': function (newVal, oldVal) {
      if (oldVal && newVal && oldVal != newVal) {
        saveData({ status: newVal }, this.order._id)
      }
    }
  },
  computed: {
    toolbarButtons() {
      let disabled = true;
      if (this.hasChange) {
        disabled = false;
      }

      return [
        { label: "Quay lại", route: `${ModelCode}_main` },
      ];
    },
  },
  methods: {
    saveAndContinue() {
      this.handleSave(true);
    },
    handleSave: function (isContinue = false) {
      this.$refs.form_data.validate(async (valid) => {
        if (valid == false) {
          return false
        } else {
          this.$wrLoading(true)
          let currentId
          if (this.form._id) {
            await saveData(this.form, this.form._id).then(({data}) => {
               if (data.code === 'success') {
                if (isContinue === false) {
                  this.$router.push({ name: `${ModelCode}_main` });
                } else {
                  currentId = data.data._id;
                }
              }
            })
          }

          this.$wrLoading(false)

          if (currentId) {
            if (!this.$route.params.id) {
              this.$router.push({
                name: `${ModelCode}_edit`,
                params: { id: currentId },
              });
            }

            getDetail(currentId).then(({data}) => {
              this.$store.dispatch("reRender")
              this.$set(this, 'form', data.data)
            }).catch((err) => {
              console.log(err)
            });
          }
        }
      })
    },
  },
  created() {
    if (this.$route.params.id) {
      this.$wrLoading(true);
      getDetail(this.$route.params.id).then(({data}) => {
        if (data.code == 'success') {
          this.$set(this, 'order', data.data)
          this.$nextTick(() => {
            this.hasChange = false;
          });
        }
        this.$store.dispatch("setPageTitle", `Chỉnh sửa`);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.$wrLoading(false);
      })
    }
  }
}
</script>

<style scoped>
.info-item{
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>