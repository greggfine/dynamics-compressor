var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

var model = {
	playing: false,
	audioBuffer: null,
}





var view = {

	init: function() {
		//Store DOM elements in variables
		var playStopBtn = document.querySelector(".play-stop-btn");
		var threshold = document.querySelector("#threshold");
		var ratio = document.querySelector("#ratio");
		var makeUpGain = document.querySelector("#make-up-gain");

		//Bind EventListeners to DOM elements
		playStopBtn.addEventListener("click",() => controller.startStopAudio());

		threshold.addEventListener("input", function(){
			controller.changeThreshold(this.value);
		});
		ratio.addEventListener("input", function(){
			controller.changeRatio(this.value);
		});
		attack.addEventListener("input", function(){
			controller.changeAttack(this.value);
		});
		release.addEventListener("input", function(){
			controller.changeRelease(this.value);
		});
		makeUpGain.addEventListener("input", function(){
			controller.changeGain(this.value);
		});

		//Grabs the audio file
		controller.getAudio();
	},

	render: function(){
		controller.playAudio();
	}
}





var controller = {
	init: function(){
		view.init();
	},
	startStopAudio: function(){
		const btn = document.querySelector("button");
		if(!model.playing){
			this.play();
			model.playing = true;
			btn.classList.remove("red-bg");
			btn.classList.add("green-bg");
		} else {
			this.stop();
			model.playing = false;
			btn.classList.add("red-bg");
		}
	},
	getAudio: function(){
		var http = new XMLHttpRequest();
		http.open("GET", "audio/tune2.mp3", true)
		http.responseType = "arraybuffer";
		http.onload = function(){
			ctx.decodeAudioData(http.response, function(buffer) {
				model.audioBuffer = buffer;
			});
		}
		http.send();
	},
	play: function(){
		this.playSound = ctx.createBufferSource();
		this.playSound.buffer = model.audioBuffer;
		this.amp = ctx.createGain();
		this.compressor = ctx.createDynamicsCompressor();
		this.playSound.connect(this.compressor);
		this.compressor.connect(this.amp);
		this.amp.connect(ctx.destination);
		this.playSound.start(ctx.currentTime);
	},


	changeThreshold: function(threshVal){
		this.compressor.threshold.value = threshVal;
	},
	changeRatio: function(ratioVal){
		this.compressor.ratio.value = ratioVal;
	},
	changeGain: function(gainVal){
		this.amp.gain.value = gainVal;
	},
	changeAttack: function(attackVal){
		this.compressor.attack.value = attackVal;
	},
	changeRelease: function(releaseVal){
		this.compressor.release.value = releaseVal;
	},



	stop: function(){
		this.playSound.stop(ctx.currentTime);
	}
}

controller.init();