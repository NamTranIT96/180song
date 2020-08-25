<template>
    <div id="app">
                <Header/>
        <home/>
    </div>
</template>

<script>
    import Home from './components/Home.vue'
    import Header from './components/Header.vue'

    export default {
        name: 'App',
        components: {
            Home,
            // eslint-disable-next-line vue/no-unused-components
            Header
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
