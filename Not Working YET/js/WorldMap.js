class WorldMap {
	constructor(id, w, h){
		var zoom = d3.zoom()
			.scaleExtent([1,8])
			.on("zoom",zoomed);
		this.canvas = d3.select("#"+id)
			.attr("width",w-75)
			.attr("height",h)
			.attr("transform","translate(50,90)")
			.call(zoom);
		this.id = id;
		this.w = w;
		this.h = h;

		var borderPath = this.canvas.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", this.h)
			.attr("width", w-75)
			.style("stroke", "black")
			.style("fill", "none")
			.style("stroke-width", 3);
		/*var tooltip = this.canvas
			.append("div")
			.attr("class", "tooltip hidden");*/

		this.cScale = d3.scaleLinear()
			.range(["#e5f5f9", "#99d8c9", "#2ca25f"]);

		this.projection = d3.geoMercator().translate([w/2,height/2]).scale(width / 2 / Math.PI);
		this.path = d3.geoPath().projection(this.projection);

		var that = this;
		function zoomed(){
			that.canvas.selectAll(".country").attr("transform",d3.event.transform);
		}
	}

	setData(data){
		var that = this;
		this.cScale
		//	.domain([0,d3.max(data,function(d){return d.rank;})+20]);
			.domain([0,100]);
		
		var country = this.canvas.selectAll(".country").data(data);
		country.enter()
			.insert("path")
			.attr("class", "country")
			.attr("d",that.path)
			.attr("id", function(d,i){return d.id;})
			.style("fill",function(d){return that.cScale(Math.random()*100);})
			//.style("fill",function(d){return that.cScale(d.rank);})
			.on("mouseover",function(d){d3.select(this).style("fill-opacity",0.8);})
			.on("mouseout",function(d){d3.selectAll(".country").style("fill-opacity",1);});
			
	}
}