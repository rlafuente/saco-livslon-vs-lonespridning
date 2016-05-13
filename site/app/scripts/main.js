$(document).ready(function() {    
  var chart_one = new ChartOne('#chart-one', 'data/life_salary.csv');
  var chart_two = new ChartTwo('#chart-two', 'data/wage_distribution.csv');
  var chart_three = new ChartThree('#chart-three', 'data/life_salary.csv');
});
