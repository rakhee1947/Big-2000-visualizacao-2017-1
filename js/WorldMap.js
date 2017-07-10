class WorldMap {
  constructor(id, w, h) {
    var that = this;

    var zoom = d3.zoom()
      .scaleExtent([1,8])
      .translateExtent([[0, -100], [w-20, h + 100]])
      .on("zoom", zoomed)
      .filter(function () { return !event.button && event.type !== 'dblclick'; });

    this.canvas = d3.select("#"+id)
      .attr("class", "container")
      .attr("width", w-20)
      .attr("height", h)
      .call(zoom)
      .on("contextmenu", resetZoom);

    this.id = id;
    this.w = w;
    this.h = h;

    this.tooltipDiv = this.canvas.append("div").attr("class", "tooltip").style("opacity", 0);

    this.cScale = d3.scaleLinear()
      .range(["#ffa07a","#ffd700","#daa520"]);
    this.caption = d3.scaleLinear()
      .range(["#ffa07a","#ffd700","#daa520"])
      .domain([0,4,8]);

    this.projection = d3.geoMercator().translate([w/2,height/2]).scale(width / 2 / Math.PI);
    this.path = d3.geoPath().projection(this.projection);
    this.rawDataset = [];
    this.dataset = [];
    this.filter = [];

    function zoomed() {
      that.canvas.selectAll(".country").attr("transform", d3.event.transform);
    }

    function resetZoom() {
      d3.event.preventDefault();
      that.canvas.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }
  }

  nextPhase(f, widget) {
    if (widget.filter.indexOf(f.properties.name) === -1) widget.filter.push(f.properties.name);
    else widget.filter.splice(widget.filter.indexOf(f.properties.name), 1);

    widget.dispatch.call("selection", {caller:widget.id, filterName:(widget.filter.length > 0)?widget.filter:"Global", data:this.rawDataset.filter(function(d) { if (widget.filter.length === 0 || widget.filter.indexOf(d.country) !== -1) return d; })});
  }

  setData(data) {
    this.rawDataset = data;
    this.dataset = this.rawDataset.filter(function(d) { if(d.year === 2016) return d; });
  }

  calculateRank(val) {
    if(val < 10) {
      return 11;
    } else if(val < 20) {
      return 6;
    } else if(val < 50) {
      return 5;
    } else if(val < 100) {
      return 4;
    } else if(val < 200) {
      return 3;
    } else if(val < 500) {
      return 2;
    } else if(val < 1000) {
      return 2;
    } else {
      return 1;
    }
  }

  polishData() {
    this.countries = [];
    this.score = [];
    this.quantity = [];
    this.maxScore = 0;

    for(var i = 0; i < this.dataset.length; i++) {
      var a = this.countries.indexOf(this.dataset[i].country);
      var b = this.calculateRank(this.dataset[i].rank);

      if(a == -1) {
        this.countries.push(this.dataset[i].country);
        this.score.push(b);
        this.quantity.push(1);
        if(b > this.maxScore) { this.maxScore = b; }
      } else {
        this.score[a] += b;
        this.quantity[a] += 1;
        if(this.score[a] > this.maxScore) { this.maxScore = this.score[a]; }
      }
    }
  }

  setMap(data) {
    var maxS = Math.log(this.maxScore)/2
    this.cScale.domain([0,maxS,(maxS*2)]);

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var that = this;

    var country = this.canvas.selectAll(".country").data(data);
    country.enter()
      .insert("path")
      .attr("class", "country")
      .attr("d",that.path)
      .attr("id", function (d,i) { return d.properties.name; })
      .style("fill",function (d) {
        if(that.countries.indexOf(d.properties.name) == -1) {
          return "c9c9c9";
        } else {
          return that.cScale(Math.log(that.score[that.countries.indexOf(d.properties.name)]));
        }
      })
      .on('mouseover', function(d){
        div.transition().duration(200).style("opacity", .9); 
        var a = that.countries.indexOf(d.properties.name);
        if(a == -1) {
          div.html(d.properties.name+"<br/> Zero Empresas")
            .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
        } else {
          div.html(d.properties.name+"<br/>"+that.quantity[a]+" Empresas")
            .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
        }
      })
      .on('mouseout', function(d){
        div.transition().duration(200).style("opacity", 0);  
        div.html("");
      })
      .on("dblclick", function(d) { that.nextPhase(d, that); });

    this.canvas
      .append("rect")
      .attr("width", (this.w/10)+3)
      .attr("height", this.h/12)
      .attr("fill", "white")
      .attr("x", -4)
      .attr("y", (22.1/24)*this.h)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("stroke", "black")
      .attr("stroke-width", this.w/1000);

    for(var i = 0; i <= 8; i++) {
      if(i != 8) {
        this.canvas
          .append("rect")
          .attr("width", this.w/100)
          .attr("height", this.h/35)
          .attr("x", (((i+0.3)/100)*this.w))
          .attr("y", (23/24)*this.h)
          .attr("fill", this.caption(i));
      } else {
        this.canvas
          .append("rect")
          .attr("width", this.w/100)
          .attr("height", this.h/35)
          .attr("x", (((i+0.3)/100)*this.w))
          .attr("y", (23/24)*this.h)
          .attr("fill", this.caption(i));
      }
    }

    this.canvas
      .append("text")
      .attr("x", (0.3/100)*this.w)
      .attr("y", (22.8/24)*this.h)
      .attr("font-family", "Candara")
      .attr("font-weight", "bold")
      .attr("font-size", this.h/40)
      .text("Scale");
  }
}