class Scatterplot {
	constructor(id, w, h){
		this.canvas = d3.select("#"+id)
			.attr("class","container")
			.attr("width",w)
			.attr("height",h)
			.attr("transform","translate(0,60)");
		this.id = id;
		this.w = w;
		this.h = h;
		this.r = Math.min(w,h)/2;
		this.g = this.canvas.append("g").attr("transform", "translate("+w/2+","+h/2+")");
		
		this.cScale = d3.scaleLinear()
			.range(["#e5f5f9", "#99d8c9", "#2ca25f"]);
	}
	
	setData(data){

	}
}