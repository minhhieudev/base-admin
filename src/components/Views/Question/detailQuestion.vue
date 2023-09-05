<template>
  <div style="z-index: 9999;">
    <el-dialog class="custom-dialog" title="Nhập nội dung câu hỏi" :visible.sync="isInviteMemberVisible">
      <!-- Sử dụng textarea thay vì el-input để có vùng nhập lớn hơn -->
      <div class="el-dialog__body">
        <div class="a">
          <!-- Hiển thị nội dung câu hỏi tương tự như question.vue -->
          <!-- Sử dụng v-for để hiển thị danh sách phản hồi -->
          <div class="question">
            <div class="info">
             <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>
      <span class="author">{{ user }}</span>
              <span class="date">{{ createdAt }}</span>
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
                <el-avatar :size="avatarSize" :src="photoURL"></el-avatar>
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
        </div>
        <div class="answer-list" style="max-height: 200px; overflow-y: auto;">
          <answer v-for="ans in answers" :key="ans.id"
            :content="ans.content" :photoURL="ans.photoURL"
                        :user="ans.user.fullname"
             :createdAt="formatDate(ans.createdAt)"
 :likes="ans.likes" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatRelative } from 'date-fns';
import Answer from './Answer.vue';
import { saveData, getCollection, getAnswersByQuestionId } from '@/api/answer'
import { format } from 'date-fns'; 


export default {
  props: {
    isInviteMemberVisible: Boolean,
    content: String,
    id:String,
    user: String,
    createdAt: String,
    photoURL: String,
    likes: Number,
    comments: Number,
     
  },
  computed: {
    avatarSize() {
      return 'small';
    },
    formattedDate() {
    if (this.createdAt) {
      // Kiểm tra xem createdAt có giá trị không âm hay không (giá trị hợp lệ)
      if (this.createdAt > 0) {
        return this.formatDate(this.createdAt);
      } else {
        // Xử lý nếu giá trị không hợp lệ (hoặc âm)
        return 'Ngày tạo không hợp lệ';
      }
    } else {
      // Xử lý nếu createdAt không tồn tại
      return 'Ngày tạo không xác định';
    }
  },
  },
  created() {
  console.log("Component created");
  this.loadAnswers();
  console.log(this.answers);

},
  data() {
    return {
      replyText: '',
      internalIsInviteMemberVisible: this.isInviteMemberVisible,
      answers: [
        // Các mục dữ liệu phản hồi ở đây...
      ],
      
    };
  },
  components: {
    Answer,
  },
  methods: {
    
    formatDate(date) {
      // Sử dụng hàm format từ date-fns để định dạng lại ngày tháng
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm')); // Thay đổi định dạng tùy ý
    },
    loadAnswers() {
    // Sử dụng ID của câu hỏi để lấy danh sách câu trả lời
    getAnswersByQuestionId(this.id)
      .then((response) => {
        if (response && response.data && response.data.success) {
          this.answers = response.data.answers; // Lưu danh sách câu trả lời vào biến answers
          console.log("Dữ liệu câu trả lời đã được tải:", this.answers);
        } else {
          console.error("Không thành công: ", response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải câu trả lời: ", error);
      });
  },
    showInviteDialog() {
      this.isInviteMemberVisible = true;
    },
    onReplyInputChange() {
      // Xử lý khi người dùng nhập vào ô phản hồi
    },
    sendReply() {
      if (this.replyText.trim() !== "") {
   

    const newReply = {
      content: this.replyText,
      question: this.id,
      user: this.$store.getters.user._id
    };
   console.log(newReply);
    saveData(newReply)
      .then((response) => {
        if (response && response.status === 200) {
          // Kiểm tra xem phản hồi có trạng thái 200 OK không
          const responseData = response.data;

          if (responseData && responseData.success) {
            // Nếu lưu thành công, thêm câu hỏi mới vào danh sách câu hỏi
            this.answers.unshift(responseData.answer);


            // Xóa nội dung câu hỏi sau khi đã tạo thành công
            this.replyText = "";

            
          } else {
            // Xử lý trường hợp lỗi khi lưu câu hỏi (API trả về success: false)
            console.error("Lỗi khi lưu câu hỏi: ", responseData);
          }
        } else {
          // Xử lý trường hợp lỗi khi gọi API (status code khác 200)
          console.error("Lỗi khi gửi câu hỏi, phản hồi không hợp lệ: ", response);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gửi câu hỏi: ", error);
        // Xử lý lỗi nếu có
      });
  } else {
    // Xử lý trường hợp không có nội dung câu hỏi
    // Hiển thị thông báo hoặc xử lý khác tùy ý
  }
    },
    validatePhotoURL(url) {
      if (typeof url === 'string') {
        return url; // Nếu 'url' là chuỗi hợp lệ, trả về nó
      } else {
        return ''; // Nếu không, trả về chuỗi rỗng
      }
    },
    toggleInviteMemberDialog() {
    this.internalIsInviteMemberVisible = !this.internalIsInviteMemberVisible;
  }
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