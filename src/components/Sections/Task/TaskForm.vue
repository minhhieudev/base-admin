<template>
  <div class="">
    <el-card>
      <div class="row">
        <div class="col-md-9">
          <el-form
            ref="form_data"
            label-width="150px"
            label-position="left"
            :model="task"
          >
            <el-form-item label="Tên công việc (mô tả ngắn)" required>
              <el-input v-model="task.name" autofocus />
            </el-form-item>
            <el-form-item label="Trạng thái">
              <el-select v-model="task.status">
                <el-option
                  v-for="(statusCode, index) in Object.keys(taskStatusMap)"
                  :key="index"
                  :label="taskStatusMap[statusCode].label"
                  :value="statusCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Nhóm việc">
              <el-select v-model="task.epic">
                <el-option
                  v-for="(epic, index) in $store.getters.allEpics"
                  :key="index"
                  :label="epic.name"
                  :value="epic._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Chiến dịch">
              <el-select v-model="task.sprint">
                <el-option
                  v-for="(epic, index) in $store.getters.allSprints"
                  :key="index"
                  :label="epic.name"
                  :value="epic._id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <label>Mô tả</label>
          <ckeditor v-model="task.description" :config="ckEditorConfig"></ckeditor>
          <TaskComment v-if="task._id"  class="mt-3" :task="task"/>
        </div>
        <div class="col-md-3 mt-2">
          <div class="text-right">
            <el-button v-if="task._id" type="primary" @click="reportDialog = true" plain>Báo cáo</el-button>
            <el-button type="primary" @click="handleCreate">Lưu</el-button>
          </div>

          <div class="mt-3">
            <div class="" v-for="(report, index) in reports" :key="index">
              {{ new Date(report.date).toLocaleDateString() }} - {{ report.time }} tiếng
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog
      append-to-body 
      :visible.sync="reportDialog" 
      title="Báo cáo công việc" 
      :width="$isMobile?'75%':'100%'">
      <label>Nội dung</label>
      <ckeditor v-model="reportForm.content" :config="ckEditorConfig"></ckeditor>
      <el-form class="mt-2">
        <el-form-item label="Ngày">
          <el-date-picker
            v-model="reportForm.date"
            type="date"
            placeholder="Chọn ngày"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Tổng thời gian (giờ)">
          <el-input-number v-model="reportForm.time" :precision="1"></el-input-number>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleReport">Gửi</el-button>
    </el-dialog>
  </div>
</template>

<script>
import TaskComment from './TaskComment.vue'
import { saveData, getDetail } from '@/api/task'
import * as taskReportAPI from '@/api/task-report'
export default {
  components: { TaskComment },
  props: ['task'],
  data() {
    return {
      reportDialog: false,
      reportForm: {
        date: Date.now(),
        time: 1,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: 'Hôm nay',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: 'Hôm qua',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: 'Tuần trước',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      reports: [],
    }
  },
  created() {
    //console.log(this.taskStatusMap, 'taskStatus');
    // getDetail(this.task._id).then(({data}) => {
    //   console.log('ttt', data);
    // })
    this.loadReports()
  },
  methods: {
    loadReports() {
      taskReportAPI.getAll(this.task._id).then(({data}) => {
        if (data.success) {
          this.reports = data.docs
        }
      })
    },
    handleReport() {
      taskReportAPI.saveData({...this.reportForm, task: this.task._id}).then(({data}) => {
        if (data.success) {
          this.reportForm = {
            date: Date.now(),
            time: 1,
          }
        }
      })
    },
    handleCreate() {
      saveData(this.task).then(({data}) => {
        if (data.success) {
          this.$emit('saved')
          console.log(data);
        }
      })
    }
  }
}
</script>

<style>

</style>