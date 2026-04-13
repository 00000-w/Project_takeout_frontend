import request from '@/utils/request'

export const getSetmealList = (params: any) =>
  request({ url: '/setmeal/page', method: 'get', params })

export const enableOrDisableSetmeal = (params: any) =>
  request({ url: `/setmeal/status/${params.status}`, method: 'post', data: { id: params.id } })

export const getSetmealCategories = () =>
  request({ url: '/category/list', method: 'get' })

export const querySetmealById = (id: string | number) =>
  request({ url: `/setmeal/${id}`, method: 'get' })

export const addSetmeal = (params: any) =>
  request({ url: '/setmeal', method: 'post', data: params })

export const editSetmeal = (params: any) =>
  request({ url: '/setmeal', method: 'put', data: params })

// 删除套餐
export const deleteSetmeal = (id: number) =>
  request({
    url: `/setmeal/${id}`,
    method: 'delete'
  })