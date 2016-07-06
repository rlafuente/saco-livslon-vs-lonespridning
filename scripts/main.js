ChartOne = (function() {
    function ChartOne(selector, data, opts) {
        var self = this;
        self.container = d3.select(selector);
        defaultOpts = {
            isIframe: false
        }
        self.opts = $.extend(defaultOpts, opts);

        // Inital state
        self.data = data;

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
    ChartOne.prototype.drawChart = function() {
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
        var yAxisMargin = 30;

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox','0 0 '+self.width+' '+self.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        self.chart = self.svg.append('g')
            .attr('transform', 'translate(' + yAxisMargin + ',0)');

        var x = d3.scale.ordinal()
              .rangeRoundBands([0, self.width - yAxisMargin], .1);
        var y = d3.scale.linear()
              .range([self.height, 0]);
              
        
        d3.csv(self.data, function (error, data) {
          data = data.sort(function(a, b){ return d3.ascending(a.lifesalary, b.lifesalary);});

          x.domain(data.map(function(d) { return d.profession_name; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.lifesalary); })]);

          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(d.profession_name) + ",0)"; });
          
          // Initialize tooltip
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<p><strong>Yrke</strong>: " + d.profession_name + "</p>" + 
                     "<p><strong>Livslön</strong>: " + Number((d.lifesalary/1000000).toFixed(1)) + " milj. kronor</p>";
            })
          self.chart.call(tip);

          bar.append("rect")
              .attr("class", function(d) { return "element d3-tip " + d.group; })
              .attr("y", function(d) { return y(parseInt(d.lifesalary)); })
              .attr("height", function(d) { return self.height - y(parseInt(d.lifesalary)); })
              .attr("fill", "lightgrey")
              .attr("width", x.rangeBand())
              .on('mouseover', function(d) {
                $('#chart-one-title').text(d.profession_name);
                $('#chart-one-subtitle').html("<strong>Livslön</strong>: " + Number((d.lifesalary/1000000).toFixed(1)) + " milj. kronor");
              })
              .on('mouseout', function(d) {
                $('#chart-one-title').text("Title");
                $('#chart-one-subtitle').html("Subtitle");
              });

          var yAxis = d3.svg.axis() 
            .scale(y)
            .ticks(4, "s")
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


      var yTextPadding = 0;

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
	      .attr("x", function(d,i) {
	          // return x(d.profession_name)+x.rangeBand()/2;
	          return x(d.profession_name);
	      })
	      .attr("y", function(d,i) {
	          return y(parseInt(d.lifesalary));
	      })
	      .text(function(d){
	           return d.profession_name;
	      });

        });

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
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
        var yAxisMargin = 30;

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
        var y = d3.scale.linear()
              .range([self.height, 0]);

        d3.csv(self.data, function (error, data) {
          data = data.sort(function(a, b){ return d3.ascending(parseInt(a.median), parseInt(b.median)); });

          x.domain(data.map(function(d) { return +d.median; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.P90); })]);
          //y.domain([0, d3.max(data, function(d) { return parseInt(d.median); })]);
          //y.domain([d3.min(data, function(d) { return parseInt(d.P10)}), d3.max(data, function(d) { return parseInt(d.P90); })]);
          
          // Initialize tooltip
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<p><strong>Yrke</strong>: " + d.profession_name + "</p>" + 
                     "<p><strong>Månadslön, lägst 10%</strong>: " + d.P10 + " kronor</p>" +
                     "<p><strong>Månadslön, högsta 10%</strong>: " + d.P90 + " kronor</p>";
            })
          self.chart.call(tip);

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

          // transparent overlay for tooltips
          bar.append("rect")
              .attr("class", function(d) { return "tip-overlay d3-tip " + d.group; })
              .attr("y", function(d) { return y(d.P90); })
              .attr("height", function(d) { return self.height - y(parseInt(d.P90 - d.P10)); })
              .attr("width", x.rangeBand())
              .style("opacity", "0")
              .attr("rx", 3)
              .attr("ry", 3)
              .on('mouseover', function(d) {
                $('#chart-two-title').text(d.profession_name);
                $('#chart-two-subtitle-1').html("<strong>Månadslön, lägst 10%</strong>: " + d.P10 + " kronor");
                $('#chart-two-subtitle-2').html("<strong>Månadslön, högsta 10%</strong>: " + d.P90 + " kronor");
              })
              .on('mouseout', function(d) {
                $('#chart-two-title').text("Title");
                $('#chart-two-subtitle-1').html("Subtitle");
                $('#chart-two-subtitle-2').html("&nbsp;");
              });
 
          var yAxis = d3.svg.axis() 
            .scale(y)
            .ticks(8, "s")
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

         
        });

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
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
        var xAxisMargin = 30;
        var yAxisMargin = 30;

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox','0 0 ' + self.width +' '+ self.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        self.chart = self.svg.append('g')
            .attr('transform', 'translate(' + yAxisMargin + ',' + -xAxisMargin + ')');

        var x = d3.scale.linear()
              .range([20, self.width - 20 - yAxisMargin]);
        var y = d3.scale.linear()
              .range([self.height-xAxisMargin, xAxisMargin*2]);

        d3.csv(self.data, function (error, data) {
          x.domain([d3.min(data, function(d) { return parseInt(d.lifesalary); }), 
                    d3.max(data, function(d) { return parseInt(d.lifesalary); })]);
          y.domain([d3.min(data, function(d) { return parseInt(d.median); }), 
                    d3.max(data, function(d) { return parseInt(d.median); })]);
 
          var dot = self.chart.selectAll("g")
              .data(data)
            .enter().append("g");

          dot.append("circle")
              .attr("class", function(d) { return "element d3-tip " + d.group; })
              .attr("cx", function(d) { return x(parseInt(d.lifesalary)); })
              .attr("cy", function(d) { return y(parseInt(d.median)); })
              .attr("r", self.width/100)
              .attr("fill", "#F8F0DE")
              .attr("stroke", "#BDA164")
              .attr("stroke-width", "1px")
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
                $('#chart-three-title').text("Title");
                $('#chart-three-subtitle-1').html("Subtitle");
                $('#chart-three-subtitle-2').html("&nbsp;");
              });
  
          var xAxis = d3.svg.axis() 
            .scale(x)
            .ticks(8, "s")
            .orient("bottom");
          self.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (self.height-xAxisMargin) + ")")
            .call(xAxis);

          var yAxis = d3.svg.axis() 
            .scale(y)
            .ticks(8, "s")
            .orient("left");
          self.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + yAxisMargin*1.2 + ", 0)")
            .call(yAxis);


        });

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
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

function setChartHighlight(group) {
  $("#chart-one .element").attr("fill", "#ECDAB5"); 
  $("#chart-one ." + group).attr("fill", "#c13d8c"); 
  $("#chart-one .bartext").attr("opacity", "0"); 
  $("#chart-one .bartext." + group).attr("opacity", "1"); 

  $("#chart-two .median").attr("fill", "#F8F0DE"); 
  $("#chart-two .quartiles").attr("fill", "#BDA164"); 
  $("#chart-two .edges").attr("fill", "#ECDAB5"); 
  $("#chart-two .median." + group).attr("fill", "#eecae0"); 
  $("#chart-two .quartiles." + group).attr("fill", "#c13d8c"); 
  $("#chart-two .edges." + group).attr("fill", "#d67db2"); 
  $("#chart-two .bartext." + group).attr("opacity", "1"); 

  $("#chart-three .element").attr("fill", "#ECDAB5"); 
  $("#chart-three ." + group).attr("fill", "#c13d8c");  
}

function setTextBlocks(group) {
  console.log("Setting text blocks");
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
  var chart_one = new ChartOne('#chart-one', csvfile, {isIframe: is_iframe});
  var chart_two = new ChartTwo('#chart-two', csvfile, {isIframe: is_iframe});
  var chart_three = new ChartThree('#chart-three', csvfile, {isIframe: is_iframe});
  return 'ready';
}

$(document).ready(function() {

  setTextBlocks('education');
  
  var chart_ready = loadCharts();
  function isChartReady() {
    if (chart_ready === 'ready') {
      console.log('chart ready');
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
