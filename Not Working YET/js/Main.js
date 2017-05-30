var width = window.innerWidth-30;
var height = window.innerHeight-70;
var filePath = "";

var map = new WorldMap("map", width, height/3);
var list = new InfoList("list", width, height/3);
var pie = new PieGraph("pieGraph", (width/3)-10, height/3);
var scatterplot = new Scatterplot("scatterplot", (width/3)-10, height/3);
var line = new LineGraph("lineGraph", (width/3)-10, height/3);
console.log(1233125);
var dataset = getData(filePath);
d3.json("world-topo-min.json", function(d){
	console.log(d[0]);
	map.setData(d);
})
//map.setData(dataset);
list.setData(dataset);
pie.setData(dataset);
scatterplot.setData(dataset);
line.setData(dataset);

var disp = d3.dispatch("countrySelected");
disp.on("countrySelected", function(){
	if(this.caller === "map"){
		list.setData(this.data);
		pie.setData(this.data);
		scatterplot.setData(this.data);
		line.setData(this.data);
	}
});

function getData(filePath){
	return [];
}