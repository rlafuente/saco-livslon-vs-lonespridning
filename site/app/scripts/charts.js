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
        self.drawChartOne();

        // Do transitions
        self.update(data);

        // Make responsize
        d3.select(window).on('resize', function() {
            self.resize();
        });
    }
    // Draw DOM elements
    ChartOne.prototype.drawChartOne = function() {
        var self = this;
        var containerWidth = self.container[0][0].offsetWidth;

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
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

          data = data.sort(function(a, b){ return parseInt(b.value) - parseInt(a.value)});

          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

          bar.append("rect")
              .attr("y", function(d) { return y(parseInt(d.value)); })
              .attr("height", function(d) { return self.height - y(parseInt(d.value)); })
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
        self.drawChartOne();
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
        self.drawChartTwo();

        // Do transitions
        self.update(data);

        // Make responsize
        d3.select(window).on('resize', function() {
            self.resize();
        });
    }
    // Draw DOM elements
    ChartTwo.prototype.drawChartTwo = function() {
        var self = this;
        var containerWidth = self.container[0][0].offsetWidth;

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
          console.log(data);

          x.domain(data.map(function(d) { return +d.median; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.median); })]);

          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(+d.median) + ",0)"; });

          bar.append("rect")
              .attr("y", function(d) { return y(d.p90); })
              .attr("height", function(d) { return self.height - y(parseInt(d.p90 - d.p10)); })
              .attr("width", x.rangeBand())
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("fill", "#ECDAB5");

          // quartiles
          bar.append("rect")
              .attr("y", function(d) { return y(d.q3); })
              .attr("height", function(d) { return self.height - y(parseInt(d.q3 - d.q1)); })
              .attr("width", x.rangeBand())
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("fill", "#BDA164");
          
          // median
          bar.append("circle")
              .attr("cy", function(d) { return y(d.median); })
              .attr("r", function(d) { return 3; })
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
        self.drawChartTwo();
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
        self.drawChartThree();

        // Do transitions
        self.update(data);

        // Make responsize
        d3.select(window).on('resize', function() {
            self.resize();
        });
    }
    // Draw DOM elements
    ChartThree.prototype.drawChartThree = function() {
        var self = this;
        var containerWidth = self.container[0][0].offsetWidth;

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
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

          data = data.sort(function(a, b){ return parseInt(b.value) - parseInt(a.value)});

          var bar = self.chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("width", 20)
              .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

          bar.append("rect")
              .attr("y", function(d) { return y(parseInt(d.value)); })
              .attr("height", function(d) { return self.height - y(parseInt(d.value)); })
              .attr("width", x.rangeBand());

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
        self.drawChartThree();
        self.update(self.data);
    }
    return ChartThree;
})();
