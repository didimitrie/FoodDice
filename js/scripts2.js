/*jshint devel:true, unused: false, undef:false*/


Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var shakeinterval;

/*Hammer(document.body).on('dragdown', function(e){

 	e.gesture.preventDefault(true);
	
	}).on('dragstart', function(e){

		e.gesture.preventDefault(true);
		console.log("start");
		$(".dice").velocity({scale:0.85},{duration:300, easing: [ 20, 6 ]}).velocity("callout.dshake", {stagger:75, duration:600});
		

	}).on("dragend", function(e){
		clearInterval(shakeinterval);

		//$(".dice").velocity("stop");
		
		$(".dice").velocity({scale: 1}, 30);
		clearInterval(shakeinterval);
		
	});
*/

Hammer(document.body).on('dragdown', function(e){
	e.gesture.preventDefault(true);
	var dy = e.gesture.deltaY;
	console.log(dy);
}).on("dragend", function(e){
	e.gesture.preventDefault(true);
	$(".dice").velocity({scale: 1}, 30);
});

$(document).ready(function () {

	var totalHeight = $("body").height();
	console.log(totalHeight);

	$(".dice").height((totalHeight-10)/5);
	$(".dice").each(function(){$(this).css("background-color", getRandomColor());});

});

