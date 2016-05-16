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

$(document).ready(function() {    
  var is_iframe = (getUrlVars().iframe === 'true');
  console.log(is_iframe);


  var chart_one = new ChartOne('#chart-one', 'data/life_salary.csv', {isIframe: is_iframe});
  var chart_two = new ChartTwo('#chart-two', 'data/wage_distribution.csv', {isIframe: is_iframe});
  var chart_three = new ChartThree('#chart-three', 'data/lifesalary_vs_median.csv', {isIframe: is_iframe});

  $(".form-control").change(function(el) {
    var group = $(this)[0].value;

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
  });
});

// pym.js

var pymChild = new pym.Child();
