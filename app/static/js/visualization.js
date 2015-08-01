
/*
 * Loading data, and wait all to 
 * start processing the visualization
 */
queue()
	.defer(d3.json, "/top-songs/api/v1.0/songs")
	.await(visualize);

/*
 * Build charts from dc
 */

var yearlyChart = dc.barChart("#yearly-bar-chart");
var themesChart = dc.pieChart("#themes-pie-chart");
var artistChart = dc.rowChart("#artist-row-chart");

function visualize(error, data){
	var topSongs = data["songs"];

	/*
	 * Compute dimensions and groups
	 *
	 */


	xfilter = crossfilter(topSongs);
	var yearDimension =  xfilter.dimension(function (song){
		return song["year"];
	});
	var artistDimension =  xfilter.dimension(function (song){
		return song["artist"];
	});	
	
	var themeDimension =  xfilter.dimension(function (song){

		return song["theme"].replace(" and ", " & ");

	});	


	var songCountByYear = yearDimension.group();
	var songCountByTheme = themeDimension.group();
	var songCountByArtist = artistDimension.group();

	//workaround to limitaton of dc.js
	function fakeTop(sourceGroup, n) {
	    return {
	        all: function () {
	            return sourceGroup.top(Infinity)
	                .slice(0, n);
	        }
	    };
	}

	var songCountByArtistTopFive = fakeTop(songCountByArtist, 5);

	/*
	 * Obtain charts parameters
	 *
	 */


	var yearOrigin = yearDimension.bottom(1)[0]["year"];
	var yearEnd = yearDimension.top(1)[0]["year"];


	/*
	 * Configure charts
	 *
	 */


	yearlyChart
		.width(818)
		.height(260)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(yearDimension)
		.group(songCountByYear)
		.transitionDuration(500)
		.x(d3.time.scale().domain([yearOrigin, yearEnd]))
		.brushOn(false)
		.xAxisLabel("Year")
		.xAxis().tickFormat(d3.format("4d"));
	
	yearlyChart
		.elasticY(true)
		.yAxis()
		.ticks(6)
		.tickFormat(d3.format("d"))
		.tickSubdivide(0);

	themesChart
		.width(300)
		.height(300)
		.dimension(themeDimension)
		.group(songCountByTheme)
		.transitionDuration(500)
		.innerRadius(60)

	artistChart
		.width(393)
		.height(240)
        .dimension(artistDimension)
        .group(songCountByArtistTopFive)
        .xAxis().ticks(5);

    dc.renderAll();

    console.log(yearlyChart);

} //end visualize
