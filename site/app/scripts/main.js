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

  $("#chart-two .median").attr("fill", "#F8F0DE"); 
  $("#chart-two .quartiles").attr("fill", "#BDA164"); 
  $("#chart-two .edges").attr("fill", "#ECDAB5"); 
  $("#chart-two .median." + group).attr("fill", "#eecae0"); 
  $("#chart-two .quartiles." + group).attr("fill", "#c13d8c"); 
  $("#chart-two .edges." + group).attr("fill", "#d67db2"); 

  $("#chart-three .element").attr("stroke", "#ECDAB5"); 
  $("#chart-three ." + group).attr("stroke", "#c13d8c");  
}

function setTextBlocks(group) {
  console.log("Setting text blocks");
  $.ajax({
    type: "GET",
    url: 'data/text_copy.csv',
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
  var chart_one = new ChartOne('#chart-one', 'data/life_salary.csv', {isIframe: is_iframe});
  var chart_two = new ChartTwo('#chart-two', 'data/wage_distribution.csv', {isIframe: is_iframe});
  var chart_three = new ChartThree('#chart-three', 'data/lifesalary_vs_median.csv', {isIframe: is_iframe});
  return 'ready';
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
  
  $(".form-control").change(function(el) {
    var group = $(this)[0].value;
    setChartHighlight(group);
    setTextBlocks(group);
  });

  

});

// pym.js

var pymChild = new pym.Child();
