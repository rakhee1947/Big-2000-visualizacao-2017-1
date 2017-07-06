class Scatterplot {
  constructor(id, w, h){
    this.canvas = d3.select("#"+id)
      .attr("class","container")
      .attr("width",w)
      .attr("height",h);
    this.id = id;
    
    this.margin = {top: 20, right: 20, bottom: 25, left: 50};
    this.w = w - this.margin.left - this.margin.right;
    this.h = h - this.margin.top - this.margin.bottom;
    this.g = this.canvas.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    
    this.xScale = d3.scaleLinear().rangeRound([0, (this.w)]);
    this.yScale = d3.scaleLinear().range([this.h, 0]);
    this.rScale = d3.scaleLinear().range([0,4]);
    this.cScale = d3.scaleLinear().range(["#000", "#f00"]);
  }
  
  setData(data){
    var that = this;
    
    d3.csv(data, function(d) {
      d.rank = +d.rank;
      d.profits = +d.profits;
      d.sales = +d.sales;
      return d;
    }, function(error, data) {
      if (error) throw error;

      that.xScale.domain(d3.extent(data, function(d) { return d.profits; }));
      that.yScale.domain(d3.extent(data, function(d) { return d.sales; }));
      that.rScale.domain(d3.extent(data, function(d) { return d.rank; }));

      that.g.selectAll("circle").data(data).enter().append("circle")
        .attr("cx", function(d){ return that.xScale(d.profits); })
        .attr("cy", function(d){ return that.yScale(d.sales); })
        .attr("r", function(d){ return that.rScale(d.rank)+1; })
        .attr("fill", "#000");

      that.g.append("g").attr("transform","translate(0,"+(that.h)+")")
        .call(d3.axisBottom(that.xScale).ticks(5).tickFormat(d3.format("d"))).append("text")
        .attr("fill","#000").attr("y",-6).attr("x",that.w-4).text("PROFITS");

      that.g.append("g").call(d3.axisLeft(that.yScale)).append("text").attr("fill", "#000")
        .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em")
        .attr("text-anchor", "end").text("SALES");
    });
  }
}