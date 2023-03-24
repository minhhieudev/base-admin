<template>
  <div>
    <el-card>
      <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
      <div class="col-md-6 mt-3">
        <el-form
          ref="form_data"
          label-width="120px"
          label-position="left"
          :model="form"
        >
          <el-form-item label="Tiêu đề" required>
            <el-input v-model="form.title" autofocus />
          </el-form-item>
          <el-form-item label="Đường dẫn" required>
            <el-input :value="form.slug" @input="handleInputSlug" />
          </el-form-item>
          <el-form-item label="Nội dung">
            <ckeditor v-model="form.content" :config="ckEditorConfig"></ckeditor>
          </el-form-item>
          <el-form-item label="Seo title">
            <el-input v-model="form.seo_title" />
          </el-form-item>
          <el-form-item label="Seo description">
            <el-input v-model="form.seo_description" />
          </el-form-item>
          <el-form-item label="Ảnh">
            <div class="d-flex">
              <img width="100" height="100" :src="getImagePath(form.image)" class="mx-2"/>
              <MediaPicker v-model="form.image" />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'article-category'
import Editor from '@tinymce/tinymce-vue'
import MediaPicker from '@/components/Widgets/MediaPicker'
import { addData, saveData, getDetail } from "@/api/article_category";
export default {
  components: { MediaPicker, Editor },
  data: function () {
    return {
      form: {},
      hasChange: false,
      isTypedSlug: false
    }
  },
  watch: {
    'form.title': function () {
      if (!this.isTypedSlug) {
        this.$set(this.form, 'slug', this.getSlug(this.form.title))
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
  methods: {
    handleInputSlug(value) {
      this.isTypedSlug = true
      this.form.slug = value
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
  },
  created() {
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
  }
}
</script>
