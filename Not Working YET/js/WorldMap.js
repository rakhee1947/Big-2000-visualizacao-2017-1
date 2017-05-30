class WorldMap {
	constructor(id, w, h){
		var zoom = d3.zoom()
			.scaleExtent([1,8])
			.on("zoom",zoomed);
		this.canvas = d3.select("#"+id)
			.attr("class", "container")
			.attr("width",w-75)
			.attr("height",h)
			.attr("transform","translate(50,60)")
			.call(zoom);
		this.id = id;
		this.w = w;
		this.h = h;

		this.tooltip = this.canvas
			.append("div")
			.attr("class", "tooltip hidden");

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
			.on("mouseover",function(d,i){that.tooltip.classed("hidden", false).attr("style", "x:"+d3.mouse(this)[0]+"px;y:"+d3.mouse(this)[1]+"px;").html(d.properties.name);})
			.on("mouseout",function(d){that.tooltip.classed("hidden", true);});
			
	}
}