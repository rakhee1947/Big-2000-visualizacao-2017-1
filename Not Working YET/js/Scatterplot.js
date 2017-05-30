class Scatterplot {
	constructor(id, w, h){
		this.canvas = d3.select("#"+id)
			.attr("width",w)
			.attr("height",h);
		this.id = id;
		this.w = w;
		this.h = h;
		
		this.cScale = d3.scaleLinear()
			.range(["#e5f5f9", "#99d8c9", "#2ca25f"]);
	}
	
	setData(data){

	}
}