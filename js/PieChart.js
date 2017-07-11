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
    this.r = (Math.min(w,h)/2) - 5;
    this.g = this.canvas.append("g")
      .attr("transform", "translate("+((w/2)+3)+","+((h/2)+25)+")");

    this.tooltipDiv = this.canvas.append("div").attr("class", "tooltip").style("opacity", 0);

    this.dataset = [];
    this.filter = [];

    this.filteredByYear = [];
    this.filteredByCountry = [];
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
    var i = this.filter.indexOf(country);
    if(i === -1) this.filter.push(country);
    else this.filter.splice(i,1);

    var that = this;
    this.filteredByCountry = this.dataset.filter(function(d) { if(that.filter.length === 0 || that.filter.indexOf(d.country) !== -1) return d; });
  }

  polishData() {
    var that = this;
    this.industries = [];
    var quantity = [];

    var join = this.dataset
      .filter(function(d) { return (that.filteredByYear.length > 0) ? that.filteredByYear.indexOf(d) !== -1 : d; })
      .filter(function(d) { return (that.filteredByCountry.length > 0) ? that.filteredByCountry.indexOf(d) !== -1 : d; });
    this.total = join.length;

    for(var i = 0; i < this.total; i++) {
      var a = this.industries.indexOf(join[i].industry);

      if(a == -1) {
        this.industries.push(join[i].industry);
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
    var quantity = this.filter.length;
    var sub = this.canvas.append("text")
      .attr("class", "title")
      .attr("transform", "translate("+((this.w/2)+3)+","+((this.h/15)+5)+")");

    if(quantity === 0) sub.text("Global");
    else if(quantity < 3) sub.text(this.filter);
    else if(quantity === 3) sub.text(this.filter[0]+","+this.filter[1]+" and 1 other country");
    else sub.text(this.filter[0]+","+this.filter[1]+" and "+(quantity-2)+" other countries");

    this.canvas.append("text")
      .attr("class", "total")
      .attr("transform", "translate("+((this.w/2)+3)+","+((this.h/15)+25)+")")
      .text(this.total + " total Companies");

    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var pie = d3.pie().sort(null).value(function(d) { return d.quantity; });
    var path = d3.arc().outerRadius(this.r - 30).innerRadius(0);
    var label = d3.arc().outerRadius(this.r - 80).innerRadius(this.r - 60);

    var tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) {
      return d.data.industry+"<br>Quantidade: <span style='color:red'>" + d.data.quantity + "</span>";
    });
    this.canvas.call(tip);

    if(this.industries.length == 0) {
      var tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) { return "No industries"; });
      this.canvas.call(tip);

      var arc = this.g.selectAll(".arc").data(pie([{industry: "-No Industries-", quantity: 1}])).enter().append("g").attr("class", "arc");
      arc.append("path").attr("d", path).attr("fill", function(d) { return color(d.data.industry); }).on('mouseover', tip.show).on('mouseout', tip.hide);
      arc.append("text").attr("class", "slice-text").text("0");
    } else {
      var arc = this.g.selectAll(".arc")
        .data(pie(this.industries)).enter().append("g")
        .attr("class", "arc");    
      var that = this;        

      arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.industry); })
        .on('mouseover', function(d){
          div.transition().duration(200).style("opacity", .9); 
          div.html(d.data.industry+"<br>Quantidade: <span style='color:red'>" + d.data.quantity + "</span>")
          .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', function(d) {
          div.transition().duration(200).style("opacity", 0);  
          div.html("");
        })
        .on('mousedown', function() { d3.event.preventDefault(); })
        .on('dblclick', function(d) {
          if(d3.select(this).style("stroke-width") != 2) {
            d3.select(this).style("stroke-width",2).style("stroke","white");
          } else {
            d3.select(this).style("stroke-width",1.).style("stroke","none");
          }
          div.transition().duration(200).style("opacity", 0);  
          div.html("");
          that.nextPhase(d, that);
        });

      arc.append("text")
        .attr("class", "slice-text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .text(function(d) { return d.data.quantity; });
    }
  }

  // AUXILIARY FUNCTIONS
  nextPhase(f, widget) {
    widget.dispatch.call("selection", {caller:widget.id, filter:f.data.industry});
  }
}