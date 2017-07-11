class PieChart {
  constructor(id, w, h) {
    this.canvas = d3.select("#"+id)
      .attr("class", "container")
      .attr("width", w)
      .attr("height", h)
      .attr("x", 0);

    this.id = id;
    this.w = w;
    this.h = h;
    this.r = Math.min(w,h)/2 - 5;
    this.g = this.canvas.append("g")
      .attr("transform", "translate(" + ((w/2)+3) + "," + ((h/2)+25) + ")");

	this.tooltipDiv = this.canvas.append("div").attr("class", "tooltip").style("opacity", 0);

    this.dataset = [];
    this.filter = [];
  }

  setData(filterName, data) {
    this.filterName = filterName;
    this.dataset = data.filter(function(d) { if(d.year === 2016) return d; });
  }

  polishData() {
    this.industries = [];
    var quantity = [];

    for(var i = 0; i < this.dataset.length; i++) {
      var a = this.industries.indexOf(this.dataset[i].industry);

      if(a == -1) {
        this.industries.push(this.dataset[i].industry);
        quantity.push(1);
      } else {
        quantity[a] += 1;
      }
    }

    for(var i = 0; i < this.industries.length; i++) {
      if(this.industries[i] === "") this.industries[i] = "-No Industry Specified-";
      this.industries[i] = { industry:this.industries[i], quantity:quantity[i] };
    }
  }
  
  drawView() {
    this.canvas.select(".title").remove();
	this.canvas.select(".total").remove();
    this.g.selectAll(".arc").remove();
    this.g.selectAll(".slice-text").remove();
	
	var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
	
	if(this.filterName.length > 2 && this.filterName != "Global"){
	   var quantity = this.filterName.length;
	   var countryAdd = "country";
	   if((quantity-2) > 1){ countryAdd = "countries"; }
       this.canvas.append("text")
      .attr("class", "title")
      .attr("transform", "translate(" + ((this.w/2)+3) + "," + ((this.h/15)+5) + ")")
      .text(this.filterName[0]+","+this.filterName[1]+" and "+(quantity-2)+" "+countryAdd);
	}else{
		this.canvas.append("text")
      .attr("class", "title")
      .attr("transform", "translate(" + ((this.w/2)+3) + "," + ((this.h/15)+5) + ")")
      .text(this.filterName);
	}

	this.canvas.append("text")
      .attr("class", "total")
      .attr("transform", "translate(" + ((this.w/2)+3) + "," + ((this.h/15)+25) + ")")
      .text(this.dataset.length + " total Companies");
	  
    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var pie = d3.pie().sort(null).value(function(d) { return d.quantity; });
    var path = d3.arc().outerRadius(this.r - 30).innerRadius(0);
    var label = d3.arc().outerRadius(this.r - 80).innerRadius(this.r - 60);

    var tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) {
      return d.data.industry+"<br>Quantidade: <span style='color:red'>" + d.data.quantity + "</span>";
    });
    this.canvas.call(tip);
	
	if(this.industries.length == 0){
		
		var tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) {
		return "No industries";});
		this.canvas.call(tip);
		
		console.log(this.industries);
		var arc = this.g.selectAll(".arc").data(pie([{industry: "-No Industries-", quantity: 1}])).enter().append("g").attr("class", "arc");
		arc.append("path").attr("d", path).attr("fill", function(d) { return color(d.data.industry); }).on('mouseover', tip.show).on('mouseout', tip.hide);
		arc.append("text").attr("class", "slice-text").text("0");
		
	}else{

		var arc = this.g.selectAll(".arc")
		  .data(pie(this.industries)).enter().append("g")
		  .attr("class", "arc");		  

		arc.append("path")
		  .attr("d", path)
		  .attr("fill", function(d) { return color(d.data.industry); })
		  .on('mouseover', function(d){
		   
			div.transition().duration(200).style("opacity", .9); 
			div.html(d.data.industry+"<br>Quantidade: <span style='color:red'>" + d.data.quantity + "</span>")
			.style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
		  })
		  .on('mouseout', function(d){
			div.transition().duration(200).style("opacity", 0);  
			div.html("");
		  })
		  .on('dblclick', function(d){
			div.transition().duration(200).style("opacity", 0);  
			div.html("");
		  });

		arc.append("text")
		  .attr("class", "slice-text")
		  .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		  .text(function(d) { return d.data.quantity; });
	}
  }
}