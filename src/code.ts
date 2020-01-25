figma.showUI(__html__)

figma.ui.onmessage = async msg => {
  const node = figma.currentPage.selection
  if (msg.type === 'init') {
    if (figma.currentPage.selection.length > 0) {
      const imageArr = await node[0].exportAsync({ format: 'PNG' })
      figma.ui.postMessage({
        node,
        imageArr,
        error: null,
      })
    } else {
      figma.ui.postMessage({
        selectedNode: null,
        imageArr: null,
        error: {
          type: 'notSelected',
          message: 'No node is selected'
        }
      })
    }
  } else if (msg.type === 'quit') {
    figma.closePlugin()
  }
  figma.closePlugin()
}
