
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
var playcountChart = dc.bubbleChart("#playcount-bubble-chart");

var TOP_ARTIST_COUNT = 20;

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


	var songsByYear = yearDimension.group();
	var songsByTheme = themeDimension.group();
	var songsByArtist = artistDimension.group();
	
	// group by artist; values from	playcount
	var playcountDimensionGroup = artistDimension.group().reduce(
		function(p,v){
			++p.count;
			p.playcountSum += v.playcount;
			p.playcountAvg = p.playcountSum / p.count;
			return p;
		},
		function(p,v){
			--p.count;
			p.playcountSum -= v.playcount;
			p.playcountAvg = p.playcountSum / p.count;
			return p;
		},
		function(p,v){
			return {count:0, playcountSum: 0, playcountAvg: 0};
		}
	);


	//workaround to limitaton of dc.js
	function getNTop(sourceGroup, n) {
	    return {
	        all: function () {
	            return sourceGroup.top(Infinity)
	                .slice(0, n);
	        }
	    };
	}

	var topArtists = getNTop(songsByArtist, TOP_ARTIST_COUNT);

	/*
	 * Obtain chart parameters
	 *
	 */


	var yearOrigin = yearDimension.bottom(1)[0]["year"];
	var yearEnd = yearDimension.top(1)[0]["year"];

	var playcountDomain = d3.max(playcountDimensionGroup.all(), function(d) { return d.value.playcountAvg; }) + 1;
	var playcountSumDomain = d3.max(playcountDimensionGroup.all(), function(d) { return d.value.playcountSum; }) + 1;
	millionFormatter = d3.format(".2s");
	
	/*
	 * Configure charts
	 *
	 */


	yearlyChart
		.width(818)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(yearDimension)
		.group(songsByYear)
		.transitionDuration(500)
		.x(d3.time.scale().domain([yearOrigin, yearEnd]))
		.brushOn(true)
        .renderTitle(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)

	yearlyChart
    	.xAxisLabel("Year")
		.xAxis().tickFormat(d3.format("4d"));
	
	yearlyChart
		.elasticY(true)
		.yAxisLabel("Number of Songs")	
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
		.height(500)
        .dimension(artistDimension)
        .group(topArtists)

    artistChart.xAxis().ticks(5);

	playcountChart
			.width(818)
			.height(500)
			.margins({top: 10, right: 30, bottom: 30, left: 50})
			.dimension(artistDimension)
			.group(playcountDimensionGroup)
			.transitionDuration(1500)
			.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
			.colorDomain([-12000, 12000])
			.keyAccessor(function (p) {	return p.value.playcountAvg; }) //x 
			.x(d3.scale.sqrt().domain([0,playcountDomain]))
			.valueAccessor(function (p) {return p.value.playcountSum;}) //y
			.y(d3.scale.sqrt().domain([0,playcountSumDomain]))
			.radiusValueAccessor(function (p) {return p.value.count/10;}) //r
			.r(d3.scale.linear().domain([0,25]))
			.title(function (p) {

                    return [
                           p.value.count + " songs in this list",
                           millionFormatter(p.value.playcountSum) + " total plays",
                           millionFormatter(Math.floor(p.value.playcountAvg))+ " average plays per song",
                           ]
                           .join("\n");
                })
            .renderTitle(true)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true);
        

	playcountChart
			.yAxisPadding(1)
			.elasticY(false) //needed for log scales
			.yAxisLabel("Total Plays")
			.yAxis().tickFormat(function(d) { return millionFormatter(d)});

	playcountChart
			.xAxisPadding(1)
			.elasticX(true)
			.xAxisLabel("Average Plays per Song")
			.xAxis().tickFormat(function(d) { return millionFormatter(d)});
					

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
	        function(s) { return d3.format(",")(s.playcount)+" plays" ; },
	        function(s) { return d3.format(",")(s.listeners)+" listeners"; }
	        
	    ])
	 //    .sortBy(function (d) {
  //   		return [d.playcount,d.year].join();
		// });
		.order(d3.descending)
		     .sortBy(function (d) {
		           return +d.playcount;
		});
	    // .sortBy(function(s){ return parseInt(s.playcount);})
	    // .order(d3.ascending);


    dc.renderAll();

} //end visualize
