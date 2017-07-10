class Scatterplot {
  constructor(id, w, h) {
    
	
	this.canvas = d3.select("#"+id)
      .attr("class", "container")
      .attr("width", w)
      .attr("height", h);

    this.id = id;
    this.w = w - 80;
    this.h = h - 90;
    this.g = this.canvas.append("g")
      .attr("transform", "translate(60,40)");
	  
	this.change = {profits: "Profits", assets:"Assets", market_value:"Market Value", sales:"Sales"}

	this.tooltipDiv = this.canvas.append("div").attr("class", "tooltip").style("opacity", 0);
	  
    this.xScale = d3.scaleLinear().rangeRound([0, this.w]);
    this.yScale = d3.scaleLinear().range([this.h, 0]);
    this.rScale = d3.scaleLinear().range([1,10]);
    this.cScale = d3.scaleLinear().range(["#0000ff", "#00ff00"]);

    this.dataset = [];
  }

  setData(filterName, data) {
    this.filterName = filterName;
    this.dataset = data.filter(function(d) { if(d.year === 2016) return d; });
  }

  polishData() {
    this.companies = [];

    for(var i = 0; i < this.dataset.length; i++) {
      var company = {
        name: this.dataset[i].name,
        rank: this.dataset[i].rank,
        sales: this.dataset[i].sales,
        profits: this.dataset[i].profits,
        assets: this.dataset[i].assets,
        market_value: this.dataset[i].market_value
      }

      this.companies.push(company);
    }
  }

  drawView() {
    this.canvas.select(".title").remove();
	this.g.selectAll(".axis").remove();
    this.g.selectAll(".ball").remove();

	var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    // .title
    this.canvas.append("text")
      .attr("class", "title")
      .attr("transform", "translate(" + ((this.w/2)+23) + "," + ((this.h/15)+5) + ")")
      .text(this.filterName);

    var that = this;
    this.xScale.domain(d3.extent(this.companies, function(d) { return d[that.xAxis]; }));
    this.yScale.domain(d3.extent(this.companies, function(d) { return d[that.yAxis]; }));
    this.rScale.domain([d3.max(this.companies, function(d) { return d.rank; }), d3.min(this.companies, function(d) { return d.rank; })]);
    this.cScale.domain([2000,1]);

    // .axis
    this.g.append("g")
      .attr("class", "axis")
      .attr("transform","translate(0," + this.h + ")")
      .call(d3.axisBottom(this.xScale).ticks(5)).append("text")
      .attr("fill","#000").attr("x",this.w/2)
	  .attr("y",30).text(this.change[this.xAxis].toUpperCase() + " (B)");

    this.g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(this.yScale)).append("text").attr("fill", "#000")
      .attr("transform", "rotate(-90)").attr("x",-this.h/2).attr("y", -50).attr("dy", "0.71em")
      .attr("text-anchor", "middle").text(this.change[this.yAxis].toUpperCase() + " (B)");

    // .ball
    this.g.selectAll("circle").data(this.companies).enter().append("circle")
      .attr("class", "ball")
      .attr("cx", function(d) { return that.xScale(d[that.xAxis]);})
      .attr("cy", function(d) { return that.yScale(d[that.yAxis]); })
      .attr("r", function(d) { return that.rScale(d.rank); })
      .attr("fill", function(d) { return that.cScale(d.rank); })
	  .on('mouseover', function(d){
       
	    div.transition().duration(200).style("opacity", .9); 
        div.html("<span style='color:red'>"+d.name+"</span> - Rank "+d.rank+"<br/>" 
		+that.change[that.xAxis]+": "+d[that.xAxis]+"<br/>"
		+that.change[that.yAxis]+": "+d[that.yAxis])
        .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function(d){
        div.transition().duration(200).style("opacity", 0);  
        div.html("");
      });
  }
}