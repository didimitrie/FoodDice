function getRandomColor(){for(var e="0123456789ABCDEF".split(""),o="#",t=0;6>t;t++)o+=e[Math.floor(16*Math.random())];return o}Number.prototype.map=function(e,o,t,n){return(this-e)*(n-t)/(o-e)+t};var shakeinterval;Hammer(document.body).on("dragdown",function(e){e.gesture.preventDefault(!0);var o=e.gesture.deltaY;console.log(o)}).on("dragend",function(e){e.gesture.preventDefault(!0),$(".dice").velocity({scale:1},30)}),$(document).ready(function(){var e=$("body").height();console.log(e),$(".dice").height((e-10)/5),$(".dice").each(function(){$(this).css("background-color",getRandomColor())})});