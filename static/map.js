

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
var dead = function(a,b){
d3.csv("../static/newdata.csv").then(function(data){
var accidents = [];
	 for (i=a; i < b;i++) {
        accidents.push(data[i]) // load data set
    };
	d3.selectAll("circle").remove();
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

})};
//Sliders
	var dict ={
	"Jan":0,
	"Feb":0,
	"Mar":0,
	"Apr":0,
	"May":0,
	"Jun":0,
	"Jul":0,
	"Aug":0,
	"Sep":0,
	"Oct":0,
	"Nov":0,
	"Dec":0
	};
d3.csv("../static/newdata.csv").then(function(data) {
    for (var i = 0; i < data.length; i++) {
		time=parseInt(data[i].DATE[0]+data[i].DATE[1]);
		if(time==1){
        dict["Jan"]++;
		}
		if(time==2){
        dict["Feb"]++;
		}
		if(time==3){
        dict["Mar"]++;
		}
		if(time==4){
        dict["Apr"]++;
		}
		if(time==5){
        dict["May"]++;
		}
		if(time==6){
        dict["Jun"]++;
		}
		if(time==7){
        dict["Jul"]++;
		}
		if(time==8){
        dict["Aug"]++;
		}
		if(time==9){
        dict["Sep"]++;
		}
		if(time==10){
        dict["Oct"]++;
		}
		if(time==11){
        dict["Nov"]++;
		}
		if(time==12){
        dict["Dec"]++;
		}
    }
});
  var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  // Time
  var dataTime = d3.range(0, 12).map(function(d) {
    return new Date(2018, d, 3);
  });

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 31)
    .width(300)
    .tickFormat(d3.timeFormat('%b'))
    .tickValues(dataTime)
    .default(new Date(2018, 0, 3))
    .on('onchange', val => {
      //d3.select('p#value-time').text(d3.timeFormat('%b')(val));
	  //d3.select('p#text-time').text(dict[d3.timeFormat('%b')(val)]);
total=0;
	  for(i=0;i<d3.timeFormat('%m')(val);i++){
			total+=dict[months[i]];
};
	end=total;
console.log(end);
total=0;
	if(d3.timeFormat('%m')(val)==0){
		dead(1,end);
	}
	else{
		for(i=0;i<d3.timeFormat('%m')(val)-1;i++){
			total+=dict[months[i]];
		}
console.log(total);
	dead(total,end);
	}
	//d3.select('p#text-time').text(total);
    });

  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  d3.select('p#value-time').text(d3.timeFormat('%b')(sliderTime.value()));
