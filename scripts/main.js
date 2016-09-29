function getUrlVars(){for(var t,e=[],r=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),a=0;a<r.length;a++)t=r[a].split("="),e.push(t[0]),e[t[0]]=t[1];return e}function setTextBlocks(t){$.ajax({type:"GET",url:"data/copy-stories.csv",dataType:"text",success:function(e){csv=$.csv.toObjects(e);var r=(csv[0][t],csv[1][t]),a=csv[2][t],n=csv[3][t];$("#text-block-1").html(r),$("#text-block-2").html(a),$("#text-block-3").html(n)},error:function(t,e,r){alert("Status: "+t.status+"     Error: "+r)}})}function loadCharts(){var t="true"===getUrlVars().iframe,e="data/development_data.csv";return chart_one=new ChartOne("#chart-one",e,{isIframe:t}),chart_two=new ChartTwo("#chart-two",e,{isIframe:t}),chart_three=new ChartThree("#chart-three",e,{isIframe:t}),"ready"}function setChartHighlight(t){chart_one.applyHighlight(t),chart_two.applyHighlight(t),chart_three.applyHighlight(t)}ChartOne=function(){function t(t,e,r){var a=this;a.container=d3.select(t),defaultOpts={isIframe:!1},a.opts=$.extend(defaultOpts,r),a.data=e,a.width=0,a.group="education",a.chartContainer=a.container.append("div").attr("class","chart-container"),a.drawChart(),a.update(e),d3.select(window).on("resize",function(){a.resize()})}return t.prototype.drawChart=function(){var t=this,e=t.container[0][0].offsetWidth;t.chartContainer.html(""),t.margins=m={top:.1*e,right:.1*e,bottom:.1*e,left:.1*e},t.width=w=e-m.left-m.right,t.height=h=.5*w;var r=(.7*m.bottom+"px",30),a=35,n=d3.scale.ordinal().rangeRoundBands([0,t.width-a],.1),s=d3.scale.linear().range([r,t.height-r]),i=d3.scale.linear().range([0,t.height-r]);t.svg=t.chartContainer.append("svg").attr("width","100%").attr("height","100%").attr("viewBox","0 0 "+t.width+" "+t.height).attr("preserveAspectRatio","xMinYMin meet"),t.chart=t.svg.append("g").attr("transform","translate("+a+","+-r+")"),d3.csv(t.data,function(e,o){function l(){var e=d3.touches(this)[0][0],r=o[~~d(e)];t.applyHighlight(),d3.select('[name="'+r.profession_name+'"]').attr("fill","darkred"),$("#chart-one-title").text(r.profession_name),$("#chart-one-subtitle").html("<strong>Livslön</strong>: "+Number((r.lifesalary/1e6).toFixed(1))+" milj. kronor")}o=o.sort(function(t,e){return d3.ascending(t.lifesalary,e.lifesalary)});var c=d3.max(o,function(t){return parseInt(t.lifesalary)});n.domain(o.map(function(t){return t.profession_name})),s.domain([c,0]),i.domain([c,0]);var h=t.chart.selectAll("g").data(o).enter().append("g").attr("width",20).attr("transform",function(t){return"translate("+n(t.profession_name)+",0)"});h.append("rect").attr("name",function(t){return t.profession_name}).attr("class",function(t){return"bar element "+t.group}).attr("y",function(t){return s(parseInt(t.lifesalary))}).attr("height",function(e){return t.height-s(parseInt(e.lifesalary))}).attr("fill","lightgrey").attr("width",n.rangeBand()).on("mouseover",function(e){t.applyHighlight(),d3.select('[name="'+e.profession_name+'"]').attr("fill","darkred"),$("#chart-one-title").text(e.profession_name),$("#chart-one-subtitle").html("<strong>Livslön</strong>: "+Number((e.lifesalary/1e6).toFixed(1))+" milj. kronor")});var d=d3.scale.linear().domain([a+n.rangeBand(),t.width]).range([0,o.length+1]).clamp(!0);t.svg.on("touchmove.chart1",l);var p=d3.svg.axis().scale(i).ticks(5).tickFormat(function(t){return t/1e6}).orient("left");t.svg.append("g").attr("class","axis").attr("transform","translate("+a+", 0)").call(p),d3.selectAll("g.tick").filter(function(t){return 0==t}).select("text").style("visibility","hidden"),t.svg.append("text").text("Yrkesgrupp").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+1.4*a+","+(t.height-r/3)+")").style("text-anchor","start"),t.svg.append("text").text("Livslön (milj. kr)").attr("class","axis legend").attr("transform","translate("+a/4+","+(t.height-r)+") rotate(-90)").style("text-anchor","start").style("background-color","white"),t.chart.selectAll("text").data(o).enter().append("text").attr("class",function(t){return"bartext "+t.group}).attr("transform",function(t){var e=n(t.profession_name),r=s(parseInt(t.lifesalary))+10;return"translate(10,-5)rotate(-30 "+e+" "+r+")"}).style("z-index",100).attr("fill","red").attr("opacity","0").attr("x",function(t,e){return n(t.profession_name)}).attr("y",function(t,e){return s(parseInt(t.lifesalary))}).text(function(t){return t.profession_name})}),t.opts.isIframe&&pymChild.sendHeight()},t.prototype.on_resize=function(t){var e=12-t/200;d3.selectAll(".bartext").style("font-size",e+"px"),600>t?$(".bartext").hide():$(".bartext").show()},t.prototype.applyHighlight=function(t){t&&t!=self.group&&(self.group=t),$("#chart-one .element").attr("fill","#ECDAB5"),$("#chart-one ."+self.group).attr("fill","#c13d8c"),$("#chart-one .bartext").attr("opacity","0"),$("#chart-one .bartext."+self.group).attr("opacity","1")},t.prototype.update=function(t){var e=this;e.data=t},t.prototype.resize=function(){var t=this;t.svg.remove(),t.drawChart(),t.update(t.data)},t}(),ChartTwo=function(){function t(t,e,r){var a=this;a.container=d3.select(t),defaultOpts={isIframe:!1},a.opts=$.extend(defaultOpts,r),a.data=e,a.group="education",a.chartContainer=a.container.append("div").attr("class","chart-container"),a.drawChart(),a.update(e),d3.select(window).on("resize",function(){a.resize()})}return t.prototype.drawChart=function(){var t=this,e=t.container[0][0].offsetWidth;t.chartContainer.html(""),t.margins=m={top:.1*e,right:.1*e,bottom:.1*e,left:.1*e},t.width=w=e-m.left-m.right,t.height=h=.5*w,t.pointRadius=.01*e;var r=30,a=35;t.svg=t.chartContainer.append("svg").attr("width","100%").attr("height","100%").attr("viewBox","0 0 "+t.width+" "+t.height).attr("preserveAspectRatio","xMinYMin meet"),t.chart=t.svg.append("g").attr("transform","translate("+a+",0)");var n=d3.scale.ordinal().rangeRoundBands([0,t.width-a],.1),s=d3.scale.linear().range([t.height,0]);d3.csv(t.data,function(e,i){function o(){var e=d3.touches(this)[0][0],r=i[~~c(e)];t.applyHighlight();d3.select('#chart-two [name="'+r.profession_name+'"]').style("opacity",".4");$("#chart-two-title").text(r.profession_name),$("#chart-two-subtitle-1").html("<strong>Månadslön, lägst 10%</strong>: "+r.P10+" kronor"),$("#chart-two-subtitle-2").html("<strong>Månadslön, högsta 10%</strong>: "+r.P90+" kronor")}i=i.sort(function(t,e){return d3.ascending(parseInt(t.median),parseInt(e.median))}),minvalue=d3.min(i,function(t){return parseInt(t.P10)}),maxvalue=d3.max(i,function(t){return parseInt(t.P90)}),n.domain(i.map(function(t){return+t.median})),s.domain([0,d3.max(i,function(t){return parseInt(t.P90)})]);var l=t.chart.selectAll("g").data(i).enter().append("g").attr("width",20).attr("transform",function(t){return"translate("+n(+t.median)+",0)"});l.append("rect").attr("class",function(t){return"edges "+t.group}).attr("y",function(t){return s(t.P90)}).attr("height",function(e){return t.height-s(parseInt(e.P90-e.P10))}).attr("width",n.rangeBand()).attr("rx",3).attr("ry",3).attr("fill","#ECDAB5"),l.append("rect").attr("class",function(t){return"quartiles "+t.group}).attr("y",function(t){return s(t._Q3)}).attr("height",function(e){return t.height-s(parseInt(e._Q3-e._Q1))}).attr("width",n.rangeBand()).attr("rx",3).attr("ry",3).attr("fill","#BDA164"),l.append("circle").attr("class",function(t){return"median "+t.group}).attr("cy",function(t){return s(t.median)}).attr("r",function(t){return 1}).attr("cx",n.rangeBand()/2).attr("fill","#F8F0DE").attr("id",function(t){return t.profession_name}),l.append("rect").attr("name",function(t){return t.profession_name}).attr("class",function(t){return"bar-overlay "+t.group}).attr("y",function(t){return s(t.P90)}).attr("height",function(e){return t.height-s(parseInt(e.P90-e.P10))}).attr("width",n.rangeBand()).style("opacity","0").style("fill","darkred").attr("rx",3).attr("ry",3).on("mouseover",function(e){t.applyHighlight();d3.select('#chart-two [name="'+e.profession_name+'"]').style("opacity",".4");$("#chart-two-title").text(e.profession_name),$("#chart-two-subtitle-1").html("<strong>Månadslön, lägst 10%</strong>: "+e.P10+" kronor"),$("#chart-two-subtitle-2").html("<strong>Månadslön, högsta 10%</strong>: "+e.P90+" kronor")});var c=d3.scale.linear().domain([a,t.width]).range([0,i.length]).clamp(!0);t.svg.on("touchmove.chart2",o);var h=d3.svg.axis().scale(s).ticks(8,"s").tickFormat(function(t){return t/1e3}).orient("left");t.svg.append("g").attr("class","axis").attr("transform","translate("+1.2*a+", 0)").call(h),d3.selectAll("g.tick").filter(function(t){return 0==t}).select("text").style("visibility","hidden"),t.svg.append("text").text("Yrkesgrupp").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+1.4*a+","+(t.height-r/3)+")").style("text-anchor","start"),t.svg.append("text").text("Månadslön (TKr)").attr("class","axis legend").attr("transform","translate("+a/4+","+(t.height-r)+") rotate(-90)").style("text-anchor","start").style("background-color","white")}),t.opts.isIframe&&pymChild.sendHeight()},t.prototype.applyHighlight=function(t){t&&t!=self.group&&(self.group=t),d3.selectAll("#chart-two .median").style("fill","#F8F0DE"),d3.selectAll("#chart-two .quartiles").style("fill","#BDA164"),d3.selectAll("#chart-two .edges").style("fill","#ECDAB5"),d3.selectAll("#chart-two .median."+self.group).style("fill","#eecae0"),d3.selectAll("#chart-two .quartiles."+self.group).style("fill","#c13d8c"),d3.selectAll("#chart-two .edges."+self.group).style("fill","#d67db2"),d3.selectAll("#chart-two .bartext."+self.group).style("opacity","1"),d3.selectAll(".bar-overlay").style("opacity","0")},t.prototype.update=function(t){var e=this;e.data=t},t.prototype.resize=function(){var t=this;t.svg.remove(),t.drawChart(),t.update(t.data)},t}(),ChartThree=function(){function t(t,e,r){var a=this;a.container=d3.select(t),defaultOpts={isIframe:!1},a.opts=$.extend(defaultOpts,r),a.data=e,a.group="education",a.chartContainer=a.container.append("div").attr("class","chart-container"),a.drawChart(),a.update(e),d3.select(window).on("resize",function(){a.resize()})}return t.prototype.drawChart=function(){var t=this,e=t.container[0][0].offsetWidth;t.chartContainer.html(""),t.margins=m={top:.1*e,right:.1*e,bottom:.1*e,left:.1*e},t.width=w=e-m.left-m.right,t.height=h=.5*w,t.pointRadius=.01*e;var r=50,a=50;t.svg=t.chartContainer.append("svg").attr("width","100%").attr("height","100%").attr("viewBox","0 0 "+t.width+" "+t.height).attr("preserveAspectRatio","xMinYMin meet"),t.chart=t.svg.append("g");var n=4,s=d3.scale.linear().range([n+a,t.width-n]),i=d3.scale.linear().range([t.height-n-r,n]);d3.csv(t.data,function(e,o){function l(){var e=d3.touches(this)[0][0],r=o[~~h(e)];t.applyHighlight();d3.select('#chart-three [name="'+r.profession_name+'"]').style("fill","darkred").style("opacity","0.8");$("#chart-three-title").text(r.profession_name),$("#chart-three-subtitle-1").html("<strong>Lönespridning (P90/P10)</strong>: "+Number(parseFloat(r.income_range).toFixed(2))),$("#chart-three-subtitle-2").html("<strong>Livslön jämfört med gymnasieutbildad</strong>: "+Number(parseFloat(r.lifesalary_vs_baseline).toFixed(2))+" procent")}s.domain([d3.min(o,function(t){return parseFloat(t.lifesalary_vs_baseline)}),d3.max(o,function(t){return parseFloat(t.lifesalary_vs_baseline)})]),i.domain([d3.min(o,function(t){return parseFloat(t.income_range)}),d3.max(o,function(t){return parseFloat(t.income_range)})]),o.sort(function(t,e){return t.lifesalary_vs_baseline-e.lifesalary_vs_baseline});var c=t.chart.selectAll("g").data(o).enter().append("g");c.append("circle").attr("name",function(t){return t.profession_name}).attr("class",function(t){return"element d3-tip "+t.group}).attr("cx",function(t){return s(parseFloat(t.lifesalary_vs_baseline))}).attr("cy",function(t){return i(parseFloat(t.income_range))}).attr("r",n).attr("fill","#BDA164").attr("stroke","white").attr("stroke-width","1").attr("fill-opacity",1).on("mouseover",function(e){t.applyHighlight(),d3.select('#chart-three [name="'+e.profession_name+'"]').attr("fill","darkred"),$("#chart-three-title").text(e.profession_name),$("#chart-three-subtitle-1").html("<strong>Lönespridning (P90/P10)</strong>: "+Number(parseFloat(e.income_range).toFixed(2))),$("#chart-three-subtitle-2").html("<strong>Livslön jämfört med gymnasieutbildad</strong>: "+(100*Number(parseFloat(e.lifesalary_vs_baseline).toFixed(4))).toFixed(2)+" procent")}).on("mouseout",function(e){t.applyHighlight(),d3.select('#chart-three [name="'+e.profession_name+'"]').attr("fill","#BDA164"),$("#chart-three-title").text("Livslön jämfört med gymnasieutbildad vs Lönespridning (P90/P10)"),$("#chart-three-subtitle-1").html("&nbsp;"),$("#chart-three-subtitle-2").html("&nbsp;")});var h=d3.scale.linear().domain([a,t.width]).range([1,o.length]).clamp(!0);t.svg.on("touchmove.chart3",l),line_x=s(.1),t.svg.append("line").attr("x1",line_x).attr("y1",0).attr("x2",line_x).attr("y2",t.height-r).style("stroke-width",1).style("stroke","lightgrey").style("fill","none"),t.svg.append("text").attr("class","salarytext").text("Tjänar mer än gymnasieutbildad").attr("dx",line_x+5).attr("dy","1em").style("font-size","10px").style("fill","lightgrey"),t.svg.append("text").text("Låg livslön").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+a+","+(t.height-r/3)+")").style("text-anchor","start"),t.svg.append("text").text("Hög livslön").attr("class","axis legend").style("background","white").style("text-transform","uppercase").attr("transform","translate("+t.width+","+(t.height-r/3)+")").style("text-anchor","end"),t.svg.append("text").text("Stor löne-").attr("dy","0em").attr("class","axis legend").attr("transform","translate("+a/2+","+(t.height-r/2)+") rotate(-90)").style("text-anchor","start"),t.svg.append("text").text("spridning").attr("dy","1em").attr("class","axis legend").attr("transform","translate("+a/2+","+(t.height-r/2)+") rotate(-90)").style("text-anchor","start"),t.svg.append("text").text("Liten lön-").attr("dy","0em").attr("class","axis legend").attr("transform","translate("+a/2+",0) rotate(-90)").style("text-anchor","end"),t.svg.append("text").text("spridning").attr("dy","1em").attr("class","axis legend").attr("transform","translate("+a/2+",0) rotate(-90)").style("text-anchor","end")}),t.opts.isIframe&&pymChild.sendHeight()},t.prototype.applyHighlight=function(t){t&&t!=self.group&&(self.group=t),d3.selectAll("#chart-three .element").style("fill","#BDA164"),d3.selectAll("#chart-three ."+self.group).style("fill","#c13d8c")},t.prototype.on_resize=function(t){var e=10-t/200;d3.selectAll("#chart-three .salarytext").style("font-size",e+"px")},t.prototype.update=function(t){var e=this;e.data=t},t.prototype.resize=function(){var t=this;t.svg.remove(),t.drawChart(),t.update(t.data)},t}();var locale=d3.locale({decimal:",",thousands:" ",grouping:[3],currency:[""," kr"],dateTime:"%A %e %B %Y kl. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["måndag","tisdag","onsdag","torsdag","fredag","lördag","söndag"],shortDays:["må","ti","ons","to","fre","lö","sö"],months:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],shortMonths:["jan","feb","mars","apr","maj","jun","jul","aug","sept","okt","nov","dec"]}),formatMillionSEK=function(t){return locale.numberFormat(".2s")(t).replace("k"," tKr").replace("M"," Mkr")},formatInSentence=function(t){return locale.numberFormat(".3s")(t).replace("k","&nbsp;000 kronor").replace("M","&nbsp;miljoner kronor")},formatPercent=function(t){return locale.numberFormat("%")(t)},formatPercentInSentence=function(t){return locale.numberFormat("%")(t).replace("%"," procent")},chart_one,chart_two,chart_three;$(document).ready(function(){function t(){"ready"===r&&setChartHighlight("education")}function e(t){chart_one.on_resize(t),chart_three.on_resize(t)}setTextBlocks("education");var r=loadCharts();setTimeout(t,1e3),$(".selectpicker").change(function(t){var e=$(this)[0].value;$(".content").animate({opacity:0},300,function(){setTextBlocks(e),setChartHighlight(e)}),$(".content").animate({opacity:1})});new pym.Child({renderCallback:e})});