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
            <el-avatar :size="avatarSize" :src="photoURL"></el-avatar>
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
            :photoURL="mes.photoURL"
            :userName="mes.userName"
            :createdAt="mes.createdAt"
            :likes="mes.likes"
            :comments="mes.comments"
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
        <ckeditor  :config="ckEditorConfig"></ckeditor>
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
import Question from '../Epic/Question.vue';
import ColorPicker from '../ChatRoom/ColorPicker.vue';

export default {
  data() {
    return {
      selectedRoom: {
        name: "Phòng chat mẫu",
        description: "Mô tả phòng chat mẫu",
        replyText: ""
      },
      inputValue: "",
      questions: [
        {
          id: 1,
          content: "Hôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay ìHôm nay làm gìHôm nay  làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gìHôm nay làm gì?",
          photoURL: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          userName: "Người gửi",
          createdAt: 1630051200,
          likes: 2,
          comments:5,
        },
        {
          id: 2,
          content: "Tro chúng tôi đãày, chúng ên sốthị, nó sẽ hiển thị toàn bộ nội dung. Nếu không, nó sẽ hiển thị số dòng cần thiết và thêm ",
          photoURL: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          userName: "Tulen",
          createdAt: 1630051500,
          likes: 2,
          comments:5,
        }
      ],
      color: "white",
      isInviteMemberVisible: false,
      isQuestionPopupVisible: false, // Biến để kiểm soát việc hiển thị popup
      questionText: "", // Dùng để lưu nội dung câu hỏi
    };
  },
  components: {
    Question,
    ColorPicker,
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
    handleOnSubmit() {
      // Xử lý khi người dùng gửi tin nhắn
      // Tương tự như trong React ChatWindow
    },
    submitQuestion() {
      // Xử lý khi người dùng đăng câu hỏi
      if (this.questionText.trim() === "") {
        // Kiểm tra xem nội dung câu hỏi có trống không
        // Hiển thị thông báo lỗi hoặc thực hiện xử lý gửi câu hỏi
        // Tùy theo logic của bạn
        return;
      }

      // Tạo một đối tượng câu hỏi mới và thêm vào danh sách câu hỏi
      const newQuestion = {
        id: this.questions.length + 1,
        text: this.questionText,
        photoURL: "", // Cập nhật ảnh đại diện nếu cần
        displayName: "Người gửi", // Cập nhật tên người gửi
        createdAt: Date.now(),
      };

      this.questions.push(newQuestion);

      // Đóng popup và xóa nội dung câu hỏi
      this.isQuestionPopupVisible = false;
      this.questionText = "";
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
