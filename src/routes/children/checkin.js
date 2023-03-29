const path_code = 'checkin'
const name = 'Check In'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/CheckIn'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
]
