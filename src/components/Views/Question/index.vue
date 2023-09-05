<template>
  <div class="chatroom">
    <el-container>
      <el-header style="height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
        <div class="header__info">
          <p class="header__title">{{ selectedRoom.name }}</p>
          <span class="header__description">{{ selectedRoom.description }}</span>
        </div>
      </el-header>
      <el-main style="height: calc(100% - 56px); padding: 11px;">
        <div class="question-button-container">
          <div class="avatar">
                    <el-avatar :size="avatarSize" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"></el-avatar>

          </div>
          <div class="input-box">
            <input
              v-model="replyText"
               @input="onReplyInputChange"
              placeholder="Nhập nội dung câu hỏi mà bạn muốn hỏi Cố vấn học tập..."
              class="reply-input" 
              @click="showQuestionPopup"
            />
          </div>
        </div>
        <el-scrollbar wrap-class="question-list">
      <question
            v-for="mes in questions"
            :key="mes.id"
            :content="mes.content"
            :photoURL="typeof mes.photoURL === 'string' ? mes.photoURL : ''"
            :user="mes.user.fullname"
            :createdAt="formatDate(mes.createdAt)"
            :likes="mes.likes"
            :comments="mes.comments"
            :id="mes._id"
          />
    </el-scrollbar>
      </el-main>
    </el-container>

    <!-- Popup nhập nội dung câu hỏi -->
    <el-dialog class="custom-dialog" title="Nhập nội dung câu hỏi" :visible.sync="isQuestionPopupVisible">
      <!-- Sử dụng textarea thay vì el-input để có vùng nhập lớn hơn -->
      <div class="el-dialog__body">
        <textarea
          v-model="questionText"
          class="question-textarea"
          placeholder="Nhập nội dung câu hỏi..."
        ></textarea>

        <!-- <ckeditor  :config="ckEditorConfig" v-model="questionText" 
          placeholder="Nhập nội dung câu hỏi..."></ckeditor> -->
        <div class="button-container-tall">
          <!-- Thêm icon cho các button bằng cách sử dụng thuộc tính icon của el-button -->
          <el-button @click="isQuestionPopupVisible = false" class="close-button" icon="el-icon-close">Đóng</el-button>
          <el-button @click="resetQuestionText" class="refresh-button" icon="el-icon-refresh">Làm mới</el-button>
          <el-button @click="showTimestampPicker" class="timestamp-button" icon="el-icon-time">Thời gian đăng</el-button>
          <el-button class="bg-green" type="primary" @click="submitQuestion">Đăng</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Question from './Question.vue';
import { saveData, getCollection } from '@/api/question'
import { getAll } from '@/api/question'; // Import các phương thức từ tệp api/question.js
import { format } from 'date-fns'; 
const ModelCode = 'question';


export default {
  data() {
    return {
      selectedRoom: {
        name: "Phòng chat mẫu",
        description: "Mô tả phòng chat mẫu",
      },
        replyText: "",

      inputValue: "",
      questions: [], // Mảng câu hỏi
      color: "white",
      isInviteMemberVisible: false,
      isQuestionPopupVisible: false, // Biến để kiểm soát việc hiển thị popup
      questionText: "", // Dùng để lưu nội dung câu hỏi
    };
  },
  components: {
    Question,
  },
  created() {
  console.log("Component created");
  this.loadQuestions();
},
  computed: {
    avatarSize() {
      return 'small';
    },
  },
  methods: {
    showInviteDialog() {
      // Hiển thị dialog mời thành viên
      this.isInviteMemberVisible = true;
    },
    showQuestionPopup() {
      // Hiển thị popup nhập nội dung câu hỏi khi click vào
      this.isQuestionPopupVisible = true;
    },
    formatDate(date) {
      // Sử dụng hàm format từ date-fns để định dạng lại ngày tháng
      return String(format(new Date(date), 'dd/MM/yyyy HH:mm')); // Thay đổi định dạng tùy ý
    },
    onReplyInputChange() {
    // Xử lý khi người dùng nhập vào ô phản hồi
    // Ví dụ: có thể kiểm tra độ dài hoặc thực hiện xử lý khác theo nhu cầu
    console.log('123');
  },
    submitQuestion() {
  if (this.questionText.trim() !== "") {
    // Tạo một đối tượng câu hỏi từ dữ liệu được nhập vào
    // Trong actions hoặc component khác

    const newQuestion = {
      content: this.questionText,
      user: this.$store.getters.user._id
      
    };
    console.log(this.questionText);
    // Lưu câu hỏi vào cơ sở dữ liệu bằng cách gọi API
    saveData(newQuestion)
      .then((response) => {
        if (response && response.status === 200) {
          // Kiểm tra xem phản hồi có trạng thái 200 OK không
          const responseData = response.data;

          if (responseData && responseData.success) {
            // Nếu lưu thành công, thêm câu hỏi mới vào danh sách câu hỏi
            this.questions.unshift(responseData.question);

            // Xóa nội dung câu hỏi sau khi đã tạo thành công
            this.questionText = "";

            // Đóng popup sau khi tạo câu hỏi
            this.isQuestionPopupVisible = false;
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
loadQuestions() {
  getAll()
    .then((response) => {
      console.log('Response from API:', response); // In ra response
      if (response && response.data && response.data.success) {
        this.questions = response.data.questions;
        console.log("Dữ liệu câu hỏi đã được tải:", this.questions);
      } else {
        console.error("Không thành công: ", response.data);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tải câu hỏi: ", error);
    });
},

    
    showTimestampPicker() {
      console.log('123');
    },
    resetQuestionText() {
      console.log('123423');
    }
  },
};
</script>

<style scoped>
.question-list {
  max-height: 100%;
  overflow-y: auto;
}

.question-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
}

.question-textarea {
  width: 100%;
  height: 150px; /* Điều chỉnh chiều cao của vùng nhập */
  border: none; /* Loại bỏ viền */
  padding: 10px; /* Khoảng cách bên trong vùng nhập */
  resize: vertical; /* Cho phép điều chỉnh chiều cao theo chiều dọc */
}

.button-container-tall {
  display: flex;
  justify-content: space-between;
}

.close-button,
.refresh-button,
.timestamp-button {
  cursor: pointer; /* Thay đổi con trỏ khi di chuột vào button */
  margin-right: 10px; /* Khoảng cách giữa các button */
}

/* CSS cho popup */
.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.5); /* Màu nền với độ trong suốt */
}

/* CSS cho nội dung bên trong popup */

/* CSS cho container chứa avatar và nút */
.question-button-container {
  display: flex;
  margin-top: 10px;
  border: 1px solid white; /* Đặt đường viền cho ô nhập phản hồi */
  border-radius: 10px; /* Bo tròn các góc của ô nhập phản hồi */
  padding: 5px;
  background-color: white; /* Màu nền của ô nhập phản hồi */
}

.input-box {
  flex-grow: 1;
  background-color: white; /* Đặt màu nền của ô nhập phản hồi giống màu nền của phần câu hỏi */
}

.reply-input {
  width: 100%;
  padding: 5px;
  border: none;
  outline: none;
  background-color: white; /* Đặt màu nền của ô input */
  color: rgb(12, 11, 11); /* Màu văn bản trong ô nhập phản hồi */
}

/* CSS cho avatar */
.avatar {
  margin-right: 10px; /* Khoảng cách giữa avatar và nút */
  /* Đặt kích thước, ảnh và bất kỳ kiểu hiển thị avatar nếu cần */
}
</style>
