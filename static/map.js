// helper fxn

var cleanStreetName = function (street){
  var newStreet = street.split(" ");
  var ret = "";
  for(i = 0; i < newStreet.length; i++){
    word = newStreet[i].charAt(0).toUpperCase() + newStreet[i].slice(1).toLowerCase();
    ret += word + " ";
  }
  return ret;
};

var determineColor = function (row){
  if (row["BOROUGH"] == "QUEENS") {
    return "green";
  } else if (row["BOROUGH"] == "BROOKLYN"){
    return "blue";
  } else if (row["BOROUGH"] == "MANHATTAN"){
    return "red";
  } else if (row["BOROUGH"] == "BRONX"){
    return "yellow";
  }else {
    return "purple";
  }
};


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

/*
DATE,TIME,BOROUGH,ZIP CODE,LATITUDE,LONGITUDE,LOCATION,ON STREET NAME,CROSS STREET NAME,OFF STREET NAME,NUMBER OF PERSONS INJURED,NUMBER OF PERSONS KILLED,
NUMBER OF PEDESTRIANS INJURED,NUMBER OF PEDESTRIANS KILLED,NUMBER OF CYCLIST INJURED,NUMBER OF CYCLIST KILLED,NUMBER OF MOTORIST INJURED,NUMBER OF MOTORIST KILLED,
CONTRIBUTING FACTOR VEHICLE 1,CONTRIBUTING FACTOR VEHICLE 2,CONTRIBUTING FACTOR VEHICLE 3,CONTRIBUTING FACTOR VEHICLE 4,CONTRIBUTING FACTOR VEHICLE 5,
UNIQUE KEY,VEHICLE TYPE CODE 1,VEHICLE TYPE CODE 2,VEHICLE TYPE CODE 3,VEHICLE TYPE CODE 4,VEHICLE TYPE CODE 5
*/

// init div of tooltip
// init div informing user of load time
var div = d3.select("body").append("div")
      .attr("class", "info_box")
      .html("<b>HOLD ON THIS MIGHT TAKE A WHILE<br>LOADING 93000+ ROWS OF DATA!!!</b>")



// load data of motor vehicle accidents onto map
var accidents = [];
d3.csv("../static/newdata.csv").then(function(data){
        for (i=0; i < data.length;i++) {
          accidents.push(data[i])
        };
        console.log(accidents);
        div.style("opacity", 0);
        var circles = svg.selectAll("circle")
            .data(accidents)
            .enter()
          .append("circle")
            .attr("r", "1px") //
            .attr("fill", function(d){ // each accident is loaded as d
              return determineColor(d);
            })
            .attr("cx", function(d){
              return albersProjection([d["LONGITUDE"], d["LATITUDE"]])[0];
            })
            .attr("cy", function(d){
              return albersProjection([d["LONGITUDE"], d["LATITUDE"]])[1];
            })
            .on("mouseover", function(d){
              div.transition()
                .duration(200)
                .style("opacity", .9);
              var injuries = (parseInt(d["NUMBER OF PERSONS INJURED"]) +
                                       parseInt(d["NUMBER OF PEDESTRIANS INJURED"]) +
                                       parseInt(d["NUMBER OF CYCLIST INJURED"]) +
                                       parseInt(d["NUMBER OF MOTORIST INJURED"])
                             ).toString();
              var deaths = (parseInt(d["NUMBER OF PERSONS INJURED"]) +
                            parseInt(d["NUMBER OF PEDESTRIANS INJURED"]) +
                            parseInt(d["NUMBER OF CYCLIST INJURED"]) +
                            parseInt(d["NUMBER OF MOTORIST INJURED"])
                          ).toString();

              var borough = d["BOROUGH"].charAt(0).toUpperCase() + d["BOROUGH"].slice(1).toLowerCase();

              div.html(`<b>Borough:</b> ${borough} <br>
                        ${cleanStreetName(d["ON STREET NAME"])}& ${cleanStreetName(d["CROSS STREET NAME"])} <br>
                        <b>Injuries: </b>${injuries} <br> <b>Deaths: </b>${deaths} <br>
                        <b>Contributing Factor: </b>${d["CONTRIBUTING FACTOR VEHICLE 1"]}
                       `
                      )
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d){
              div.transition()
                .duration(500)
                .style("opacity", 0);
            });

});
