class InfoList {
  constructor(id, w, h){
    this.canvas = d3.select("#"+id)
      .attr("class", "container")
      .attr("width",w-20)
      .attr("height",h)
      .attr("transform","translate(0,0)");
    this.id = id;
    this.w = w;
    this.h = h;
  }
  
  setData(data){

  }
}