function getUrlVars(){for(var t,e=[],a=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),r=0;r<a.length;r++)t=a[r].split("="),e.push(t[0]),e[t[0]]=t[1];return e}function setTextBlocks(t){$.ajax({type:"GET",url:"data/copy-stories.csv",dataType:"text",success:function(e){csv=$.csv.toObjects(e),$('[value="education"]').text(csv[0].education),$('[value="humanities"]').text(csv[0].humanities),$('[value="healthcare"]').text(csv[0].healthcare),$('[value="social"]').text(csv[0].social);var a=csv[0][t],r=csv[1][t],n=csv[2][t],i=csv[3][t];$("#text-block-1").html(r),$("#text-block-2").html(n),$("#text-block-3").html(i),$("#chart-caption-1").html(a),$("#chart-caption-2").html(a),$("#chart-caption-3").html(a)},error:function(t,e,a){alert("Status: "+t.status+"     Error: "+a)}})}function setChartTooltips(){$.ajax({type:"GET",url:"data/copy-general.csv",dataType:"text",success:function(t){csv=$.csv.toObjects(t),$("#main-title").text(csv[0].text),$("#intro-text").html(csv[1].text),chart_one.tooltip=csv[2].text,chart_two.tooltip=csv[3].text,chart_three.tooltip=csv[4].text,chart_one.title=csv[11].text,$("#chart-one-title").text(csv[11].text),chart_two.title=csv[12].text,$("#chart-two-title").text(csv[12].text),chart_three.title=csv[13].text,$("#chart-three-title").text(csv[13].text)},error:function(t,e,a){alert("Status: "+t.status+"     Error: "+a)}})}function loadCharts(){var t="true"===getUrlVars().iframe,e="data/data-latest.csv";return chart_one=new ChartOne("#chart-one",e,{isIframe:t}),chart_two=new ChartTwo("#chart-two",e,{isIframe:t}),chart_three=new ChartThree("#chart-three",e,{isIframe:t}),"ready"}function setChartHighlight(t){chart_one.applyHighlight(t),chart_two.applyHighlight(t),chart_three.applyHighlight(t)}ChartOne=function(){function t(t,e,a){var r=this;r.container=d3.select(t),defaultOpts={isIframe:!1},r.opts=$.extend(defaultOpts,a),r.data=e,r.width=0,r.group="education",r.chartContainer=r.container.append("div").attr("class","chart-container"),r.drawChart(),r.update(e),d3.select(window).on("resize",function(){r.resize()}),r.tooltip=""}return t.prototype.drawChart=function(){var t=this,e=t.container[0][0].offsetWidth;t.chartContainer.html(""),t.margins=m={top:.1*e,right:.1*e,bottom:.1*e,left:.1*e},t.width=w=e-m.left-m.right,t.height=h=.5*w;var a=(.7*m.bottom+"px",30),r=35,n=.1,i=d3.scale.ordinal().rangeRoundBands([0,t.width-r],n),o=d3.scale.linear().range([a,t.height]),l=d3.scale.linear().range([a,t.height]);t.svg=t.chartContainer.append("svg").attr("width","100%").attr("height","100%").attr("viewBox","0 0 "+t.width+" "+t.height).attr("preserveAspectRatio","xMinYMin meet"),t.chart=t.svg.append("g").attr("transform","translate("+r+","+-a+")"),d3.csv(t.data,function(e,n){function s(){var e=d3.touches(this)[0][0],a=n[~~d(e)];t.applyHighlight(),d3.select('[name="'+a.profession_label+'"]').attr("fill","#008ea1"),$("#chart-one-title").text(a.profession_label),$("#chart-one-subtitle").html(t.getTooltip(a))}n=n.sort(function(t,e){return d3.ascending(parseInt(t.baseline_diff),parseInt(e.baseline_diff))});var c=d3.max(n,function(t){return parseInt(t.baseline_diff)}),h=d3.min(n,function(t){return parseInt(t.baseline_diff)});i.domain(n.map(function(t){return t.profession_label})),o.domain([c,h]),l.domain([c,h]);var p=t.chart.selectAll("g").data(n).enter().append("g").attr("width",20).attr("transform",function(t){return"translate("+i(t.profession_label)+",0)"});p.append("rect").attr("name",function(t){return t.profession_label}).attr("class",function(t){return"bar element "+t.group}).attr("y",function(t){return o(t.baseline_diff<0?0:parseInt(t.baseline_diff))}).attr("height",function(t){return t.baseline_diff<0?o(parseInt(t.baseline_diff))-o(0):o(0)-o(parseInt(t.baseline_diff))}).attr("fill","lightgrey").attr("width",i.rangeBand()),p.append("rect").attr("name",function(t){return t.profession_label}).attr("class",function(t){return"bar-overlay "+t.group}).attr("y",0).attr("height",t.height).attr("width",i.rangeBand()+1).style("opacity","0").on("mouseover",function(e){t.applyHighlight(),d3.select('#chart-one [name="'+e.profession_label+'"]').attr("fill","#008ea1"),$("#chart-one-title").text(e.profession_label),$("#chart-one-subtitle").html(t.getTooltip(e))}).on("mouseout",function(e){t.applyHighlight(),$("#chart-one-title").text(t.title),$("#chart-one-subtitle").html("↔ Swipa för att se detaljer")});var d=d3.scale.linear().domain([r+i.rangeBand(),t.width]).range([0,n.length+1]).clamp(!0);t.svg.on("touchmove.chart1",s);var u=d3.svg.axis().scale(l).ticks(9).tickFormat(function(t){return t/1e6}).orient("left");t.svg.append("g").attr("class","axis").attr("transform","translate("+r+", "+-a+")").call(u),t.svg.append("line").attr("x1",r).attr("y1",o(0)-a).attr("x2",t.width).attr("y2",o(0)-a).style("stroke-width",1).style("stroke","#ECDAB5").style("fill","none"),t.svg.append("text").text("Yrkesgrupp").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+1.4*r+","+(t.height-a/3)+")").style("text-anchor","start"),t.svg.append("text").text("Livslön jfr med icke-akademiker").attr("class","axis legend").attr("transform","translate("+r/4+","+(t.height-a)+") rotate(-90)").style("text-anchor","start").style("background-color","white"),t.opts.isIframe&&pymChild.sendHeight()})},t.prototype.on_resize=function(t){var e=12-t/200;d3.selectAll(".bartext").style("font-size",e+"px"),t<600?$(".bartext").hide():$(".bartext").show()},t.prototype.getTooltip=function(t){var e=this;return e.tooltip.replace("{ lifesalary }",Number((t.lifesalary/1e6).toFixed(1))).replace("{ baseline_diff }",Number((Math.abs(t.baseline_diff)/1e6).toFixed(1))).replace("{mer/mindre}",function(e){return t.baseline_diff>0?"mer":"mindre"}).replace("{ baseline }",t.baseline)},t.prototype.applyHighlight=function(t){t&&t!=self.group&&(self.group=t),$("#chart-one .element").attr("fill","#ECDAB5"),$("#chart-one ."+self.group).attr("fill","#c13d8c"),$("#chart-one .bartext").attr("opacity","0"),$("#chart-one .bartext."+self.group).attr("opacity","1")},t.prototype.update=function(t){var e=this;e.data=t},t.prototype.resize=function(){var t=this;t.svg.remove(),t.drawChart(),t.update(t.data)},t}(),ChartTwo=function(){function t(t,e,a){var r=this;r.container=d3.select(t),defaultOpts={isIframe:!1},r.opts=$.extend(defaultOpts,a),r.data=e,r.group="education",r.chartContainer=r.container.append("div").attr("class","chart-container"),r.drawChart(),r.update(e),d3.select(window).on("resize",function(){r.resize()}),r.tooltip=""}return t.prototype.drawChart=function(){var t=this,e=t.container[0][0].offsetWidth;t.chartContainer.html(""),t.margins=m={top:.1*e,right:.1*e,bottom:.1*e,left:.1*e},t.width=w=e-m.left-m.right,t.height=h=.5*w,t.pointRadius=.01*e;var a=30,r=35;t.svg=t.chartContainer.append("svg").attr("width","100%").attr("height","100%").attr("viewBox","0 0 "+t.width+" "+t.height).attr("preserveAspectRatio","xMinYMin meet"),t.chart=t.svg.append("g").attr("transform","translate("+r+",0)");var n=d3.scale.ordinal().rangeRoundBands([0,t.width-r],.1),i=d3.scale.linear().range([t.height-a,0]);d3.csv(t.data,function(e,o){function l(){var e=d3.touches(this)[0][0],a=o[~~c(e)];t.applyHighlight();d3.select('#chart-two [name="'+a.profession_label+'"]').style("opacity",".4");$("#chart-two-title").text(a.profession_label),$("#chart-two-subtitle-1").html(t.getTooltip(a))}o=o.sort(function(t,e){return d3.ascending(parseInt(t.median),parseInt(e.median))}),minvalue=d3.min(o,function(t){return parseInt(t.P10)}),maxvalue=d3.max(o,function(t){return parseInt(t.P90)}),n.domain(o.map(function(t){return+t.median})),i.domain([2e4,d3.max(o,function(t){return parseInt(t.P90)})]);var s=t.chart.selectAll("g").data(o).enter().append("g").attr("width",20).attr("transform",function(t){return"translate("+n(+t.median)+",0)"});s.append("rect").attr("class",function(t){return"edges "+t.group}).attr("y",function(t){return i(t.P90)}).attr("height",function(t){return i(t.P10)-i(t.P90)}).attr("width",n.rangeBand()).attr("rx",3).attr("ry",3).attr("fill","#ECDAB5"),s.append("circle").attr("class",function(t){return"median "+t.group}).attr("cy",function(t){return i(t.median)}).attr("r",function(t){return 3}).attr("cx",n.rangeBand()/2).attr("fill","#F8F0DE").attr("id",function(t){return t.profession_label}),s.append("rect").attr("name",function(t){return t.profession_label}).attr("class",function(t){return"bar-overlay "+t.group}).attr("y",function(t){return i(t.P90)}).attr("height",function(t){return i(t.P10)-i(t.P90)}).attr("width",n.rangeBand()+1).style("opacity","0").style("fill","#008ea1").attr("rx",3).attr("ry",3).on("mouseover",function(e){t.applyHighlight();d3.select('#chart-two [name="'+e.profession_label+'"]').style("opacity",".4");$("#chart-two-title").text(e.profession_label),$("#chart-two-subtitle-1").html(t.getTooltip(e))}).on("mouseout",function(e){t.applyHighlight(),$("#chart-two-title").text(t.title),$("#chart-two-subtitle-1").html("↔ Swipa för att se detaljer"),$("#chart-two-subtitle-2").html("&nbsp;")});var c=d3.scale.linear().domain([r,t.width]).range([0,o.length]).clamp(!0);t.svg.on("touchmove.chart2",l);var h=d3.svg.axis().scale(i).ticks(6,"s").tickFormat(function(t){return t/1e3}).orient("left");t.svg.append("g").attr("class","axis").attr("transform","translate("+r+", 0)").call(h),d3.selectAll("#chart-two g.tick").filter(function(t){return 0==t}).select("text").style("visibility","hidden"),t.svg.append("text").text("Yrkesgrupp").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+1.4*r+","+(t.height-a/3)+")").style("text-anchor","start"),t.svg.append("text").text("Månadslön (TKr)").attr("class","axis legend").attr("transform","translate("+r/4+","+(t.height-a)+") rotate(-90)").style("text-anchor","start").style("background-color","white")}),t.opts.isIframe&&pymChild.sendHeight()},t.prototype.getTooltip=function(t){var e=this;return e.tooltip.replace("{ P10 }",t.P10).replace("{ P90 }",t.P90).replace("{ income_range_kr }",t.income_range_kr).replace("{ income_range_perc }",Number(t.income_range_perc).toFixed(1))},t.prototype.applyHighlight=function(t){t&&t!=self.group&&(self.group=t),d3.selectAll("#chart-two .median").style("fill","#F8F0DE"),d3.selectAll("#chart-two .edges").style("fill","#ECDAB5"),d3.selectAll("#chart-two .median."+self.group).style("fill","#eecae0"),d3.selectAll("#chart-two .edges."+self.group).style("fill","#c13d8c"),d3.selectAll("#chart-two .bartext."+self.group).style("opacity","1"),d3.selectAll(".bar-overlay").style("opacity","0")},t.prototype.update=function(t){var e=this;e.data=t},t.prototype.resize=function(){var t=this;t.svg.remove(),t.drawChart(),t.update(t.data)},t}(),d3.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.parentNode.appendChild(this.parentNode)})},ChartThree=function(){function t(t,e,a){var r=this;r.container=d3.select(t),defaultOpts={isIframe:!1},r.opts=$.extend(defaultOpts,a),r.data=e,r.group="education",r.chartContainer=r.container.append("div").attr("class","chart-container"),r.drawChart(),r.update(e),d3.select(window).on("resize",function(){r.resize()}),r.tooltip=""}return t.prototype.drawChart=function(){var t=this,e=t.container[0][0].offsetWidth;t.chartContainer.html(""),t.margins=m={top:.1*e,right:.1*e,bottom:.1*e,left:.1*e},t.width=w=e-m.left-m.right,t.height=h=.5*w,t.pointRadius=.01*e;var a=50,r=50;t.svg=t.chartContainer.append("svg").attr("width","100%").attr("height","100%").attr("viewBox","0 0 "+t.width+" "+t.height).attr("preserveAspectRatio","xMinYMin meet");var n=t.svg.append("defs"),i=n.append("filter").attr("id","glow").attr("height","130%");i.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation","5").attr("result","coloredBlur");var o=i.append("feMerge");o.append("feMergeNode").attr("in","coloredBlur"),o.append("feMergeNode").attr("in","SourceGraphic"),t.chart=t.svg.append("g");var l=4,s=4,c=d3.scale.linear().range([s+l+r,t.width-l-s]),p=d3.scale.linear().range([t.height-l-s-a,l+s]);d3.csv(t.data,function(e,n){function i(){var e=d3.touches(this)[0][0],a=n[~~h(e)];if(t.applyHighlight(),"undefined"!=typeof a&&a){d3.select('#chart-three .element[name="'+a.profession_label+'"]').style("fill","#008ea1").moveToFront();$("#chart-three-title").text(a.profession_label),$("#chart-three-subtitle-1").html(t.getTooltip(a))}}c.domain([d3.min(n,function(t){return parseFloat(t.lifesalary_vs_baseline)}),d3.max(n,function(t){return parseFloat(t.lifesalary_vs_baseline)})]),p.domain([d3.min(n,function(t){return parseFloat(t.income_range_perc)}),d3.max(n,function(t){return parseFloat(t.income_range_perc)})]),n.sort(function(t,e){return t.lifesalary_vs_baseline-e.lifesalary_vs_baseline}),line_x=c(1),t.svg.append("line").attr("x1",line_x).attr("y1",0).attr("x2",line_x).attr("y2",t.height-a).style("stroke-width",1).style("stroke","lightgrey").style("fill","none"),t.svg.append("text").attr("class","salarytext").text("Tjänar mer än gymnasieutbildad").attr("dx",line_x+5).attr("dy","1em").style("font-size","10px").style("fill","grey");var o=t.chart.selectAll("g").data(n).enter().append("g");o.append("circle").attr("name",function(t){return t.profession_label}).attr("class",function(t){return"d3-tip glow "+t.group}).attr("cx",function(t){return c(parseFloat(t.lifesalary_vs_baseline))}).attr("cy",function(t){return p(parseFloat(t.income_range_perc))}).attr("r",l+s).attr("fill","#008ea1").attr("fill-opacity",.1),o.append("circle").attr("name",function(t){return t.profession_label}).attr("class",function(t){return"element d3-tip "+t.group}).attr("cx",function(t){return c(parseFloat(t.lifesalary_vs_baseline))}).attr("cy",function(t){return p(parseFloat(t.income_range_perc))}).attr("r",l).attr("fill","#BDA164").attr("stroke","white").attr("stroke-width","1").attr("fill-opacity",1).on("mouseover",function(e){t.applyHighlight(),d3.select('.glow[name="'+this.getAttribute("name")+'"]').moveToFront(),d3.select(this).style("fill","#008ea1").moveToFront(),$("#chart-three-title").text(e.profession_label),$("#chart-three-subtitle-1").html(t.getTooltip(e))}).on("mouseout",function(e){t.applyHighlight(),$("#chart-three-title").text(t.title),$("#chart-three-subtitle-1").html("↔ Swipa för att se detaljer"),$("#chart-three-subtitle-2").html("&nbsp;")});var h=d3.scale.linear().domain([r,t.width]).range([0,n.length]).clamp(!0);t.svg.on("touchmove.chart3",i),t.svg.on("touchend.chart3",function(){$("#chart-three-title").text("Livslön jämfört med gymnasieutbildad vs Lönespridning (P90/P10)"),$("#chart-three-subtitle-1").html("&nbsp;"),$("#chart-three-subtitle-2").html("&nbsp;")}),t.svg.append("text").text("Låg livslön").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+r+","+(t.height-a/3)+")").style("text-anchor","start"),t.svg.append("text").text("Hög livslön").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+t.width+","+(t.height-a/3)+")").style("text-anchor","end"),t.svg.append("text").text("Liten löne-").attr("dy","0em").attr("class","axis legend").attr("transform","translate("+r/2+","+(t.height-a/2)+") rotate(-90)").style("text-anchor","start"),t.svg.append("text").text("spridning").attr("dy","1em").attr("class","axis legend").attr("transform","translate("+r/2+","+(t.height-a/2)+") rotate(-90)").style("text-anchor","start"),t.svg.append("text").text("Stor lön-").attr("dy","0em").attr("class","axis legend").attr("transform","translate("+r/2+",0) rotate(-90)").style("text-anchor","end"),t.svg.append("text").text("spridning").attr("dy","1em").attr("class","axis legend").attr("transform","translate("+r/2+",0) rotate(-90)").style("text-anchor","end")}),t.opts.isIframe&&pymChild.sendHeight()},t.prototype.getTooltip=function(t){var e=this;return e.tooltip.replace("{ lifesalary }",Number((t.lifesalary/1e6).toFixed(1))).replace("{ mer/mindre }",function(e){return Number(t.lifesalary_vs_baseline)>1?"mer":"mindre"}).replace("{ lifesalary_vs_baseline }",function(e){return t.lifesalary_vs_baseline>=1?(100*Number(t.lifesalary_vs_baseline)-100).toFixed(1):Math.abs(100-100*Number(t.lifesalary_vs_baseline)).toFixed(1)}).replace("{baseline}",t.baseline).replace("{ income_range_kr }",t.income_range_kr).replace("{ income_range_perc }",Number(t.income_range_perc).toFixed(1))},t.prototype.applyHighlight=function(t){t&&t!=self.group&&(self.group=t),d3.selectAll("#chart-three .element").style("fill","#BDA164"),d3.selectAll("#chart-three ."+self.group).style("fill","#c13d8c").moveToFront()},t.prototype.on_resize=function(t){var e=10-t/200;d3.selectAll("#chart-three .salarytext").style("font-size",e+"px")},t.prototype.update=function(t){var e=this;e.data=t},t.prototype.resize=function(){var t=this;t.svg.remove(),t.drawChart(),t.update(t.data)},t}();var locale=d3.locale({decimal:",",thousands:" ",grouping:[3],currency:[""," kr"],dateTime:"%A %e %B %Y kl. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["måndag","tisdag","onsdag","torsdag","fredag","lördag","söndag"],shortDays:["må","ti","ons","to","fre","lö","sö"],months:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],shortMonths:["jan","feb","mars","apr","maj","jun","jul","aug","sept","okt","nov","dec"]}),formatMillionSEK=function(t){return locale.numberFormat(".2s")(t).replace("k"," tKr").replace("M"," Mkr")},formatInSentence=function(t){return locale.numberFormat(".3s")(t).replace("k","&nbsp;000 kronor").replace("M","&nbsp;miljoner kronor")},formatPercent=function(t){return locale.numberFormat("%")(t)},formatPercentInSentence=function(t){return locale.numberFormat("%")(t).replace("%"," procent")},chart_one,chart_two,chart_three;$(document).ready(function(){function t(){"ready"===a&&(setChartTooltips(),setChartHighlight("education"))}function e(t){chart_one.on_resize(t),chart_three.on_resize(t)}setTextBlocks("education");var a=loadCharts();setTimeout(t,1e3),$(".selectpicker").change(function(t){var e=$(this)[0].value;$(".content").animate({opacity:0},300,function(){setTextBlocks(e),setChartHighlight(e)}),$(".content").animate({opacity:1})});new pym.Child({renderCallback:e})});