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
    this.r = Math.min(w,h)/2;
    this.g = this.canvas.append("g")
      .attr("transform", "translate(" + ((w/2)+3) + "," + ((h/2)+20) + ")");

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
    this.industries = [];
    var quantity = [];

    for(var i = 0; i < this.dataset.length; i++) {
      if(this.filter.length === 0 || this.filter.indexOf(this.dataset[i].country) !== -1) {
        var a = this.industries.indexOf(this.dataset[i].industry);

        if(a == -1) {
          this.industries.push(this.dataset[i].industry);
          quantity.push(1);
        } else {
          quantity[a] += 1;
        }
      }
    }

    this.total = this.industries.length;

    for(var i = 0; i < this.total; i++) {
      if(this.industries[i] === "") this.industries[i] = "-No Industry Specified-";
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
      .text(function(d) { return d.data.quantity; });
  }
}