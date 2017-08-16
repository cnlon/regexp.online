const LINE_BREAK_RE = /\n/g

export default class Coordinates extends Array {
  options = {}

  resize (options) {
    const {
      charWidth,
      paddingLeft,
      paddingRight,
      canvasWidth,
    } = options
    options.charsPeerLine = Math.floor(
      (canvasWidth - paddingLeft - paddingRight) / charWidth
    )
    this.options = options
  }

  hold (input) {
    this._clear()
    if (input) {
      const charsPeerLine = this.options.charsPeerLine
      const selfParas = 1
      let lastPoint = this[0]
      let res, index, distance, selfLines, col
      while (true) {
        res = LINE_BREAK_RE.exec(input)
        if (!res) break
        index = res.index
        distance = index - lastPoint.index
        if (distance <= 1) {
          selfLines = 1
          col = 0
        } else {
          selfLines = Math.ceil((distance - 1) / charsPeerLine)
          col = (distance - 1) % charsPeerLine
          if (col === 0) {
            col = charsPeerLine
          }
        }
        lastPoint = {
          index,
          para: lastPoint.para + selfParas,
          line: lastPoint.line + selfLines,
          col,
        }
        this.push(lastPoint)
      }
    }
  }

  _paraIndex = 0

  /**
   * @param {Number} index
   * @param {Number} length
   * @returns {Point}
   */

  compute (index, length) {
    const lastIndex = this.length - 1
    let next
    while (this._paraIndex < lastIndex) { // floor
      next = this[this._paraIndex + 1]
      if (next.index > index) {
        break
      }
      this._paraIndex++
    }

    const {charWidth, charHeight, charsPeerLine} = this.options

    const current = this[this._paraIndex]
    const distance = index - current.index
    const selfLines = Math.ceil(distance / charsPeerLine)
    let col = distance % charsPeerLine
    col = (col === 0 ? charsPeerLine : col) - 1
    const para = current.para + 1
    const line = current.line + selfLines
    let xywhs
    if (col + length < charsPeerLine) {
      xywhs = [[
        charWidth * col,
        charHeight * line,
        charWidth * length,
        charHeight,
      ]]
    } else {
      const beforeLength = charsPeerLine - col
      xywhs = [[
        charWidth * col,
        charHeight * line,
        charWidth * beforeLength,
        charHeight,
      ]]
      const left = length - beforeLength
      const middleLines = Math.floor(left / charsPeerLine)
      let newLine = line + 1
      if (middleLines > 0) {
        xywhs.push([
          0,
          charHeight * newLine,
          charWidth * charsPeerLine,
          charHeight * middleLines,
        ])
        newLine += middleLines
      }
      const afterLength = left % charsPeerLine
      xywhs.push([
        0,
        charHeight * newLine,
        charWidth * afterLength,
        charHeight,
      ])
    }
    return {index, para, line, col, xywhs}
  }

  _clear () {
    this.splice(0, this.length, {
      index: -1,
      para: -1,
      col: -1,
      line: -1,
    })
    this._paraIndex = 0
  }
}
