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
	var words = "carrot-cake polenta asparagus-brocoli musli lime leek-salad steam lamb pork tulips deodorant mashed-potatoes".split(' ');
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

	var elemno = $(".dice").length;

	$(".dice").each(function(){
		$(this).css("background-color", getRandomColor());
		$(this).css("height", 100/elemno + "%");
	});

	$(".title").each(function(){
		$(this).css("background-color", getRandomColor());
	});

	$(".dice .ingredient").css("line-height", $(".dice").height()*0.7+"px");
	$(".dice .phrase").css("line-height", $(".dice").height()*0.3+"px");
	
	$(".menu").css("line-height", $("#menu-holder").height()+"px");
	
	$(".title").css("line-height", $(".title").height()+"px");


	$("#menu-holder").velocity({boxShadowBlur:20}, 0);
	
}



var vegan = false;

function changeRegime()
{

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
	
	var menuopen = false;

	var prevMargin = 0;

	$(".title").css("height", "25%");
	$(".title").css("line-height", $(".title").height() + "px");

	$("#menu-holder").hammer().on('tap', function(e){
		console.log("closing or opening something else.");
		menuopen = !menuopen;

		if(menuopen) {

			var top = 0;
		
			$(this).velocity({top: top+"%"}, {duration: 400});

			$(".inner-holder").velocity({marginTop: "0%"}, {duration: 1});
			//$(".active").velocity("scroll", { duration: 1, container: $(".inner-holder"), offset: -100 });

		}
		else {
			var top = 90;
			$(this).velocity({top: top+"%"}, {duration: 350, complete: function(){

				var absH = $("body").height();
				var unitH = absH*0.1;
				var activeIndex = 0;
				var activeH = 0;


				$(".title").each(function(index){ if($(this).hasClass("active")) { activeIndex = index; activeH = $(this).position().top; return; }});

				//prevMargin = -unitH*activeIndex;

				$(this).find(".inner-holder").velocity({marginTop: -activeH - $(".title").height()/3+"px"}, {duration: 1200, easing: [600,20]});

			}});

		}
		
	});


	$(".title").hammer().on("tap", function(){
		if(!menuopen) return;
		$(".title").removeClass("active");
		$(this).addClass("active");
		$(this).bringToTop();	
	});

	//
	// PULL TO REFRESH
	// priority 0 in the event queue
	//
	$("body").hammer().on('hold', function (e) {
	
	});

	$("#dice-holder").hammer().on('dragdown', function(e){
			
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
				
				$("body").velocity({backgroundColor: "#fff"}, 600);
		 	} // end big if


		}).on("dragend", function(e){
			if(!dragInProcess) return; 

			console.log("released from drag");
			kickOff = true;

			$("body").velocity("stop", true);
			$("body").velocity({backgroundColor: "#d7d7d7"}, 1);
			
			$(".dice").velocity("stop", true);//.velocity("reverse");
			$(".dice").velocity({scale: 1, translateX:0, translateY:0}, {easing: [400,20], complete: function() {dragInProcess = false;}});
			$(".dice").each(function(){ 
				var color = getRandomColor();
				$(this).css("background-color", color); 
				//$(this).find(".swiper").css("background-color", color);
				$(this).find(".swiper").find(".ingredient-text").html(randomIngredient());

				var noChars = $(this).find(".swiper").find(".ingredient-text").html().length;
				var width = noChars * 19;

				$(this).find(".svg-handler").css("width", width + "px");
				$(this).find(".svg-handler").css("left", ($(this).width() - width)/2 + "px");
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

	$(".swipeable").hammer().on("touch", function(e) {
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

	$(".swipeable").hammer().on("dragleft", function(e){
		if(dragInProcess) return;
		if(dragUpInProcess) return;

		e.gesture.preventDefault();
		
		if(!focused) { console.log("aha!"); return; }

		$(this).find(".swiper").css("left", (0 + e.gesture.deltaX) + "px");
		$(this).find(".swiper").velocity({opacity: e.gesture.deltaX.map(0,-100,1,0)}, 1);

		if(e.gesture.deltaX < -100)	refreshElement = true; 
	});

	$(".swipeable").hammer().on("dragright", function(e){
		if(dragInProcess) return;
		if(dragUpInProcess) return;
		
		e.gesture.preventDefault();
		
		if(!focused) { console.log("aha!"); return; }

		rightDrag = true;

		$(this).find(".swiper").css("left", (0 + e.gesture.deltaX) + "px");
		$(this).find(".swiper").velocity({opacity: e.gesture.deltaX.map(0,100,1,0)}, 1);

		if(e.gesture.deltaX > 100)	refreshElement = true; 
	});

	$(".swipeable").hammer().on("release", function(e){
				
				if(dragInProcess) return;
				if(dragUpInProcess) return;

				if(touchInProcess) {
					if(!holdAnim) $(this).velocity("stop", true);
					$(this).velocity({boxShadowBlur: 0}, {duration:300, complete: function() {touchInProcess = false;}});
				}
				if(holdAnim) { $(this).velocity({boxShadowBlur: 0, scale:1}, {duration:300, complete: function() {touchInProcess = false;}});}

				if(refreshElement){
					refreshElement = false;
					$(this).find(".swiper").css("opacity", "0");
					$(this).find(".swiper").css("left", "0%");
					
					var color = getRandomColor();
					console.log(color);

					//$(this).find(".swiper").css("background-color", color); 
					//$(this).css("backgroundColor",color);
					$(this).velocity({backgroundColor: color}, {duration: 250});

					$(this).find(".swiper").find(".ingredient-text").html(randomIngredient());
					
					if(rightDrag) { $(this).find(".swiper").velocity("transition.bounceLeftIn", 600); rightDrag = false; }
					else $(this).find(".swiper").velocity("transition.bounceRightIn", 600);
				}
				else{
					if(rightDrag) { $(this).find(".swiper").velocity({left:"0%", opacity:1}, 200); rightDrag = false; } 
					else $(this).find(".swiper").velocity({left:"0%", opacity:1}, 200);
				}


				if(!$(this).hasClass("dice")) return;
				var noChars = $(this).find(".swiper").find(".ingredient-text").html().length;
				var width = noChars * 19;

				$(this).find(".svg-handler").css("width", width + "px");
				$(this).find(".svg-handler").css("left", ($(this).width() - width)/2 + "px");

				//$(this).find(".arrow").velocity("transition.bounceLeftIn", 750);
				
	});
	
});

