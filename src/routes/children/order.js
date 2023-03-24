const path_code = 'order'
const name = 'Đơn Hàng'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/Order'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `${path_code}/new`,
    component: () => import('@/components/Views/Order/Form'),
    name: `${path_code}_new`,
    meta: {
      title: `Tạo ${name}`
    }
  },
  {
    path: `${path_code}/edit/:id`,
    component: () => import('@/components/Views/Order/Form'),
    name: `${path_code}_edit`,
    meta: {
      title: `Cập nhật ${name}`
    }
  }
]
