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
    var xAxisMargin = 30;
    var yAxisMargin = 50;
    // Set up scales
    var x = d3.scale.ordinal()
          // .rangeRoundBands([0, self.width], .1);
          .rangeRoundBands([0, self.width - yAxisMargin], .1);
    var y = d3.scale.linear()
          .range([xAxisMargin, self.height-xAxisMargin]);
          // .range([self.height-xAxisMargin, xAxisMargin*2]);
          // .range([0, self.height]);
    var yAxisScale = d3.scale.linear()
          .range([0, self.height-xAxisMargin]);

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
      data = data.sort(function(a, b){ return d3.ascending(a.lifesalary, b.lifesalary);});
      var maxvalue = d3.max(data, function(d) { return parseInt(d.lifesalary); });
      x.domain(data.map(function(d) { return d.profession_name; }));
      y.domain([maxvalue, 0]);
      yAxisScale.domain([maxvalue, 0]);

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
        .scale(yAxisScale)
        .ticks(3, "s")
        .tickFormat(function(d) { return formatMillionSEK(d); })
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
        .attr("transform", "translate(" + yAxisMargin*1.4 + "," + (self.height-xAxisMargin/3) + ")")
        .style("text-anchor", "start");
      self.svg.append("text")
        .text("Livslön (milj. kr)")
        .attr("class", "axis legend")
        .attr("transform", "translate(" + yAxisMargin/4 + "," + (self.height-xAxisMargin) + ") rotate(-90)")
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
        var fontSize = m.bottom * 0.7 + "px";

        // margin value to make room for the y-axis
        var xAxisMargin = 30;
        var yAxisMargin = 50;

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
          console.log(minvalue);
          console.log(maxvalue);

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
        var touchScale = d3.scale.linear().domain([0,self.width]).range([0,data.length]).clamp(true);
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
            .tickFormat(function(d) { return formatMillionSEK(d); })
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
            .text("Månadslön")
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


/*
 * Scatterplot
 */

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
    }
    // Draw DOM elements
    ChartThree.prototype.drawChart = function() {
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
        var fontSize = m.bottom * 0.7 + "px";

        // margin value to make room for the axes
        var xAxisMargin = 50;
        var yAxisMargin = 50;

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox','0 0 ' + self.width +' '+ self.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        self.chart = self.svg.append('g');
            // .attr('transform', 'translate(' + yAxisMargin + ',' + -xAxisMargin + ')');
        var circleRadius = self.width / 100;
        var x = d3.scale.linear()
              .range([circleRadius + yAxisMargin, self.width-circleRadius-yAxisMargin]);
        var y = d3.scale.linear()
              .range([self.height-circleRadius-xAxisMargin, circleRadius + xAxisMargin]);

        d3.csv(self.data, function (error, data) {
          x.domain([d3.min(data, function(d) { return parseFloat(d.lifesalary_vs_baseline); }), 
                    d3.max(data, function(d) { return parseFloat(d.lifesalary_vs_baseline); })]);
          y.domain([d3.min(data, function(d) { return parseFloat(d.income_range); }), 
                    d3.max(data, function(d) { return parseFloat(d.income_range); })]);
 
          // Sort data so that touch events follow proper order
          data.sort(function(a,b) { return a.lifesalary_vs_baseline - b.lifesalary_vs_baseline; });

          var dot = self.chart.selectAll("g")
              .data(data)
            .enter().append("g");

          dot.append("circle")
              .attr("name", function(d) { return d.profession_name; })
              .attr("class", function(d) { return "element d3-tip " + d.group; })
              .attr("cx", function(d) { return x(parseFloat(d.lifesalary_vs_baseline)); })
              .attr("cy", function(d) { return y(parseFloat(d.income_range)); })
              .attr("r", circleRadius)
              .attr("fill", "#F8F0DE")
              .attr("stroke", "#BDA164")
              .attr("stroke-width", "1")
              .attr("fill-opacity", 0.2)

              .on('mouseover', function(d) {
                d3.select(this).attr('fill-opacity', 1);
                $('#chart-three-title').text(d.profession_name);
                $('#chart-three-subtitle-1').html(
                    "<strong>Lönespridning (P90/P10)</strong>: " + Number(parseFloat(d.income_range).toFixed(2))
                );
                $('#chart-three-subtitle-2').html(
                    "<strong>Livslön jämfört med gymnasieutbildad</strong>: " + Number(parseFloat(d.lifesalary_vs_baseline).toFixed(2)) + " procent"
                );
              })
              .on('mouseout', function(d) {
                d3.select(this).attr('fill-opacity', 0.2);
                $('#chart-three-title').text("Livslön jämfört med gymnasieutbildad vs Lönespridning (P90/P10)");
                $('#chart-three-subtitle-1').html("&nbsp;");
                $('#chart-three-subtitle-2').html("&nbsp;");
              });


        // Mobile swipe events
        // var touchScale = d3.scale.linear().domain([yAxisMargin,self.width]).range([0,data.length]).clamp(true);
        var touchScale = d3.scale.linear().domain([yAxisMargin,self.width]).range([0,data.length]).clamp(true);
        function onTouchMove() {
          var xPos = d3.touches(this)[0][0];
          var d = data[~~touchScale(xPos)];
          // reset colors and highlight the touched one
          self.applyHighlight();
          var sel = d3.select('#chart-three [name="' + d.profession_name + '"]').style("fill", "darkred").style("opacity", "0.8");
          $('#chart-three-title').text(d.profession_name);
          $('#chart-three-subtitle-1').html(
              "<strong>Lönespridning (P90/P10)</strong>: " + Number(parseFloat(d.income_range).toFixed(2))
          );
          $('#chart-three-subtitle-2').html(
              "<strong>Livslön jämfört med gymnasieutbildad</strong>: " + Number(parseFloat(d.lifesalary_vs_baseline).toFixed(2)) + " procent"
          );
          console.log("Touched!")
        }
        self.svg.on('touchmove.chart3', onTouchMove);


          var xAxis = d3.svg.axis() 
            .scale(x)
            .ticks(Math.floor(self.width/120), "s")
            .tickFormat(d3.format(".0%"))
            .orient("bottom");
          self.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (self.height-xAxisMargin) + ")")
            .call(xAxis);
          var yAxis = d3.svg.axis() 
            .scale(y)
            .ticks(Math.floor(self.width/120), "s")
            .orient("left");
          self.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + yAxisMargin + ", 0)")
            .call(yAxis);

          self.svg.append("text")
            .text("Lönespridning (P90/P10)")
            .attr("class", "axis legend")
            .style("background", "white")
            .style("text-transform", "uppercase")
            .attr("transform", "translate(" + yAxisMargin + "," + (self.height-xAxisMargin/3) + ")")
            .style("text-anchor", "start");
          self.svg.append("text")
            .text("Livslön jämfört med gymnasieutbildad")
            .attr("class", "axis legend")
            .attr("transform", "translate(" + yAxisMargin/2 + "," + (self.height-xAxisMargin) + ") rotate(-90)")
            .style("text-anchor", "start")
            .style("background-color", "white");

        });

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
    }

    ChartThree.prototype.applyHighlight = function(group) {
      if (group && group != self.group) { self.group = group; }
      d3.selectAll("#chart-three .element").style("fill", "#ECDAB5"); 
      d3.selectAll("#chart-three ." + self.group).style("fill", "#c13d8c");  
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

var locale = d3.locale({
  "decimal": ",",
  "thousands": "\xa0",
  "grouping": [3],
  "currency": ["", " kr"],
  "dateTime": "%A %e %B %Y kl. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"],
  "shortDays": ["må", "ti", "ons", "to", "fre", "lö", "sö"],
  "months": ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
  "shortMonths": ["jan", "feb", "mars", "apr", "maj", "jun", "jul", "aug", "sept", "okt", "nov", "dec"]
})
var formatMillionSEK = function(d) {
	return locale.numberFormat(".2s")(d)
		.replace('k', ' tKr')
		.replace('M', ' Mkr'); 
}
var formatInSentence = function(d) {
	return locale.numberFormat(".3s")(d)
		.replace('k', '&nbsp;000 kronor')
		.replace('M', '&nbsp;miljoner kronor'); 
}
var formatPercent = function(d) {
  return locale.numberFormat("%")(d);
}
var formatPercentInSentence = function(d) {
  return locale.numberFormat("%")(d)
    .replace('%', ' procent');
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
} 

// Set up charts
var chart_one;
var chart_two;
var chart_three;

function setTextBlocks(group) {
  $.ajax({
    type: "GET",
    url: 'data/copy-stories.csv',
    dataType: "text",
    success: function(data) {
      // dropdown options
      csv = $.csv.toObjects(data);
      var title = csv[0][group];
      var text1 = csv[1][group];
      var text2 = csv[2][group];
      var text3 = csv[3][group];
      $("#text-block-1").html(text1);
      $("#text-block-2").html(text2);
      $("#text-block-3").html(text3);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("Status: " + xhr.status + "     Error: " + thrownError);
    }
  });
};

function loadCharts() {
  var is_iframe = (getUrlVars().iframe === 'true');
  var csvfile = 'data/development_data.csv';
  chart_one = new ChartOne('#chart-one', csvfile, {isIframe: is_iframe});
  chart_two = new ChartTwo('#chart-two', csvfile, {isIframe: is_iframe});
  chart_three = new ChartThree('#chart-three', csvfile, {isIframe: is_iframe});
  return 'ready';
}

function setChartHighlight(group) {
  chart_one.applyHighlight(group);
  chart_two.applyHighlight(group);
  chart_three.applyHighlight(group);
}

$(document).ready(function() {
  setTextBlocks('education');
  var chart_ready = loadCharts();
  function isChartReady() {
    if (chart_ready === 'ready') {
      setChartHighlight('education');
    }
  }
  setTimeout(isChartReady, 1000);
  
  $(".selectpicker").change(function(el) {
    var group = $(this)[0].value;
    $(".content").animate({opacity: 0}, 300, function() { 
      setTextBlocks(group); 
      setChartHighlight(group); 
    });
    $(".content").animate({opacity: 1});
  });

});

// pym.js

var pymChild = new pym.Child();
