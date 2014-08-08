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
	var elemNo = $(".dice").length;

	$(".dice").each(function(i) { $(this).height((totalHeight-0)/elemNo); $(this).css("top", i*totalHeight/elemNo); });
	$(".dice .arrow").css("top", totalHeight/(elemNo*2)-30 + "px");
	$(".dice .ingredient").each(function(){$(this).css("background-color", getRandomColor());});
	$(".dice .ingredient").css("line-height", totalHeight/elemNo+"px");
	$(".dice .phrase").css("line-height", totalHeight/elemNo+"px");
	$(".dice .funny-text").css("line-height", totalHeight/elemNo+"px");
}

function setUpCards(){
	var cardNo = $(".card").length;
	var height = $("body").height();

	var totalHeight = $("body").height();
	$(".card").each(function (index) {
		$(this).css("top", -index * height + "px");
		$(this).each(function(){$(this).css("background-color", getRandomColor());});
	});
}

$(document).ready(function () {

	setElementsHeight();

	var kickOff = true;
	var kickOffUp = true;

	var dragInProcess = false;
	var dragUpInProcess = false;
	var collapsedState = false;

	var sidebarOpen = false;
	var sidebardDragLeft = false;
	var sidebardDragRight = false;
	var sideBarScale = 0;


	$("body").hammer().on('dragright', function(e) {
		$(this).bringToTop();
		e.gesture.preventDefault(true);
		sidebardDragLeft = true;
		var scale = e.gesture.deltaX.map(0, $("body").width(), 12, 100);
		$(".collection").css("width", scale + "%");
		$(".dc").css("left", scale*0.7 + "%");
		$(".dc").velocity({rotateX:scale*0.8, opacity:1-scale/100}, 0);
		sideBarScale = scale;
	}).on('release', function(){
		if(!sidebardDragLeft) return;
		sidebardDragLeft = false;
		if(sideBarScale>50) {
			$(".collection").velocity({width:"100%"}, {duration: 300, easing: "easeOutCubic", complete:function(){sidebarOpen = true;}});
			$(".dc").velocity({left:"100%", rotateX: 90}, {duration: 300, easing: "easeOutCubic"});
		}
		else{ 
			$(".collection").velocity({width:"10%"}, {duration: 300, easing: "easeOutCubic"});
			$(".dc").velocity({left:"0%", rotateX:0, opacity:1}, {duration: 300, easing: "easeOutCubic"});
		}
	});

	$(".collection").hammer().on('dragleft', function(e){
		e.gesture.preventDefault(true);
		if(!sidebarOpen) return;
		var scale = 100-e.gesture.deltaX.map(0, -$("body").width(), 12, 100);
		$(this).css("width", scale + "%");
		$(".dc").css("left", scale*0.35 + "%");
		$(".dc").velocity({rotateX:scale*0.8, opacity:1-scale/100}, 0);

		sideBarScale = scale;
		sidebardDragRight = true;
	}).on('release', function(){
		if(!sidebardDragRight) return;
		if(sideBarScale<50) 
		{
			$(".collection").velocity({width:"10%"}, {duration: 100, complete:function(){sidebarOpen = false;}});
			$(".dc").velocity({left:"0%", rotateX:0, opacity:1}, 100);
		}
		else
		{ 
			$(".collection").velocity({width:"100%"}, 100);
			$(".dc").velocity({left:"100%", rotateX: 90}, 100);
		}
	});


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
			$(".dice").each(function(){ $(this).find(".ingredient").css("background-color", getRandomColor()); $(this).find(".ingredient").html(randomIngredient())});
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
			
			$(that).velocity({boxShadowBlur:30, scale:1.1}, {duration:2, complete:function(){focused = true;}, begin: function() { foucused = false; touchInProcess = true;}});
		}, 50);
		
	});

	var refreshElement = false;
	var rightDrag = false;

	$(".dice ").hammer().on("dragleft", function(e){
		if(dragInProcess) return;
		if(dragUpInProcess) return;
		if(collapsedState) return;

		e.gesture.preventDefault();
		
		if(!focused) { console.log("aha!"); return; }

		$(this).find(".ingredient").css("left", ($("body").width()/2 + e.gesture.deltaX) + "px");
		$(this).find(".ingredient").velocity({opacity: e.gesture.deltaX.map(0,-190,1,0)}, 1);
		$(this).find(".funny-text").velocity({opacity: e.gesture.deltaX.map(0,-120,0,1)}, 1);
		$(this).find(".arrow").velocity({opacity: e.gesture.deltaX.map(0,-190,1,0)}, 1);

		if(e.gesture.deltaX < -100)	refreshElement = true; 
	});

	$(".dice").hammer().on("release", function(e){
				
				if(dragInProcess) return;
				if(dragUpInProcess) return;
				if(collapsedState) return;

				if(false) return;

				if(touchInProcess) {
					if(!holdAnim) $(this).velocity("stop", true);
					$(this).velocity({boxShadowBlur: 0, scale:1}, {duration:300, complete: function() {touchInProcess = false;}});
				}
				if(holdAnim) { $(this).velocity({boxShadowBlur: 0, scale:1}, {duration:300, complete: function() {touchInProcess = false;}});}

				if(refreshElement){
					console.log("refreshingElement");
					refreshElement = false;
					$(this).find(".ingredient").css("opacity", "0");
					$(this).find(".ingredient").css("left", "50%");
					$(this).find(".ingredient").css("background-color", getRandomColor()); $(this).find(".ingredient").html(randomIngredient());
					if(rightDrag) { $(this).find(".ingredient").velocity("transition.bounceLeftIn", 600); rightDrag = false; }
					else $(this).find(".ingredient").velocity("transition.bounceRightIn", 600);
				}
				else{
					if(rightDrag) { $(this).find(".ingredient").velocity({left:"50%", opacity:1}, 200); rightDrag = false; } 
					else $(this).find(".ingredient").velocity({left:"50%", opacity:1}, 200);
				}

				$(this).find(".funny-text").velocity({opacity: 0}, 200);
				$(this).find(".arrow").velocity("transition.bounceLeftIn", 750);
				
	});
	
});

