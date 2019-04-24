/*
var ball   = document.querySelector('.ball');
var garden = document.querySelector('.garden');
var output = document.querySelector('.output');

var maxX = garden.clientWidth  - ball.clientWidth;
var maxY = garden.clientHeight - ball.clientHeight;

function handleOrientation(event) {
  var x = event.beta;  // In degree in the range [-180,180]
  var y = event.gamma; // In degree in the range [-90,90]
  var z = event.alpha;
  
  output.innerHTML  = "beta : " + x + "\n";
  output.innerHTML += "gamma: " + y + "\n";
  output.innerHTML += "alpha: " + z + "\n";

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x >  90) { x =  90};
  if (x < -90) { x = -90};

  // To make computation easier we shift the range of 
  // x and y to [0,180]
  x += 90;
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  ball.style.top  = (maxX*x/180 - 10) + "px";
  ball.style.left = (maxY*y/180 - 10) + "px";
}

window.addEventListener('deviceorientation', handleOrientation);
*/

(function(){

	function Countstep(){
	   this.init();
	   return this.count;

	}

Countstep.prototype={
	init:function(){
		var _this=this;
		_this.flag=false;
		_this.count=[];//使用数组实现按引用传值；
		_this.count[0]=0;
	   function motionHandler(event) {  
	   		 var accGravity = event.accelerationIncludingGravity;  
	   		 _this.yg=accGravity.y;
	   		 return false;
	   }
	    function orientationHandler(event){
	    	 if ((_this.yg-10*Math.sin(event.beta*Math.PI/180))>1) {
                 _this.flag=true;
             }
             if((_this.yg-10*Math.sin(event.beta*Math.PI/180))<-1){
                     if(_this.flag==true){
                        _this.count[0]++;
                        _this.flag=false;  
                      
                     };
                     
                 }
	    }
 
	     if (window.DeviceMotionEvent&&window.DeviceOrientationEvent) {  
          window.addEventListener("devicemotion",motionHandler, false); 
          window.addEventListener("deviceorientation",orientationHandler, false); 
          return _this.count;
        }
         else {  
          alert('您的浏览器不支持本计步插件');
        }  

	},


}
  window.Countstep=Countstep;
})();
