import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
});

const loadUserSuccess = (users, page, totalPage) => ({
  type: 'LOAD_USER_SUCCESS',
  users,
  page,
  totalPage
})

const loadUserFailure = () => ({
  type: 'LOAD_USER_FAILURE'
})

export const loadUser = () => dispatch => request.get('api/phonebooks')
  .then(({ data }) => {
    dispatch(loadUserSuccess(data.data.result, data.data.page, data.data.totalPage))
  }).catch(() => {
    dispatch(loadUserFailure())
  })

export const addUserSuccess = (id, user) => ({
  type: 'ADD_USER_SUCCESS',
  user,
  id
})

export const addUserFailure = (id) => ({
  type: 'ADD_USER_FAILURE',
  id
})

export const addUserRedux = (id, name, phone) => ({
  type: 'ADD_USER',
  id,
  name,
  phone
})

export const addUser = (name, phone) => dispatch => {
  const id = Date.now()
  dispatch(addUserRedux(id, name, phone))
  return request.post('api/phonebooks', { name, phone }).then(({ data }) => {
    dispatch(addUserSuccess(id, data.data))
  }).catch((err) => {
    dispatch(addUserFailure(err))
  })
}

const removeUserSuccess = (id) => ({
  type: 'REMOVE_USER_SUCCESS',
  id
})

const removeUserFailure = () => ({
  type: 'REMOVE_USER_FAILURE'
})

export const removeUser = (id) => dispatch => {
  return request.delete(`api/phonebooks/${id}`).then(({ data }) => {
    dispatch(removeUserSuccess(id))
  }).catch((err) => {
    dispatch(removeUserFailure(err))
  })
}

const resendUserSuccess = (id, user) => ({
  type: 'RESEND_USER_SUCCESS',
  id,
  user
})

const resendUserFailure = () => ({
  type: 'RESEND_USER_FAILURE'
})

export const resendUser = (id, name, phone) => dispatch => {
  return request.post('api/phonebooks', { name, phone }).then(({ data }) => {
    dispatch(resendUserSuccess(id, data.data))
  }).catch((err) => {
    dispatch(resendUserFailure(err))
  })
}

const updateUserSuccess = (id, user) => ({
  type: 'UPDATE_USER_SUCCESS',
  id,
  user
})

const updateUserFailure = (error) => ({
  type: 'UPDATE_USER_FAILURE',
  error
})

export const updateUser = (id, name, phone) => dispatch => {
  return request.put(`api/phonebooks/${id}`, { name, phone }).then(({ data }) => {
    dispatch(updateUserSuccess(id, data.data))
  }).catch((error) => {
    dispatch(updateUserFailure(error))
  })
}



