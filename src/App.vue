<template>
  <div id="app">
    <Header @clickedTerm="handleClickedTerms(true)"/>
    <Terms v-if="showTerm" @closeTerm="handleClickedTerms(false)"/>
    <home v-else/>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Terms from './components/Terms.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  data() {
    return {
      showTerm: false,
    }
  },
  components: {
    Home,
    Header,
    Terms
  },
  methods: {
    handleClickedTerms(flag) {
        console.log('received');
        this.showTerm = flag;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #171E29 !important;

}

body {
  color: white !important;
  background-color: #171E29 !important;
}

html {
  background-color: #171E29 !important;
  color: white !important;
}
</style>
