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
    var xAxisMargin = 60;
    var yAxisMargin = 60;
    // Set up scales
    var x = d3.scale.ordinal()
          .rangeRoundBands([0, self.width], .1);
          //.rangeRoundBands([0, self.width - yAxisMargin], .1);
    var y = d3.scale.linear()
         // .range([self.height-xAxisMargin, xAxisMargin*2]);
          .range([0, self.height]);

    // Create SVG container
    self.svg = self.chartContainer.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox','0 0 '+self.width+' '+self.height)
        .attr("preserveAspectRatio", "xMinYMin meet");
    self.chart = self.svg.append('g');
        // .attr('transform', 'translate(' + yAxisMargin + ',' + -xAxisMargin + ')');

    // Get the data to draw from
    d3.csv(self.data, function (error, data) {
      // Init data and domains
      data = data.sort(function(a, b){ return d3.ascending(a.lifesalary, b.lifesalary);});
      var maxvalue = d3.max(data, function(d) { return parseInt(d.lifesalary); });
      x.domain(data.map(function(d) { return d.profession_name; }));
      y.domain([maxvalue, 0]);

      // Draw!
      // Start by creating groups for the bars and associated objects
      var bar = self.chart.selectAll("g")
          .data(data)
        .enter().append("g")
          .attr("width", 20)
          .attr("transform", function(d) { return "translate(" + x(d.profession_name) + ",0)"; });

      // Bars
      bar.append("rect")
        .attr("name", function(d) { return d.profession_name; })
        .attr("class", function(d) { return "bar element " + d.group; })
        .attr("y", function(d) { return y(parseInt(d.lifesalary)); })
        .attr("height", function(d) { return self.height - y(parseInt(d.lifesalary)); })
        .attr("fill", "lightgrey")
        .attr("width", x.rangeBand())
        .on('mouseover', function(d) {
          $('#chart-one-title').text(d.profession_name);
          $('#chart-one-subtitle').html("<strong>Livslön</strong>: " + Number((d.lifesalary/1000000).toFixed(1)) + " milj. kronor");
        })
        .on('mouseout', function(d) {
          $('#chart-one-title').text("Yrkesgrupp vs. Livslön");
          $('#chart-one-subtitle').html("&nbsp;");
          self.applyHighlight();
        });

    // Mobile swipe events
    var touchScale = d3.scale.linear().domain([x.rangeBand(),self.width]).range([0,data.length+1]).clamp(true);
    //var touchScale = d3.scale.linear().domain([yAxisMargin,self.width]).range([0,data.length]).clamp(true);
    function onTouchMove() {
      var xPos = d3.touches(this)[0][0];
      var d = data[~~touchScale(xPos)];
      // reset colors and highlight the touched one
      self.applyHighlight();
      d3.select('[name="' + d.profession_name + '"]').attr("fill", "darkred");
      $('#chart-one-title').text(d.profession_name);
      $('#chart-one-subtitle').html("<strong>Livslön</strong>: " + Number((d.lifesalary/1000000).toFixed(1)) + " milj. kronor");
    }
    self.svg.on('touchmove.chart1', onTouchMove);

      // Vertical axis
      var yAxis = d3.svg.axis() 
        .scale(y)
        .ticks(4, "s")
        .orient("left");
      self.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + yAxisMargin*1.2 + ", 0)")
        .call(yAxis);
      // Remove tick for 0
      d3.selectAll('g.tick')
        .filter(function(d){ return d==0;} )
        .select('text')
        .style('visibility', 'hidden');
      // Axis labels
      self.svg.append("text")
        .text("Yrkesgrupp")
        .attr("class", "axis legend")
        .style("background", "white")
        .style("text-transform", "uppercase")
        .attr("transform", "translate(" + yAxisMargin + "," + (self.height-xAxisMargin/3) + ")")
        .style("text-anchor", "start");
      self.svg.append("text")
        .text("Livslön (milj. kr)")
        .attr("class", "axis legend")
        .attr("transform", "translate(" + yAxisMargin/2 + "," + (self.height-xAxisMargin) + ") rotate(-90)")
        .style("text-anchor", "start")
        .style("background-color", "white");
    
    // Text labels for highlighted bars
    self.chart.selectAll("text")
      .data(data)
      .enter().append("text")
        .attr("class", function(d) { return "bartext " + d.group; })
        .attr("transform", function(d) { 
          var tx = x(d.profession_name);
          var ty = y(parseInt(d.lifesalary));
          return "translate(10,-5)rotate(-30 " + tx + " " + ty + ")"; 
        })
        .style("z-index", 100)
        .attr("fill", "red")
        .attr("opacity", "0")
        .attr("x", function(d,i) { return x(d.profession_name); })
        .attr("y", function(d,i) { return y(parseInt(d.lifesalary)); })
        .text(function(d){ return d.profession_name; });
    });

    // Send resize signal to parent page
    if (self.opts.isIframe) {
      pymChild.sendHeight();
    }
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

