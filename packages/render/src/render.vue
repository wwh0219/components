<script>
export default {
  functional: true,
  render: (h, { props }) => {
    return props.render(h)
  }
}
</script>
