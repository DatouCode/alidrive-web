<template>
  <div>
    <Input v-model="value" placeholder="refresh_token" style="width: 50%"/>
    <Button type="primary" @click="login">提交</Button>
  </div>
</template>

<script>
import * as api from '@/api/AliDrive'

export default {
  name: "Login",
  data() {
    return {
      value: ''
    }
  },
  methods: {
    login() {
      localStorage.setItem('refresh_token', this.value)
      api.getUserInfo().then(res => {
        console.log(res['nick_name'])
        this.$Message['success']({
          background: true,
          content: `欢迎登录  ${res['nick_name']}`
        });
        this.$router.push('/')
      })
    }
  },
}
</script>

<style scoped>

</style>