<template>
  <div class="">
    <hr/>
    <h5 class="text-secondary">Trao đổi</h5>
    <div class="d-flex">
      <el-input v-model="comment.content" placeholder="Nhập lời nhắn"/>
      <el-button class="ml-2" @click="handleAddComment" type="primary">Gửi</el-button>
    </div>
    <div class="">
      <div class="comment-item" v-for="(comment, index) in comments" :key="index">
        <div class="avatar">
          <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" width="50" height="50" />
        </div>
        <div class="detail">
          <b>{{ comment.user && comment.user.fullname }}</b>
          <div class="content">
            {{ comment.content }}
          </div>
          <div class="date-time text-secondary">
            {{ new Date(comment.createdAt).toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCollection, saveData } from '@/api/comment'
export default {
  props: ['task'],
  data() {
    return {
      comments: [],
      comment: {
        content: ''
      }
    }
  },
  created() {
    this.loadComments()
  },
  methods: {
    loadComments() {
      const filter = { task: this.task._id }
      const populate = {
        path: 'user',
        select: 'fullname avatar'
      }
      getCollection({ filter, populate }).then(({data}) => {
        if (data.success) {
          this.comments = data.docs
        }
      })
    },
    handleAddComment() {
      if (this.comment.content) {
        saveData({ content: this.comment.content, task: this.task._id }).then(({ data }) => {
          if (data.success) {
            this.comments.unshift(data.doc)
            this.comment.content = ""
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .comment-item{
    margin-top: 15px;
    display: flex;
    .avatar{
      margin-top: 5px;
      img{
        border-radius: 5px;
      }
    }
    .detail{
      margin-left: 15px;
      .content{

      }
      .date-time{

      }
    }
  }
</style>