class LineGraph {
  constructor(id, w, h){
    this.canvas = d3.select("#"+id)
      .attr("class","container")
      .attr("width",w)
      .attr("height",h);
	  
    this.id = id;
	this.w = w - 50;
    this.h = h - 75;
    this.g = this.canvas.append("g")
      .attr("transform", "translate(34,40)");

	this.xScale = d3.scaleTime().domain([new Date(2011,0,1), new Date(2016,0,1)]).range([0, this.w]);
	this.yScale = d3.scaleLinear().range([this.h, 0]);
	this.cScale = d3.scaleLinear().range(["#000", "#00f"]);

	this.dataset = [];
    this.filter = [];
}
  
  setFilter(filter) {
    var i = -1;

    if ((i = this.filter.indexOf(filter)) === -1) {
      this.filter.push(filter);
    } else {
      this.filter.splice(i, 1);
	}
  }
 
  setData(data) {
	this.dataset = data;
  }
 
  filterData(data) {
    if(this.filter === "") return true;
    else if(this.filter.indexOf(data) !== -1) return true;
    else return false;
  }
  
  polishData() {
	this.industryNames = [];
    this.industries = [];

    for(var i = 0; i < this.dataset.length; i++) {
      if(this.filter.length === 0 || this.filter.indexOf(this.dataset[i].country) !== -1) {
        var a = this.industryNames.indexOf(this.dataset[i].name);
        
		if(a == -1) {
			var newL = [null,null,null,null,null,null];
			newL[(this.dataset[i].year)-2011] = this.dataset[i];
			this.industries.push(newL);
			this.industryNames.push(this.dataset[i].name);
        } else {
			this.industries[a][(this.dataset[i].year)-2011] = this.dataset[i];
        }
		
		//d3.extent(a, function(a){return d.b;});
		
      }
    }

	for(var i = 0; i < this.industries.length; i++){
		for(var j = 0; j < this.industries[i].length; j++){
			if(this.industries[i][j] == null){
				var dummy = {name: this.industryNames[i], profits: 0, sales: 0, market_value: 0, assets: 0, year: (2011+j), rank: 2001};
				this.industries[i][j] = dummy;
			}
		}
	}	
  }
  
  setYAxis(y){
    this.y = y;
    this.yScale.domain(d3.extent(this.dataset, function(d) { return d[y]; }));
  }
 
  drawView() {
    this.canvas.select(".title").remove();
    this.g.selectAll(".axis").remove();
	this.g.selectAll(".history").remove();
  
    this.canvas.append("text")
      .attr("class", "title")
      .attr("transform", "translate(" + ((this.w/2)+23) + "," + ((this.h/15)+5) + ")")
      .text((this.filter.length > 0) ? this.filter : "Global");

	this.g.append("g")
		.attr("transform","translate(0," + this.h + ")")
		.attr("class", "axis")
		.call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat("%Y")));
	
	this.g.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(this.yScale));
	
	var that = this;
  
    var line = d3.line()
      .x(function(d) { debugger;return xScale(new Date(d.year,0,1)); })
      .y(function(d) { return that.yScale(d[that.y]); });
	  
	  
	this.cScale.domain([2000,1])
	for(var i = 0; i < this.industries.length; i++){
		var points = "";
		for (var j = 0; j < 6; j++){
			if(j == 0){
				points = this.xScale(new Date(2011+j,0,1))+","+this.yScale(this.industries[i][j][this.y]);
			}else{
				points += " " + this.xScale(new Date(2011+j,0,1))+","+this.yScale(this.industries[i][j][this.y]);
			}

		}
		this.g.append("g").attr("class","history").attr("fill", "none").append("polyline").attr("points", points).attr("stroke", function(){ return that.cScale(that.industries[i][5].rank);});
	}
	
    this.g.append("g").attr("transform","translate(0," + this.h + ")")
      .call(d3.axisBottom(this.xScale).ticks(5)).append("text")
      .attr("fill","#000").attr("y",+24).attr("x",((this.w)/2)).text("YEAR");

    this.g.append("g").call(d3.axisLeft(this.yScale)).append("text").attr("fill", "#000")
      .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em")
      .attr("text-anchor", "end").text(this.y.toUpperCase() + "(B)");
	
	//this.canvas.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));
	//this.canvas.append("g").call(d3.axisLeft(this.yScale));
	
  }
}