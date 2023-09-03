<template>
  <aside class="sidebar" :class="{'w-180': true, 'w-100 position-static bg-none': isHeader}"  :style="{ height: sidebarHeight + 'px' }">
    <div v-if="!isHeader" class="p-3 d-flex flex-wrap" :class="isSidebarExpand ? 'align-items-center justify-content-between' : 'justify-content-center'">
      <div class="text-center">
      </div>
      <div class="flex" :class="isSidebarExpand ? 'ml-2' : 'mt-2'">
        <img v-if="!$isMobile" src="@/assets/logo.png" alt="logo" height="60" />
        <p style="color: aqua;">PHẦN MỀM CỐ VẤN HỌC TẬP</p>
        <!-- <el-button circle plain type="primary" :icon="isSidebarExpand ? 'el-icon-arrow-left' : 'el-icon-arrow-right'" @click="handleSidebarExpand" /> -->
      </div>
    </div>
    <div style="background-color: antiquewhite; border-radius: 15px;">
      CỐ VẤN HỌC TẬP
    </div>
    <div class="wrapper-sidebar-menu">
      <ul class="sidebar-menu">
       <li>IE_Võ Minh Hiếu</li>
       <li>IE_Cố vấn học tập</li>
      </ul>
    </div>
    <div style="background-color: rgb(156, 230, 243); border-radius: 15px;">
      QUẢN TRỊ CHUNG
    </div>
    <div class="wrapper-sidebar-menu">
      <ul class="sidebar-menu">
        <sidebar-item
          v-for="(sidebar, index) in sidebars"
          :sidebar="sidebar"
          :key="index"
          :index="index"
          @active_item="handleClickItem"
        ></sidebar-item>
      </ul>
      <!-- <template v-if="isHeader">
        <el-collapse accordion class="px-3 py-0 border-0">
          <template v-for="(sidebar, idx) in sidebars">
            <sidebar-item-collapse
              :sidebar="sidebar"
              :key="sidebar.url + idx"
              :index="idx"
              class="my-2"
            ></sidebar-item-collapse>
          </template>
          
        </el-collapse>
      </template> -->
      
    </div>
  </aside>
</template>
<script>
import sidebars from './Sidebars'
import SidebarItem from './SidebarItem'
import SidebarItemCollapse from './SidebarItemCollapse.vue'
export default {
  components: {
    SidebarItem,
    SidebarItemCollapse
  },
  props: {
    isHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sidebars: [],
      isSidebarExpand: false
    }
  },
  created() {
    let role = this.$store.getters.user.role || 'employee'
    this.sidebars = sidebars[role]
  },
  methods: {
    handleClickItem() {
      this.$emit('active_item')
    },
    handleSidebarExpand() {
      this.isSidebarExpand = !this.isSidebarExpand
      this.$emit('sidebarExpand', this.isSidebarExpand)
    },
    scrollHeight() {
      return document.documentElement.scrollHeight
    }
  },
  computed: {
    sidebarHeight() {
      return this.$store.getters.sidebarHeight
    },
    hasACL() {
      let acl = this.$store.getters['acl']
      return acl === '*' || (Array.isArray(acl) && acl.length)
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar-menu {
  list-style: none;
  padding: 0;
  text-align: center;
  border-top: 1px solid #ddd5;
 // background: $wr-sidebar-bg;
}
.sidebar {
  margin: 20px;
  border-radius: 20px;

  width: 250px !important;
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100% - 40px);
  background: #fff;
  z-index: 1010;
  &.w-180 {
    width: $sidebar-size-expand;
    /deep/.sidebar-menu-item {
      button {
        //background: #468a5f;
        color: #333;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .active {
        background: #d8ede9;
      }
      .sidebar-item {
        flex-direction: row !important;
        justify-content: flex-start !important;
        .text {
          padding-left: 8px;
          margin-top: 0 !important;
        }
      }
    }
  }
  /deep/.el-collapse {
    background: transparent;
    .el-collapse-item{
      background-color: white;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      &__header {
        border: 0;
        background-color: transparent;
        font-size: 14px !important;
        font-weight: 500;
        padding: 0.75rem;
        height: auto;
        line-height: 30px;
      }
      &__content {
        padding: 0;
        background-color: var(--light-gray);
      }
      .el-collapse-item {
        box-shadow: none;
        border-radius: 0;
        margin: 0;
        .el-collapse-item__header {
          padding-left: 3rem;
          box-shadow: inset 0px -1px 0px #DCDFE6;
        }
        .el-collapse-item__content {
          padding-left: 4rem;
          a {
            display: block;
            padding: 0.75rem 0;
            font-weight: bold;
            font-size: 14px;
            color: #606266;
            &:hover {
              color: $primary;
            }
          }
        }
      }
      .icon {
        font-size: 24px;
      }
    }
  }
}
</style>
