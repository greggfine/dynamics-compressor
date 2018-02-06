var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

var model = {
	playing: false,
	audioBuffer: null,
};

var view = {

	init: function() {
		//Store DOM elements in variables
		var playStopBtn = document.querySelector(".play-stop-btn");
		var threshold = document.querySelector("#threshold").value;
		var ratio = document.querySelector("#ratio").value;
		var attack = document.querySelector("#attack").value;
		var release = document.querySelector("#release").value;

		//Bind EventListeners to DOM elements
		playStopBtn.addEventListener("click",() => controller.startStopAudio());

		$(".dial-1").knob({
			change: function(threshold) {
				controller.changeThreshold(threshold)
			}
		});

		$(".dial-2").knob({
			change: function(ratio) {
				controller.changeRatio(ratio)
			}
		});

		$(".dial-3").knob({
			change: function(attack) {
				controller.changeAttack(attack)
			}
		});

		$(".dial-4").knob({
			change: function(release) {
				controller.changeRelease(release)
			}
		});

		$("#make-up-gain").slider({
			"orientation": "horizontal",
			"range": "min",
			"min": 0,
			"value": .5,
			"max": 1,
			"animate": true,
			"step": 0.01,
			"slide": function(event, ui) {
				controller.changeGain(ui.value);
		}});

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