<template>
  <div>
    <Input v-model="value" placeholder="refresh_token" style="width: 50%"/>
    <Button type="primary" @click="login">提交</Button>

  </div>
</template>

<script>
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
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>