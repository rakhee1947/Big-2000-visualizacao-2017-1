var width = window.innerWidth-100;
var height = window.innerHeight-50;

var disp = d3.dispatch("countrySelected");
disp.on("countrySelected", function() {
  if(this.caller === "map") {
    list.attData(this.data_list);
    pie.attData(this.data_pie);
    scatterplot.attData(this.data_scatter);
    line.attData(this.data_line);
  }
});

var map = new WorldMap("map", width, height-50);
var list = new InfoList("list", width, (height/2)-50);
var pie = new PieChart("pie", ((width/3)-(width/50)), height/2);
var scatterplot = new Scatterplot("scatter", ((width/3)-(width/50)), height/2);
var line = new LineGraph("line", ((width/3)-(width/50)), height/2);

// datasets
d3.json("https://raw.githubusercontent.com/vsychen/Big-2000-visualizacao-2017-1/master/json/forbes.json", function(d) {
  var dataset = d.companies;
  console.log(dataset);

  map.setData(dataset);
  //list.setData(dataset);
  //pie.setData(dataset);
  //scatterplot.setData(dataset);
  //line.setData(dataset);

  // world map
  d3.json("https://rawgit.com/vsychen/Big-2000-visualizacao-2017-1/master/json/world-topo-min.json", function(d){
    map.setMap(topojson.feature(d,d.objects.countries).features);
  });
});