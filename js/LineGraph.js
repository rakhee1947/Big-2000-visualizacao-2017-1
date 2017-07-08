class LineGraph {
  constructor(id, w, h){
    this.canvas = d3.select("#"+id)
      .attr("class","container")
      .attr("width",w)
      .attr("height",h);
	  
    this.id = id;
	this.w = w;
    this.h = h;
	
	this.dataset = [];
    this.filter = [];
	this.yAxis = "Profits";
	this.yScale = d3.scaleLinear().range([(this.h), 0]);
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
    this.yScale.domain(d3.extent(this.companies, function(d) { return d[y]; }));
  }
 
  drawView() {
	var xScale = d3.scaleLinear().range([0, (this.w)]).domain([2011,2016]);
	this.yScale = this.setYAxis();
	var that = this;
  
    var line = d3.line()
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return that.yScale(d[that.y]); });
	  
	for(var i = 0; i < this.industries.length; i++){
		this.canvas.append("path").data(this.industries[i]).attr("stroke","black").attr("stroke-width",3).attr("d", line);
	}
	
	//this.canvas.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));
	//this.canvas.append("g").call(d3.axisLeft(this.yScale));
	
  }
}