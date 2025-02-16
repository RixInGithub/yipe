// ==UserScript==
// @name         yipe
// @version      1
// @description  an userscript which adds the brand new "yipe" block in snap
// @author       RixTheTyrunt
// @match        https://snap.berkeley.edu/snap/*
// @updateURL    https://rixingithub.github.io/yipe/yipe.user.js
// @downloadURL  https://rixingithub.github.io/yipe/yipe.user.js
// @grant        none
// ==/UserScript==

!function() {
	if (world.children[0].currentSprite.blocks.yipe) return // we aint want multiple yipes rolling around here
	var pCol = world.children[0].palette.color
	var p = world.children[0].palette
	var orig1 = SpriteMorph.prototype.primitiveBlocks
	SpriteMorph.prototype.primitiveBlocks = function() {
		var r = orig1.call(this)
		r.yipe = {
			type: "command",
			category: "operators",
			spec: "yipe %yipe",
			defaults: [
				["42"]
			],
			code: "yipe"
		}
		return r
	}
	var orig2 = SpriteMorph.prototype.blockTemplates
	SpriteMorph.prototype.blockTemplates = function(...a) {
		function block(b, c) {
			if ((StageMorph.prototype.hiddenPrimitives[b]) && (!(a.reverse()[0]))) {
				return null
			}
			var d = SpriteMorph.prototype.blockForSelector(b, true)
			d.isDraggable = false
			d.isTemplate = true
			if (c) d.ghost()
			return d
		}
		var r = orig2.apply(this, a)
		if (a[0]!="operators") return r
		var varIdIdx = r.findIndex(function(a){return"reportVariadicIsIdentical"==a.selector})
		var r0 = r.slice(0, varIdIdx+1)
		var r1 = r.slice(varIdIdx+1)
		return r0.concat(["-", block("yipe"), "-"], r1)
	}
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
				var l = world.children[0].logo
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
						c.src = world.children[0].logo.texture
					})
					Object.defineProperty(world.children[0],"logo",{get(){return(l)},set(a){return[l=a,Object.defineProperty(a,"texture",{get(){return""+lF}})]}}) // upside down normal snap logo
					world.children[0].logo = l
					l.cachedTexture=null
					world.children[0].logo.rerender()
				})()
				break
			case "reallygut":
				var ring = this.reifyReporter(SpriteMorph.prototype.blockForSelector("xPosition",true),new List())
				eval(invoke(ring)+"")
				break
			default: // unknown uption
				world.children.forEach(function(a){try{a.destroy()}catch(_){}})
				break
		}
	}
	Object.defineProperty(world.children[0],"palette",{get(){return(p)},set(a){return[p=a,Object.defineProperty(a,"color",{get(){return(pCol)}})]}})
	world.children[0].palette = p
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
	world.children[0].refreshIDE()
}()