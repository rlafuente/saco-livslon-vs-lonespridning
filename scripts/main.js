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

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', w + m.left + m.right)
            .attr('height', h + m.top + m.bottom);
        self.chart = self.svg.append('g')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')');

        var x = d3.scale.ordinal()
              .rangeRoundBands([0, self.width], .1);
        var y = d3.scale.linear()
              .range([self.height, 0]);

        d3.csv(self.data, function (error, data) {
          data = data.sort(function(a, b){ return d3.ascending(a.value, b.value);});

          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

          bar.append("rect")
              .attr("class", function(d) { return "element " + d.group; })
              .attr("y", function(d) { return y(parseInt(d.value)); })
              .attr("height", function(d) { return self.height - y(parseInt(d.value)); })
              .attr("fill", "lightgrey")
              .attr("width", x.rangeBand());

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

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', w + m.left + m.right)
            .attr('height', h + m.top + m.bottom);
        self.chart = self.svg.append('g')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')');

        var x = d3.scale.ordinal()
              .rangeRoundBands([0, self.width], .1);
        var y = d3.scale.linear()
              .range([self.height, 0]);

        d3.csv(self.data, function (error, data) {
          data = data.sort(function(a, b){ return d3.ascending(parseInt(a.median), parseInt(b.median)); });

          x.domain(data.map(function(d) { return +d.median; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.p90); })]);
          //y.domain([0, d3.max(data, function(d) { return parseInt(d.median); })]);
          //y.domain([d3.min(data, function(d) { return parseInt(d.p10)}), d3.max(data, function(d) { return parseInt(d.p90); })]);

          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(+d.median) + ",0)"; });

          bar.append("rect")
              .attr("class", function(d) { return "edges " + d.group; })
              .attr("y", function(d) { return y(d.p90); })
              .attr("height", function(d) { return self.height - y(parseInt(d.p90 - d.p10)); })
              .attr("width", x.rangeBand())
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("fill", "#ECDAB5");

          // quartiles
          bar.append("rect")
              .attr("class", function(d) { return "quartiles " + d.group; })
              .attr("y", function(d) { return y(d.q3); })
              .attr("height", function(d) { return self.height - y(parseInt(d.q3 - d.q1)); })
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
              .attr("id", function(d) { return d.name });
          
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

        // Create SVG container
        self.svg = self.chartContainer.append('svg')
            .attr('width', w + m.left + m.right)
            .attr('height', h + m.top + m.bottom);
        self.chart = self.svg.append('g')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')');

        var x = d3.scale.linear()
              .range([0, self.width]);
        var y = d3.scale.linear()
              .range([self.height, 0]);

        d3.csv(self.data, function (error, data) {
          x.domain([d3.min(data, function(d) { return parseInt(d.lifesalary); }), d3.max(data, function(d) { return parseInt(d.lifesalary); })]);
          y.domain([d3.min(data, function(d) { return parseInt(d.median); }), d3.max(data, function(d) { return parseInt(d.median); })]);

          var dot = self.chart.selectAll("g")
              .data(data)
            .enter().append("g");

          dot.append("circle")
              .attr("class", function(d) { return "element " + d.group; })
              .attr("cx", function(d) { return x(parseInt(d.lifesalary)); })
              .attr("cy", function(d) { return y(parseInt(d.median)); })
              .attr("r", 5)
              .attr("fill", "#F8F0DE")
              .attr("stroke", "#ECDAB5")
              .attr("fill-opacity", 0.6);
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
  console.log('Setting highlight: ' + group);
  $("#chart-one .element").attr("fill", "#ECDAB5"); 
  $("#chart-one ." + group).attr("fill", "#c13d8c"); 

  $("#chart-two .median").attr("fill", "#F8F0DE"); 
  $("#chart-two .quartiles").attr("fill", "#BDA164"); 
  $("#chart-two .edges").attr("fill", "#ECDAB5"); 
  $("#chart-two .median." + group).attr("fill", "#eecae0"); 
  $("#chart-two .quartiles." + group).attr("fill", "#c13d8c"); 
  $("#chart-two .edges." + group).attr("fill", "#d67db2"); 

  $("#chart-three .element").attr("stroke", "#ECDAB5"); 
  $("#chart-three ." + group).attr("stroke", "#c13d8c");  
}

function loadCharts() {
  var is_iframe = (getUrlVars().iframe === 'true');
  var chart_one = new ChartOne('#chart-one', 'data/life_salary.csv', {isIframe: is_iframe});
  var chart_two = new ChartTwo('#chart-two', 'data/wage_distribution.csv', {isIframe: is_iframe});
  var chart_three = new ChartThree('#chart-three', 'data/lifesalary_vs_median.csv', {isIframe: is_iframe});
  return 'ready';
}

$(document).ready(function() {    
  
  var chart_ready = loadCharts();
  function isChartReady() {
    if (chart_ready === 'ready') {
      console.log('Chart ready, highlighting');
      setChartHighlight('education');
    }
  }
  setTimeout(isChartReady, 1000);
  
  $(".form-control").change(function(el) {
    var group = $(this)[0].value;
    setChartHighlight(group);
  });

  

});

// pym.js

var pymChild = new pym.Child();
