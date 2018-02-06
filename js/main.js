var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

var model = {
	playing: false,
	audioBuffer: null,
}

var view = {
	init: function() {
		var playStopBtn = document.querySelector(".play-stop-btn");
		var threshold = document.querySelector("#threshold");
		var ratio = document.querySelector("#ratio");
		var makeUpGain = document.querySelector("#make-up-gain");

		playStopBtn.addEventListener("click", function(){
				controller.startStopAudio();
		});

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
		if(!model.playing){
			this.play();
			model.playing = true;
		} else {
			this.stop();
			model.playing = false;
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