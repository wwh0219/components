<template>
  <div>
    <render  :render="render" />
  </div>
</template>
<script>
export default {
  computed: {
    render () {
      return (h) => {
        console.log(321)
        console.log('hhhhhhhhhh', h)
        return (
          <div>
          asdasdasd
          </div>
        )
      }
    }
  }
}
</script>
