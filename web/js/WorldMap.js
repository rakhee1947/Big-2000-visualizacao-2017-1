class WorldMap {
	constructor(id, w, h){
		var zoom = d3.zoom()
			.scaleExtent([1,8])
			.translateExtent([[-100, -100], [width + 90, height + 100]])
			.on("zoom",zoomed);
		this.canvas = d3.select("#"+id)
			.attr("class", "container")
			.attr("width",w-20)
			.attr("height",h)
			.attr("transform","translate(0,60)")
			.call(zoom);
		this.id = id;
		this.w = w;
		this.h = h;

		this.tooltip = this.canvas
			.append("div")
			.attr("class", "tooltip hidden");

		this.cScale = d3.scaleLinear()
			.range(["#0f0", "#00f"]);
			
		this.projection = d3.geoMercator().translate([w/2,height/2]).scale(width / 2 / Math.PI);
		this.path = d3.geoPath().projection(this.projection);

		var that = this;
		function zoomed(){
			that.canvas.selectAll(".country").attr("transform",d3.event.transform);
		}
	}

	setMap(data){
		var that = this;
				
		this.cScale.domain([0,that.maxScore]);

		var country = this.canvas.selectAll(".country").data(data);
		country.enter()
			.insert("path")
			.attr("class", "country")
			.attr("d",that.path)
			.attr("id", function(d,i){return d.properties.name;})
			.style("fill",function(d){
				if(that.countries.indexOf(d.properties.name) == -1){
					return "grey";
				}else{
					return that.cScale(that.score[that.countries.indexOf(d.properties.name)]);
				}
			})
			//.style("fill",function(d){return that.cScale(d.rank);})
			.on("mouseover",function(d,i){that.tooltip.classed("hidden", false).attr("style", "x:"+d3.mouse(this)[0]+"px;y:"+d3.mouse(this)[1]+"px;").html(d.properties.name);})
			.on("mouseout",function(d){that.tooltip.classed("hidden", true);});
			
	}
	
	rankCalc(val) {
		if(val < 10){ 
			return 11;
		}else if(val < 20){ 
			return 6;
		}else if(val < 50){ 
			return 5;
		}else if(val < 100){ 
			return 4;
		}else if(val < 200){ 
			return 3;
		}else if(val < 500){ 
			return 2;
		}else if(val < 1000){ 
			return 2;
		}else{ 
			return 1;
		}
	}
	
	setData(data){
		var that = this;
		this.countries = [];
		this.score = [];
		this.maxScore = 0;
		for (var i = 0; i < data.length; i++){
			var a = this.countries.indexOf(data[i].country);
			var b = this.rankCalc(data[i].rank)
			if(a == -1){ 
				this.countries.push(data[i].country); 
				this.score.push(b)
				if(b > this.maxScore){ this.maxScore = b }
			}else{ 
				this.score[a] += b; 
				if(this.score[a] > this.maxScore){ this.maxScore = this.score[a]}
			}				
		}
		console.log(this.countries)
		console.log(this.score)
	}

}