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
    var xAxisMargin = 50;
    var yAxisMargin = 60;
    var barPadding = 0.1;
    // Set up scales
    var x = d3.scale.ordinal()
          .rangeRoundBands([0, self.width - yAxisMargin], barPadding);
    var y = d3.scale.linear()
          .range([xAxisMargin, self.height]);
    var yAxisScale = d3.scale.linear()
          .range([xAxisMargin, self.height]);

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
      data = data.sort(function(a, b){ return d3.ascending(parseFloat(a.lifesalary_vs_baseline), parseFloat(b.lifesalary_vs_baseline));});
      var y_maxvalue = d3.max(data, function(d) { return parseFloat(d.lifesalary_vs_baseline); });
      var y_minvalue = d3.min(data, function(d) { return parseFloat(d.lifesalary_vs_baseline); });
      x.domain(data.map(function(d) { return d.profession_label; }));
      y.domain([y_maxvalue, y_minvalue]);

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

        .attr("y", function(d) { 
          if (d.lifesalary_vs_baseline < 1) {
            return y(1); 
          } else {
            return y(parseFloat(d.lifesalary_vs_baseline));
        }})
        .attr("height", function(d) { if (d.lifesalary_vs_baseline < 1) {
            return y(parseFloat(d.lifesalary_vs_baseline)) - y(1); 
          } else {
            return y(1) - y(parseFloat(d.lifesalary_vs_baseline));
          }})


        //.attr("y", function(d) { return self.height - y(parseFloat(d.lifesalary_vs_baseline)); })
        //.attr("height", function(d) { return y(parseFloat(d.lifesalary_vs_baseline)); })
        .attr("fill", "#008ea1")
        .attr("width", x.rangeBand());
      // Mouseover overlay
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
          $('#chart-one-subtitle').html(self.getTooltip(d));
        })
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
    self.svg.on('touchend.chart1', function() {
      self.applyHighlight();
      $('#chart-one-title').text("Livslöner för olika utbildningar");
      $('#chart-one-subtitle').html("↔ Swipa för att se detaljer");
    });
    
    // Vertical axis
    yAxisScale.domain([y_maxvalue, y_minvalue]);
    var yAxis = d3.svg.axis() 
      .scale(yAxisScale)
      .ticks(9)
      .tickFormat(function(d) { 
        var pcvalue = parseFloat(d-1).toFixed(2)*100;
        if (d > 1) { return '+' + pcvalue + "%"; }
        else if (d < 1) { return pcvalue + "%"; }
        else if (d === 0) { return ""; }
      })
      .orient("left");
    self.svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + yAxisMargin + ", " + (-xAxisMargin) + ")")
      .call(yAxis);
    // Axis line
    self.svg.append("line")
      .attr("x1", yAxisMargin)
      .attr("y1", y(1) - xAxisMargin)
      .attr("x2", self.width)
      .attr("y2", y(1) - xAxisMargin)
      .style("stroke-width", 1)
      .style("stroke", "#383f82")
      .style("fill", "none");
    // Axis labels
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

    // Send resize signal to parent page
    if (self.opts.isIframe) {
      pymChild.sendHeight();
    }
  });
  };

  ChartOne.prototype.on_resize = function(w) {
    //var size = Math.max(16, Math.min(8, 12 - w/50));
    var size = 12 - w/200;
    d3.selectAll(".bartext").style("font-size", size + "px");

    if (w < 600) { $(".bartext").hide(); } else { $(".bartext").show(); }
  };

  ChartOne.prototype.getTooltip = function(d) {
    var self = this;
    return self.tooltip
    .replace("{ lifesalary }", Number((d.lifesalary/1000000).toFixed(1)))
    .replace("{ lifesalary_vs_baseline }", Number((Math.abs(1 - d.lifesalary_vs_baseline) * 100).toFixed(0)))
    .replace("{mer/mindre}", function(s) {
      if (d.baseline_diff < 0) { return "mindre"; } else { return "mer"; }
    })
    .replace("{ baseline }", d.baseline)
    .replace("{ baseline_diff }", Number((d.baseline_diff.replace("-", "")/1000000).toFixed(1)));
  };

  ChartOne.prototype.set_legend = function(lx, ly) {
    $("#chart-one .legend-x").text(lx);
    $("#chart-one .legend-y").text(ly);
  };

  ChartOne.prototype.applyHighlight = function(group) {
    if (group && group != self.group) { self.group = group; }
    $("#chart-one .element").attr("fill", "#383f82"); 
    $("#chart-one ." + self.group).attr("fill", "#c13d8c"); 
    $("#chart-one .bartext").attr("opacity", "0"); 
    $("#chart-one .bartext." + self.group).attr("opacity", "1"); 
  };
  
  // Transitions only
  ChartOne.prototype.update = function(data) {
    var self = this;
    self.data = data;
  };
  ChartOne.prototype.resize = function() {
    var self = this;
    self.svg.remove();
    self.drawChart();
    self.update(self.data);
  };
  return ChartOne;
})();

