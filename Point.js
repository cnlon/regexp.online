class Point {
    /**
     * @param {number} x
     * @param {number} y
     */

    constructor (x, y) {
        this.x = x
        this.y = y
    }

    moveTo (x, y) {
        this.x = x
        this.y = y
    }

    move (x, y) {
        this.x -= x
        this.y -= y
    }
}

export default Point
