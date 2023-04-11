<template>
  <div class="">
    <div class="d-flex justify-content-between mb-2 mt-n2">
      <div class="">
        <el-select class="ml-2" v-model="currentSprint._id">
          <el-option value="all" label="Tất cả chiến dịch"></el-option>
          <el-option
            v-for="(sprint, index) in $store.getters.allSprints"
            :key="index"
            :value="sprint._id" :label="sprint.name"></el-option>
        </el-select>
        <el-button v-if="currentSprint._id != 'all'" class="ml-2" type="primary" plain>Xem chi tiết</el-button>
      </div>
      <div class="" v-if="isAdminRole">
        <el-button type="primary" @click="createNewTask">Tạo mới</el-button>
      </div>
    </div>
    <div class="d-flex list-task" :class="{ 'mobile': $isMobile }">
      <div class="ml-2"  v-for="(status, index) in statusList" :key="index">
        <el-card>
          <div class="status-label" :style="`background-color: ${taskStatusMap[status].color};`">
            {{ taskStatusMap[status].label }}
          </div>
          <draggable @change="changeStatusTask($event, status)" v-model="taskMap[status]" :animation="250" group="preset-attributes">
            <transition-group style="min-height: calc(100vh - 200px);" :name="status" class="list-group" tag="ul" :key="2">
              <div v-for="(task, indexItem) in taskMap[status]" :key="indexItem">
                <TaskCard :task="task"  class="mt-2" @viewDetail="handleViewDetail" @remove="handleRemoveTask"/>
              </div>
            </transition-group>
          </draggable>
        </el-card>
      </div>
    </div>

    <el-dialog :visible.sync="dialogDetail" title="Chi tiết công việc" :width="$isMobile ?'100%':'75%'">
      <TaskDetail @saved="afterSavedTask" :task="currentTask"/>
    </el-dialog>
  </div>
</template>

<script>
import TaskDetail from '../../Sections/Task/TaskForm.vue'
import TaskCard from '../../Sections/Task/TaskCard.vue'
import draggable from 'vuedraggable'
import { saveData, getCollection, handleDelete, getAll } from '@/api/task'

export default {
  components: { draggable, TaskCard, TaskDetail },
  data() {
    return {
      statusList: [],
      dialogDetail: false,
      currentTask: {},
      currentSprint: {
        _id: 'all'
      },
      taskMap: {}
    }
  },
  computed: {
    tasks() {
      return this.$store.getters.tasks
    }
  },
  watch: {
    'currentSprint._id': function () {
      this.loadTasks()
    },
    tasks() {
      let map = {}
      this.$store.getters.tasks.forEach(task => {
        if (!map[task.status]) {
          map[task.status] = []
        }
        map[task.status].push(task)
      })
      this.taskMap = map
    }
  },
  created() {
    this.loadAllSprints()
    this.loadTasks()
    this.statusList = Object.keys(this.taskStatusMap)
    this.statusList.forEach(status => {
      this.$set(this.taskMap, status, [])
    })
  },
  methods: {
    afterSavedTask() {
      this.dialogDetail = false
      this.loadTasks()
    },
    loadTasks() {
      if (this.currentSprint._id) {
        if (this.currentSprint._id != 'all') {
          let filter = {}
          filter.sprint = this.currentSprint._id
          const populate = [{ path: 'epic', select: 'name' }, { path: 'sprint', select: 'name' }, { path: 'assigned_users', select: 'fullname' }]
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
        } else {
          getAll().then(({data}) => {
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
        }
      }
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

<style lang="scss" scoped>
.list-task{
  //width: 400px;
  >div{
    width: 400px;
  }
  &.mobile{
    width: 100vw;
    overflow: scroll;
    >div{
      min-width: 90vw ;
    }
  }
}
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