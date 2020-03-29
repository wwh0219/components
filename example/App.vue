<template>
  <div id="app">
    <div id="nav">
      <router-link to="/virtual-list">virtual-list</router-link> |
    </div>
    <div style="flex:1;overflow:auto">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
html,body{
    height: 100%;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
