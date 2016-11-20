/*
 * Scatterplot
 */

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.parentNode.appendChild(this.parentNode);
  });
};

ChartThree = (function() {
    function ChartThree(selector, data, opts) {
        var self = this;
        self.container = d3.select(selector);
        defaultOpts = {
            isIframe: false
        }
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
    ChartThree.prototype.drawChart = function() {
        var self = this;
        var containerWidth = self.container[0][0].offsetWidth;

        // clear container
        self.chartContainer.html("");
        // setup sizing
        self.margins = m = {
            top: containerWidth * 0.1,
            right: containerWidth * 0.1,
            bottom: containerWidth * 0.1,
            left: containerWidth * 0.1 
        };
        self.width = w = containerWidth - m.left - m.right;
        self.height = h = w * 0.5;
        self.pointRadius = containerWidth * 0.01;

        // margin value to make room for the axes
        var xAxisMargin = 50;
        var yAxisMargin = 50;

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox','0 0 ' + self.width +' '+ self.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        // Add outer glow filter to svg
        // http://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization.html
	var defs = self.svg.append("defs");
	var filter = defs.append("filter")
		.attr("id","glow")
                .attr("height", "130%");
	filter.append("feGaussianBlur")
		.attr("in", "SourceAlpha")
		.attr("stdDeviation","5")
		.attr("result","coloredBlur");
	var feMerge = filter.append("feMerge");
	feMerge.append("feMergeNode")
		.attr("in","coloredBlur");
	feMerge.append("feMergeNode")
		.attr("in","SourceGraphic");

        // Set up chart
        self.chart = self.svg.append('g');
            // .attr('transform', 'translate(' + yAxisMargin + ',' + -xAxisMargin + ')');
        // var circleRadius = self.width / 100;
        var circleRadius = 4;
	var glowRadius = 4;
        var x = d3.scale.linear()
              .range([glowRadius+circleRadius+yAxisMargin, self.width-circleRadius-glowRadius]);
        var y = d3.scale.linear()
              .range([self.height-circleRadius-glowRadius-xAxisMargin, circleRadius+glowRadius]);

        d3.csv(self.data, function (error, data) {
          x.domain([d3.min(data, function(d) { return parseFloat(d.lifesalary_vs_baseline); }), 
                    d3.max(data, function(d) { return parseFloat(d.lifesalary_vs_baseline); })]);
          y.domain([d3.min(data, function(d) { return parseFloat(d.income_range_perc); }), 
                    d3.max(data, function(d) { return parseFloat(d.income_range_perc); })]);
 
          // Sort data so that touch events follow proper order
          data.sort(function(a,b) { return a.lifesalary_vs_baseline - b.lifesalary_vs_baseline; });

          // Salary indicator line
          line_x = x(1);
          self.svg.append("line")
            .attr("x1", line_x)
            .attr("y1", 0)
            .attr("x2", line_x)
            .attr("y2", self.height - xAxisMargin)
            .style("stroke-width", 1)
            .style("stroke", "lightgrey")
            .style("fill", "none");
          self.svg.append("text")
            .attr("class", "salarytext")
            .text("Tjänar mer än gymnasieutbildad")
            .attr("dx", line_x + 5)
            .attr("dy", "1em")
            //.attr("transform", "translate(" + (line_x + 5) + ",20)")
            .style("font-size", "10px")
            .style("fill", "grey");

          var dot = self.chart.selectAll("g")
              .data(data)
            .enter().append("g");
	  // outer highlight circle
          dot.append("circle")
              .attr("name", function(d) { return d.profession_label; })
              .attr("class", function(d) { return "d3-tip glow " + d.group; })
              .attr("cx", function(d) { return x(parseFloat(d.lifesalary_vs_baseline)); })
              .attr("cy", function(d) { return y(parseFloat(d.income_range_perc)); })
              .attr("r", circleRadius+glowRadius)
              .attr("fill", "#008ea1")
	      .attr("fill-opacity", .1);

          dot.append("circle")
              .attr("name", function(d) { return d.profession_label; })
              .attr("class", function(d) { return "element d3-tip " + d.group; })
              .attr("cx", function(d) { return x(parseFloat(d.lifesalary_vs_baseline)); })
              .attr("cy", function(d) { return y(parseFloat(d.income_range_perc)); })
              .attr("r", circleRadius)
              .attr("fill", "#BDA164")
              .attr("stroke", "white")
              .attr("stroke-width", "1")
              .attr("fill-opacity", 1)

              .on('mouseover', function(d) {
                self.applyHighlight();
		d3.select('.glow[name="' + this.getAttribute('name') + '"]').moveToFront();
		d3.select(this)
                  .style('fill', '#008ea1')
                  .moveToFront();

                $('#chart-three-title').text(d.profession_label);
                $('#chart-three-subtitle-1').html(self.getTooltip(d));
              })
              .on('mouseout', function(d) {
		self.applyHighlight();
		$('#chart-three-title').text(self.title);
		$('#chart-three-subtitle-1').html("↔ Swipa för att se detaljer");
		$('#chart-three-subtitle-2').html("&nbsp;");
              });

        // Mobile swipe events
        var touchScale = d3.scale.linear().domain([yAxisMargin,self.width]).range([0,data.length]).clamp(true);
        function onTouchMove() {
          var xPos = d3.touches(this)[0][0];
          var d = data[~~touchScale(xPos)];
          // reset colors and highlight the touched one
          self.applyHighlight();
          if (typeof d != 'undefined' && d) {
          var sel = d3.select('#chart-three .element[name="' + d.profession_label + '"]')
            .style("fill", "#008ea1")
	    .moveToFront();
          $('#chart-three-title').text(d.profession_label);
          $('#chart-three-subtitle-1').html(self.getTooltip(d));
          }

        }
        self.svg.on('touchmove.chart3', onTouchMove);
        self.svg.on('touchend.chart3', function() {
          $('#chart-three-title').text("Livslön jämfört med gymnasieutbildad vs Lönespridning (P90/P10)");
          $('#chart-three-subtitle-1').html("&nbsp;");
	  $('#chart-three-subtitle-2').html("&nbsp;");
        });


        // Axes
        self.svg.append("text")
          .text("Låg livslön")
          .attr("class", "axis legend")
          .style("background", "white")
          .style("text-transform", "uppercase")
          .attr("transform", "translate(" + yAxisMargin + "," + (self.height-xAxisMargin/3) + ")")
          .style("text-anchor", "start");
        self.svg.append("text")
          .text("Hög livslön")
          .attr("class", "axis legend")
          .style("background", "white")
          .style("text-transform", "uppercase")
          .attr("transform", "translate(" + (self.width) + "," + (self.height-xAxisMargin/3) + ")")
          .style("text-anchor", "end");

        self.svg.append("text")
          .text("Liten löne-")
          .attr("dy", "0em")
          .attr("class", "axis legend")
          .attr("transform", "translate(" + yAxisMargin/2 + "," + (self.height-xAxisMargin/2) + ") rotate(-90)")
          .style("text-anchor", "start");
        self.svg.append("text")
          .text("spridning")
          .attr("dy", "1em")
          .attr("class", "axis legend")
          .attr("transform", "translate(" + yAxisMargin/2 + "," + (self.height-xAxisMargin/2) + ") rotate(-90)")
          .style("text-anchor", "start");

        self.svg.append("text")
          .text("Stor lön-")
          .attr("dy", "0em")
          .attr("class", "axis legend")
          .attr("transform", "translate(" + yAxisMargin/2 + ",0) rotate(-90)")
          .style("text-anchor", "end");
        self.svg.append("text")
          .text("spridning")
          .attr("dy", "1em")
          .attr("class", "axis legend")
          .attr("transform", "translate(" + yAxisMargin/2 + ",0) rotate(-90)")
          .style("text-anchor", "end");


        });

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
    }

    ChartThree.prototype.getTooltip = function(d) {
      var self = this;
      return self.tooltip
        .replace("{ lifesalary }", Number((d.lifesalary/1000000).toFixed(1)))
        .replace("{ mer/mindre }", function(s) {
          if (Number(d.lifesalary_vs_baseline) > 1) { return "mer" } else { return "mindre"}
        })
        .replace("{ lifesalary_vs_baseline }", function(s) {
          if (d.lifesalary_vs_baseline >= 1) { return (100 * Number(d.lifesalary_vs_baseline) - 100).toFixed(1) } 
          else { return Math.abs(100 - Number(d.lifesalary_vs_baseline)*100).toFixed(1) }
        })
        .replace("{baseline}", d.baseline)
        .replace("{ income_range_kr }", d.income_range_kr)
        .replace("{ income_range_perc }", Number(d.income_range_perc).toFixed(1));
    }

    ChartThree.prototype.applyHighlight = function(group) {
      if (group && group != self.group) { self.group = group; }
      d3.selectAll("#chart-three .element").style("fill", "#BDA164"); 
      d3.selectAll("#chart-three ." + self.group).style("fill", "#c13d8c").moveToFront();  
    }

    ChartThree.prototype.on_resize = function(w) {
      var size = 10 - w/200;
      d3.selectAll("#chart-three .salarytext").style("font-size", size + "px");
    }

    // Transitions only
    ChartThree.prototype.update = function(data) {
        var self = this;
        self.data = data;
    }
    ChartThree.prototype.resize = function() {
        var self = this;
        self.svg.remove();
        self.drawChart();
        self.update(self.data);
    }
    return ChartThree;
})();
