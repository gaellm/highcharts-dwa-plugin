highcharts-dwa-plugin
=====================

Dynamnic Weighted Average plugin. Add a weighted average graph on the chart, dynamically calculated following displayed series.

###Demo
http://jsfiddle.net/gaellm/pw4fwdjm/

###How it works
To use the plugin you must call the plugin js file after the highcharts library. Then the only thing needed is the points' values and weights number on each series' datas. The plugin will sum values and weights to calculate the average.

```
$('#chart').highcharts({
chart: {
  type: 'spline'
},
... 

wgaOptions: {
  'visibleAtFirst' : false          
},

...
series: [{
    name : 'foo',
    data : [{
              x : Date.UTC(2014, 8, 15, 00, 00, 00),
              y : .26,
              comment : 'foo',
              s:10603,
              n:4070950
            }, 
            ... 
            ]
        }],
...
```

To call the plugin you must use the chart's DynamnicWeightedAverage() function, for example:
```
$('#chart').highcharts().DynamnicWeightedAverage();
```


###Options
Options can be set on chart object by adding the key 'wgaOptions'.
* `name`
Weighted average serie's name, 'Dynamic Weighted Average' by default.
* `visibleAtFirst`
If false the graph wont be visible at plugin call.
* `round`
How many numbers needed after float for average. 3 by default.
* `valueVariableName`
The value's key in series' points. 's' by default.
* `weightVariableName`
The weight's key in series' points. 'n' by default.
* `averageFactor`
Average factor, to display percent it has to be set to 100 for example 1000 for thousandth. 100 by default.
* `commentLabel`
Comment to display on average's serie tooltip.

###Dependencies
Tested with:
* Jquery 1.11.0
* Highcharts 4.0.4
