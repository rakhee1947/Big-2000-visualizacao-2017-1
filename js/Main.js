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
    list.setData(this.data);
    pie.setData(this.filterName, this.data);
    scatter.setData(this.filterName, this.data);
    line.setData(this.filterName, this.data);
  } else if(this.caller === "pie") {
    list.setData(this.data);
    scatter.setData(this.filterName, this.data);
    line.setData(this.filterName, this.data);
  } else if(this.caller === "list") {
    scatter.setData(this.filterName, this.data);
    line.setData(this.filterName, this.data);
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
var scatter = new Scatterplot("scatter", (3/10)*width, height/2);
var line = new LineGraph("line", (6/10)*width, height/2);

map.dispatch = disp;
pie.dispatch = disp;
list.dispatch = disp;

map.year = year;
pie.year = year;
list.year = year;
scatter.year = year;

list.rank = list_rank;

scatter.xAxis = scatter_x_axis;
scatter.yAxis = scatter_y_axis;

line.yAxis = line_y_axis;

// datasets
d3.json("https://raw.githubusercontent.com/vsychen/Big-2000-visualizacao-2017-1/master/json/forbes.json", function (d) {
  var dataset = d.companies;

  map.setData(dataset);
  map.polishData();

  list.setData(dataset);
  list.polishData();
  list.drawView();

  pie.setData("Global", dataset);
  pie.polishData();
  pie.drawView();

  scatter.setData("Global", dataset);
  scatter.polishData();
  scatter.drawView();

  line.setData("Global",dataset);
  line.polishData();
  line.drawView();

  // world map
  d3.json("https://rawgit.com/vsychen/Big-2000-visualizacao-2017-1/master/json/world-topo-min.json", function (d) {
    map.setMap(topojson.feature(d, d.objects.countries).features);
  });
});