<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    node: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, node } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (node) {
      vnodes.push(<i class='el-icon-eleme'/>)
    }

    if (title) {
      vnodes.push(<span slot='title' class='link-title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
