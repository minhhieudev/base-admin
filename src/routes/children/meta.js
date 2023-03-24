const path_code = 'meta_attribute'
const name = 'Meta Attribute'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/MetaAttribute'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `${path_code}/new/:meta_code`,
    component: () => import('@/components/Views/MetaAttribute/Form'),
    name: `${path_code}_new`,
    meta: {
      title: `Tạo ${name}`
    }
  },
  {
    path: `${path_code}/edit/:id`,
    component: () => import('@/components/Views/MetaAttribute/Form'),
    name: `${path_code}_edit`,
    meta: {
      title: `Chỉnh Sửa ${name}`
    }
  }
]
