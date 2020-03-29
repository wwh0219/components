<template>
  <div style="height:100%;width:300px;overflow:hidden;height:600px">
      <virtual-list use-slot @scroll-end="loadData" tag="ul" width="100%">
        <li v-for="i in data" :key="i.id" :style="{backgroundColor:i.color}">
          {{i.id}}
          <div :key="index" v-for="(c,index) in i.childs" :style="{height:`${c.height}`}"></div>
        </li>
      </virtual-list>
  </div>
</template>

<script>
import VirtualList from 'packages/virtual-list'
let id = 0
const colors = ['red', 'blue', 'gray', '#fff', '#f7f7f7']
// const genBlockColor = item => {
//   return {
//     backgroundColor: item.color
//   }
// }
const genData = () => {
  const arr = new Array(100).fill('')
  const data = arr.map((a, index) => {
    const itemData = {
      itemCount: Math.ceil(Math.random() * 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      id: id++,
      label: index
    }
    return {
      ...itemData,
      childs: new Array(itemData.itemCount).fill(null).map(i => {
        return {
          height: '30px'
        }
      })
    }
  })
  return data
}
const data = genData()
export default {
  data () {
    return {
      data
    }
  },
  methods: {
    loadData () {
      if (this.timer || this.data.length >= 50) {
        return
      }
      this.timer = setTimeout(() => {
        this.data.push(...genData())
        clearTimeout(this.timer)
        this.timer = null
      }, 1000)
    }
  },
  components: {
    VirtualList
  },
  async mounted () {}
}
</script>
