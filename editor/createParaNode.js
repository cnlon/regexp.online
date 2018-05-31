/**
 * @param {string} text
 * @return {HTMLDivElement}
 */

function createParaNode (text) {
    const paraNode = document.createElement('div')
    if (text) {
        paraNode.textContent = text
    } else {
        const br = document.createElement('br')
        paraNode.appendChild(br)
    }
    return paraNode
}

export default createParaNode
