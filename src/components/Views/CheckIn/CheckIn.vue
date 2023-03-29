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
      checkIn()
    },
    checkOut() {
      checkOut()
    }
  }
}
</script>

<style>

</style>