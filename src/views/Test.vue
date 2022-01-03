<template>
  <div>

  </div>
</template>

<script>
import {get} from '@/utils/axios'

export default {
  name: "Test",
  async mounted() {
    await get("/api/test").then(res => {
      console.log(res)
    })

    console.log('end')
  }
}
</script>

<style scoped>

</style>