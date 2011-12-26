(function(jQuery, undefined){
	var debug = (window.console && console.log);
	
	var doc = jQuery(document),
	    views = {},
	    count = parseInt(window.location.hash.replace('#', '')) || 5000,
	    n = count,
	    w = 960,
	    h = 270,
	    points = [],
	    point, domStr, tStart, tEnd;
	
	// Generate n random points
	while (n--) {
	   point = {
	     type: 'circle',
	     cx: Math.random() * w,
	     cy: Math.random() * h,
	     r: 2,
	     fill: '#' + ([parseInt(Math.random() * 99), parseInt(Math.random() * 99), parseInt(Math.random() * 99)].join('')),
	     stroke: 'none'
	   };
	   
	   points.push(point);
	}
	
	doc.ready(function(){
	  var graph1, graph2, graph3,
	      svg2 = jQuery('#graph2 svg')[0],
	      readout = jQuery('<div class="readout"></div>'),
	      timeStart, timeEnd, frag;
	  
	  jQuery('body').append(readout);
	  
	  
	  
	  // Speed test Raphael --------------------------------------------
	  timeStart = +new Date();
	  graph1 = Raphael(document.getElementById('graph1'), w, h);
	  graph1.add(points);
	  timeEnd = +new Date();
	  jQuery('#graph1').append('<p>[Raphael] Points: '+ count+ ', Time (ms): ' + (timeEnd - timeStart) + '</p>');
	  
		
		
		// Speed test DOM string insertion -------------------------------
	  timeStart = +new Date();
	  domStr = ['<svg height="270" version="1.1" width="960" xmlns="http://www.w3.org/2000/svg">'];
	  
		n = count;
		while (n--) {
			point = points[n];
			domStr.push('<circle cx="', point.cx, '" cy="', point.cy, '" r="', point.r, '" fill="', point.fill, '" stroke="', point.stroke, '">Yo</circle>');
		}
		
		domStr.push('</svg>');
		domStr = domStr.join('');
	  document.getElementById('graph2').innerHTML = domStr;
	  timeEnd = +new Date();
	  
	  jQuery('#graph2')
	  .append('<p>[String concatenation] Points: '+ count+ ', Time (ms): ' + (timeEnd - timeStart) + '</p>');
	  
	  
	  
	  // Speed test d3 ------------------------------------------------
	  timeStart = +new Date();
	 
	  d3
	  .select('#graph3')
	  .append('svg')
	  .attr("width", w)
	  .attr("height", h)
	  .attr("xmlns", "http://www.w3.org/2000/svg")
	  .selectAll('circle')
	  .data(points)
	  .enter()
	  .append('circle')
	  .attr("cx",     function(obj){ return obj.cx; })
    .attr("cy",     function(obj){ return obj.cy; })
    .attr("r",      function(obj){ return obj.r; })
    .attr("fill",   function(obj){ return obj.fill; })
    .attr("stroke", function(obj){ return obj.stroke; });
    
	  timeEnd = +new Date();
	  jQuery('#graph3').append('<p>[d3] Points: '+ count+ ', Time (ms): ' + (timeEnd - timeStart) + '</p>');
	  
	  
	  
	  // Add tips to graph2
	  jQuery('svg')
	  .bind('mouseover', function(e) {
	  	if (e.target === e.currentTarget) { return; }
	  	readout.css({visibility: 'visible', left: e.pageX, top: e.pageY}).text(parseInt(e.target.getAttribute('cx')) + ', ' + parseInt(e.target.getAttribute('cy')));
	  })
	  .bind('mouseout', function(e) {
	  	if (e.target === e.currentTarget) { return; }
	  	readout.css({visibility: 'hidden'});
	  });
	});
})(jQuery);