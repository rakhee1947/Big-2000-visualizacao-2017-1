var width = window.innerWidth-100;
var height = window.innerHeight-50;

var disp = d3.dispatch("selection");
disp.on("selection", function () {
  if(this.caller === "map") {
    list.setData(this.data);
    pie.setData(this.filterName, this.data);
    scatterplot.setData(this.filterName, this.data);
    line.setData(this.filterName, this.data);
  } else if(this.caller === "pie") {
    list.setData(this.data);
    scatterplot.setData(this.filterName, this.data);
    line.setData(this.filterName, this.data);
  } else if(this.caller === "list") {
    scatterplot.setData(this.filterName, this.data);
    line.setData(this.filterName, this.data);
  }

  // LIST
  list.polishData();
  list.drawView();
  
  // PIE CHART
  pie.polishData();
  pie.drawView();
  
  // SCATTERPLOT
  scatterplot.polishData();
  scatterplot.drawView();
  
  // LINE CHART
  line.polishData();
  line.drawView();
});

var map = new WorldMap("map", width, height);
map.dispatch = disp;
var pie = new PieChart("pie", (3/10)*width, height/2);
pie.dispatch = disp;
var list = new InfoList("list", (7/10)*width, height/2);
list.dispatch = disp;
var scatterplot = new Scatterplot("scatter", (3/10)*width, height/2);
var line = new LineGraph("line", (6/10)*width, height/2);

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

  scatterplot.setData("Global", dataset);
  scatterplot.polishData();
  scatterplot.setXAxis("sales");
  scatterplot.setYAxis("profits");
  scatterplot.drawView();

  line.setData("Global",dataset);
  line.polishData();
  line.setYAxis("profits");
  line.drawView();

  // world map
  d3.json("https://rawgit.com/vsychen/Big-2000-visualizacao-2017-1/master/json/world-topo-min.json", function (d) {
    map.setMap(topojson.feature(d, d.objects.countries).features);
  });
});