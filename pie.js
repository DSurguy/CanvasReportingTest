window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function PieCanvas(width, height, innerRadius, pieWidth, data, threshold){

	/* OPTIONS */

	this.colors = ["562643", "a52b34", "baba73", "28561c", "ac7b32"];
	this.otherColor = "777777";

	/* DON'T TOUCH THIS STUFF THANKS */

	//create a new canvas
	var newCanv = document.createElement("canvas");
	newCanv.width = width;
	newCanv.height = height;
	document.body.appendChild(newCanv);

	//grab the drawing context
	this.ctx = newCanv.getContext("2d");
	
	//store the width and height
	this.width = width;
	this.height = height;

	//store the center of the circle
	this.centerX = width/2;
	this.centerY = height/2;

	//store the inner and outer radius
	this.innerRadius = innerRadius;
	this.outerRadius = innerRadius+pieWidth;

	//sort the data
	data.sort(function(a,b){
		if( a.percent > b.percent ){
			return -1;
		}
		if( a.percent < b.percent ){
			return 1;
		}
		return 0;
	});

	//store the data
	this.data = data;

	//init the percent index
	this.currentPercent = 0;
	//init the colors index
	this.colorIndex = 0;
	//store the threshold for showing "Other"
	this.threshold = threshold || 75;
	//init the wedge array
	this.wedges = [];


	//add the wedges
	for( var i=0; i<this.data.length; i++ ){
		if( this.currentPercent == 100 ){
			break;
		}
		this.addWedge(this.data[i].percent, this.data[i].label);
	}

	//draw the Pie!
	this.draw();

	//holder for event handlers
	var holdThis = this;

	//bind click handling
	newCanv.addEventListener("click", function(e){
		//dispatch this event to all wedges
		for( var i=0; i<holdThis.wedges.length; i++ ){
			holdThis.wedges[i].checkCollision(e);
		}
	});

};

PieCanvas.prototype.addWedge = function(percent, label){

	var curColor = this.colors[this.colorIndex],
		startPercent = this.currentPercent,
		centerX = this.centerX,
		centerY = this.centerY,
		innerRadius = this.innerRadius;
		outerRadius = this.outerRadius;


	//see if we hit the threshold and need to lump the rest
	if( this.currentPercent >= this.threshold ){
		percent = 100 - this.currentPercent;
		curColor = this.otherColor;
		this.currentPercent = 100;
		//add the 'other' wedge
		this.wedges.push(new Wedge(this.ctx,{
			label: "Other",
			startPercent: startPercent,
			percent: percent,
			fillColor: curColor,
			centerX: centerX,
			centerY: centerY,
			innerRadius: innerRadius,
			outerRadius: outerRadius
		}));
		// end adding of wedges
		return;
	}
	else{
		//add this wedge
		this.wedges.push(new Wedge(this.ctx,{
			label: label,
			startPercent: startPercent,
			percent: percent,
			fillColor: curColor,
			centerX: centerX,
			centerY: centerY,
			innerRadius: innerRadius,
			outerRadius: outerRadius
		}));
	}

	this.currentPercent += percent;
	if( this.colorIndex == this.colors.length-1 ){
		this.colorIndex = 0;
	}
	else{
		this.colorIndex++;
	}
};

PieCanvas.prototype.draw = function(){
	//clear the canvas
	this.ctx.clearRect(0,0,this.width, this.height)

	for( var i=0; i<this.wedges.length; i++ ){
		this.wedges[i].draw();
	}

};


/*
* OPTIONS
*	@label: 		wedge label
*	@startPercent: 	where to start drawing wedge
*	@percent: 		length of wedge
*	@fillColor: 	color of wedge
*	@centerX: 		x-coord of circle
*	@centerY: 		y-coord of circle
*	@innerRadius: 	inside radius of wedge
*	@outerRadius: 	outside radius of wedge	
*/
function Wedge(canvasContext, options){
	this.ctx = canvasContext;

	this.label = options.label;

	this.arcStart = ((Math.PI)*2)*(options.startPercent/100);
	this.arcLength = ((Math.PI)*2)*(options.percent/100);
	this.fillColor = options.fillColor;
	this.centerX = options.centerX;
	this.centerY = options.centerY;
	this.innerRadius = options.innerRadius;
	this.outerRadius = options.outerRadius;
};

Wedge.prototype.draw = function(){
	this.ctx.fillStyle = this.fillColor;
	this.tracePath();
	this.ctx.fill();
	this.ctx.closePath();
};

Wedge.prototype.tracePath = function(){
	var fullPI = Math.PI*2;
	//close any open paths
	this.ctx.closePath();
	//open a new path
	this.ctx.beginPath();
	//draw the inner arc counter clockwise
	this.ctx.arc(this.centerX, this.centerY, this.innerRadius, fullPI-this.arcStart, fullPI-(this.arcStart+this.arcLength), true);
	//draw the outer arc clockwise
	this.ctx.arc(this.centerX, this.centerY, this.outerRadius, fullPI-(this.arcStart+this.arcLength), fullPI-this.arcStart, false);
	//complete the path
	this.ctx.arc(this.centerX, this.centerY, this.innerRadius, fullPI-this.arcStart, fullPI-this.arcStart, true);
};

Wedge.prototype.checkCollision = function(event){
	//WE GONNA MATH IT
	var fullPI = Math.PI*2;
	var mouseX = event.offsetX;
	var mouseY = event.offsetY;
	var mouseAngle = Math.atan2(this.centerY-mouseY, mouseX-this.centerX);
	//see if we need to modify the atan angle
	if( mouseAngle < 0 ){
		//it went clockwise
		mouseAngle = Math.abs(mouseAngle);
	}
	else{
		mouseAngle = fullPI - mouseAngle;
	}
	var mouseRadius = Math.sqrt((mouseX-this.centerX)*(mouseX-this.centerX) + (this.centerY-mouseY)*(this.centerY-mouseY));

	

	//determine if the point is within the start and end angles
	var startAngle = fullPI-this.arcStart;
	var endAngle = fullPI-(this.arcStart+this.arcLength);

	if( startAngle < mouseAngle || endAngle > mouseAngle ){
		return false;
	}

	//now determine if it's within the radius
	if( mouseRadius < this.innerRadius || mouseRadius > this.outerRadius ){
		return false;
	}

	this.report(event);

	return true;
};

Wedge.prototype.report = function(event){
	alert(this.label);
}