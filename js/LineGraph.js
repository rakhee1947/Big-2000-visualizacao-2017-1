class LineGraph {
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

    this.change = {profits: "Profits", assets:"Assets", market_value:"Market Value", sales:"Sales", rank:"Rank"};
    this.tooltipDiv = this.canvas.append("div").attr("class", "tooltip").style("opacity", 0);

    this.xScale = d3.scaleTime().domain([new Date(2011,0,1), new Date(2016,0,1)]).range([0, this.w]);
    this.yScale = d3.scaleLinear().range([this.h, 0]);
    this.rScale = d3.scaleLinear().range([1,5]);
    this.cScale = d3.scaleLinear().range(["#000", "#00f"]);

    this.dataset = [];
    this.filterCountry = [];
    this.filterIndustry = [];
    this.filterCompany = [];

    this.filteredByCountry = [];
    this.filteredByIndustry = [];
    this.filteredByCompany = [];
  }

  setData(data) {
    this.dataset = data;
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
    this.industryNames = [];
    this.industries = [];

    this.join = this.dataset
      .filter(function(d) { return (that.filteredByCompany.length > 0) ? that.filteredByCompany.indexOf(d) !== -1 : d; })
      .filter(function(d) { return (that.filterCountry.length > 0 || that.filteredByCountry.length > 0) ? that.filteredByCountry.indexOf(d) !== -1 : d; })
      .filter(function(d) { return (that.filterIndustry.length > 0 || that.filteredByIndustry.length > 0) ? that.filteredByIndustry.indexOf(d) !== -1 : d; });

    for(var i = 0; i < this.join.length; i++) {
      var a = this.industryNames.indexOf(this.join[i].name);

      if(a == -1) {
        var newL = [null,null,null,null,null,null];
        newL[(this.join[i].year)-2011] = this.join[i];
        this.industries.push(newL);
        this.industryNames.push(this.join[i].name);
      } else {
        this.industries[a][(this.join[i].year)-2011] = this.join[i];
      }
    }

    for(var i = 0; i < this.industries.length; i++) {
      for(var j = 0; j < this.industries[i].length; j++) {
        if(this.industries[i][j] == null) {
          this.industries[i][j] = {name:this.industryNames[i], profits:0, sales:0, market_value:0, assets:0, year:2011+j, rank:2001};
        }
      }
    }    
  }

  drawView() {
    this.canvas.select(".title").remove();
    this.canvas.select(".total").remove();
    this.g.selectAll(".axis").remove();
    this.g.selectAll(".history").remove();
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
    this.yDataset = this.join;
    this.yDataset.push({name:"Dummy", profits:0, sales:0, market_value:0, assets:0, year:0, rank:2001});
    this.yScale.domain(d3.extent(this.yDataset, function(d) { return d[that.yAxis]; }));
    this.cScale.domain([2000,1]);

    if(this.yAxis == "rank") {
      this.yScale.range([0, this.h]);
    } else {
      this.yScale.range([this.h,0]);
    }

    // .axis
    this.g.append("g")
      .attr("class", "axis")
      .attr("transform","translate(0," + this.h + ")")
      .call(d3.axisBottom(this.xScale).ticks(5).tickFormat(d3.timeFormat("%Y"))).append("text")
      .attr("fill","#000").attr("x",this.w/2).attr("y",30).text("YEAR");

    this.g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(this.yScale)).append("text").attr("fill", "#000")
      .attr("transform", "rotate(-90)").attr("x",-this.h/2).attr("y", -50).attr("dy", "0.71em")
      .attr("text-anchor", "middle").text(this.change[this.yAxis].toUpperCase() + ((this.yAxis !== "rank") ? " (B)" : ""));

    var line = d3.line()
      .x(function(d) { debugger;return xScale(new Date(d.year,0,1)); })
      .y(function(d) { return that.yScale(d[that.yAxis]); });

    var ballData = []
    for(var i = 0; i < this.industries.length; i++) {
      var points = "";

      for(var j = 0; j < 6; j++) {
        if(j == 0) {
          points = this.xScale(new Date(2011+j,0,1))+","+this.yScale(this.industries[i][j][this.yAxis]);
        } else {
          points += " " + this.xScale(new Date(2011+j,0,1))+","+this.yScale(this.industries[i][j][this.yAxis]);
        }
        ballData.push({name: this.industryNames[i], year: (2011+j), yAxis: this.industries[i][j][this.yAxis], rank: this.industries[i][j].rank});
      }

      this.g.append("g").attr("class","history").append("polyline")
        .attr("fill","none")
        .attr("points", points)
        .attr("stroke-width", 1)
        .attr("stroke", function() { return that.cScale(that.industries[i][5].rank);});
    }

    this.g.selectAll("circle").data(ballData).enter().append("circle")
      .attr("class", "ball")
      .attr("cx", function(d) { return that.xScale((new Date(d.year,0,1)));})
      .attr("cy", function(d) { return that.yScale(d.yAxis); })
      .attr("r", function(d) { if(d.rank == -1){ return 0; } else { return 3; }})
      .attr("fill", function(d) { return that.cScale(d.rank); })
      .on('mouseover', function(d){
        div.transition().duration(200).style("opacity", .9); 
        div.html("<span style='color:red'>"+d.name+"</span> - Rank "+d.rank+"<br/>Year: " 
        +d.year+"<br/>"+that.change[that.yAxis]+" (B): "+d.yAxis)
        .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function(d){
        div.transition().duration(200).style("opacity", 0);  
        div.html("");
      });
  }
}