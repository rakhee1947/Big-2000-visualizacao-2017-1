class InfoList {
  constructor(id, w, h) {
    this.canvas = d3.select("#"+id)
      .attr("style", "width: " + (w-20) + "px; height: " + h + "px;");

    this.id = id;
    this.w = w-40;
    this.h = h;
    this.col = [{name:"Rank", width:this.w/15},
      {name:"Company", width:this.w*4/15},
      {name:"Country", width:this.w*3/15},
      {name:"Sales", width:this.w/15},
      {name:"Profits", width:this.w/15},
      {name:"Assets", width:this.w/15},
      {name:"Market Value", width:this.w/16}];

    this.table = this.canvas.append("table").attr("width", this.w);
    this.thead = this.table.append("thead").attr("id", "header");
    this.tbody = this.table.append("tbody");
    this.thead.append("tr").selectAll("th")
      .data(this.col).enter().append("th")
      .style("width", function(d) { return d.width+"px"; })
      .text(function(d) { return d.name; });

    this.dataset = [];
    this.filter = [];
  }
  
  setData(data) {
    this.dataset = data.filter(function(d) { if(d.year === 2016) return d; });
  }

  polishData() {
    this.companies = [];

    for(var i = 0; i < this.dataset.length; i++) {
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

  drawView() {
    this.tbody.selectAll(".item").remove();

    var columns = ["rank", "name", "country", "sales", "profits", "assets", "market_value"];
    var tr = this.tbody.selectAll("tr")
      .data(this.dataset).enter().append("tr")
      .attr("class", "item");
    tr.selectAll("td")
      .data(function(row) { return columns.map(function(column) { return {column:column, value:row[column]}; }); })
      .enter().append("td")
      .text(function(d) { return d.value; });
  }
}