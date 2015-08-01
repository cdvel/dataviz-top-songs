/*
 * Loading data, and wait all to 
 * start processing the visualization
 */

queue()
	.defer(d3.json, "/top-songs/api/v1.0/songs")
	.await(visualize);

function visualize(error, data){
	var top_songs = data["songs"];


	/*
	 * Compute dimensions and groups
	 *
	 */


	xfilter = crossfilter(top_songs);
	var year_dimension =  xfilter.dimension(function (song){
		return song["year"];
	});
	var artist_dimension =  xfilter.dimension(function (song){
		return song["artist"];
	});	
	
	var theme_dimension =  xfilter.dimension(function (song){

		return song["theme"].replace(" and ", " & ");

	});	


	var song_count_by_year = year_dimension.group();
	var song_count_by_theme = theme_dimension.group();
	var song_count_by_artist = artist_dimension.group();

	//workaround to limitaton of dc.js
	function fake_top(source_group, n) {
	    return {
	        all: function () {
	            return source_group.top(Infinity)
	                .slice(0, n);
	        }
	    };
	}

	var song_count_by_artist_top_five = fake_top(song_count_by_artist, 5);

	/*
	 * Obtain charts parameters
	 *
	 */


	var year_origin = year_dimension.bottom(1)[0]["year"];
	var year_end = year_dimension.top(1)[0]["year"];


	/*
	 * Create and configure charts
	 *
	 */


	var yearly_chart = dc.barChart("#yearly-bar-chart");
	var themes_chart = dc.pieChart("#themes-pie-chart");
	var artist_chart = dc.rowChart("#artist-row-chart");

	yearly_chart
		.width(818)
		.height(240)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(year_dimension)
		.group(song_count_by_year)
		.transitionDuration(500)
		.x(d3.time.scale().domain([year_origin, year_end]))
		.brushOn(false)
		.xAxisLabel("Year")
		.xAxis().tickFormat(d3.format("4d"));
	
	yearly_chart
		.elasticY(true)
		.yAxis()
		.ticks(6)
		.tickFormat(d3.format("d"))
		.tickSubdivide(0);

	themes_chart
		.width(300)
		.height(300)
		.dimension(theme_dimension)
		.group(song_count_by_theme)
		.transitionDuration(500)
		.innerRadius(60)

	artist_chart
		.width(393)
		.height(240)
        .dimension(artist_dimension)
        .group(song_count_by_artist_top_five)
        .xAxis().ticks(5);

    dc.renderAll();


} //end visualize
