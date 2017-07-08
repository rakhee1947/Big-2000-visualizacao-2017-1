class Scatterplot {
  constructor(id, w, h) {
    this.canvas = d3.select("#"+id)
      .attr("class", "container")
      .attr("width", w)
      .attr("height", h);

    this.id = id;
    this.w = w - 40;
    this.h = h - 70;
    this.g = this.canvas.append("g")
      .attr("transform", "translate(20,40)");
    
    this.xScale = d3.scaleLinear().rangeRound([0, this.w]);
    this.yScale = d3.scaleLinear().range([this.h, 0]);
    this.rScale = d3.scaleLinear().range([1,5]);
    this.cScale = d3.scaleLinear().range(["#000", "#f00"]);

    this.dataset = [];
    this.filter = [];
  }

  setFilter(filter) {
    var i = -1;

    if((i = this.filter.indexOf(filter)) === -1) {
      this.filter.push(filter);
    } else {
      this.filter.splice(i, 1);
    }
  }

  setData(data) {
    this.dataset = [];

    for(var i = 0; i < data.length; i++) {
      if(data[i].year === 2016) {
        this.dataset.push(data[i]);
      }
    }
  }

  polishData() {
    this.companies = [];

    for(var i = 0; i < this.dataset.length; i++) {
      if(this.filter.length === 0 || this.filter.indexOf(this.dataset[i].country) !== -1) {
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
  }
  
  setXAxis(x) {
	this.x = x;
    this.xScale.domain(d3.extent(this.dataset, function(d) { return d[x]; }));
  }
  
  setYAxis(y) {
	this.y = y;
    this.yScale.domain(d3.extent(this.dataset, function(d) { return d[y]; }));
  }
  
  drawView() {
    this.canvas.select(".title").remove();
    this.g.selectAll(".ball").remove();
	
	this.canvas.append("text")
		.attr("class", "title")
		.attr("transform", "translate(" + ((this.w/2)+3) + "," + ((this.h/15)+5) + ")")
		.text((this.filter.length > 0) ? this.filter : "Global");

	var that = this;
	this.rScale.domain(d3.extent(this.dataset, function(d) { return d.rank; }));

	this.g.selectAll("circle").data(this.dataset).enter().append("circle")
		.attr("class", "ball")
		.attr("cx", function(d) { return that.xScale([this.x]); })
		.attr("cy", function(d) { return that.yScale([this.y]); })
		.attr("r", function(d) { return that.rScale(d.rank); })
		.attr("fill", function(d) { return that.cScale(d.rank); });

	this.g.append("g").attr("transform","translate(0," + this.h + ")")
		.call(d3.axisBottom(this.xScale).ticks(5)).append("text")
		.attr("fill","#000").attr("y",-6).attr("x",this.w-4).text(this.x.toUpperCase());

	this.g.append("g").call(d3.axisLeft(this.yScale)).append("text").attr("fill", "#000")
		.attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em")
		.attr("text-anchor", "end").text(this.y.toUpperCase());
/*
    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var pie = d3.pie().sort(null).value(function(d) { return d.quantity; });
    var path = d3.arc().outerRadius(this.r - 30).innerRadius(0);
    var label = d3.arc().outerRadius(this.r - 80).innerRadius(this.r - 60);

    var tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) {
      return d.data.industry+"<br>Quantidade: <span style='color:red'>" + d.data.quantity + "</span>";
    });
    this.canvas.call(tip);

    this.canvas.select(".title").remove();
    this.g.selectAll(".arc").remove();
    this.g.selectAll("text").remove();

    var arc = this.g.selectAll(".arc")
      .data(pie(this.industries)).enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.industry); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    this.canvas.append("text")
      .attr("class", "title")
      .attr("transform", "translate(" + ((this.w/2)+3) + "," + ((this.h/15)+5) + ")")
      .text((this.filter.length > 0) ? this.filter : "Global");

    arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .text(function(d) { return d.data.quantity; });*/
  }
}