# WHAMo
SoftDev2  P#04
### by Johnny Wong, Hasif Ahmed, Matthew Ming, and Addison Huang

## Description
New York City is one of the busiest cities, if not the busiest city, in the world. But, with busyness comes a sense of rushing which can affect safety. When it comes to vehicles, rushing is something to generally avoid. Therefore, it would be helpful to have a general idea of which places throughout the city may be safer than others. 
The dataset we selected is the NYPD Motor Vehicle Collisions dataset. This dataset contains a breakdown of every collision in NYC by location and injury. The location factor is broken down by city, borough, precinct, and cross street. The data is collected monthly and the purpose of it is to inform the general public of which intersections may be safer than others. 
### The data set we will be using is:
- [NYPD Motor Vehicle Collisions](https://data.cityofnewyork.us/Public-Safety/NYPD-Motor-Vehicle-Collisions/h9gi-nx95?fbclid=IwAR1oCtMJ3B-d1bDWUMtCx0rau8BirVrvp1gHvMB2ZKpuilWwAzpQbXVy0rs)

## The Plan to Make The Data Come Alive
We plan to make our data come alive by displaying our data through interactive graphs and charts that constantly update with different batches of data. Each data point will display the exact location of the car crash in NYC. Additionally, the user can possibly select certain data points to compare and to generate specific graphs to show the differences and similarities between data.

Our visualization will show correlations between vehicle type, time of day, place of accident, and cause of accident. However, it will be unable to show any correlation with any qualitative data of the driver like race and age as well as the affiliated car company. This has the benefit of removing bias from the dataset.

The user can interact with the data by using widgets such as sliders and radio buttons. Additionally, they can select data points and compare the selected data in new graphs to better visualize the data.

Our visualization will allow the user to explore questions such as “What frequency do drivers in the evening crash their car” or “What borough has the most car crashes?” It will provoke questions such as “What was the condition of the car at that time?” and “Does the person involved in the car crash have a criminal history?”

## D3 Utilization
Transitions will be needed when changing the x-axis of the bar graphs. It will be needed because users will be dragging a row label onto the x-axis. Transitions allow the image of dragging the row label to be smooth and not instantaneous. Furthermore, a transition will be needed when a user zooms into the map of car accidents and when the user moves the map. This is to increase fluidity and make the user experience more streamlined.

When plotting points of where car crashes occurred in NYC, enter will be necessary to place the points on the map. Enter and exit will also be needed when changing the label of the bar graphs.

On our bubble map, users will be able to zoom in and out of the map and pan to their heart’s content. They will be able to hover over a bubble on the map and find out the latitude and the longitude of the crash.

We are going to have a bubble map that is similar to the one in gallery. Instead of using a map of the USA, we are going to use a map of all 5 boroughs of NYC and the bubbles will represent where car crashes occurred. We will also have hierarchical bars so users will be able to see information such as which borough had the most car accidents.

## Envisioned Visualization
![](doc/visual.png)
