figma.showUI(__html__)

figma.ui.onmessage = msg => {
  if (msg.type === 'init') {
    if (figma.currentPage.selection) {
      const node = figma.currentPage.selection
      figma.ui.postMessage({
        node,
        error: null,
      })
    } else {
      figma.ui.postMessage({
        selectedNode: null,
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
