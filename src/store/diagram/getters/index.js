export default {
  nodes(state) {
    return state.project
  },
  nodeTypes(state) {
    return state.nodeTypes
  },
  allowedChildren: (state) => (nodeType) => {
    let allowedChildren = []
    state.nodeTypes.forEach(element => {
      if (element.allowedChildren.includes(nodeType)) {
        allowedChildren.push(element)
      }
    });
    return allowedChildren 
  },
}