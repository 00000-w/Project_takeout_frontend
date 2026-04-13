import request from '@/utils/request'

/**
 * 员工管理
 */

// 登录
export const login = (data: any) =>
  request({
    url: '/employee/login',
    method: 'post',
    data
  })

// 退出
export const userLogout = (params: any) =>
  request({
    url: '/employee/logout',
    method: 'post',
    params
  })

// 分页查询
export const getEmployeeList = (params: any) =>
  request({
    url: '/employee/page',
    method: 'get',
    params
  })

// 启用/禁用员工账号
export const enableOrDisableEmployee = (params: any) =>
  request({
    url: `/employee/status/${params.status}`,
    method: 'post',
    data: { id: params.id }
  })

// 新增员工
export const addEmployee = (params: any) =>
  request({
    url: '/employee',
    method: 'post',
    data: params
  })

// 修改员工
export const editEmployee = (params: any) =>
  request({
    url: '/employee/update',
    method: 'put',
    data: params
  })

// 根据 id 查询员工
export const queryEmployeeById = (id: string | number) =>
  request({
    url: `/employee/${id}`,
    method: 'get'
  })