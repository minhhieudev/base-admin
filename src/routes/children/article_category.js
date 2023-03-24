const path_code = 'article-category'
const name = 'Danh mục bài viết'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/ArticleCategory'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `${path_code}/new`,
    component: () => import('@/components/Views/ArticleCategory/Form'),
    name: `${path_code}_new`,
    meta: {
      title: `Tạo ${name}`
    }
  },
  {
    path: `${path_code}/edit/:id`,
    component: () => import('@/components/Views/ArticleCategory/Form'),
    name: `${path_code}_edit`,
    meta: {
      title: `Chỉnh Sửa ${name}`
    }
  }
]
