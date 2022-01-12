<template>
  <div>

  </div>
</template>

<script>
import {post} from "@/utils/axios";

export default {
  name: "Test",
  methods: {

  },
  mounted() {
    post('/api/test', {
      name: 'test'
    }).then(res => {
      console.log(res);
    })
  }
}
</script>

<style scoped>

</style>