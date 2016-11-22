/*
 * Yearly incomes
 */

ChartOne = (function() {
  function ChartOne(selector, data, opts) {
    var self = this;
    self.container = d3.select(selector);
    defaultOpts = {
      isIframe: false
    };
    self.opts = $.extend(defaultOpts, opts);

    // Inital state
    self.data = data;
    self.width = 0;
    // Highlight group
    self.group = 'education';
    // Append chart container
    self.chartContainer = self.container.append("div")
      .attr("class", "chart-container");
    // Render charts
    self.drawChart();
    // Do transitions
    self.update(data);
    // Make responsive
    d3.select(window).on('resize', function() {
      self.resize();
    });
    // Set up tooltip
    self.tooltip = '';
  }
  // Draw DOM elements
  ChartOne.prototype.drawChart = function() {
    var self = this;
    var containerWidth = self.container[0][0].offsetWidth;

    // Clear container
    self.chartContainer.html("");
    // Setup sizing
    self.margins = m = {
        top: containerWidth * 0.1,
        right: containerWidth * 0.1,
        bottom: containerWidth * 0.1,
        left: containerWidth * 0.1 
    };
    // Dynamic width, height and font size
    self.width = w = containerWidth - m.left - m.right;
    self.height = h = w * 0.5;
    var fontSize = m.bottom * 0.7 + "px";
    // Margin value to make room for the axes
    var xAxisMargin = 30;
    var yAxisMargin = 35;
    var barPadding = .1;
    // Set up scales
    var x = d3.scale.ordinal()
          // .rangeRoundBands([0, self.width], .1);
          .rangeRoundBands([0, self.width - yAxisMargin], barPadding);
    var y = d3.scale.linear()
          .range([xAxisMargin, self.height-xAxisMargin]);
          // .range([self.height-xAxisMargin, xAxisMargin*2]);
          // .range([0, self.height]);
    var yAxisScale = d3.scale.linear()
          .range([xAxisMargin, self.height-xAxisMargin]);

    // Create SVG container
    self.svg = self.chartContainer.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox','0 0 '+self.width+' '+self.height)
        .attr("preserveAspectRatio", "xMinYMin meet");
    self.chart = self.svg.append('g')
        .attr('transform', 'translate(' + yAxisMargin + ',' + -xAxisMargin + ')');

    // Get the data to draw from
    d3.csv(self.data, function (error, data) {
      // Init data and domains
      data = data.sort(function(a, b){ return d3.ascending(parseInt(a.baseline_diff), parseInt(b.baseline_diff));});
      var maxvalue = d3.max(data, function(d) { return parseInt(d.baseline_diff); });
      var minvalue = d3.min(data, function(d) { return parseInt(d.baseline_diff); });
      x.domain(data.map(function(d) { return d.profession_label; }));
      y.domain([maxvalue, minvalue]);
      yAxisScale.domain([maxvalue, minvalue]);

      // Draw!
      // Start by creating groups for the bars and associated objects
      var bar = self.chart.selectAll("g")
          .data(data)
        .enter().append("g")
          .attr("width", 20)
          .attr("transform", function(d) { return "translate(" + x(d.profession_label) + ",0)"; });
      
      // Bars
      bar.append("rect")
        .attr("name", function(d) { return d.profession_label; })
        .attr("class", function(d) { return "bar element " + d.group; })
        .attr("y", function(d) { if (d.baseline_diff < 0) {
          return y(0); 
        } else {
          return y(parseInt(d.baseline_diff));
        }})
        .attr("height", function(d) { if (d.baseline_diff < 0) {
          return y(parseInt(d.baseline_diff)) - y(0); 
        } else {
          return y(0) - y(parseInt(d.baseline_diff));
        }})
        .attr("fill", "lightgrey")
        .attr("width", x.rangeBand());
      bar.append("rect")
        .attr("name", function(d) { return d.profession_label; })
        .attr("class", function(d) { return "bar-overlay " + d.group; })
        .attr("y", 0)
        .attr("height", self.height)
        .attr("width", x.rangeBand() + 1)
        .style("opacity", "0")
        .on('mouseover', function(d) {
          self.applyHighlight();
          d3.select('#chart-one [name="' + d.profession_label + '"]').attr("fill", "#008ea1");
          $('#chart-one-title').text(d.profession_label);
          $('#chart-one-subtitle').html(self.getTooltip(d))})
        .on('mouseout', function(d) {
          self.applyHighlight();
          $('#chart-one-title').text(self.title);
          $('#chart-one-subtitle').html("↔ Swipa för att se detaljer");
        });

    // Mobile swipe events
    var touchScale = d3.scale.linear().domain([yAxisMargin + x.rangeBand(),self.width]).range([0,data.length+1]).clamp(true);
    //var touchScale = d3.scale.linear().domain([yAxisMargin,self.width]).range([0,data.length]).clamp(true);
    function onTouchMove() {
      var xPos = d3.touches(this)[0][0];
      var d = data[~~touchScale(xPos)];
      // reset colors and highlight the touched one
      self.applyHighlight();
      d3.select('[name="' + d.profession_label + '"]').attr("fill", "#008ea1");
      $('#chart-one-title').text(d.profession_label);
      $('#chart-one-subtitle').html(self.getTooltip(d));
    }
    self.svg.on('touchmove.chart1', onTouchMove);
    
    // Vertical axis
    var yAxis = d3.svg.axis() 
      .scale(yAxisScale)
      .ticks(9)
      .tickFormat(function(d) { return d/1000000; })
      .orient("left");
    self.svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + yAxisMargin + ", " + -xAxisMargin + ")")
      .call(yAxis);
    // Axis line
    self.svg.append("line")
      .attr("x1", yAxisMargin)
      .attr("y1", y(0) - xAxisMargin)
      .attr("x2", self.width)
      .attr("y2", y(0) - xAxisMargin)
      .style("stroke-width", 1)
      .style("stroke", "#ECDAB5")
      .style("fill", "none");
    // Axis labels
    self.svg.append("text")
      .text("Yrkesgrupp")
      .attr("class", "axis legend")
      .style("background", "white")
      .style("text-transform", "uppercase")
      .attr("transform", "translate(" + yAxisMargin*1.4 + "," + (self.height-xAxisMargin/3) + ")")
      .style("text-anchor", "start");
    self.svg.append("text")
      .text("Livslön (milj. kr)")
      .attr("class", "axis legend")
      .attr("transform", "translate(" + yAxisMargin/4 + "," + (self.height-xAxisMargin) + ") rotate(-90)")
      .style("text-anchor", "start")
      .style("background-color", "white");

    // Send resize signal to parent page
    if (self.opts.isIframe) {
      pymChild.sendHeight();
    }
  });
  }

  ChartOne.prototype.on_resize = function(w) {
    //var size = Math.max(16, Math.min(8, 12 - w/50));
    var size = 12 - w/200;
    d3.selectAll(".bartext").style("font-size", size + "px");

    if (w < 600) { $(".bartext").hide(); } else { $(".bartext").show(); }
  }

  ChartOne.prototype.getTooltip = function(d) {
    var self = this;
    return self.tooltip
    .replace("{ lifesalary }", Number((d.lifesalary/1000000).toFixed(1)))
    .replace("{ baseline_diff }", Number((Math.abs(d.baseline_diff)/1000000).toFixed(1)))
    .replace("{mer/mindre}", function(s) {
      if (d.baseline_diff > 0) { return "mer" } else { return "mindre"}
    })
    .replace("{ baseline }", d.baseline);
  }


  ChartOne.prototype.applyHighlight = function(group) {
    if (group && group != self.group) { self.group = group; }
    $("#chart-one .element").attr("fill", "#ECDAB5"); 
    $("#chart-one ." + self.group).attr("fill", "#c13d8c"); 
    $("#chart-one .bartext").attr("opacity", "0"); 
    $("#chart-one .bartext." + self.group).attr("opacity", "1"); 
  }
  
  // Transitions only
  ChartOne.prototype.update = function(data) {
    var self = this;
    self.data = data;
  }
  ChartOne.prototype.resize = function() {
    var self = this;
    self.svg.remove();
    self.drawChart();
    self.update(self.data);
  }
  return ChartOne;
})();

