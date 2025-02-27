// ==UserScript==
// @name yipe
// @version 13
// @description an userscript which adds the brand new "yipe" block in snap
// @author RixTheTyrunt
// @match https://snap.berkeley.edu/snap/snap.html
// @updateURL https://rixingithub.github.io/yipe/yipe.user.js
// @downloadURL https://rixingithub.github.io/yipe/yipe.user.js
// @grant none
// ==/UserScript==

!function() {
	var __RUNYIPE__ = function(ide) {
		console.log(ide)
		if (ide.currentSprite.blocks.yipe) return // we aint want multiple yipes rolling around here
		var pCol = ide.palette.color
		var p = ide.palette
		var yipeBlk = {
			type: "command",
			category: "operators",
			spec: "yipe %yipe",
			defaults: [
				["42"]
			],
			code: "yipe"
		}
		function blkUpdater(m) {
			var orig = m.prototype.primitiveBlocks
			console.log(m.prototype.primitiveBlocks, orig)
			m.prototype.primitiveBlocks = function() {
				var r = orig.call(this)
				r.yipe = yipeBlk
				return r
			}
			m.prototype.blocks = m.prototype.primitiveBlocks() // immediately patch in yipe
		}
		blkUpdater(SpriteMorph)
		// blkUpdater(StageMorph)
		var yipeTemp
		function makeYipe() { // "cache" yipe template block
			if (!(yipeTemp)) {
				yipeTemp = SpriteMorph.prototype.blockForSelector("yipe", true)
				yipeTemp.isDraggable = false
				yipeTemp.isTemplate = true
			}
			return yipeTemp
		}
		function tmplUpdater(m) {
			var orig = m.prototype.blockTemplates
			m.prototype.blockTemplates = function(...a) {
				var r = orig.apply(this, a)
				if (a[0]!="operators") return r
				var varIdIdx = r.findIndex(function(a){return"reportVariadicIsIdentical"==a.selector})
				if (varIdIdx == -1) return r
				var r0 = r.slice(0, varIdIdx+1)
				var r1 = r.slice(varIdIdx+1)
				return r0.concat(["-",((StageMorph.prototype.hiddenPrimitives.yipe)&&(!(a.reverse()[0])))?null:makeYipe(),"-"],r1)
			}
		}
		tmplUpdater(SpriteMorph)
		tmplUpdater(StageMorph)
		var lF
		Process.prototype.yipe = function __YIPEFUNC__(a) {
			console.log(a)
			if (!(Array.isArray(a))) return __YIPEFUNC__([""])
			switch (a[0]) {
				case "42":
					console.log("palette")
					pCol = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1)
					p.rerender()
					break
				case "×0.9":
					console.log("buncy ball") // comig soon
					break
				case "🔥":
					console.log("flip")
					var l = ide.logo
					return (async function() {
						if (!(lF)) lF = await new Promise(function(b) {
							var c = new Image()
							c.onload = function() {
								var d = document.createElement("canvas")
								var e = d.getContext("2d")
								d.width = c.width
								d.height = c.height
								e.translate(0, c.height)
								e.scale(1, -1)
								e.drawImage(c, 0, 0)
								b(d.toDataURL())
							}
							c.src = ide.logo.texture
						})
						Object.defineProperty(ide,"logo",{get(){return(l)},set(a){return[l=a,Object.defineProperty(a,"texture",{get(){return""+lF}})]}}) // upside down normal snap logo
						ide.logo = l
						l.cachedTexture=null
						ide.logo.rerender()
					})()
					break
				case "reallygut":
					var ring = this.reifyReporter(SpriteMorph.prototype.blockForSelector("xPosition",true),new List())
					eval(invoke(ring)+"")
					break
				default: // unknown uption
					ide.parentThatIsA(WorldMorph).children.forEach(function(a){try{a.destroy()}catch(_){}})
					break
			}
		}
		Object.defineProperty(ide,"palette",{get(){return(p)},set(a){return[p=a,Object.defineProperty(a,"color",{get(){return(pCol)}})]}})
		ide.palette = p
		SyntaxElementMorph.prototype.labelParts["%yipe"] = {
			type: "input",
			tags: "read-only static",
			menu: (function(a){return(Object).fromEntries(a.map(function(b){return[b,[b+""]]}))})([
				42,
				"×0.9",
				"🔥",
				"reallygut"
			])
		}
		ide.refreshIDE() // i assume we need this for ff too
	}
	if ((world) && (world.childThatIsA(IDE_Morph))) return __RUNYIPE__(world.childThatIsA(IDE_Morph)) // shit, we're late into the party
	var __open = IDE_Morph.prototype.openIn
	IDE_Morph.prototype.openIn = function(w) {
		__open.call(this,w)
		__RUNYIPE__(this)
	}
}()