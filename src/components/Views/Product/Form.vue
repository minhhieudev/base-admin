<template>
  <div>
    <el-card>
      <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
      <div class="mt-3">
        <el-form
          ref="form_data"
          label-width="120px"
          label-position="left"
          :model="form"
        >
          <div class="row">
            <div class="col-md-8">
              <el-card>
                <h3><b class="mb-5">Thuộc tính chính</b></h3>
                <br>
                <el-form-item label="Trạng thái">
                  <el-switch v-model="form.status"></el-switch>
                </el-form-item>
                <el-form-item label="Tên sản phẩm" required>
                  <el-input v-model="form.name" autofocus />
                </el-form-item>

                <div class="field-box mb-2">
                  <div class="row">
                    <div class="col-md-6">
                      <el-form-item label="SKU" required>
                        <el-input v-model="form.sku" />
                      </el-form-item>
                      <el-form-item label="Đường dẫn" required>
                        <el-input :value="form.slug" @input="handleInputSlug" />
                      </el-form-item>
                    </div>
                    <div class="col-md-6">
                      <el-form-item label="Số lượng">
                        <el-input v-model="form.stock" type="number" :min="0"/>
                      </el-form-item>
                      <el-form-item label="Danh mục" required>
                        <el-select
                          filterable
                          v-model="form.catalogs"
                          multiple
                          collapse-tags
                          placeholder="Select">
                          <el-option
                            v-for="item in catalogs"
                            :key="item._id"
                            :label="item.title"
                            :value="item._id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </div>

                <div class="field-box mb-2">
                  <div class="row">
                    <div class="col-md-6">
                      <el-form-item label="Giá bán" required>
                        <el-input v-model="form.price.regular" type="number" :min="0"/>
                      </el-form-item>
                      <el-form-item label="Giá khuyến mãi">
                        <el-input v-model="form.price.sale" type="number" :min="0"/>
                      </el-form-item>
                    </div>
                    <div class="col-md-6">
                      <el-form-item label="Giá nhập" required>
                        <el-input v-model="form.price.cost" type="number" :min="0"/>
                      </el-form-item>
                      <el-form-item label="Giá đại lý">
                        <el-input v-model="form.price.agent" type="number" :min="0"/>
                      </el-form-item>
                    </div>
                  </div>
                </div>

                <label class="text-info">Nội dung</label>
                <ckeditor v-model="form.content" :config="ckEditorConfig"></ckeditor>
                
                <el-form-item label="Hiển thị trang chủ?">
                  <el-switch v-model="form.featured"></el-switch>
                </el-form-item>
                <el-form-item label="Nhà cung cấp">
                  <el-select
                    v-model="form.supplier"
                    placeholder="Select">
                    <el-option
                      v-for="item in vendors"
                      :key="item._id"
                      :label="item.title"
                      :value="item._id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Seo Title">
                  <el-input v-model="form.seo_title" />
                </el-form-item>
                <el-form-item label="Seo description">
                  <el-input type="textarea" :rows="4" v-model="form.seo_description" />
                </el-form-item>
                <el-form-item label="Ảnh">
                  <div class="d-flex">
                    <img width="100" height="100" :src="getImagePath(form.image)" class="mr-2"/>
                    <MediaPicker v-model="form.image" />
                  </div>
                </el-form-item>
                <el-form-item label="Ảnh phụ">
                  <div class="" style="height: 120px">
                    <MediaPicker @pick="handlePickImage" text="Thêm ảnh"/>
                    <span v-for="(item, index) of form.sliders" :key="index">
                      <img width="100" height="100" :src="getImagePath(item)" class=""/>
                      <i class="el-icon-circle-close rm-btn" @click="removeImageSlider(index)"></i>
                    </span>
                  </div>
                </el-form-item>
              </el-card>
            </div>
            <div class="col-md-4">
              <el-card class="mt-2">
                <h3><b>Các tùy chọn</b></h3>
                <el-button @click="dialogAddVariation = true" class="ml-2 mt-2" size="medium" type="primary">Thêm tùy chọn</el-button>
                <div class="mt-2" v-if="Array.isArray(form.variations)">
                  <el-tag type="success" closable @close="handleRemoveVariation(index)" class="ml-2" v-for="(item, index) in form.variations" :key="index">
                    {{item.label}}
                  </el-tag>
                </div>
              </el-card>
              <el-card class="mt-2">
                <div class="d-flex justify-content-between mb-3">
                  <h3><b>Thuộc tính</b></h3>
                  <el-button  type="info" class="ml-2" size="mini" @click="loadMetaAttributes">Làm mới</el-button>
                </div>
                <el-form-item :label="item.title + (item.is_multi_value?' (s)':'')" v-for="(item, index) in metas" :key="index">
                  <span>
                    <el-select
                      filterable
                      v-model="form['meta_'+item.code]"
                      :multiple="item.is_multi_value"
                      placeholder="Select">
                      <el-option
                        label="Không chọn"
                        :value="null">
                      </el-option>
                      <el-option
                        v-for="item in getMetaAtt(item.code)"
                        :key="item._id"
                        :label="item.value"
                        :value="item._id">
                      </el-option>
                    </el-select>
                  </span>
                  <router-link target="_blank" :to="{ name: 'meta_attribute_new', params: { meta_code: item.code } }">
                    <el-button  type="primary" class="ml-2" size="medium">Thêm</el-button>
                  </router-link>
                </el-form-item>
              </el-card>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>

    <el-dialog
      width="40%"
      title="Upload"
      :visible.sync="dialogAddVariation">
      <div class="w-100 text-center">
        <el-form>
          <el-form-item label="Tên">
            <el-input v-model="newVariationForm.label" autofocus placeholder="Tên"></el-input>
          </el-form-item>
          <el-form-item label="Đường dẫn sản phẩm">
            <el-input v-model="newVariationForm.slug" placeholder="ruou-vang-nien-vu-2017"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVariation = false">Đóng</el-button>
        <el-button type="primary" @click="handleCreateVariation">Tạo</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const ModelCode = 'product'
import Editor from '@tinymce/tinymce-vue'
import MediaPicker from '@/components/Widgets/MediaPicker'
import { addData, saveData, getDetail } from "@/api/product";
import * as vendorApi from "@/api/vendor";
import * as catalogApi from "@/api/category";
import * as metaApi from "@/api/meta";
import * as metaAttributeApi from "@/api/meta_attribute";
export default {
  components: { MediaPicker, Editor },
  data: function () {
    return {
      dialogAddVariation: false,
      metas: [],
      vendors: [],
      catalogs: [],
      form: {
        price: {},
        sliders: []
      },
      hasChange: false,
      metaAttributes: [],
      isTypedSlug: false,
      newVariationForm: {}
    }
  },
  watch: {
    'form.name': function () {
      if (this.form.name && !this.isTypedSlug) {
        this.$set(this.form, 'slug', this.getSlug(this.form.name))
      }
    },
    form: {
      handler: function () {
        this.hasChange = true;
      },
      deep: true,
    },
  },
  computed: {
    toolbarButtons() {
      let disabled = true;
      if (this.hasChange) {
        disabled = false;
      }

      return [
        { label: "Quay lại", route: `${ModelCode}_main` },
        {
          label: "Lưu và tiếp tục",
          disabled: disabled,
          callback: this.saveAndContinue,
          type: "primary",
        },
        {
          label: "Lưu",
          disabled: disabled,
          callback: this.handleSave,
          type: "primary",
        },
      ];
    },
  },
  created() {
    this.loadMetaCodes()
    this.loadMetaAttributes()
    this.loadVendors()
    this.loadCatalogs()
    if (this.$route.params.id) {
      this.$wrLoading(true);
      getDetail(this.$route.params.id).then(({data}) => {
        if (data.code == 'success') {
          this.$set(this, 'form', data.data)
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
  },
  methods: {
    removeImageSlider(index) {
      this.form.sliders.splice(index, 1)
    },
    handlePickImage(media) {
      this.form.sliders.push(media)
    },
    handleRemoveVariation(index) {
      this.form.variations.splice(index, 1)
    },
    handleCreateVariation() {
      if (this.newVariationForm.label && this.newVariationForm.slug) {
        if (!Array.isArray(this.form.variations)) {
          this.$set(this.form, 'variations', [])
        }

        this.form.variations.push({
          label: this.newVariationForm.label,
          slug: this.newVariationForm.slug
        })

        this.dialogAddVariation = false
        this.newVariationForm = {}
      }
    },
    handleInputSlug(value) {
      this.isTypedSlug = true
      this.form.slug = value
    },
    getMetaAtt(metaCode) {
      return this.metaAttributes.filter(item => item.meta_code == metaCode)
    },
    loadMetaAttributes() {
      metaAttributeApi.getList().then(({data}) => {
        if (data.code == 'success') {
          this.metaAttributes = data.data
        }
      })
    },
    loadMetaCodes() {
      metaApi.getCollection().then(({ data }) => {
        if (data.code == 'success') {
          this.metas = data.data
        }
      })
    },
    loadCatalogs() {
      catalogApi.getList().then(({ data }) => {
        if (data.code == 'success') {
          this.catalogs = data.data
        }
      })
    },
    loadVendors() {
      vendorApi.getCollection().then(({ data }) => {
        if (data.code == 'success') {
          this.vendors = data.data
        }
      })
    },
    handlePickMedia(media) {
      if (media) {
        this.form.image = media.path
      }
    },
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
                  currentId = this.form._id
                }
              }
            })
          } else {
            await addData(this.form).then(({data}) => {
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
  }
}
</script>

<style scoped lang="scss">
.field-box {
  padding: 0.5em 1em;
  margin: 0 -0.5em;
  border: dashed 1px #ccc;
  border-radius: 5px;
}

.rm-btn{
    font-size: 25px;
    position: relative;
    top: -30px;
    left: -28px;
    cursor: pointer;
  }
</style>