<script>
export default {
  functional: true,
  name: 'render',
  render (h, { props }) {
    return props.render(h)
  }
}
</script>
