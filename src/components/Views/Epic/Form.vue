<template>
  <div>
    <el-card>
      <toolbar-widget :buttons="toolbarButtons"></toolbar-widget>
      <div class="col-md-6 mt-3">
        <el-form
          ref="form_data"
          label-width="150px"
          label-position="left"
          :model="form"
        >
          <el-form-item label="Tên" required>
            <el-input v-model="form.name" autofocus />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'epic'
import { saveData, getDetail } from "@/api/epic";
export default {
  data: function () {
    return {
      form: {
        address: {},
        role: 'employee'
      },
      hasChange: false,
    }
  },
  watch: {
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
    this.loadData(this.$route.params.id)
  },
  methods: {
    loadData (currentId) {
      if (!currentId && this.$route.params.id) {
        currentId = this.$route.params.id
      }

      if (currentId) {
        this.$wrLoading(true);
        getDetail(currentId).then(({data}) => {
          if (data.success) {
            this.$set(this, 'form', data.doc)
            this.hasChange = false;
          }
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.$wrLoading(false);
        })
      }
    },
    saveAndContinue() {
      this.handleSave(true);
    },
    handleSave: function (isContinue = false) {
      this.$refs.form_data.validate(async (valid) => {
        if (!this.form.name) {
          return false
        }
        if (valid == false) {
          return false
        } else {
          this.$wrLoading(true)
          let currentId
          await saveData(this.form).then(({data}) => {
            if (data.success == true) {
              this.loadAllEpics()
              if (isContinue === false) {
                this.$router.push({ name: `${ModelCode}_main` });
              } else {
                if (data.doc) {
                  currentId = data.doc._id;
                } else {
                  currentId = this.form._id;
                }
              }
            }
          })

          this.$wrLoading(false)

          if (currentId) {
            if (!this.$route.params.id) {
              this.$router.push({
                name: `${ModelCode}_edit`,
                params: { id: currentId },
              });
            }
            
            this.loadData(currentId)
            this.$store.dispatch("reRender")
          }
        }
      })
    },
  }
}
</script>
