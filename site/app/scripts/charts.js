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
              return "<h4>" + d.profession_name + "</h4><p>" + d.lifesalary + "</p>";
            })
          self.chart.call(tip);

          bar.append("rect")
              .attr("class", function(d) { return "element d3-tip " + d.group; })
              .attr("y", function(d) { return y(parseInt(d.lifesalary)); })
              .attr("height", function(d) { return self.height - y(parseInt(d.lifesalary)); })
              .attr("fill", "lightgrey")
              .attr("width", x.rangeBand())
              // FIXME: is this line necessary? we define the tip above
              .attr("title", function(d) { return "<h4>" + d.profession_name + "</h4><p>" + d.lifesalary + "</p>"; })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
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
          y.domain([0, d3.max(data, function(d) { return parseInt(d.P90); })]);
          //y.domain([0, d3.max(data, function(d) { return parseInt(d.median); })]);
          //y.domain([d3.min(data, function(d) { return parseInt(d.P10)}), d3.max(data, function(d) { return parseInt(d.P90); })]);
          
          // Initialize tooltip
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<h4>" + d.profession_name + "</h4><p>" + d.P90 + "</p><p>" + d.median + "</p>";
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
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
          
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
 
          // Initialize tooltip
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<h4>" + d.profession_name + "</h4><p>" + d.lifesalary + "</p><p>" + d.median + "</p>";
            })
          self.chart.call(tip);

          var dot = self.chart.selectAll("g")
              .data(data)
            .enter().append("g");

          dot.append("circle")
              .attr("class", function(d) { return "element d3-tip" + d.group; })
              .attr("cx", function(d) { return x(parseInt(d.lifesalary)); })
              .attr("cy", function(d) { return y(parseInt(d.median)); })
              .attr("r", 5)
              .attr("fill", "#F8F0DE")
              .attr("stroke", "#ECDAB5")
              .attr("fill-opacity", 0.6)
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
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
