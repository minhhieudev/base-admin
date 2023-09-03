<template>
  <div>
    <el-button @click="toggleColorPicker">{{ buttonText }}</el-button>
    <el-popover
      v-model="showColorPicker"
      trigger="click"
      placement="bottom-start"
    >
      <el-color-picker v-model="selectedColor" @change="handleColorChange" />
      <div @click="closeColorPicker" class="color-picker-overlay"></div>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    color: String, // Màu được chọn ban đầu
  },
  data() {
    return {
      showColorPicker: false, // Hiển thị hoặc ẩn bảng chọn màu
      selectedColor: this.color || "#ffffff", // Màu đang được chọn
    };
  },
  computed: {
    buttonText() {
      return this.showColorPicker ? "Đóng" : "Chọn màu";
    },
  },
  methods: {
    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker;
    },
    handleColorChange(newColor) {
      this.selectedColor = newColor;
      this.$emit("change", newColor);
    },
    closeColorPicker() {
      this.showColorPicker = false;
    },
  },
};
</script>

<style scoped>
.color-picker-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
}
</style>
