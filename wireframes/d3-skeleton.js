
Chart = (function() {
    function Chart(selector, data, opts) {
        var self = this;
        self.container = d3.select(selector);
        defaultOpts = {
            isIframe: false
        }
        self.opts = extend(defaultOpts, opts);

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
    Chart.prototype.drawChart = function() {
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

        // Send resize signal to parent page
        if (self.opts.isIframe) {
            pymChild.sendHeight();
        }
    }

    // Transitions only
    Chart.prototype.update = function(data) {
        var self = this;
        self.data = data;

    }


    Chart.prototype.resize = function() {
        var self = this;
        self.svg.remove();
        self.drawChart();
        self.update(self.data);
    }
    return Chart;
})();