
class PieGraph {

	constructor(id, w, h){
		this.canvas = d3.select("#"+id)
			.attr("width",w)
			.attr("height",h)
			.attr("transform","translate(50,-120)");
		this.id = id;
		this.w = w;
		this.h = h;
		this.r = Math.min(w,h)/2;
		this.g = this.canvas.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

		var borderPath = this.canvas.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", h)
			.attr("width", w)
			.style("stroke", "black")
			.style("fill", "none")
			.style("stroke-width", 3);
		
		this.cScale = d3.scaleLinear()
			.range(["#e5f5f9", "#99d8c9", "#2ca25f"]);
		
	}
	
	setData(data){
		var color = d3.scaleOrdinal(d3.schemeCategory20c);
		var color2 = d3.scaleOrdinal(d3.schemeCategory10);

		var pie = d3.pie().sort(null).value(function(d) { return d.quantity; });
		var path = d3.arc().outerRadius(this.r - 30).innerRadius(0);
		var label = d3.arc().outerRadius(this.r - 80).innerRadius(this.r - 60);
	
		var tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) {
			return d.data.type+"<br>Quantidade: <span style='color:red'>" + d.data.quantity + "</span>";
		})
		this.canvas.call(tip);
		var that = this;
		
		d3.csv(data, function(d) {
			d.quantity = +d.quantity;
			return d;
		}, function(error, data) {
			if (error) throw error;
 
			var arc = that.g.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
				.attr("class", "arc");
			
			arc.append("path")
				.attr("d", path)
				.attr("fill", function(d) { return color(d.data.type); })
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);
				
			arc.append("text")
				.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
				.style("font-size","10")
				.style("font-family","Verdana")
				.style("font-weight","Bold")
				.style("fill", "#ffffff")
				.style("cursor", "default")
				.style("pointer-events", "none")
				.text(function(d) { return d.data.quantity; });
		});
	}
}