class WorldMap {
	constructor(id, w, h){
		var zoom = d3.zoom()
			.scaleExtent([1,8])
			.on("zoom",zoomed);
		this.canvas = d3.select("#"+id)
			.attr("width",w-75)
			.attr("height",h)
			.attr("transform","translate(50,30)")
			.call(zoom);
		this.id = id;
		this.w = w;
		this.h = h;

		/*var tooltip = this.canvas
			.append("div")
			.attr("class", "tooltip hidden");*/

		this.cScale = d3.scaleLinear()
			.range(["#e5f5f9", "#99d8c9", "#2ca25f"]);

		this.projection = d3.geoMercator().translate([w/2,height/2]).scale(width);
		this.path = d3.geoPath().projection(this.projection);

		function zoomed(){
			this.canvas.selectAll("path").attr("transform",d3.event.transform);
		}
	}

	setData(data){
		var that = this;
		this.cScale
			.domain([0,d3.max(data,function(d){return d.rank;})+20]);

		var country = this.canvas.selectAll(".country").data(data);
		country.enter()
			.insert("path")
			.attr("class", "country")
			.attr("d",that.path)
			.attr("id", function(d,i){return d.id;})
			.style("fill","black")
			//.style("fill",function(d){return cScale(d.rank);})
			.on("mouseover",function(d){d3.select(this).style("fill-opacity",0.8);})
			.on("mouseout",function(d){d3.selectAll("path").style("fill-opacity",1);});
	}
}