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
          <el-form-item label="Tên" required prop="name">
            <el-input v-model="form.name" autofocus />
          </el-form-item>
          <el-form-item label="Người thực hiện">
            <el-select v-model="form.users" multiple placeholder="Select">
              <el-option
                v-for="(user, index) in $store.getters.allUsers"
                :key="index"
                :label="user.fullname"
                :value="user._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Bắt đầu chạy">
            <el-switch v-model="form.is_enabled" />
          </el-form-item>
          <el-form-item label="Số ngày dự kiến">
            <el-input-number v-model="form.estimate_time" />
          </el-form-item>
        </el-form>
      </div>
      <div class="row">
        <div class="col-md-6">
          <el-card style="min-height: 250px;">
            <b>Danh Sách Công Việc</b>
            
          </el-card>
        </div>
        <div class="col-md-6">
          <el-card style="min-height: 250px;">
            <b>Công Việc Đang Chờ</b>
            <div class="d-flex mt-2" v-for="(task, index) in readyTasks" :key="index">
              <el-button @click="addTask(task)" type="primary" icon="el-icon-circle-plus-outline" size="mini" circle plain></el-button>
              <b class="ml-2">{{ task.name }}</b>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
const ModelCode = 'sprint'
import { saveData, getDetail } from "@/api/sprint";
export default {
  data: function () {
    return {
      form: {
        estimate_time: 1,
        tasks: []
      },
      hasChange: false,
      readyTasks: [],
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
    this.loadReadyTask()
  },
  methods: {
    removeTask(task) {
      this.form.tasks = this.form.tasks.filter(t => t._id != task._id)
      this.readyTasks.push(task)
    },
    addTask(task) {
      this.readyTasks = this.readyTasks.filter(t => t._id != task._id)
      this.form.tasks.push(task)
    },
    loadReadyTask() {
      let filter = {
        status: 'READY_FOR_WORK',
        sprint: null
      }
      getCollection({filter}).then(({data}) => {
        if (data.success) {
          this.readyTasks = data.docs
        }
      })
    },
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
              this.loadAllSprints()
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
