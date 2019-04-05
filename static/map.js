// Our D3 code will go here.
      var width = 900;
      var height = 780;

      // Create SVG
      var svg = d3.select( "body" )
      .append( "svg" )
      .attr( "width", width )
      .attr( "height", height );

      // Append empty placeholder g element to the SVG
      // g will contain geometry elements
      var g = svg.append( "g" );

      var albersProjection = d3.geoAlbers()
      .scale( 100000 )
      .rotate( [74.0060,0] )
      .center( [0, 40.7128] )
      .translate( [width/2,height/2] );

      var geoPath = d3.geoPath()
      .projection( albersProjection );
      
      g.selectAll( "path" )
      .data( neighborhoods_json.features )
      .enter()
      .append( "path" )
      .attr( "fill", "#ccc" )
      .attr( "stroke", "#333")
      .attr( "d", geoPath );
      
      
      d3.csv("../static/newdata.csv").then(function(data){
      for (i=0; i < 1000;i++) {
      var long = data[i]["LONGITUDE"];
      var lat = data[i]["LATITUDE"];
      var array = [long,lat];
      var g = svg.append("g");
      g.selectAll("circle")
      .data(array)
      .enter()
      .append("circle")
      .attr("r","1px")
      .attr("fill","red")
      .attr("cx", albersProjection(array)[0])
      .attr("cy", albersProjection(array)[1]);   
		    }
		    }
      );

      d3.csv("../static/newdata.csv").then(function(data){
      var array = [];
      for (i= 0; i < 10; i++) {
		     array.push([data[i]["LONGITUDE"],data[i]["LATITUDE"]]);
		     }
		     console.log(array);
		     
		     var p = svg.append("g");
		     p.selectAll("path")
		     .data(array)
		     .append("path")
		     .attr("fill","#900")
		     .attr("stroke","#999")
		     .attr("d",d3.geoPath().projection(array));
		     console.log("hi");
		     }
		     
		     		     
      );
