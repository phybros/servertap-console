<template>
  <div id="app">
    <input class="hacker" type="text" value="localhost:4567/v1/ws/console" />
    <Console />
  </div>
</template>

<script>
import Console from './components/Console.vue'

export default {
  name: 'App',
  components: {
    Console
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: flex-start;
  height: 100%;
  margin: 0;
}

input {
  flex: 0 1 auto;
  align-self: stretch;
}
</style>
