
//goals: visualize the green eggs data
// resize it
var margin = {top: 20, right: 20, bottom:20, left:20};
var width = 1060 - margin.right - margin.left;
var height = 1060 - margin.top-margin.bottom;
var radius = width/2;
var i = 0;

var svg  = d3.select("#main")
	.append("svg")
	.attr("viewBox", [0,0,width + margin.right+margin.left,height+margin.top+margin.bottom])
	.call(d3.zoom().scaleExtent([1, 4]).on("zoom", function(){
		div.style("opacity", 0);
		svg.attr("transform", d3.event.transform)
	}))
	.append("g");

var logScale = d3.scaleLog()
	.domain([1, 70])
	.range([2, 19]);

var div = d3.select("#main").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

var data = d3.json("./greeneggs.json").then(function(data){
	var tree = d3.tree()
		.size([2*Math.PI, radius])
		.separation((a,b) => (logScale(a.value) > logScale(b.value) ? 1.2*logScale(a.value) :1.2*logScale(b.value) )/a.depth) /*a.parent == b.parent ? logScale(b.value) : logScale(b.value))/a.depth)*/;
	
	var data = d3.hierarchy(data)
		.sort((a,b) => d3.ascending(a.data.name, b.data.name));

	const root = tree(data);

	//links
	svg.append("g")
   		.attr("fill", "none")
   		.attr("stroke", "#555")
   		.attr("stroke-opacity", 0.4)
   		.attr("stroke-width", 1.5)
   		.attr("transform", "translate(" + (width / 2 + 0) + "," + (height / 2 + 0) + ")")
   		.selectAll("path")
   			.data(root.links())
   			.join("path")
   			.attr("d", d3.linkRadial()
				.angle(d => { return d.x})
				.radius(d => d.y));
  	
  	//nodes
  	

    //text
	svg.append("g")
		.attr("transform", "translate(" + (width / 2 + 0) + "," + (height / 2 + 0) + ")")
		.attr("font-family", "sans-serif")
		.attr("font-size", 8)
		.attr("stroke-linejoin", "round")
		.selectAll("text")
			.data(root.descendants())
			.join("text")
				.attr("transform", d => `
				rotate(${d.x * 180 / Math.PI - 90}) 
				translate(${d.y},0) 
				rotate(${d.x >= Math.PI ? 180 : 0})
				`)
				.attr("dy", "0.31em")
				.attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
			.attr("text-anchor",d => d.x < Math.PI === !d.children ? "start" : "end")
			.text(d => d.data.name)
			.clone(true).lower()
				.attr("stroke", "white")
				.attr("stroke-width", "0.3px");


  	svg.append("g")
   		.attr("transform", "translate(" + (width / 2 + 0) + "," + (height / 2 + 0) + ")")
   		.attr("pointer-events","all")
   		.selectAll("circle")
   		.data(root.descendants())
   		.join("circle")
   			.attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y },0)
      `)
      .attr("fill", d => d.children ? "lightblue" : "mediumblue")
      .attr("r", d => logScale(d.value) /*> 30 ? 30 : d.value < 3 ? 2 : d.value*/)
      .style("opacity", ".7")
      .style("z-index", 10);
     svg.selectAll("circle")
     .on('mouseenter', mouseover)
      .on('mouseout', mouseleave);
});


var mouseover = function(d) {
	console.log("enter");
	// div.transition()
 //      		.duration(200)
 //      		.style("opacity", 0.9);
  	div.style("opacity", 1);
  	div.html("<p style='text-transform:capitalize'>Word: "+(d.data.name)+"</p><p> Ocurrences: "+ d.data.value +"</p>")
  		.style("position", "absolute")
  		.style("left", (d3.event.pageX -5)+"px")
  		.style("top", (d3.event.pageY -15)+"px");
}
var mousemove = function(d) {
	console.log("move");
	div.html("<p style='text-transform:capitalize'>Word: "+(d.data.name)+"</p><p> Ocurrences: "+ d.data.value +"</p>")
  		.style("position", "absolute")
  		.style("left", (d3.event.pageX -5)+"px")
  		.style("top", (d3.event.pageY -15)+"px");
}
var mouseleave = function(d){
	console.log("leve");
	div.style("opacity", 0);
	
}






