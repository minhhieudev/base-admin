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
          <el-form-item label="Mã thuộc tính">
            <el-input disabled :value="form.meta_code" />
          </el-form-item>
          <el-form-item label="value" required>
            <el-input v-model="form.value" autofocus />
          </el-form-item>
          <el-form-item label="slug" required>
            <el-input :value="form.slug" @input="handleInputSlug" />
          </el-form-item>
          <el-form-item label="content">
            <ckeditor v-model="form.content" :config="ckEditorConfig"></ckeditor>
          </el-form-item>
          <el-form-item label="seo_title">
            <el-input v-model="form.seo_title" />
          </el-form-item>
          <el-form-item label="seo_description">
            <el-input v-model="form.seo_description" />
          </el-form-item>
          <el-form-item label="Image">
            <div class="d-flex">
              <img width="100" height="100" :src="getImagePath(form.image)" class="mx-2"/>
              <MediaPicker v-model="form.image"/>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'meta_attribute'
import Editor from '@tinymce/tinymce-vue'
import MediaPicker from '@/components/Widgets/MediaPicker'
import { addData, saveData, getDetail } from "@/api/meta_attribute";

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
    'form.value': function () {
      if (!this.isTypedSlug) {
        this.$set(this.form, 'slug', this.getSlug(this.form.value))
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
        { label: "Quay lại", route: `${ModelCode}_main`, routeQuery: { meta_code: this.form.meta_code } },
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
                  currentId = data.data._id;
                }
              }
            })
          } else {
            await addData(this.form).then(({data}) => {
              if (data.code === 'success') {
                if (isContinue === false) {
                  this.$router.push({ name: `${ModelCode}_main`, query: { meta_code: this.form.meta_code } });
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
    } else if (this.$route.params.meta_code) {
      this.form.meta_code = this.$route.params.meta_code
    }
  }
}
</script>
