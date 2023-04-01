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
            <el-form-item label="Tên" required>
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
          <TaskComment class="mt-3" :task="task"/>
        </div>
        <div class="col-md-3">
          <div class="text-right">
            <el-button type="primary" @click="handleCreate">Lưu</el-button>
          </div>

          <label>Thời gian:</label>
          <span class="">
            3:23:42
          </span>
        </div>
      </div>
      
    </el-card>
  </div>
</template>

<script>
import TaskComment from './TaskComment.vue'
import { saveData } from '@/api/task'
export default {
  components: { TaskComment },
  props: ['task'],
  created() {
   console.log(this.taskStatusMap, 'taskStatus');
  },
  methods: {
    handleCreate() {
      saveData(this.task).then(({data}) => {
        if (data.success) {
          console.log(data);
        }
      })
    }
  }
}
</script>

<style>

</style>