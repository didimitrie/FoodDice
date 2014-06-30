/*jshint devel:true, unused: false, undef:false*/


Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

function randomString()
{
    var text = "";
    var possible = "Zabcdefghi  jklmnopqrstuvwxyz ";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

(function() {
    var highest = 1;

    $.fn.bringToTop = function() {
        this.css('z-index', ++highest); // increase highest by 1 and set the style
    };
})();


$(document).ready(function () {

	var totalHeight = $("body").height();
	console.log(totalHeight);

	$(".dice").each(function(i) { $(this).height((totalHeight-0)/5); $(this).css("top", i*totalHeight/5); });

	$(".dice").each(function(){$(this).css("background-color", getRandomColor());});

	var kickOff = true;
	var globalDrag = false;
	var timeout = null;
	var holding = false;
	var touched = false;
	var pinchin = false;
	var pinchinKickOff = false;
	var pinchScale = 0;

	$("body").hammer().on('pinchin', function(e){

		pinchin = true;
		if(kickOff) {
			$(".dice").each(function(index){ $(this).css("z-index", index);});
			var scale = pinchScale = e.gesture.scale; // goes from 1 at the beginning to around 0.2 (0) at the end of the pinchin
			var middle = $("body").height()/2;
			var topMiddle = middle - middle/5; // this is the top value we expect to reach with all divs
			
			console.log("Pinch scale: " + scale);

			$(".dice").each(function(index){
				//$(this).velocity({left: $("body").width()/2-$(this).height()/2, top: topMiddle + index*10, scale: 0.9, width: $(this).height(), borderRadius: 100,}, {duration:600, easing: "easeInOutBack"});
				$(this).velocity({top: topMiddle + index*10}, {duration:400, easing: "easeInOutBack", complete: function() { kickOff = false;}});
				});
		
		}

	}).on('release', function(){
		
			if(pinchin&&pinchScale>0.6) {
				console.log("pinch released! ");
				$(".dice").velocity("stop", true);
				$(".dice").each(function(i){
				$(this).velocity({left:0, width: "100%", borderRadius: 0, top: $("body").height()/5*i, scale: 1}, {complete: function() {pinchin = false;}, duration:200});
				});
			}
		
	});

	$("body").hammer().on('pinchout', function(e){
		$(".dice").velocity("stop", true);
		$(".dice").each(function(i){
				$(this).velocity({left:0, width: "100%", borderRadius: 0, top: $("body").height()/5*i, scale: 1}, {complete: function() {pinchin = false;}, duration:200});
				});
				
	});



	$("body").hammer().on('dragdown', function(e){

		if(holding || touched) return; 
		console.log("Start drag");

	 	e.gesture.preventDefault(true);

	 	globalDrag = true;

	 	if(kickOff == true) { 
	 		kickOff=false; 
	 		$(".dice").velocity({scale:0.8}, {duration:900, easing:[ 600, 20 ]});
	 	}

		}).on("dragend", function(e){
			if(pinchin) return;
			if(holding || touched || pinchin) return;
			console.log("Stop drag");

			kickOff = true;
			globalDrag = false;
			$(".dice").velocity("stop", true);//.velocity("reverse");
			$(".dice").velocity({scale: 1, translateX:0, translateY:0}, {easing: [600,20]});
			$(".dice").each(function(){ $(this).css("background-color", getRandomColor()); $(this).find(".container").html(randomString())});
	});

	$(".dice").hammer().on("touch", function(e) {
		if(pinchin) return;	
	 	e.gesture.preventDefault(true);
		var myElement = $(this);
		$(this).bringToTop();
		setTimeout(function(){
			if(!globalDrag){
			console.log("touchy > " + $(myElement).html());
			touched = true;
			$(myElement).velocity({boxShadowBlur: 50, scale:1.1}, {duration:100});
			
			}
		}, 200);
		
	});

	$(".dice").hammer().on("hold", function(ev) { 
		holding = true;
		$(this).find(".container").velocity("transition.bounceRightOut", 300).velocity("transition.bounceLeftIn", 300);
		$(this).find(".container").html(randomString());
	});

	$(".dice").hammer().on("release", function(ev){
		
				if(pinchin) return;
				var myElement = $(this);

				setTimeout(function(){
					if(pinchin) return;
					if(!globalDrag || !pinchin) {
						if(holding) {
							holding = false;
							console.log("released element");
							$(myElement).css("background-color", getRandomColor());

						}
					if(touched) {
						console.log("released element from touch");
						touched = false;
						$(myElement).velocity("stop", true);
						$(myElement).velocity({boxShadowBlur: 0, scale:1}, {duration:300});
					
				}
			}
		}, 200);
	});
	
});

