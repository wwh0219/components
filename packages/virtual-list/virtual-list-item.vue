
<script>
export default {
  name: 'virtual-list-item',
  props: {
    render: Function,
    vnode: Object
  },
  data () {
    return {
      rect: {}
    }
  },
  async updated () {
    await this.$nextTick()
    if (this.$refs.el) {
      this.getRect()
    }
  },
  destroyed () {
    this.rect = null
  },
  mounted () {
    this.getRect()
  },
  methods: {
    getRect () {
      const rect = this.$el.getBoundingClientRect().toJSON()
      for (const prop in rect) {
        this.$set(this.rect, prop, rect[prop])
      }
    }
  },

  watch: {
    rect: {
      immediate: true,
      handler () {
        if (this.rect) {
          this.$emit('update-rect', this.rect)
        }
      }
    }
  },
  render (h) {
    if (this.vnode) {
      return this.vnode
    }
    return this.render(h)
  }
}
</script>
