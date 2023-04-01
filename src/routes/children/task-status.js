const path_code = 'task-status'
const name = 'Tổng quan công việc'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/TaskStatus'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  }
]
