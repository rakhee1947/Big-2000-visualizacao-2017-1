var width = window.innerWidth-30;
var height = window.innerHeight-70;
var filePath = "";

var map = new WorldMap("map", (14/19)*width, (3/9)*height);
var pie = new PieGraph("pieGraph", (2/9)*width, (3/9)*height);
var list = new InfoList("list", width, (2/9)*height);
var scatterplot = new Scatterplot("scatterplot", (width/3)+100, (2/9)*height);
var line = new LineGraph("lineGraph", (width/3)+100, (2/9)*height);

var dataset = getData(filePath);

d3.json("world-topo-min.json", function(d){
	map.setData(topojson.feature(d,d.objects.countries).features);
})

pie.setData("pieTest.csv");

//map.setData(dataset);
//pie.setData(dataset);
list.setData(dataset);
scatterplot.setData(dataset);
line.setData(dataset);

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