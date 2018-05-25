const range = document.createRange()

/**
 * @param {Node} startNode
 * @param {number} startOffset
 * @param {Node} stopNode
 * @param {number} stopOffset
 * @return {ClientRectList}
 */

function getClientRects (startNode, startOffset, stopNode, stopOffset) {
    range.setStart(startNode, startOffset)
    range.setEnd(stopNode, stopOffset)
    const clientRectList = range.getClientRects()
    range.detach()
    return clientRectList
}

export default getClientRects
