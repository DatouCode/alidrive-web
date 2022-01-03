<template>
  <div>
    {{ this.$store.state.token }}
    <br>
    <button @click="add">+1</button>
  </div>
</template>

<script>
export default {
  name: 'Store',
  methods: {
    add() {
      this.$store.commit('add')
    }
  }
}
</script>