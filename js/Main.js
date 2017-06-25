var width = window.innerWidth-100;
var height = window.innerHeight-50;
var filePath = "../json/";

var map = new WorldMap("map", width, height-50);
var list = new InfoList("list", width, (height/2)-50);
var pie = new PieGraph("pieGraph", ((width/3)-(width/50)), height/2);
var scatterplot = new Scatterplot("scatterplot", ((width/3)-(width/50)), height/2);
var line = new LineGraph("lineGraph", ((width/3)-(width/50)), height/2);

var dataset = getData(filePath);

d3.json("../json/forbes2016.json", function(d){
  map.setData(d.customers)
})
d3.json("../json/world-topo-min.json", function(d){
  map.setMap(topojson.feature(d,d.objects.countries).features);
})

pie.setData("../test/pieTest.csv");
list.setData("../test/listTest.csv")
scatterplot.setData("../test/scatterplotTest.csv");
line.setData("../test/lineTest.csv");

//map.setData(dataset);
//pie.setData(dataset);
//list.setData(dataset);
//scatterplot.setData(dataset);
//line.setData(dataset);

var disp = d3.dispatch("countrySelected");
disp.on("countrySelected", function(){
  if(this.caller === "map"){
    pie.setData(this.data);
    list.setData(this.data);
    scatterplot.setData(this.data);
    line.setData(this.data);
  }
});

function getData(filePath){
  return [];
}