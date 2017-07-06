class PieChart {
  constructor(id, w, h) {
    this.canvas = d3.select("#"+id)
      .attr("class", "container")
      .attr("width",w)
      .attr("height",h)
      .attr("x",0);

    this.id = id;
    this.w = w;
    this.h = h;
    this.r = Math.min(w,h)/2;
    this.g = this.canvas.append("g")
      .attr("transform", "translate(" + ((w/2)+3) + "," + ((h/2)+5) + ")");

    this.dataset = [];
    this.filter = "";
  }

  setFilter(filter) {
    this.filter = filter;
  }

  setData(data) {
    this.dataset = data;
  }

  polishData() {
    this.industries = [];
    this.total = 0;
    var quantity = [];

    for(var i = 0; i < this.dataset.length; i++) {
      if(this.filter === "" || this.filter === this.dataset[i].country) {
        var a = this.industries.indexOf(this.dataset[i].industry);
        this.total += 1;

        if(a == -1) {
          this.industries.push(this.dataset[i].industry);
          quantity.push(1);
        } else {
          quantity[a] += 1;
        }
      }
    }

    for(var i = 0; i < this.industries.length; i++) {
      if (this.industries[i] === "") this.industries[i] = "-No Industry Specified-";
      this.industries[i] = { industry:this.industries[i], quantity:quantity[i] };
    }
  }
  
  drawView() {
    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var pie = d3.pie().sort(null).value(function(d) { return d.quantity; });
    var path = d3.arc().outerRadius(this.r - 30).innerRadius(0);
    var label = d3.arc().outerRadius(this.r - 80).innerRadius(this.r - 60);

    var tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) {
      return d.data.industry+"<br>Quantidade: <span style='color:red'>" + d.data.quantity + "</span>";
    });
    this.canvas.call(tip);

    var arc = this.g.selectAll(".arc")
      .data(pie(this.industries)).enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.industry); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .style("font-size", this.total/1700)
      .style("font-family","Verdana")
      .style("font-weight","Bold")
      .style("fill", "#ffffff")
      .style("cursor", "default")
      .style("pointer-events", "none")
      .text(function(d) { return d.data.quantity; });
  }
}