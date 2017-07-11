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
      {name:"Sales (B)", width:this.w/13},
      {name:"Profits (B)", width:this.w/13},
      {name:"Assets (B)", width:this.w/13},
      {name:"Market Value (B)", width:this.w/13}];

    this.table = this.canvas.append("table").attr("width", this.w);
    this.thead = this.table.append("thead").attr("id", "header");
    this.tbody = this.table.append("tbody");
    this.thead.append("tr").selectAll("th")
      .data(this.col).enter().append("th")
      .style("width", function(d) { return d.width+"px"; })
      .text(function(d) { return d.name; });

    this.dataset = [];
    this.filterCountry = [];
    this.filterIndustry = [];

    this.filteredByYear = [];
    this.filteredByCountry = [];
    this.filteredByIndustry = [];
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
    var i = this.filterCountry.indexOf(country);
    if(i === -1) this.filterCountry.push(country);
    else this.filterCountry.splice(i,1);

    var that = this;
    this.filteredByCountry = this.dataset.filter(function(d) { if(that.filterCountry.length === 0 || that.filterCountry.indexOf(d.country) !== -1) return d; });
  }

  applyFilterIndustry(industry) {
    var i = this.filterIndustry.indexOf(industry);
    if(i === -1) this.filterIndustry.push(industry);
    else this.filterIndustry.splice(i,1);

    var that = this;
    this.filteredByIndustry = this.dataset.filter(function(d) { if(that.filterIndustry.length === 0 || that.filterIndustry.indexOf(d.industry) !== -1) return d; });
  }

  polishData() {
    var that = this;
    this.companies = [];
    this.join = this.filteredByYear.filter(function(d) { return (that.filteredByCountry.length > 0) ? that.filteredByCountry.indexOf(d) !== -1 : d; }).filter(function(d) { return (that.filteredByIndustry.length > 0) ? that.filteredByIndustry.indexOf(d) !== -1 : d; });
  }

  drawView() {
    this.tbody.selectAll(".item").remove();

    var columns = ["rank", "name", "country", "sales", "profits", "assets", "market_value"];
    var tr = this.tbody.selectAll("tr")
      .data(this.join).enter().append("tr")
      .attr("class", "item");
    tr.selectAll("td")
      .data(function(row) { return columns.map(function(column) { return {column:column, value:row[column]}; }); })
      .enter().append("td")
      .text(function(d) { return d.value; });
  }
}