<template>
  <div class="popup">
    <!-- Hiển thị nội dung câu hỏi tương tự như question.vue -->
    <!-- Sử dụng v-for để hiển thị danh sách phản hồi -->
    <div class="question">
      <div class="info">
        <el-avatar :size="avatarSize" :src="photoURL">
        </el-avatar>

        <span class="author">{{ userName }}</span>
        <span class="date">{{ formattedDate }}</span>
      </div>
      <div class="content">{{ content }}</div>
      
      <!-- Hiển thị biểu tượng lượt thích và biểu tượng phản hồi -->
      <div class="actions">
        <div class="like-container">
          <i class="fa fa-heart-o" aria-hidden="true"></i>
          <span class="likes">{{ likes }}</span>
        </div>
        <div class="comment-container">
          <el-icon style="color: rgb(24, 61, 228);" class="el-icon-chat-dot-square"></el-icon>
          <span class="comments">{{ comments }}</span>
        </div>
      </div>

      <!-- Ô nhập phản hồi -->
      <div class="reply-container">
        <div class="avatar">
          <el-avatar :size="avatarSize" :src="photoURL">
          </el-avatar>
        </div>
        <div class="input-box">
          <input
            v-model="replyText"
            @input="onReplyInputChange"
            placeholder="Nhập phản hồi của bạn..."
            class="reply-input" 
          />
        </div>
        <div class="send-button">
          <i class="fa fa-paper-plane" @click="sendReply" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="replies">
      <div v-for="(reply, index) in replies" :key="index" class="reply">
        <!-- Hiển thị nội dung phản hồi -->
        <!-- Tương tự như cách hiển thị nội dung câu hỏi -->
      </div>
    </div>
  </div>
</template>

<script>

import { formatRelative } from 'date-fns';

export default {
  props: {
    content: String,
    userName: String,
    createdAt: Number,
    photoURL: String,
    likes: Number,
    comments: Number,
  },
  computed: {
    avatarSize() {
      return 'small';
    },
    formattedDate() {
      return this.createdAt ? this.formatDate(this.createdAt) : '';
    },
  },
  methods: {
    formatDate(seconds) {
      let formattedDate = '';

      if (seconds) {
        formattedDate = formatRelative(
          new Date(seconds * 1000),
          new Date()
        );

        formattedDate =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      }

      return formattedDate;
    },
    onReplyInputChange() {
      // Xử lý khi người dùng nhập vào ô phản hồi
      // Ví dụ: có thể kiểm tra độ dài hoặc thực hiện xử lý khác theo nhu cầu
    },
    
    sendReply() {
      // Xử lý khi người dùng gửi phản hồi
      // Ví dụ: có thể gửi dữ liệu phản hồi đến máy chủ hoặc thực hiện xử lý khác theo nhu cầu
      if (this.replyText.trim() !== '') {
        // Gửi phản hồi đi và cập nhật giao diện nếu cần
        // Ví dụ: this.replyText chứa nội dung phản hồi từ người dùng
        // Đảm bảo cập nhật danh sách phản hồi hoặc hiển thị phản hồi mới
        // và sau đó đặt lại this.replyText để xóa ô nhập phản hồi
        this.replyText = '';
      }
    },
  },
};
</script>

<style scoped>
/* CSS cho popup */
.popup {
  /* Thiết lập kích thước, vị trí, và hiển thị popup */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Màu nền mờ */
  z-index: 999; /* Để đảm bảo nằm trên cùng */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

/* Thiết lập cho nội dung popup */

/* CSS cho phần câu hỏi */
.question {
  margin: 10px; /* Khoảng cách giữa các phần câu hỏi */
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px; /* Bo tròn các góc của phần câu hỏi */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Đổ bóng cho phần câu hỏi */
  transition: transform 0.2s ease-in-out; /* Hiệu ứng khi hover */
  background-color: rgb(245, 246, 247);
}

.question:hover {
  transform: scale(1.01); /* Hiệu ứng phóng to khi hover */
}
.info {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.author {
  margin-left: 5px;
  font-weight: bold;
}

.date {
  margin-left: 10px;
  font-size: 11px;
  color: #a7a7a7;
}

.content {
  margin-left: 30px;
}

/* CSS cho biểu tượng lượt thích và phản hồi */
.actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.like-container,
.comment-container {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.fa-heart-o {
  font-size: 16px;
  color: red; /* Màu sắc của biểu tượng lượt thích */
}

.likes,
.comments {
  font-size: 14px;
  margin-left: 4px;
  color: #555; /* Màu sắc của số liệu lượt thích và phản hồi */
}

/* CSS cho ô nhập phản hồi */
.reply-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  border: 1px solid #333; /* Đặt đường viền cho ô nhập phản hồi */
  border-radius: 20px; /* Bo tròn các góc của ô nhập phản hồi */
  padding: 5px;
  background-color: #f1e8e8; /* Màu nền của ô nhập phản hồi */
}

.avatar {
  margin-right: 10px;
}

.input-box {
  flex-grow: 1;
  background-color: #f1e8e8;; /* Đặt màu nền của ô nhập phản hồi giống màu nền của phần câu hỏi */
}

.reply-input {
  width: 100%;
  padding: 5px;
  border: none;
  outline: none;
  background-color: #f1e8e8;; /* Đặt màu nền của ô input */
  color: rgb(12, 11, 11); /* Màu văn bản trong ô nhập phản hồi */
}

.send-button {
  cursor: pointer;
}

/* Thiết lập cho danh sách phản hồi */
.replies {
  /* CSS cho danh sách phản hồi */
  /* Cài đặt kích thước, cuộn nếu nội dung quá dài */
  max-height: 70vh; /* Giới hạn chiều cao tối đa */
  overflow-y: auto; /* Cho phép cuộn nếu cần */
}

/* Thiết lập cho mỗi phản hồi */
.reply {
  /* CSS cho từng phản hồi */
  /* Giống với CSS của question.vue */
}
</style>
