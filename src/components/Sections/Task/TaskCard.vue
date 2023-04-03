<template>
  <div class="">
    <el-card>
      <div class="epic-tag">
        {{ task.epic && task.epic.name }}
      </div>
      <h5 @click="$emit('viewDetail', task)">{{ task.name }}</h5>
      <div class="d-flex justify-content-between">
        <div class="">

        </div>
        <div class="d-flex">
          <div class="edit-btn" @click="$emit('remove', task)" v-if="isAdminRole">
            <i class="el-icon-delete text-danger"></i>
          </div>
          <div class="edit-btn ml-2" @click="$emit('viewDetail', task)">
            <i class="el-icon-edit"></i>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  components: {},
  props: ['task'],
  data() {
    return {
      // task: {
      //   name: 'Moo ta cho task name',
      //   epic: {
      //     name: 'Tiktok team'
      //   }
      // },
      detailDialog: false
    }
  }
}
</script>

<style>
  .epic-tag {
    border-left: #dfdfdf 5px solid;
    padding-left: 5px;
  }
  .edit-btn{
    cursor: pointer;
    padding: 2px;
  }
</style>