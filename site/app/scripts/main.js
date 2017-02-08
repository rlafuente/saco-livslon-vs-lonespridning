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
});
var formatMillionSEK = function(d) {
	return locale.numberFormat(".2s")(d)
		.replace('k', ' tKr')
		.replace('M', ' Mkr'); 
};
var formatInSentence = function(d) {
	return locale.numberFormat(".3s")(d)
		.replace('k', '&nbsp;000 kronor')
		.replace('M', '&nbsp;miljoner kronor'); 
};
var formatPercent = function(d) {
  return locale.numberFormat("%")(d);
};
var formatPercentInSentence = function(d) {
  return locale.numberFormat("%")(d)
    .replace('%', ' procent');
};

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
      $('[value="education"]').text(csv[0].education);
      $('[value="humanities"]').text(csv[0].humanities);
      $('[value="healthcare"]').text(csv[0].healthcare);
      $('[value="social"]').text(csv[0].social);

      var title = csv[0][group];
      var text1 = csv[1][group];
      var text2 = csv[2][group];
      var text3 = csv[3][group];
      $("#text-block-1").html(text1);
      $("#text-block-2").html(text2);
      $("#text-block-3").html(text3);
      $("#chart-caption-1").html(title);
      $("#chart-caption-2").html(title);
      $("#chart-caption-3").html(title);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("Status: " + xhr.status + "     Error: " + thrownError);
    }
  });
}
function setChartTooltips() {
  $.ajax({
    type: "GET",
    url: 'data/copy-general.csv',
    dataType: "text",
    success: function(data) {
      // dropdown options
      csv = $.csv.toObjects(data);
      $("#main-title").text(csv[0].text);
      $("#intro-text").html(csv[1].text);
      chart_one.tooltip = csv[2].text;
      chart_two.tooltip = csv[3].text;
      chart_three.tooltip = csv[4].text;
      chart_one.title = csv[11].text;
      $("#chart-one-title").text(csv[11].text);
      chart_two.title = csv[12].text;
      $("#chart-two-title").text(csv[12].text);
      chart_three.title = csv[13].text;
      $("#chart-three-title").text(csv[13].text);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("Status: " + xhr.status + "     Error: " + thrownError);
    }
  });
}

function loadCharts() {
  var is_iframe = (getUrlVars().iframe === 'true');
  var csvfile = 'data/data-latest.csv';
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
  setTextBlocks('humanities');
  var chart_ready = loadCharts();
  function isChartReady() {
    if (chart_ready === 'ready') {
      setChartTooltips();
      setChartHighlight('humanities');
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

  // pym.js
  function resizeCallback(d) {
    chart_one.on_resize(d);
    chart_three.on_resize(d);
  }
  var pymChild = new pym.Child({renderCallback: resizeCallback});
});

