
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
var songsDataTable =  dc.dataTable("#songs-data-table");

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

	var titleDimension =  xfilter.dimension(function (song){
		return song["title"];
	});	

	var playcountDimension =  xfilter.dimension(function (song){
		return song["playcount"];
	});	

	var listenersDimension =  xfilter.dimension(function (song){
		return song["listeners"];
	});

	var lastUpdateDimension =  xfilter.dimension(function (song){
		return song["lastUpdate"];
	});



	var songsByYear = yearDimension.group();
	var songsByTheme = themeDimension.group();
	var songsByArtist = artistDimension.group();
	var songsPlayCount = artistDimension.group();
	var songsListeners = artistDimension.group();



	//workaround to limitaton of dc.js
	function fakeTop(sourceGroup, n) {
	    return {
	        all: function () {
	            return sourceGroup.top(Infinity)
	                .slice(0, n);
	        }
	    };
	}

	var songsByArtistTopFive = fakeTop(songsByArtist, 5);

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
		.group(songsByYear)
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
		.group(songsByTheme)
		.transitionDuration(500)
		.innerRadius(60)

	artistChart
		.width(393)
		.height(240)
        .dimension(artistDimension)
        .group(songsByArtistTopFive)
        .xAxis().ticks(5);


    songsDataTable
	    .dimension(titleDimension)
	    .group(function(d) {
	    	return Math.floor(d.year/10)*10+"s";
    	})
	    .size(50) //records to display
	    .columns([
	        function(s) { return s.year; },
	        function(s) { 
	        	if (s.url != "")
	        		return '<a href=\"'+ s.url +'\" target=\"_blank\">'+s.title+'</a>';
	        	else
	        		return s.title;
	        },
	        function(s) { return s.artist; },
	        function(s) { return s.theme; },
	        function(s) { return d3.format(",")(s.playcount)+" plays  /  "+d3.format(",")(s.listeners)+" listeners"; }
	        
	    ])
	    .sortBy(function(s){ return s.artist; })
	    .order(d3.ascending);

    dc.renderAll();

} //end visualize
