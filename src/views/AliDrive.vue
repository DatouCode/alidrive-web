<template>
  <div id="app">
    <Table row-key="file_id" context-menu show-context-menu border :columns="columns1" :data="filelist"
           :load-data="getFolder" @on-contextmenu="handleContextMenu">
      <template slot-scope="{ row }" slot="name">
        <!--  文件  -->
        <span v-if="row.type==='file'">{{ row.name }}</span>
        <!--  文件夹  -->
        <div v-else-if="row.type==='folder'">
          <Icon type="md-folder"/>
          <span style="cursor: pointer" @click="getFolder(row.file_id)">
            {{ row.name }}
          </span>
        </div>
      </template>
      <template slot="contextMenu">
        <DropdownItem @click.native="download">下载</DropdownItem>
      </template>
    </Table>
  </div>
</template>
<script>
import {post} from '@/utils/axios'
import {format} from 'date-fns'

export default {
  data() {
    return {
      columns1: [
        {
          title: '文件名',
          slot: 'name',
        },
        {
          title: '修改时间',
          key: 'updated_at',
          width: 170
        },
        {
          title: '大小',
          key: 'size',
          width: 100
        }
      ],
      filelist: [],
      size: [],
      index: 0,
      contextLine: 0,
    }
  },
  methods: {
    handleContextMenu(row) {
      this.index = this.filelist.findIndex(item => item.name === row.name);
      this.contextLine = this.index + 1;
    },
    getFilelist(parent_file_id = 'root') {
      post('/api/filelist', {
        token: localStorage.getItem('token'),
        parent_file_id,
        drive_id: localStorage.getItem('drive_id')
      }).then(res => {
        if (res.code === "AccessTokenInvalid") {
          console.log('token失效')
          this.getAccessToken()
        } else {
          this.filelist = res;
          this.size = this.filelist.map(item => item.size || 0);
          this.filelist.map(file => {
            file.updated_at = format(new Date(file.updated_at), "yyyy-MM-dd HH:mm:ss")
            if (file.size) {
              if (file.size < 1024 * 1024)
                file.size = (file.size / 1024).toFixed(0) + 'KB';
              else if (file.size < 1024 * 1024 * 1024)
                file.size = (file.size / (1024 * 1024)).toFixed(0) + 'MB';
              else
                file.size = (file.size / (1024 * 1024 * 1024)).toFixed(0) + 'GB';
            }
          })
        }
      })
    },

    getAccessToken() {
      post('/api/access_token', {refresh_token: localStorage.getItem('refresh_token')}).then((res) => {
        console.log(res)
        localStorage.setItem("token", res + "")
        this.getFilelist()
      })
    },

    getFolder(file_id) {
      this.getFilelist(file_id)
    },

    async download() {
      let file = this.filelist[this.index]
      let downloadUrl = await post('/api/getDownloadUrl', {
        drive_id: localStorage.getItem('drive_id'),
        file_id: file.file_id,
        token: localStorage.getItem('token')
      })
      console.log(downloadUrl)
      let res = await post('/api/downloadByMotrix', {url: downloadUrl, filename: file.name})
      this.$Message.success('下载成功');
    },

    getUserInfo() {
      post('/api/getUserInfo', {token: localStorage.getItem('token')}).then(res => {
        console.log(res)
        localStorage.setItem('drive_id', res['default_drive_id'])
      })
    }
  },
  mounted() {
    if (!localStorage.getItem('refresh_token')) {
      this.$router.push('/login')
    }
    if (!localStorage.getItem('token')) {
      this.getAccessToken()
    }
    if (!localStorage.getItem('drive_id')) {
      this.getUserInfo()
    }
    this.getFilelist();
  }
}
</script>
