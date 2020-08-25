<template>
    <div id="app">
        <home/>
    </div>
</template>

<script>
    import Home from './components/Home.vue'

    export default {
        name: 'App',
        components: {
            Home
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

    }

    body {
        color: white !important;
    }

    html {
        background-color: #171E29 !important;
        color: white !important;
    }
</style>
