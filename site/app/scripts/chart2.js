/*
 * Wage distribution
 */

ChartTwo = (function() {
    function ChartTwo(selector, data, opts) {
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
              .rangeRoundBands([0, self.width - yAxisMargin], .1);
              //.rangeRoundBands([0, self.width], .1);
        var y = d3.scale.linear()
              .range([self.height, 0]);

        d3.csv(self.data, function (error, data) {
          data = data.sort(function(a, b){ return d3.ascending(parseInt(a.median), parseInt(b.median)); });

          minvalue = d3.min(data, function(d) { return parseInt(d.P10)});
          maxvalue = d3.max(data, function(d) { return parseInt(d.P90)});
          // console.log(minvalue);
          // console.log(maxvalue);

          x.domain(data.map(function(d) { return +d.median; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.P90); })]);
          //y.domain([0, d3.max(data, function(d) { return parseInt(d.median); })]);
          //y.domain([d3.min(data, function(d) { return parseInt(d.P10)}), d3.max(data, function(d) { return parseInt(d.P90); })]);
          
          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(+d.median) + ",0)"; });

          bar.append("rect")
              .attr("class", function(d) { return "edges " + d.group; })
              .attr("y", function(d) { return y(d.P90); })
              .attr("height", function(d) { return self.height - y(parseInt(d.P90 - d.P10)); })
              .attr("width", x.rangeBand())
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("fill", "#ECDAB5")

          // quartiles
          bar.append("rect")
              .attr("class", function(d) { return "quartiles " + d.group; })
              .attr("y", function(d) { return y(d._Q3); })
              .attr("height", function(d) { return self.height - y(parseInt(d._Q3 - d._Q1)); })
              .attr("width", x.rangeBand())
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("fill", "#BDA164");
          
          // median
          bar.append("circle")
              .attr("class", function(d) { return "median " + d.group; })
              .attr("cy", function(d) { return y(d.median); })
              .attr("r", function(d) { return 1; })
              .attr("cx", x.rangeBand() / 2)
              .attr("fill", "#F8F0DE")
              .attr("id", function(d) { return d.profession_name });

          // transparent overlay for mouseovers
          bar.append("rect")
              .attr("name", function(d) { return d.profession_name; })
              .attr("class", function(d) { return "bar-overlay " + d.group; })
              .attr("y", function(d) { return y(d.P90); })
              .attr("height", function(d) { return self.height - y(parseInt(d.P90 - d.P10)); })
              .attr("width", x.rangeBand())
              .style("opacity", "0")
              .style("fill", "darkred")
              .attr("rx", 3)
              .attr("ry", 3)
              .on('mouseover', function(d) {
                $('#chart-two-title').text(d.profession_name);
                $('#chart-two-subtitle-1').html("<strong>Månadslön, lägst 10%</strong>: " + d.P10 + " kronor");
                $('#chart-two-subtitle-2').html("<strong>Månadslön, högsta 10%</strong>: " + d.P90 + " kronor");
              })
              .on('mouseout', function(d) {
                $('#chart-two-title').text("Yrkesgrupp vs Månadslön");
                $('#chart-two-subtitle-1').html("&nbsp;");
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
          var sel = d3.select('#chart-two [name="' + d.profession_name + '"]').style("opacity", ".4");
          $('#chart-two-title').text(d.profession_name);
          $('#chart-two-subtitle-1').html("<strong>Månadslön, lägst 10%</strong>: " + d.P10 + " kronor");
          $('#chart-two-subtitle-2').html("<strong>Månadslön, högsta 10%</strong>: " + d.P90 + " kronor");
        }
        self.svg.on('touchmove.chart2', onTouchMove);

         
          var yAxis = d3.svg.axis() 
            .scale(y)
            .ticks(8, "s")
            // .tickFormat(function(d) { return formatMillionSEK(d); })
            .tickFormat(function(d) { return d / 1000; })
            .orient("left");
          self.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + yAxisMargin*1.2 + ", 0)")
            .call(yAxis);
          // remove tick for 0
          d3.selectAll('g.tick')
            .filter(function(d){ return d==0;} )
            .select('text') //grab the tick line
            .style('visibility', 'hidden');

          self.svg.append("text")
            .text("Yrkesgrupp")
            .attr("class", "axis legend")
            .style("background", "white")
            .style("text-transform", "uppercase")
            .attr("transform", "translate(" + yAxisMargin*1.4 + "," + (self.height-xAxisMargin/3) + ")")
            .style("text-anchor", "start");
          self.svg.append("text")
            .text("Månadslön (TKr)")
            .attr("class", "axis legend")
            .attr("transform", "translate(" + yAxisMargin/4 + "," + (self.height-xAxisMargin) + ") rotate(-90)")
            .style("text-anchor", "start")
            .style("background-color", "white");
        

        });

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
    }

    ChartTwo.prototype.applyHighlight = function(group) {
      if (group && group != self.group) { self.group = group; }
      d3.selectAll("#chart-two .median").style("fill", "#F8F0DE"); 
      d3.selectAll("#chart-two .quartiles").style("fill", "#BDA164"); 
      d3.selectAll("#chart-two .edges").style("fill", "#ECDAB5"); 

      d3.selectAll("#chart-two .median." + self.group).style("fill", "#eecae0"); 
      d3.selectAll("#chart-two .quartiles." + self.group).style("fill", "#c13d8c"); 
      d3.selectAll("#chart-two .edges." + self.group).style("fill", "#d67db2"); 
      d3.selectAll("#chart-two .bartext." + self.group).style("opacity", "1"); 
      d3.selectAll(".bar-overlay").style("opacity", "0");
    }

    // Transitions only
    ChartTwo.prototype.update = function(data) {
        var self = this;
        self.data = data;

    }
    ChartTwo.prototype.resize = function() {
        var self = this;
        self.svg.remove();
        self.drawChart();
        self.update(self.data);
    }
    return ChartTwo;
})();

