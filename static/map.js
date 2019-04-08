

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

// init loading warning and var to be used as tooltip
var tooltip = svg.append("g")
      .style("fill", "black")
      .style("font-size", "22px");
    tooltip.append("text")
      .attr("x", 20)
      .attr("y", 30)
      .text("LOADING DATA...");

var info = document.createElement("div");
info.classList.add("info");
document.body.appendChild(info);

// load data of motor vehicle accidents onto map
var accidents = [];
d3.csv("../static/newdata.csv").then(function(data){
    for (i=0; i < 10000;i++) {
        accidents.push(data[i]) // load data set
    };
    console.log(accidents);
    // remove loading tip
    tooltip.remove();
    var circles = svg.selectAll("circle")
        .data(accidents)
        .enter()
        .append("circle")
        .attr("class", function(d){
            if (d["BOROUGH"] != "STATEN ISLAND"){
		            return d["BOROUGH"].charAt(0).toUpperCase() + d["BOROUGH"].slice(1).toLowerCase();
            } else {
		            return "FakeBorough";
            }
          })
        .attr("r", "2.5px")
        .attr("cx", function(d){
            return albersProjection([d["LONGITUDE"], d["LATITUDE"]])[0];
        })
        .attr("cy", function(d){
            return albersProjection([d["LONGITUDE"], d["LATITUDE"]])[1];
        })
        .on("mouseover", function(d){
            // init vars
            var street = `${cleanStreetName(d["ON STREET NAME"])}& ${cleanStreetName(d["CROSS STREET NAME"])}`
            var injuries = (parseInt(d["NUMBER OF PERSONS INJURED"]) +
                            parseInt(d["NUMBER OF PEDESTRIANS INJURED"]) +
                            parseInt(d["NUMBER OF CYCLIST INJURED"]) +
                            parseInt(d["NUMBER OF MOTORIST INJURED"])
                           ).toString();
            var deaths = (parseInt(d["NUMBER OF PERSONS KILLED"]) +
                          parseInt(d["NUMBER OF PEDESTRIANS KILLED"]) +
                          parseInt(d["NUMBER OF CYCLIST KILLED"]) +
                          parseInt(d["NUMBER OF MOTORIST KILLED"])
                         ).toString();

            var borough = d["BOROUGH"].charAt(0).toUpperCase() + d["BOROUGH"].slice(1).toLowerCase();
            //  write out tooltip
            tooltip = svg.append("g")
              .style("fill", "black")
              .style("font-size", "22px");
            tooltip.append("text")
              .attr("x", 20)
              .attr("y", 30)
              .text(`Borough: ${borough}`);
            tooltip.append("text")
              .attr("x", 20)
              .attr("y", 55)
              .text(street);
            tooltip.append("text")
              .attr("x", 20)
              .attr("y", 80)
              .text(`Injuries: ${injuries}`);
            tooltip.append("text")
              .attr("x", 20)
              .attr("y", 105)
              .text(`Deaths: ${deaths}`);
            tooltip.append("text")
              .attr("x", 20)
              .attr("y", 130)
              .text(`Contributing Factor: ${d["CONTRIBUTING FACTOR VEHICLE 1"]}`)

        })
        .on("mouseout", function(d){
            tooltip.remove();
	      })
	      .on("click", function(d){
      	    var injuries = (parseInt(d["NUMBER OF PERSONS INJURED"]) +
                            parseInt(d["NUMBER OF PEDESTRIANS INJURED"]) +
                            parseInt(d["NUMBER OF CYCLIST INJURED"]) +
                            parseInt(d["NUMBER OF MOTORIST INJURED"])
                           ).toString();
            var deaths = (parseInt(d["NUMBER OF PERSONS KILLED"]) +
                          parseInt(d["NUMBER OF PEDESTRIANS KILLED"]) +
                          parseInt(d["NUMBER OF CYCLIST KILLED"]) +
                          parseInt(d["NUMBER OF MOTORIST KILLED"])
                         ).toString();
            var borough = d["BOROUGH"].charAt(0).toUpperCase() + d["BOROUGH"].slice(1).toLowerCase();
      	    var factor = d["CONTRIBUTING FACTOR VEHICLE 1"]
      	    var street = d["ON STREET NAME"] + " & " + d["CROSS STREET NAME"]
      	    var html = "<table> <tr> <td> Borough </td> <td> Street </td> <td> Injuries </td> <td>  Deaths </td> <td> Contributing Factor </td> </tr> <tr> <td>" +
      		              borough + "</td> <td>" +street + "</td> <td>" + injuries + "</td> <td>" + deaths + "</td> <td>" + factor + "</td> </tr> </table> <br>" ;
      	    var newDiv = document.createElement("div");
            newDiv.innerHTML = html;
            console.log(newDiv);
      	    console.log("done");
	          document.body.appendChild(newDiv);
	});

});
