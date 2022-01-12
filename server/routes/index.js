const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

const axios = require('axios');
const WebSocket = require('ws');

router.post('/getUserInfo', (req, res) => {
  axios.post('https://api.aliyundrive.com/v2/user/get', {}, {
    headers: {
      'authority': 'api.aliyundrive.com', 'authorization': `Bearer ${req.body.token}`, 'content-type': 'application/json;charset=UTF-8', 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36', 'origin': 'https://www.aliyundrive.com', 'referer': 'https://www.aliyundrive.com/', 'accept-language': 'zh-CN,zh;q=0.9', 'Content-Type': 'application/json; charset=UTF-8'
    }
  }).then(({data: response}) => {
    res.send(response)
  }).catch(err => {
    res.send(err.response.data)
  })
})

router.post('/filelist', async (req, res) => {
  let parent_file_id = req.body.parent_file_id, order_by = 'name', order_direction = 'ASC'
  axios.post('https://api.aliyundrive.com/adrive/v3/file/list', {"drive_id": req.body.drive_id, "parent_file_id": parent_file_id, "limit": 100, "all": false, "url_expire_sec": 1600, "image_thumbnail_process": "image/resize,w_400/format,jpeg", "image_url_process": "image/resize,w_1920/format,jpeg", "video_thumbnail_process": "video/snapshot,t_0,f_jpg,ar_auto,w_300", "fields": "*", "order_by": order_by, "order_direction": order_direction}, {
    headers: {
      'authority': 'api.aliyundrive.com', 'authorization': `Bearer ${req.body.token}`, 'content-type': 'application/json;charset=UTF-8', 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36', 'origin': 'https://www.aliyundrive.com', 'referer': 'https://www.aliyundrive.com/', 'accept-language': 'zh-CN,zh;q=0.9', 'Content-Type': 'application/json; charset=UTF-8'
    }
  }).then(({data: response}) => {
    res.send(response.items)
  }).catch(err => {
    res.send(err.response.data)
  })
});

router.post('/getDownloadUrl', (req, res) => {
  axios.post('https://api.aliyundrive.com/v2/file/get_download_url', {"drive_id": req.body.drive_id, "file_id": req.body.file_id}, {
    headers: {
      'authority': 'api.aliyundrive.com',
      'authorization': `Bearer ${req.body.token}`,
      'content-type': 'application/json;charset=UTF-8',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
      'origin': 'https://www.aliyundrive.com',
      'referer': 'https://www.aliyundrive.com/',
      'accept-language': 'zh-CN,zh;q=0.9',
      'Content-Type': 'application/json; charset=UTF-8'
    }
  }).then(({data: response}) => {
    res.send(response.url)
  })
})

router.post('/downloadByMotrix', (req, res) => {
  let ws = new WebSocket('ws://localhost:16800/jsonrpc');
  ws.on('open', () => {
    ws.send(JSON.stringify({
      "jsonrpc": 2, "id": "", "method": "system.multicall", "params": [[{
        "methodName": "aria2.addUri", "params": [[req.body.url], {
          "max-connection-per-server": 8, "split": 8, "out": req.body.filename, "referer": "https://www.aliyundrive.com/"
        }]
      }]]
    }));
  });

  ws.on('message', function incoming(data) {
    console.log(data.toString())
    if (JSON.parse(data.toString()).method === 'aria2.onDownloadComplete') {
      ws.close();
      res.send('success')
    }
  });
})

router.post('/access_token', (req, res) => {
  axios.post('https://auth.aliyundrive.com/v2/account/token', {
    "refresh_token": req.body.refresh_token,
    "grant_type": "refresh_token"
  }, {
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=utf-8",
      "Origin": "https://www.aliyundrive.com",
      "Referer": "https://www.aliyundrive.com/",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0",
    }
  }).then(({data: response}) => {
    res.send(response['access_token'])
  }).catch(err => {
    res.send(err.response.data)
  })
})

router.get('/test', (req, res) => {
  res.send('test')
})

module.exports = router;
