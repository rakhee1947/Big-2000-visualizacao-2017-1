class InfoList {
  constructor(id, w, h){
    this.canvas = d3.select("#"+id)
    .attr("style", "width: " + (w-20) + "px; height: " + h + "px; overflow: auto;");

    this.id = id;
    this.w = w;
    this.h = h;

    this.dataset = [];
    this.filter = [];
    this.companies = [];
  }
  
  setData(data){
    this.dataset = [];

    for(var i = 0; i < data.length; i++) {
      if(data[i].year === 2016) {
        this.dataset.push(data[i]);
      }
    }
  }

  setFilter(filter) {
    var i = -1;

    if((i = this.filter.indexOf(filter)) === -1) {
      this.filter.push(filter);
    } else {
      this.filter.splice(i, 1);
    }
  }

  polishData() {
    this.companies = [];

    for(var i = 0; i < this.dataset.length; i++) {
      if(this.filter.length === 0 || this.filter.indexOf(this.dataset[i].country) !== -1) {
        var company = {
          rank: this.dataset[i].rank,
          name: this.dataset[i].name,
          country: this.dataset[i].country,
          sales: this.dataset[i].sales,
          profits: this.dataset[i].profits,
          assets: this.dataset[i].assets,
          market_value: this.dataset[i].market_value
        }

        this.companies.push(company);
      }
    }
  }

  drawView() {
    var columnNames = ["Rank", "Company", "Country", "Sales", "Profits", "Assets", "Market Value"];
    var columns = ["rank", "name", "country", "sales", "profits", "assets", "market_value"];

    this.canvas.selectAll("table").remove();

    var table = this.canvas.append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    thead.append("tr")
    .selectAll("th")
    .data(columnNames)
    .enter()
    .append("th")
    .text(function(d) { return d });

    var tr = tbody.selectAll("tr")
    .data(this.dataset)
    .enter()
    .append("tr")
    .attr("class", "item");

    var td = tr.selectAll("td")
    .data(function (row) { return columns.map(function(column) {return {column: column, value: row[column]}}); })
    .enter()
    .append("td")
    .text(function(d) { return d.value });


    // this.canvas.select(".title").remove();
    // this.g.selectAll(".ball").remove();

    // this.canvas.append("text")
    // .attr("class", "title")
    // .attr("transform", "translate(" + ((this.w/2)+3) + "," + ((this.h/15)+5) + ")")
    // .text((this.filter.length > 0) ? this.filter : "Global");

    // var that = this;
    // this.rScale.domain(d3.extent(this.companies, function(d) { return d.rank; }));
    // this.cScale.domain([2000,1])

    // this.g.selectAll("circle").data(this.companies).enter().append("circle")
    // .attr("class", "ball")
    // .attr("cx", function(d) { return that.xScale(d[that.x]);})
    // .attr("cy", function(d) { return that.yScale(d[that.y]); })
    // .attr("r", function(d) { return that.rScale(d.rank); })
    // .attr("fill", function(d) { return that.cScale(d.rank); });

    // this.g.append("g").attr("transform","translate(0," + this.h + ")")
    // .call(d3.axisBottom(this.xScale).ticks(5)).append("text")
    // .attr("fill","#000").attr("y",-6).attr("x",this.w-4).text(this.x.toUpperCase());

    // this.g.append("g").call(d3.axisLeft(this.yScale)).append("text").attr("fill", "#000")
    // .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em")
    // .attr("text-anchor", "end").text(this.y.toUpperCase());
  }
}