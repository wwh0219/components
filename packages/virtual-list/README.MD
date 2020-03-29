# VirtualList

## 说明
  基于Vue的虚拟列表组件

## props

| 名称      | 类型                             | 默认值 | 说明                   | 必须 |
| --------- | -------------------------------- | ------ | ---------------------- | ---- |
| list | Array\<ListItem\> | []    | 列表数据 | n    |
| itemMinHeight | number | 30 | 列表项最小高度，在列表项还没渲染时作为高度使用 | n |
| throttleTime | number | 300 | 渲染列表计算间隔 | n |
| outsideRemain | number | 10 | 屏幕上下边缘外的列表项保留个数 | n |



## slots

| 名称   | 位置         |
| ------ | ------------ |
| before | 列表区域以上 |
| after  | 列表区域以下 |

## 使用

### 注册

```js
import Vue from 'vue'
import VirtualList from '@bandaotiehe/virtual-list'
Vue.component('VirtualList',VirtualList)
```

用法1.使用list传入列表 (id必须)

  ```typescript
  //列表项
  type ListItem={
    id:number|string //唯一标识
    render:()=>VNode //渲染函数
  }
  ```
  ```html
  <template>
     <virtual-list :list="data" @scroll-end="loadData">
     </virtual-list>
  </template>
  ```

用法2. v-for (key必须，use-slot)

```html
<template>
     <virtual-list use-slot>
         <div v-for="i in 1000" :key="i">
             
         </div>
     </virtual-list>
</template>
```

