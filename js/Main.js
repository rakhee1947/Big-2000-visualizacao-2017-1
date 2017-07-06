var width = window.innerWidth-100;
var height = window.innerHeight-50;

var disp = d3.dispatch("countrySelected");
disp.on("countrySelected", function () {
  if (this.caller === "map") {
    list.setFilter(this.filter_list);
    pie.setFilter(this.filter_pie);
    scatterplot.setFilter(this.filter_scatter);
    line.setFilter(this.filter_line);

    list.drawView();
    pie.drawView();
    scatterplot.drawView();
    line.drawView();
  }
});

var map = new WorldMap("map", width, height);
var list = new InfoList("list", width, height/2);
var pie = new PieChart("pie", (width/3)-(width/50), height/2);
var scatterplot = new Scatterplot("scatter", (width/3)-(width/50), height/2);
var line = new LineGraph("line", (width/3)-(width/50), height/2);

// datasets
d3.json("https://raw.githubusercontent.com/vsychen/Big-2000-visualizacao-2017-1/master/json/forbes.json", function (d) {
  var dataset = d.companies;

  map.setData(dataset);
  list.setData(dataset);
  pie.setData(dataset);
  scatterplot.setData(dataset);
  line.setData(dataset);

  map.polishData();
  //list.drawView();
  pie.polishData();
  //scatterplot.drawView();
  //line.drawView();

  pie.drawView();
  // world map
  d3.json("https://rawgit.com/vsychen/Big-2000-visualizacao-2017-1/master/json/world-topo-min.json", function (d) {
    map.setMap(topojson.feature(d, d.objects.countries).features);
  });
});