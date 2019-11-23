<template>
  <div id="app" class="container">
    <Contact />
  </div>
</template>

<script>
import Contact from './components/ContactForm.vue'


export default {
  name: 'app',
  components: {
    Contact
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
