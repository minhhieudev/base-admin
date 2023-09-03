<template>
  <div>
    <div class="question" @click="openDetailQuestion">
      <div class="info">
        <el-avatar :size="avatarSize" :src="photoURL">
        </el-avatar>

        <span class="author">{{ userName }}</span>
        <span class="date">{{ formattedDate }}</span>
      </div>

      <!-- Hiển thị nội dung câu hỏi -->
      <div class="content" v-if="showFullContent">
        {{ content }}
        <div class="toggle-button-full-content" v-if="content.length > maxContentLength" @click="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>
      <div class="content" v-else>
        {{ truncatedContent }}
        <div class="toggle-button-truncated-content"  v-if="content.length > maxContentLength"  @click="toggleContent">
          {{ showFullContent ? 'Thu gọn' : 'xem thêm' }}
        </div>
      </div>
      
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
    <detailQuestionVue  :isInviteMemberVisible="isInviteMemberVisible"
      :content="content"
      :photoURL="photoURL"
      :userName="userName"
      :createdAt="createdAt"
      :likes="likes"
      :comments="comments"
    />
  </div>
  
</template>

<script>
import { formatRelative } from 'date-fns';
import detailQuestionVue from './detailQuestion.vue'; 

export default {
  props: {
    content: String,
    userName: String,
    createdAt: Number,
    photoURL: String,
    likes: Number,
    comments: Number,
  },
  data() {
    return {
      showFullContent: false,
      maxContentLength: 200, // Thay đổi giá trị maxContentLength nếu cần
      showPopup: false,
      replyText: "",
      isInviteMemberVisible: false, 
    };
  },
  computed: {
    avatarSize() {
      return 'small';
    },
    formattedDate() {
      return this.createdAt ? this.formatDate(this.createdAt) : '';
    },
    truncatedContent() {
      if (this.content.length > this.maxContentLength) {
        return this.content.slice(0, this.maxContentLength) + '...';
      } else {
        return this.content;
      }
    },
  },
  components: {
    detailQuestionVue,
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
    toggleContent() {
      this.showFullContent = !this.showFullContent;
    },
    openDetailQuestion() {
      this.isInviteMemberVisible = !this.isInviteMemberVisible;
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




/* CSS cho "Xem thêm" và thu gọn */

.toggle-button-full-content,
.toggle-button-truncated-content {
  text-align: right; /* Đặt nút "Xem thêm" ở bên phải */
  margin-top: 5px; /* Khoảng cách giữa nút và nội dung */
  cursor: pointer;
  opacity: 0.5;
  font-size: smaller;
}

.toggle-button-full-content {
  /* Cài đặt cho nút "Xem thêm" trong nội dung đầy đủ */
  display: block; /* Hiển thị nút "Xem thêm" */
}

.toggle-button-truncated-content {
  /* Cài đặt cho nút "Xem thêm" trong nội dung cắt bớt */
  display: inline; /* Hiển thị nút "Xem thêm" cùng hàng với nội dung */
}
</style>
