<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted() {
    if (['admin', 'leader'].includes(this.$store.getters.user.role)) {
      this.loadAllUsers()
      this.loadAllEpics()
      this.loadAllSprints()
    }
  }
}
</script>

<style lang="scss">
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
