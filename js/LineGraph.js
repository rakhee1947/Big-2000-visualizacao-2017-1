class LineGraph {
	constructor(id, w, h){
		this.canvas = d3.select("#"+id)
			.attr("class","container")
			.attr("width",w)
			.attr("height",h)
			.attr("transform","translate(0,60)");	
		this.id = id;

		this.margin = {top: 20, right: 20, bottom: 25, left: 30};
		this.w = w - this.margin.left - this.margin.right;
		this.h = h - this.margin.top - this.margin.bottom;
		this.g = this.canvas.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
	}
	
	setData(data){
		var x = d3.scaleLinear()
			.rangeRound([0, (this.w)]);
		var y = d3.scaleLinear()
			.range([(this.h), 0]);
		var line = d3.line()
			.x(function(d) { return x(d.day); })
			.y(function(d) { return y(d.height); });
		var that = this;

		d3.csv(data, function(d) {
			d.date = +d.day;
			d.height = +d.height;
			return d;
		}, function(error, data) {
			if (error) throw error;

			x.domain(d3.extent(data, function(d) { return d.day; }));
			y.domain(d3.extent(data, function(d) { return d.height; }));

			that.g.append("g").attr("transform","translate(0,"+((that.h))+")")
				.call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d"))).append("text")
				.attr("fill","#000").attr("y",-6).attr("x",that.w).text("DAY");

			that.g.append("g").call(d3.axisLeft(y)).append("text").attr("fill", "#000")
				.attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em")
				.attr("text-anchor", "end").text("HEIGHT");

			that.g.append("path").data([data]).attr("fill", "none").attr("stroke", "black")
				.attr("stroke-linejoin", "round").attr("stroke-linecap", "round")
				.attr("stroke-width", 1.5).attr("d", line);
		});
	}
}