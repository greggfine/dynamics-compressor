var ctx = new (window.AudioContext || window.webkitAudioContext)();

var model = {
	playing: false,
	audioBuffer: null
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
		});

		ratio.addEventListener("input", function(){
		});

		makeUpGain.addEventListener("input", function(){
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
		}
	},
	getAudio: function(){
		var http = new XMLHttpRequest();
		http.open("GET", "/audio/drums.wav", true)
		http.responseType = "arraybuffer";
		http.onload = function(){
			ctx.decodeAudioData(http.response, function(buffer) {
				model.audioBuffer = buffer;
			});
		}
		http.send();
	},
	play: function(){
		var playSound = ctx.createBufferSource();
		playSound.buffer = model.audioBuffer;
		playSound.start(ctx.currentTime);
		playSound.connect(ctx.destination);
	}
}

controller.init();