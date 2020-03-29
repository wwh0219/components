<script>
import Vue from 'vue'
import VueRx from 'vue-rx'
import { debounceTime } from 'rxjs/internal/operators/debounceTime'
import { throttleTime } from 'rxjs/internal/operators/throttleTime'
import { map } from 'rxjs/internal/operators/map'
import { filter } from 'rxjs/internal/operators/filter'
import { startWith } from 'rxjs/internal/operators/startWith'
import { merge } from 'rxjs/internal/observable/merge'
import { scan } from 'rxjs/internal/operators/scan'
import ListItem from './virtual-list-item'
Vue.use(VueRx)
const arr = []
export default {
  name: 'virtual-list',
  props: {
    list: {
      type: Array,
      default: () => [] // {id:string|number, render:Function}[]
    },
    itemMinHeight: {
      type: Number,
      default: 30
    },
    throttleTime: {
      type: Number,
      default: 300
    },
    outsideRemain: {
      type: Number,
      default: 10
    },
    useSlot: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      mainHeight: 0,
      rect: {},
      firstItemIndex: 0,
      lastItemIndex: 0,
      itemsRectCache: {},
      mounted: false,
      slotList: []
    }
  },
  inject: {},
  activated () {
    this.$refs.el.scrollTop = this.scrollTop
  },
  destroyed () {},
  components: {
    ListItem
  },
  domStreams: ['scroll$', 'itemUpdated$'],
  subscriptions () {
    this.$subscribeTo(this.scroll$, ({ event }) => {
      this.$emit('scroll', event)
    })
    const scrollEnd$ = this.scroll$.pipe(
      filter(({ event: e }) => {
        return (
          e.target.scrollTop >=
          e.target.scrollHeight -
            e.target.offsetHeight -
            (this.itemMinHeight - 10)
        )
      }),
      map(({ event }) => event)
    )
    this.$subscribeTo(scrollEnd$, e => {
      this.$emit('scroll-end', e)
    })
    const itemsRectCache$ = this.itemUpdated$.pipe(
      startWith(null),
      map(data => {
        if (data) {
          const { event, data: id } = data
          return {
            data: event.msg,
            id
          }
        }
        return null
      }),
      scan((result, current) => {
        if (current) {
          result[current.id] = current.data
        }
        return result
      }, {}),
      debounceTime(200)
    )
    this.$subscribeTo(itemsRectCache$, data => {
      this.itemsRectCache = { ...data }
    })
    return {
      scrollTop: this.scroll$.pipe(
        startWith(0),
        map(data => {
          return data.event ? data.event.target.scrollTop : data
        })
      )
    }
  },
  created () {},
  async updated () {
    await this.$nextTick()
    if (this.$refs.el) {
      this.getRect()
    }
    this.getSlotList()
  },
  mounted () {
    this.getRect()
    const merged$ = merge(this.itemUpdated$, this.$observables.scrollTop).pipe(
      throttleTime(this.throttleTime, undefined, { trailing: true })
    )
    this.$subscribeTo(merged$, (...args) => {
      // console.log(args)
      this.setVisibleIndex()
    })
    this.setVisibleIndex()
    this.getSlotList()
  },
  computed: {
    _list () {
      if (this.useSlot) {
        return this.slotList
      }
      return this.list
    },
    scroller () {
      return this.$refs.el
    },
    paddedTop () {
      return this._list
        .filter((i, index) => index < this.firstItemIndex)
        .reduce((a, b) => {
          const key = this.useSlot ? b.data.key : b.id
          const rect = this.itemsRectCache[key]
          if (rect) {
            return Math.ceil(a + rect.height)
          }
          return Math.ceil(a + this.itemMinHeight)
        }, 0)
    },
    // 渲染出来的列表
    visibleList () {
      const list = this[this.useSlot ? 'slotList' : 'list'].slice(
        this.firstItemIndex,
        this.lastItemIndex + 1
      )
      return list
    },
    contentStyle () {
      const height = this._list.reduce((a, b) => {
        const key = this.useSlot ? b.data.key : b.id
        const rect = this.itemsRectCache[key]
        if (rect) {
          return a + rect.height
        }
        return a + this.itemMinHeight
      }, 0)
      return {
        minHeight: `${height}px`,
        paddingTop: `${this.paddedTop}px`
      }
    }
  },
  methods: {
    // 生成可视区域的首位列表项序号
    setVisibleIndex () {
      const { scrollTop } = this
      const { height } = this.rect
      // const firstIndex = Math.floor(this.scrollTop / this.itemMinHeight)
      let beforeTotalHeight = 0 // 计算第一个元素之前的所有元素的高度总和
      let innerTotalHeight = 0 // 可视区域所有元素的高度总和
      let firstItemIndex, lastItemIndex
      const beforeSlotHeight = this.$refs.before.offsetHeight
      for (let i = 0; i < this._list.length; i++) {
        const item = this._list[i]
        const key = this.useSlot ? item.data.key : item.id
        const rect = this.itemsRectCache[key]
        if (rect) {
          if (firstItemIndex === undefined) {
            beforeTotalHeight = beforeTotalHeight + rect.height
          } else {
            innerTotalHeight = innerTotalHeight + rect.height
          }
        } else {
          if (firstItemIndex === undefined) {
            beforeTotalHeight = beforeTotalHeight + this.itemMinHeight
          } else {
            innerTotalHeight = innerTotalHeight + this.itemMinHeight
          }
        }
        if (
          firstItemIndex === undefined &&
          beforeTotalHeight + beforeSlotHeight > scrollTop
        ) {
          firstItemIndex = i > this.outsideRemain ? i - this.outsideRemain : 0
          continue
        }
        if (firstItemIndex !== undefined && innerTotalHeight > height) {
          lastItemIndex =
            i + this.outsideRemain > this._list.length - 1
              ? this._list.length - 1
              : i + this.outsideRemain
          break
        }
      }
      this.firstItemIndex = firstItemIndex || 0
      this.lastItemIndex = lastItemIndex || this._list.length
    },
    getRect () {
      const rect = this.$refs.el.getBoundingClientRect().toJSON()
      for (const prop in rect) {
        this.$set(this.rect, prop, rect[prop])
      }
    },
    getSlotList () {
      if (this.useSlot) {
        this.slotList = this.$slots.default ? this.$slots.default : arr
        console.log(this.slotList)
      }
    }
  },
  watch: {},
  render (h) {
    const before = <div ref="before">{this.$slots.before}</div>
    const after = <div ref="after">{this.$slots.after}</div>
    const list = this.useSlot
      ? this.visibleList.map(item => {
        const directives = [
          {
            name: 'stream',
            arg: 'update-rect',
            value: { subject: this.itemUpdated$, data: item.data.key }
          }
        ]
        return (
          <ListItem
            ref="items"
            {...{ directives }}
            vnode={item}
            key={item.data.key}
          ></ListItem>
        )
      })
      : this.visibleList.map(item => {
        const directives = [
          {
            name: 'stream',
            arg: 'update-rect',
            value: { subject: this.itemUpdated$, data: item.id }
          }
        ]
        return (
          <ListItem
            render={item.render}
            key={item.id}
            {...{ directives }}
          ></ListItem>
        )
      })
    const directives = [
      {
        name: 'stream',
        arg: 'scroll',
        value: this.scroll$
      }
    ]
    const scroller = (
      <div class="virtual-list" {...{ directives }} ref="el">
        {before}
        {h(
          this.tag,
          {
            class: 'virtual-list__main',
            ref: 'main',
            style: this.contentStyle
          },
          list
        )}
        {after}
      </div>
    )
    return scroller
  }
}
</script>
