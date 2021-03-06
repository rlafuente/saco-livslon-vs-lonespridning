/*
 * Wage distribution
 */

ChartTwo = (function() {
    function ChartTwo(selector, data, opts) {
        var self = this;
        self.container = d3.select(selector);
        defaultOpts = {
            isIframe: false
        };
        self.opts = $.extend(defaultOpts, opts);

        // Inital state
        self.data = data;
        // Highlight group
        self.group = 'education';

        // Append chart container
        self.chartContainer = self.container.append("div")
            .attr("class", "chart-container");

        // Render charts
        self.drawChart();

        // Do transitions
        self.update(data);

        // Make responsize
        d3.select(window).on('resize', function() {
            self.resize();
        });
        // Set up tooltip
        self.tooltip = '';
    }
    // Draw DOM elements
    ChartTwo.prototype.drawChart = function() {
        var self = this;
        var containerWidth = self.container[0][0].offsetWidth;

        // clear container
        self.chartContainer.html("");

        // Setup sizing
        self.margins = m = {
            top: containerWidth * 0.1,
            right: containerWidth * 0.1,
            bottom: containerWidth * 0.1,
            left: containerWidth * 0.1 
        };
        self.width = w = containerWidth - m.left - m.right;
        self.height = h = w * 0.5;
        self.pointRadius = containerWidth * 0.01;

        // margin value to make room for the y-axis
        var xAxisMargin = 30;
        var yAxisMargin = 35;

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox','0 0 ' + self.width +' '+ self.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        self.chart = self.svg.append('g')
            .attr('transform', 'translate(' + yAxisMargin + ',0)');

        var x = d3.scale.ordinal()
              .rangeRoundBands([0, self.width - yAxisMargin], 0.1);
              //.rangeRoundBands([0, self.width], .1);
        var y = d3.scale.linear()
              .range([self.height - xAxisMargin, 0]);

        d3.csv(self.data, function (error, data) {
          data = data.sort(function(a, b){ return d3.ascending(parseInt(a.mean), parseInt(b.mean)); });

          minvalue = d3.min(data, function(d) { return parseInt(d.P10); });
          maxvalue = d3.max(data, function(d) { return parseInt(d.P90); });

          x.domain(data.map(function(d) { return d.profession_label; }));
          y.domain([20000, d3.max(data, function(d) { return parseInt(d.P90); })]);
          //y.domain([0, d3.max(data, function(d) { return parseInt(d.mean); })]);
          //y.domain([d3.min(data, function(d) { return parseInt(d.P10)}), d3.max(data, function(d) { return parseInt(d.P90); })]);
          
          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(d.profession_label) + ",0)"; });

          bar.append("rect")
              .attr("name", function(d) { return d.profession_label; })
              .attr("class", function(d) { return "edges " + d.group; })
              .attr("y", function(d) { return y(d.P90); })
              .attr("height", function(d) { return y(d.P10) - y(d.P90); })
              .attr("width", x.rangeBand())
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("fill", "#383f82");

          // mean
          bar.append("circle")
              .attr("class", function(d) { return "mean " + d.group; })
              .attr("cy", function(d) { return y(d.mean); })
              .attr("r", function(d) { return 3; })
              .attr("cx", x.rangeBand() / 2)
              .attr("fill", "#F8F0DE")
              .attr("id", function(d) { return d.profession_label; });

          // transparent overlay for mouseovers
          bar.append("rect")
              .attr("class", function(d) { return "bar-overlay " + d.group; })
              .attr("y", 0)
              .attr("height", self.height)
              // .attr("y", function(d) { return y(d.P90); })
              // .attr("height", function(d) { return y(d.P10) - y(d.P90); })
              .attr("width", x.rangeBand() + 2)
              .style("opacity", "0")
              .attr("rx", 3)
              .attr("ry", 3)
              .on('mouseover', function(d) {
                self.applyHighlight();
                var sel = d3.select('.edges[name="' + d.profession_label + '"]').style("fill", "#008ea1");
                $('#chart-two-title').text(d.profession_label);
                $('#chart-two-subtitle-1').html(self.getTooltip(d));
              })
              .on('mouseout', function(d) {
		self.applyHighlight();
		$('#chart-two-title').text(self.title);
		$('#chart-two-subtitle-1').html("↔ Swipa för att se detaljer");
		$('#chart-two-subtitle-2').html("&nbsp;");
              });

        // Mobile swipe events
        // var touchScale = d3.scale.linear().domain([yAxisMargin,self.width]).range([0,data.length]).clamp(true);
        var touchScale = d3.scale.linear().domain([yAxisMargin,self.width]).range([0,data.length]).clamp(true);
        function onTouchMove() {
          var xPos = d3.touches(this)[0][0];
          var d = data[~~touchScale(xPos)];
          // reset colors and highlight the touched one
          self.applyHighlight();
          var sel = d3.select('.edges[name="' + d.profession_label + '"]').style("fill", "#008ea1");
          $('#chart-two-title').text(d.profession_label);
          $('#chart-two-subtitle-1').html(self.getTooltip(d));
        }
        self.svg.on('touchmove.chart2', onTouchMove);
        self.svg.on('touchend.chart2', function() {
          self.applyHighlight();
          $('#chart-two-title').text("Lönespridning i olika yrken");
          $('#chart-two-subtitle-1').html("↔ Swipa för att se detaljer");
	  $('#chart-two-subtitle-2').html("&nbsp;");
        });

         
          var yAxis = d3.svg.axis() 
            .scale(y)
            .ticks(6, "s")
            // .tickFormat(function(d) { return formatMillionSEK(d); })
            .tickFormat(function(d) { return d / 1000; })
            .orient("left");
          self.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + yAxisMargin + ", 0)")
            .call(yAxis);
          // remove tick for 0
          d3.selectAll('#chart-two g.tick')
            .filter(function(d){ return d === 0;} )
            .select('text') //grab the tick line
            .style('visibility', 'hidden');

          self.svg.append("text")
            .text("")
            .attr("class", "axis legend legend-x")
            .style("background", "white")
            .style("text-transform", "uppercase")
            .attr("transform", "translate(" + yAxisMargin*1.4 + "," + (self.height-xAxisMargin/3) + ")")
            .style("text-anchor", "start");
          self.svg.append("text")
            .text("")
            .attr("class", "axis legend legend-y")
            .attr("transform", "translate(" + yAxisMargin/4 + "," + (self.height-xAxisMargin) + ") rotate(-90)")
            .style("text-anchor", "start")
            .style("background-color", "white");
        

        });

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
    };

    ChartTwo.prototype.getTooltip = function(d) {
      var self = this;
      return self.tooltip
      .replace("{ P10 }", d.P10)
      .replace("{ P90 }", d.P90)
      .replace("{ income_range_kr }", d.income_range_kr)
      .replace("{ income_range_perc }", Number(d.income_range_perc).toFixed(1));
    };

    ChartTwo.prototype.set_legend = function(lx, ly) {
      $("#chart-two .legend-x").text(lx);
      $("#chart-two .legend-y").text(ly);
    };

    ChartTwo.prototype.applyHighlight = function(group) {
      if (group && group != self.group) { self.group = group; }
      d3.selectAll("#chart-two .mean").style("fill", "#F8F0DE"); 
      d3.selectAll("#chart-two .edges").style("fill", "#383f82"); 

      d3.selectAll("#chart-two .mean." + self.group).style("fill", "#eecae0"); 
      d3.selectAll("#chart-two .edges." + self.group).style("fill", "#c13d8c"); 
      d3.selectAll("#chart-two .bartext." + self.group).style("opacity", "1"); 
      d3.selectAll(".bar-overlay").style("opacity", "0");
    };

    // Transitions only
    ChartTwo.prototype.update = function(data) {
        var self = this;
        self.data = data;

    };
    ChartTwo.prototype.resize = function() {
        var self = this;
        self.svg.remove();
        self.drawChart();
        self.update(self.data);
    };
    return ChartTwo;
})();

