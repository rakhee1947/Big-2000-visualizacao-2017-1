class Scatterplot {
  constructor(id, w, h) {
    this.canvas = d3.select("#"+id)
      .attr("class", "container")
      .attr("width", w)
      .attr("height", h);

    this.id = id;
    this.w = w - 80;
    this.h = h - 110;
    this.g = this.canvas.append("g")
      .attr("transform", "translate(60,70)");

    this.change = {profits: "Profits", assets:"Assets", market_value:"Market Value", sales:"Sales"}
    this.tooltipDiv = this.canvas.append("div").attr("class", "tooltip").style("opacity", 0);

    this.xScale = d3.scaleLinear().rangeRound([0, this.w]);
    this.yScale = d3.scaleLinear().range([this.h, 0]);
    this.rScale = d3.scaleLinear().range([2,10]);
    this.cScale = d3.scaleLinear().range(["#0000ff", "#00ff00"]);

    this.dataset = [];
    this.filterCountry = [];
    this.filterIndustry = [];
    this.filterCompany = [];

    this.filteredByYear = [];
    this.filteredByCountry = [];
    this.filteredByIndustry = [];
    this.filteredByCompany = [];
  }

  setData(data) {
    this.dataset = data;
  }

  applyFilterYear(year) {
    var that = this;
    this.year = year;
    this.filteredByYear = this.dataset.filter(function(d) { if(d.year === year) return d; });
  }

  applyFilterCountry(country) {
    var i = this.filterCountry.indexOf(country);
    if(i === -1) this.filterCountry.push(country);
    else this.filterCountry.splice(i,1);

    var that = this;
    this.filteredByCountry = this.dataset.filter(function(d) { if(that.filterCountry.length === 0 || that.filterCountry.indexOf(d.country) !== -1) return d; });
  }

  applyFilterIndustry(industry) {
    var i = this.filterIndustry.indexOf(industry);
    if(i === -1) this.filterIndustry.push(industry);
    else this.filterIndustry.splice(i,1);

    var that = this;
    this.filteredByIndustry = this.dataset.filter(function(d) { if(that.filterIndustry.length === 0 || that.filterIndustry.indexOf(d.industry) !== -1) return d; });
  }

  applyFilterCompany(company) {
    var i = this.filterCompany.indexOf(company);
    if(i === -1) this.filterCompany.push(company);
    else this.filterCompany.splice(i,1);

    var that = this;
    this.filteredByCompany = this.dataset.filter(function(d) { if(that.filterCompany.length === 0 || that.filterCompany.indexOf(d.name) !== -1) return d; });
  }

  polishData() {
    var that = this;
    this.companies = [];
    this.join = this.filteredByYear.filter(function(d) { return (that.filteredByCompany.length > 0) ? that.filteredByCompany.indexOf(d) !== -1 : d; }).filter(function(d) { return (that.filteredByCountry.length > 0) ? that.filteredByCountry.indexOf(d) !== -1 : d; }).filter(function(d) { return (that.filteredByIndustry.length > 0) ? that.filteredByIndustry.indexOf(d) !== -1 : d; });

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
	this.canvas.select(".total").remove();
    this.g.selectAll(".axis").remove();
    this.g.selectAll(".ball").remove();

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // .title
    var quantity = this.filterCountry.length;
    var subCountry = this.canvas.append("text")
        .attr("class", "title")
        .attr("transform", "translate("+((this.w/2)+43)+","+((this.h/15)+5)+")");

    if(quantity === 0) subCountry.text("Global");
    else if(quantity < 3) subCountry.text(this.filterCountry);
    else if(quantity === 3) subCountry.text(this.filterCountry[0]+","+this.filterCountry[1]+" and 1 other country");
    else subCountry.text(this.filterCountry[0]+","+this.filterCountry[1]+" and "+(quantity-2)+" other countries");

	quantity = this.filterIndustry.length;
    var subIndustry = this.canvas.append("text")
        .attr("class", "total")
        .attr("transform", "translate("+((this.w/2)+43)+","+((this.h/15)+25)+")");

    if(quantity === 0) subIndustry.text("All Industries");
    else if(quantity < 3) subIndustry.text(this.filterIndustry);
    else if(quantity === 3) subIndustry.text(this.filterIndustry[0]+","+this.filterIndustry[1]+" and 1 other industry");
    else subIndustry.text(this.filterIndustry[0]+","+this.filterIndustry[1]+" and "+(quantity-2)+" other industries");
	
    var that = this;
    this.xScale.domain(d3.extent(this.join, function(d) { return d[that.xAxis]; }));
    this.yScale.domain(d3.extent(this.join, function(d) { return d[that.yAxis]; }));
    this.rScale.domain([d3.max(this.join, function(d) { return d.rank; }), d3.min(this.join, function(d) { return d.rank; })]);
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
    this.g.selectAll("circle").data(this.join).enter().append("circle")
      .attr("class", "ball")
      .attr("cx", function(d) { return that.xScale(d[that.xAxis]);})
      .attr("cy", function(d) { return that.yScale(d[that.yAxis]); })
      .attr("r", function(d) { return that.rScale(d.rank); })
      .attr("fill", function(d) { return that.cScale(d.rank); })
      .on('mouseover', function(d) {
        div.transition().duration(200).style("opacity", .9); 
        div.html("<span style='color:red'>"+d.name+"</span> - Rank "+d.rank+"<br/>" 
          +that.change[that.xAxis]+": "+d[that.xAxis]+"<br/>"
          +that.change[that.yAxis]+": "+d[that.yAxis])
        .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function(d) {
        div.transition().duration(200).style("opacity", 0);  
        div.html("");
      });
  }
}