const path_code = 'question'
const name = 'Câu hỏi'
const routeName = 'Questions'
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}`),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `${path_code}/new`,
    component: () => import(`@/components/Views/${routeName}/Form`),
    name: `${path_code}_new`,
    meta: {
      title: `Tạo ${name}`
    }
  },
  {
    path: `${path_code}/edit/:id`,
    component: () => import(`@/components/Views/${routeName}/Form`),
    name: `${path_code}_edit`,
    meta: {
      title: `Chỉnh Sửa ${name}`
    }
  }
]
