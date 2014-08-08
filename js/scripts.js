/*jshint devel:true, unused: false, undef:false*/

/*
/////////////////////////////////////////////
			HELPER FUNCTIONS 
/////////////////////////////////////////////
*/

Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

function randomIngredient()
{
	var words = "carrot cake polenta asparagus brocoli musli lime steam lamb pork tulips deodorant".split(' ');
	return words[Math.floor(Math.random() * words.length)];
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

/*
/////////////////////////////////////////////
			DOC INIT FUNCTIONS 
/////////////////////////////////////////////
*/

function setElementsHeight(){
	var totalHeight = $("body").height();
	var unit = totalHeight/9;

	var elemNo = $(".dice").length;
	var unitD = (totalHeight-unit)/elemNo;
	
	$(".dice").each(function(i) { 
		$(this).height(unitD); 
		$(this).css("top", i*unitD); 
	});

	$(".dice").each(function(){
		$(this).css("background-color", getRandomColor());
	});

	$(".dice .ingredient").css("line-height", unitD+"px");
	$(".dice .phrase").css("line-height", unitD+"px");
	$(".dice .funny-text").css("line-height", unitD+"px");

	$(".menu").height(unit*1);
	$(".menu").css("line-height", unit*1+"px");
	//$(".vegToggle").height(unit*1);
	$(".vegToggle").css("line-height", unit*0.7+"px");

	$(".menu").velocity({boxShadowBlur:10}, 0);
	//$(".vegToggle").velocity({boxShadowBlur:10}, 0);

	$(".svg-handler").each(function(index){
		


		var skewfactor = index.map(0,3, 10, 15) * (index%2==0 ? 1 : -1);
		//$(this).velocity({rotateZ: 45}, 1);
	});
}



var vegan = false;

function changeRegime()
{
	$(".vegToggle").hammer().on("drag", function(e){
		e.gesture.preventDefault();
		
		$(this).velocity({right: "-=" + e.gesture.deltaX.map(0, $("body").width(), 0, 50) + "%"},1)
		//$(this).css("left", ($("body").width()*0.7 + e.gesture.deltaX) + "px");
		$(this).velocity({opacity: Math.abs(e.gesture.deltaX).map(0,$("body").width(),1,0)}, 1);

	});
}

function makeMenu()
{
	
}

$(document).ready(function () {

	setElementsHeight();

	makeMenu();

	changeRegime();

	var kickOff = true;
	var kickOffUp = true;

	var dragInProcess = false;
	var dragUpInProcess = false;
	var collapsedState = false;

	var sidebarOpen = false;
	var sidebardDragLeft = false;
	var sidebardDragRight = false;
	var sideBarScale = 0;

	//
	// VEGETARIAN TOGGLE
	// no interaction conflicts for now
	//


	//
	// PULL TO REFRESH
	// priority 0 in the event queue
	//
	$("body").hammer().on('hold', function (e) {
		console.log("what is wrong?");
		if(collapsedState) { 
		 		$(".dc").velocity("fadeIn", {duration: 100, complete: function() {collapsedState = false;}});
		 		$(".mc").velocity("fadeOut", "fast");
		 	} 	
	});

	$(".dice").hammer().on('dragdown', function(e){
			
			if(collapsedState) return;

			e.gesture.preventDefault(true);
		 	dragInProcess = true;
		 	
		 	
		 	if(kickOff == true) { 
		 		$(".dice").velocity("stop", true);
		 		$(".dice").velocity({boxShadowBlur:0}, 0);
		 		kickOff = false; 
		 		$(".dice").each(
		 			function (index) {
		 				var elem = $(this);
		 				setTimeout(function(){
		 					$(elem).velocity({scale:0.8}, {duration:900, easing:[ 600, 20 ]});
		 				}, index*40);
		 		});
				
		 	} // end big if


		}).on("dragend", function(e){
			if(!dragInProcess) return; 
			if(dragUpInProcess) return;
			if(false) return;

			console.log("released from drag");
			kickOff = true;
			
			$(".dice").velocity("stop", true);//.velocity("reverse");
			$(".dice").velocity({scale: 1, translateX:0, translateY:0}, {easing: [400,20], complete: function() {dragInProcess = false;}});
			$(".dice").each(function(){ 
				var color = getRandomColor();
				$(this).css("background-color", color); 
				$(this).find(".ingredient").css("background-color", color);
				$(this).find(".ingredient").find(".ingredient-text").html(randomIngredient());
			});
	});

	//
	// INDIVIDUAL ELEMENT TOUCH
	// priority 2 in the event queue
	//

	var touchInProcess = false;
	var holdAnim = false;
	var dragleftInProcess = false;
	var focused = false;

	$(".dice").hammer().on("touch", function(e) {
		if(collapsedState) return;
		e.gesture.preventDefault(true);

		var that = $(this);

			
		setTimeout(function(){
			if(dragInProcess) return;
			if(dragUpInProcess) return;

			$(that).bringToTop();
			
			$(that).velocity({boxShadowBlur:30}, {duration:2, complete:function(){focused = true;}, begin: function() { foucused = false; touchInProcess = true;}});
		}, 50);
		
	});

	var refreshElement = false;
	var rightDrag = false;

	$(".dice").hammer().on("dragleft", function(e){
		if(dragInProcess) return;
		if(dragUpInProcess) return;
		if(collapsedState) return;

		e.gesture.preventDefault();
		
		if(!focused) { console.log("aha!"); return; }

		$(this).find(".ingredient").css("left", ($("body").width()*0.4 + e.gesture.deltaX) + "px");
		$(this).find(".ingredient").velocity({opacity: e.gesture.deltaX.map(0,-190,1,0)}, 1);
		//$(this).find(".arrow").velocity({opacity: e.gesture.deltaX.map(0,-190,1,0)}, 1);

		if(e.gesture.deltaX < -100)	refreshElement = true; 
	});

	$(".dice").hammer().on("dragright", function(e){
		if(dragInProcess) return;
		if(dragUpInProcess) return;
		if(collapsedState) return;

		e.gesture.preventDefault();
		
		if(!focused) { console.log("aha!"); return; }

		rightDrag = true;

		$(this).find(".ingredient").css("left", ($("body").width()*0.4 + e.gesture.deltaX) + "px");
		$(this).find(".ingredient").velocity({opacity: e.gesture.deltaX.map(0,100,1,0)}, 1);
		//$(this).find(".arrow").velocity({opacity: e.gesture.deltaX.map(0,-190,1,0)}, 1);

		if(e.gesture.deltaX > 100)	refreshElement = true; 
	});

	$(".dice").hammer().on("release", function(e){
				
				if(dragInProcess) return;
				if(dragUpInProcess) return;
				if(collapsedState) return;

				if(false) return;

				if(touchInProcess) {
					if(!holdAnim) $(this).velocity("stop", true);
					$(this).velocity({boxShadowBlur: 0}, {duration:300, complete: function() {touchInProcess = false;}});
				}
				if(holdAnim) { $(this).velocity({boxShadowBlur: 0, scale:1}, {duration:300, complete: function() {touchInProcess = false;}});}

				if(refreshElement){
					console.log("refreshingElement");
					refreshElement = false;
					$(this).find(".ingredient").css("opacity", "0");
					$(this).find(".ingredient").css("left", "40%");
					
					var color = getRandomColor();
					console.log(color);

					$(this).find(".ingredient").css("background-color", color); 
					//$(this).css("backgroundColor",color);
					$(this).velocity({backgroundColor: color}, {duration: 250});

					$(this).find(".ingredient").find(".ingredient-text").html(randomIngredient());
					
					if(rightDrag) { $(this).find(".ingredient").velocity("transition.bounceLeftIn", 600); rightDrag = false; }
					else $(this).find(".ingredient").velocity("transition.bounceRightIn", 600);
				}
				else{
					if(rightDrag) { $(this).find(".ingredient").velocity({left:"40%", opacity:1}, 200); rightDrag = false; } 
					else $(this).find(".ingredient").velocity({left:"40%", opacity:1}, 200);
				}

	
				//$(this).find(".arrow").velocity("transition.bounceLeftIn", 750);
				
	});
	
});

