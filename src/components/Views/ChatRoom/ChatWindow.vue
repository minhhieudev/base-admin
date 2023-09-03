<template>
  <div class="chatroom">
    <el-container>
      <el-header style="height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
        <div class="header__info">
          <p class="header__title">{{ selectedRoom.name }}</p>
          <span class="header__description">{{ selectedRoom.description }}</span>
        </div>
        <div>
          <p style="color: bisque;font-weight: bold;">Góc cố vấn</p>
        </div>
        <el-button-group>
          <el-button icon="el-icon-user-solid" type="text" @click="showInviteDialog">Mời</el-button>
          <el-avatar-group :max="2" size="small">
            <el-tooltip v-for="member in members" :key="member.id" :content="member.displayName">
              <el-avatar :src="member.photoURL">
                {{ member.photoURL ? '' : member.displayName.charAt(0).toUpperCase() }}
              </el-avatar>
            </el-tooltip>
          </el-avatar-group>
        </el-button-group>
      </el-header>
      <el-main style="height: calc(100% - 56px); padding: 11px;">
        <el-scrollbar wrap-class="question-list">
          <question v-for="mes in questions" :key="mes.id"
                   :text="mes.text" :photoURL="mes.photoURL"
                   :displayName="mes.displayName" :createdAt="mes.createdAt" />
        </el-scrollbar>
        <!-- Phần nhập nội dung câu hỏi -->
        <div class="question-input-wrapper" :class="{ 'expanded': isQuestionInputExpanded }">
          <textarea v-model="inputValue" placeholder="Nhập nội dung câu hỏi..." @keyup.enter.native="handleOnSubmit"></textarea>
          <!-- Các công cụ chỉnh sửa như nút in đậm, nghiêng, v.v. -->
          <div class="formatting-tools">
            <button @click="toggleBold"><strong>B</strong></button>
            <button @click="toggleItalic"><em>I</em></button>
            <!-- Thêm các công cụ khác tương tự -->
          </div>
        </div>
        <!-- Kết thúc phần nhập nội dung câu hỏi -->
        <el-form ref="form" class="question-form" @submit.native.prevent="handleOnSubmit">
          <el-form-item>
            <el-button type="primary" @click="handleOnSubmit">Gửi</el-button>
          </el-form-item>
          <color-picker v-model="color"></color-picker>
        </el-form>
      </el-main>
    </el-container>
    <el-dialog title="Mời thành viên" :visible.sync="isInviteMemberVisible">
      <!-- Nội dung của dialog mời thành viên -->
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
        description: "Mô tả phòng chat mẫu"
      },
      members: [
        {
          id: 1,
          displayName: "Người 1",
          photoURL: ""
        },
        {
          id: 2,
          displayName: "Người 2",
          photoURL: ""
        }
      ],
      inputValue: "",
      questions: [
        {
          id: 1,
          text: "Chào bạn!",
          photoURL: "",
          displayName: "Người gửi",
          createdAt: 1630051200
        }
      ],
      color: "white",
      isInviteMemberVisible: false,
      isQuestionInputExpanded: false // Thêm biến để theo dõi trạng thái mở rộng
    };
  },
  components: {
    Question,
    ColorPicker
  },
  methods: {
    showInviteDialog() {
      // Hiển thị dialog mời thành viên
      this.isInviteMemberVisible = true;
    },
    handleOnSubmit() {
      // Xử lý khi người dùng gửi tin nhắn
      // Tương tự như trong React ChatWindow
    },
    toggleBold() {
      // Xử lý việc thêm hoặc bỏ định dạng in đậm cho vùng nhập nội dung câu hỏi
    },
    toggleItalic() {
      // Xử lý việc thêm hoặc bỏ định dạng nghiêng cho vùng nhập nội dung câu hỏi
    },
    // Thêm các phương thức xử lý công cụ chỉnh sửa khác tương tự
  }
};
</script>

<style scoped>
.question-list {
  max-height: 100%;
  overflow-y: auto;
}

.question-input-wrapper {
  transition: height 0.3s;
  overflow: hidden;
  margin-bottom: 10px;
}

.question-input-wrapper.expanded {
  height: 150px; /* Điều chỉnh chiều cao mở rộng tùy ý */
}

.question-input-wrapper textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: 1px solid #ccc;
  padding: 5px;
}

.formatting-tools button {
  margin-right: 5px;
}
</style>
