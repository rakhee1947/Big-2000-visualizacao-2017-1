class InfoList {
  constructor(id, w, h) {
    this.canvas = d3.select("#"+id)
    .attr("style", "width: " + (w-20) + "px; height: " + h + "px; overflow: auto;");

    this.id = id;
    this.w = w;
    this.h = h;

    this.dataset = [];
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
    var columnNames = ["Rank", "Company", "Country", "Sales", "Profits", "Assets", "Market Value"];
    var columns = ["rank", "name", "country", "sales", "profits", "assets", "market_value"];

    this.canvas.selectAll("table").remove();

    var table = this.canvas.append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    thead.append("tr").selectAll("th")
      .data(columnNames).enter().append("th")
      .text(function(d) { return d; });

    var tr = tbody.selectAll("tr")
      .data(this.dataset).enter().append("tr")
      .attr("class", "item");

    var td = tr.selectAll("td")
      .data(function(row) { return columns.map(function(column) { return {column: column, value: row[column]}; }); })
      .enter().append("td")
      .text(function(d) { return d.value; });
  }
}