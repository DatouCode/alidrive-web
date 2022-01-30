import {post} from '@/utils/axios'

export function getAccessToken() {
  post('/api/access_token', {refresh_token: localStorage.getItem('refresh_token')})
    .then((res) => {
      console.log(res)
      localStorage.setItem("token", res + "")
    })
}

export async function getFilelist(parent_file_id = 'root') {
  return post('/api/filelist', {
    token: localStorage.getItem('token'),
    parent_file_id,
    drive_id: localStorage.getItem('drive_id')
  })
    .then(async res => {
      if (res.code === "AccessTokenInvalid") {
        console.log('token失效')
        await getAccessToken()
        await getFilelist(parent_file_id)
      } else {
        console.log(res)
        return res
      }
    })
}

export function getUserInfo() {
  return post('/api/getUserInfo', {token: localStorage.getItem('token')}).then(res => {
    localStorage.setItem('drive_id', res['default_drive_id'])
    return res
  })
}

export function trash(file_id) {
  return post('/api/trash', {token: localStorage.getItem('token'), drive_id: localStorage.getItem('drive_id'), file_id})
}