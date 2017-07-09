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
      .attr("fill","#000").attr("x",this.w/2).attr("y",30).text(this.xAxis.toUpperCase() + " (B)");

    this.g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(this.yScale)).append("text").attr("fill", "#000")
      .attr("transform", "rotate(-90)").attr("x",-this.h/2).attr("y", -50).attr("dy", "0.71em")
      .attr("text-anchor", "middle").text(this.yAxis.toUpperCase() + " (B)");

    // .ball
    this.g.selectAll("circle").data(this.companies).enter().append("circle")
      .attr("class", "ball")
      .attr("cx", function(d) { return that.xScale(d[that.xAxis]);})
      .attr("cy", function(d) { return that.yScale(d[that.yAxis]); })
      .attr("r", function(d) { return that.rScale(d.rank); })
      .attr("fill", function(d) { return that.cScale(d.rank); });
  }
}