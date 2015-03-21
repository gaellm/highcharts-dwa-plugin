/**
 * Dynamic Weighted Average plugin
 *
 * Add a weighted average graph on the chart, dynamically calculated following displayed series.
 *
 * @author      Gaël Le Moëllic <gael.lm@gmail.com>
 * @version     Release: 1.2.1
 * @highcharts  Version 4.0.4
 */
;
// This is a self executing function
// The global variable Highcharts is passed along with a reference H
(function (H) {
    
	//Add function to Chart prototype
	H.wrap(H.Chart.prototype, 'DynamicWeightedAverage', function () {

		var chartSeries = this.series,
			existingDwaSerie = this.get('dwa'),
			dwaDefaultOptions = {
				'name' : 'Dynamic Weighted Average',
				'visibleAtFirst' : true,
				'round' : 3,
				'valueVariableName' : 's',
				'weightVariableName' : 'n',
				'averageFactor': 100,
				'commentLabel' : 'weighted average'
			},
			dwaOptions = H.extend(dwaDefaultOptions, this.options.wgaOptions),
			dwaSerie = {
				'id' : 'dwa',
				'name' : dwaOptions.name,
				'data' : [],
				'visible': dwaOptions.visibleAtFirst
			};

	   /**
 		* Calculate weighted average point
 		*
 		* @param {Object} point
 		* @param {Object} dwaOptions
 		* @param {Object} dwaPoint if exisiting (optional)
 		* 
 		*/
		function dwaCalculateNewPoint(point, dwaOptions, dwaPoint){

			//if no existing dwaPoint, dwaPoint = point 
			if(typeof dwaPoint === 'undefined'){
				dwaPoint = {
					'x': point.x,
					'y': point.y,
					'comment': dwaOptions.commentLabel + ' = ' + point[dwaOptions.valueVariableName] +' / ' + point[dwaOptions.weightVariableName]
				};
				dwaPoint[dwaOptions.valueVariableName] = point[dwaOptions.valueVariableName];
				dwaPoint[dwaOptions.weightVariableName] = point[dwaOptions.weightVariableName];
			}
			else{ //Calculate average
				dwaPoint.x = point.x;
				dwaPoint[dwaOptions.valueVariableName] += point[dwaOptions.valueVariableName];
				dwaPoint[dwaOptions.weightVariableName] += point[dwaOptions.weightVariableName];
				dwaPoint.y = Number(((dwaPoint[dwaOptions.valueVariableName]/dwaPoint[dwaOptions.weightVariableName])*dwaDefaultOptions.averageFactor).toFixed(dwaOptions.round));
				dwaPoint.comment = dwaOptions.commentLabel + ' = ' + dwaPoint[dwaOptions.valueVariableName] +' / ' + dwaPoint[dwaOptions.weightVariableName];
			}
			return dwaPoint;
		}

		//remove existing dwa serie without redrawing
		if(existingDwaSerie){ 
			dwaSerie.color = existingDwaSerie.color;
			dwaSerie.visible = existingDwaSerie.visible;
			existingDwaSerie.remove(false);
		}

		H.each(chartSeries, function(serie){

			//calculate only visible series
			if(serie.visible){

				if (dwaSerie.data.length > 0){

					H.each(serie.data, function(point){

						var foundedPoint = false;

						H.each(dwaSerie.data, function(dwaPoint){
							if(dwaPoint.x == point.x){
								foundedPoint = true;
								dwaCalculateNewPoint(point, dwaOptions, dwaPoint);
								return;
							}
						});

						if(!foundedPoint){
							var data = dwaCalculateNewPoint(point,dwaOptions);
							dwaSerie.data.push(data);
						}
					});
				}
				else{
					//init dwaSeries
					H.each(serie.data, function(point){
						var data = dwaCalculateNewPoint(point,dwaOptions)
						dwaSerie.data.push(data);
					});
				}
			}
		});

		// Sort by x
		dwaSerie.data.sort(function (a, b) {
		    if (a.x > b.x)
		      return 1;
		    if (a.x < b.x)
		      return -1;
		    // a doit être égale à b
		    return 0;
		});

		//Add the generated serie and redraw
		this.addSeries(dwaSerie);
    });

	//Add function to Series prototype
	H.wrap(H.Series.prototype, 'setVisible', function (proceed) {
   		var chart = this.chart,
   			dwaSerie = chart.get('dwa');

   		// Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 2));

      	// Run wga if visible
      	if(dwaSerie.visible){
  			chart.DynamicWeightedAverage();
  		}	
	});

}(Highcharts));
