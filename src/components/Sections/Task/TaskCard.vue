<template>
  <div class="">
    <el-card>
      <div class="epic-tag">
        {{ task.epic && task.epic.name }}
      </div>
      <h5 @click="$emit('viewDetail', task)">{{ task.name }}</h5>
      <div class="d-flex justify-content-between">
        <div class="d-flex">
          <div class="user-circle ml-1" v-for="(label, index) in userLabels" :key="index">
            {{ label }}
          </div>
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
  },
  computed: {
    userLabels() {
      let labels = []
      this.task.assigned_users.forEach(user => {
        if (typeof user == 'string') {
          user = this.$store.getters.allUsers.find(_u => _u._id == user)
        }
        let names = user.fullname.split(' ')
        let label = ''
        if (names.length > 1) {
          label = names[0][0] + names[1][0]
        } else {
          label = names[0].slice(0, 2)
        }
        labels.push(label.toUpperCase())
      });
      return labels
    }
  }
}
</script>

<style>
  .user-circle{
    text-align: center;
    background-color: #000;
    color: #fff;
    width: 27px;
    height: 26px;
    border-radius: 50%;
    font-size: 13px;
    display: flex;
    justify-content: center;
    line-height: 25px;
    font-weight: 800;
  }
  .epic-tag {
    border-left: #dfdfdf 5px solid;
    padding-left: 5px;
  }
  .edit-btn{
    cursor: pointer;
    padding: 2px;
  }
</style>