<template>
  <div class="">
    <el-button type="primary" @click="checkIn">
      Check In
    </el-button>
    <el-button type="warning" @click="checkOut">
      Check Out
    </el-button>
  </div>
</template>

<script>
import { checkIn, checkOut } from '@/api/user_report';
export default {
  methods: {
    checkIn() {
      this.$confirm(`Check In`, 'Xác nhận', {
        confirmButtonText: 'OK',
        type: 'warning'
      }).then(() => {
        checkIn().then(() => {
          this.$emit('change')
        })
      }).catch()
    },
    checkOut() {
      this.$confirm(`Check Out`, 'Xác nhận', {
        confirmButtonText: 'OK',
        type: 'warning'
      }).then(() => {
        checkOut().then(() => {
          this.$emit('change')
        })
      }).catch()
    }
  }
}
</script>

<style>

</style>