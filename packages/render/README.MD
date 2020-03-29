# Render

## 说明
  用于将渲染函数渲染到模板中的组件

## props

| 名称      | 类型                             | 默认值 | 说明                   | 必须 |
| --------- | -------------------------------- | ------ | ---------------------- | ---- |
| render | ()=>VNode | - | 返回虚拟节点的函数 | y |

## 使用

### 注册

```js
import Vue from 'vue'
import Render from '@bandaotiehe/render'
Vue.component('Render',Render)
```

```html
<template>
  <div>
    <render :render="render" />
  </div>
</template>
<script>
export default {
  computed:{
    render(){
      return (
        <div>
          adasdasdasdasd
        </div>
      )
    }
  }
}
</script>
```