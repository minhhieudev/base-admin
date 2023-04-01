<template>
  <div class="">
    <div class="d-flex justify-content-between mb-2 mt-n2">
      <div class="">
        <el-select class="ml-2" v-model="currentSprint._id">
          <el-option value="all" label="Tất cả chiến dịch"></el-option>
        </el-select>
        <el-button v-if="currentSprint._id != 'all'" class="ml-2" type="primary" plain>Xem chi tiết</el-button>
      </div>
      <div class="">
        <el-button type="primary" @click="createNewTask">Tạo mới</el-button>
      </div>
    </div>
    <div class="d-flex">
      <div class="ml-2" style="width: 300px;" v-for="(status, index) in statusList" :key="index">
        <el-card>
          <div class="status-label" :style="`background-color: ${taskStatusMap[status].color};`">
            {{ taskStatusMap[status].label }}
          </div>
          <draggable @change="changeStatusTask($event, status)" v-model="taskMap[status]" :animation="250" group="preset-attributes">
            <transition-group style="min-height: calc(100vh - 200px);" :name="status" class="list-group" tag="ul">
              <div v-for="(task, indexItem) in taskMap[status]" :key="indexItem">
                <TaskCard :task="task"  class="mt-2" @viewDetail="handleViewDetail" @remove="handleRemoveTask"/>
              </div>
            </transition-group>
          </draggable>
        </el-card>
      </div>
    </div>

    <el-dialog :visible.sync="dialogDetail" title="Chi tiết công việc" width="75%">
      <TaskDetail :task="currentTask"/>
    </el-dialog>
  </div>
</template>

<script>
import TaskDetail from '../../Sections/Task/TaskForm.vue'
import TaskCard from '../../Sections/Task/TaskCard.vue'
import draggable from 'vuedraggable'
import { saveData, getCollection, handleDelete } from '@/api/task'

export default {
  components: { draggable, TaskCard, TaskDetail },
  data() {
    return {
      statusList: [],
      dialogDetail: false,
      currentTask: {},
      currentSprint: {
        _id: 'all'
      }
    }
  },
  computed: {
    taskMap() {
      let map = {}
      this.$store.getters.tasks.forEach(task => {
        if (!map[task.status]) {
          map[task.status] = []
        }
        map[task.status].push(task)
      })
      return map
    }
  },
  created() {
    this.loadTasks()
    this.statusList = Object.keys(this.taskStatusMap)
    this.statusList.forEach(status => {
      this.$set(this.taskMap, status, [])
    })
  },
  methods: {
    loadTasks() {
      let filter = {}
      const populate = { path: 'epic', select: 'name' }
      getCollection({ filter, populate }).then(({data}) => {
        if (data.success) {
          this.setData({
            key: 'tasks',
            data: {
              docs: data.docs,
              total: data.total
            }
          })
        }
      })
    },
    createNewTask () {
      this.dialogDetail = true
      this.currentTask = { status: 'READY_FOR_WORK' }
    },
    handleViewDetail(task){
      this.currentTask = task
      this.dialogDetail = true
    },
    handleRemoveTask(task) {
      this.$confirm(`Xác nhận xóa ?`, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        type: 'warning'
      }).then(() => {
        handleDelete(task._id).then(({data}) => {
          if (data.success) {
            this.loadTasks()
          }
        }).finally(() => {
          this.$wrLoading(false)
        })
      })
    },
    changeStatusTask(e, newStatus) {
      if (e.added) {
        saveData({ _id: e.added.element._id, status: newStatus })
      }
    }
  }
}
</script>

<style>
.status-label{
  color: white;
  padding: 2px;
  padding-left: 15px;
  padding-right: 15px;
  font-weight: 700;
  border-radius: 3px;
  text-align: center;
}
</style>