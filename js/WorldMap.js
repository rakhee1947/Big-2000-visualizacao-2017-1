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
      .range(["lightsalmon","gold","goldenrod"]);
    this.dScale = d3.scaleLinear()
      .range(["lightsalmon","gold","goldenrod"])
	  .domain([0,4,8]);
	  
    this.projection = d3.geoMercator().translate([w/2,height/2]).scale(width / 2 / Math.PI);
    this.path = d3.geoPath().projection(this.projection);
		
    var that = this;
    function zoomed(){
      that.canvas.selectAll(".country").attr("transform",d3.event.transform);
    }
  }

  setMap(data){
    var that = this;
	var maxS = Math.log(that.maxScore)/2
    this.cScale.domain([0,maxS,(maxS*2)]);

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
          return that.cScale(Math.log(that.score[that.countries.indexOf(d.properties.name)]));
        }
      })
      //.style("fill",function(d){return that.cScale(d.rank);})
      .on("mouseover",function(d,i){that.tooltip.classed("hidden", false).attr("style", "x:"+d3.mouse(this)[0]+"px;y:"+d3.mouse(this)[1]+"px;").html(d.properties.name);})
      .on("mouseout",function(d){that.tooltip.classed("hidden", true);});

	this.canvas.append("rect").attr("fill","white").attr("x",-4).attr("y",(22.1/24)*this.h).attr("width", this.w/10).attr("height", this.h/12)
	.attr("stroke","black").attr("stroke-width",this.w/1000).attr("rx", 6).attr("ry",6);
	
	for (var i = 0; i <= 8; i++){
		if(i != 8){
			this.canvas.append("rect").attr("x",(((i+0.3)/100)*this.w)).attr("y",(23/24)*this.h)
			.attr("width",this.w/100).attr("height",this.h/35).attr("fill",this.dScale(i));
		}else{
			this.canvas.append("rect").attr("x",(((i+0.3)/100)*this.w)).attr("y",(23/24)*this.h)
			.attr("width",this.w/100).attr("height",this.h/35).attr("fill",this.dScale(i));
		}
	}
	
	this.canvas.append("text").attr("x", (0.3/100)*this.w).attr("y",(22.8/24)*this.h)
	.attr("font-family","Candara").attr("font-weight","bold").attr("font-size",this.h/40).text("Scale");
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
  }
}