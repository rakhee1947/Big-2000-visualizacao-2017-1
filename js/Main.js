var width = window.innerWidth-100;
var height = window.innerHeight-50;
var filePath = "";

var map = new WorldMap("map", width, height-50);
var list = new InfoList("list", width, (height/2)-50);
var pie = new PieGraph("pieGraph", ((width/3)-(width/50)), height/2);
var scatterplot = new Scatterplot("scatterplot", ((width/3)-(width/50)), height/2);
var line = new LineGraph("lineGraph", ((width/3)-(width/50)), height/2);

var dataset = getData(filePath);

d3.json("world-topo-min.json", function(d){
	map.setData(topojson.feature(d,d.objects.countries).features);
})

pie.setData("pieTest.csv");
line.setData("lineTest.csv");

//map.setData(dataset);
//pie.setData(dataset);
list.setData(dataset);
scatterplot.setData(dataset);
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