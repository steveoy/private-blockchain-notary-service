class Star {
    constructor(data) {
        this.dec = data.dec,
            this.ra = data.ra,
            this.story = Buffer.from(data.story, "ascii").toString("hex"),
            this.mag = data.mag,
            this.constellation = data.constellation
    }
}

module.exports = Star;