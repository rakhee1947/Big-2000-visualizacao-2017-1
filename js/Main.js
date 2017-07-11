var width = window.innerWidth-100;
var height = window.innerHeight-50;

var year = 2016;
var list_rank = "rank";
var scatter_x_axis = "market_value";
var scatter_y_axis = "assets";
var line_y_axis = "profits";

var disp = d3.dispatch("selection");
disp.on("selection", function () {
  if(this.caller === "map") {
    pie.applyFilterCountry(this.filter);
    list.applyFilterCountry(this.filter);
    scatter.applyFilterCountry(this.filter);
    line.applyFilterCountry(this.filter);
  } else if(this.caller === "pie") {
    list.applyFilterIndustry(this.filter);
    scatter.applyFilterIndustry(this.filter);
    line.applyFilterIndustry(this.filter);
  } else if(this.caller === "list") {
    scatter.applyFilterCompany(this.filter);
    line.applyFilterCompany(this.filter);
  }

  // LIST
  list.polishData();
  list.drawView();

  // PIE CHART
  pie.polishData();
  pie.drawView();

  // SCATTERPLOT
  scatter.polishData();
  scatter.drawView();

  // LINE CHART
  line.polishData();
  line.drawView();
});

var map = new WorldMap("map", width, height);
var pie = new PieChart("pie", (3/10)*width, height/2);
var list = new InfoList("list", (7/10)*width, height/2);
var scatter = new Scatterplot("scatter", (3/10)*width, (height/2)+80);
var line = new LineGraph("line", (6/10)*width, (height/2)+80);

map.dispatch = disp;
pie.dispatch = disp;
list.dispatch = disp;

map.year = pie.year = list.year = scatter.year = year;
list.rank = list_rank;
scatter.xAxis = scatter_x_axis;
scatter.yAxis = scatter_y_axis;
line.yAxis = line_y_axis;

// datasets
d3.json("https://raw.githubusercontent.com/vsychen/Big-2000-visualizacao-2017-1/master/json/forbes.json", function(d) {
  var dataset = d.companies;

  map.setData(dataset);
  map.applyFilterYear(year);
  map.polishData();

  pie.setData(dataset);
  pie.applyFilterYear(year);
  pie.polishData();
  pie.drawView();

  list.setData(dataset);
  list.applyFilterYear(year);
  list.polishData();
  list.drawView();

  scatter.setData(dataset);
  scatter.applyFilterYear(year);
  scatter.polishData();
  scatter.drawView();

  line.setData(dataset);
  line.polishData();
  line.drawView();

  // world map
  d3.json("https://rawgit.com/vsychen/Big-2000-visualizacao-2017-1/master/json/world-topo-min.json", function(d) {
    map.setMap(topojson.feature(d, d.objects.countries).features);
  });
});

function setYear(year) {
  map.applyFilterYear(year);
  pie.applyFilterYear(year);
  list.applyFilterYear(year);
  scatter.applyFilterYear(year);

  map.polishData();
  pie.polishData();
  list.polishData();
  scatter.polishData();

  map.drawView();
  pie.drawView();
  list.drawView();
  scatter.drawView();
}

function setScatterXAxis(xAxis) {
  scatter.xAxis = xAxis;
  scatter.polishData();
  scatter.drawView();
}

function setScatterYAxis(yAxis) {
  scatter.yAxis = yAxis;
  scatter.polishData();
  scatter.drawView();
}

function setLineYAxis(yAxis) {
  line.yAxis = yAxis;
  line.polishData();
  line.drawView();
}