// ! Consts
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const myCar = new Image();
myCar.src = 'machine.png';

const noise = [];
const arrHillsSmoothNoise = [];
const arrHillsNoise = [];

// @ Variables

let okLeftSmoothNoise = false;
let okRightSmoothNoise = false;

let okLeftNoise = false;
let okRightNoise = false;

// >>> Code

// --- Create Point for Hills
for (let i = 0; i < 11; i++) {
	let tmp = Math.floor(Math.random() * 200) + 200;
	noise.push(tmp);
}


// --- Smoothing Point for Hills
let smoothNoise = [];
for (let i = 0; i < 11; i++) {
	if (noise[i] < noise[i + 1] || noise[i] === noise[i + 1] || noise[i + 1] === undefined) {
		smoothNoise.push(noise[i]);
	} else {
		smoothNoise.push(noise[i + 1]);
	}
}

// $ Interpolation
function interpol(a, b, mid) {
	ft = mid * Math.PI;
	f = (1 - Math.cos(ft)) * 0.5;
	return a * (1 - f) + b * f;
}

// ^ Calculate the road points for SmoothNoise array
for (let i = 0; i < 10; i++) {
	let mid = 0;

	for (let k = 0; k < 40; k++) {
		let midY = interpol(smoothNoise[i], smoothNoise[i + 1], mid);

		arrHillsSmoothNoise.push(midY);

		mid += 0.025;
	}
}

// ^ Calculate the road points for Noise array
for (let i = 0; i < 10; i++) {
	let mid = 0;

	for (let k = 0; k < 40; k++) {
		let midY = interpol(noise[i], noise[i + 1], mid);

		arrHillsNoise.push(midY);

		mid += 0.025;
	}
}

// & Draw Hills
function drawHills(typeNoise, x) {
	for (let i = 0; i < 400; i++) {
		ctx.strokeStyle = 'green';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(i + x, typeNoise[i]);
		ctx.lineTo(i + x, typeNoise[i] + 10);
		ctx.stroke();

		ctx.strokeStyle = 'chocolate';
		ctx.beginPath();
		ctx.moveTo(i + x, typeNoise[i] + 10);
		ctx.lineTo(i + x, 500);
		ctx.stroke();
		//ctx.fillRect(i + x, typeNoise[i], 1, 10);
	}
}

// & Draw Background
function drawBack(x) {
	ctx.fillStyle = 'skyblue';
	ctx.fillRect(x, 0, 400, 500);
}

// @ Class for Car
class Car {
	constructor(xSmoothNoise, xNoise) {
		this.xSmoothNoise = xSmoothNoise;
		this.xNoise = xNoise;
	}

	drawCar(typeArrHills) {
		if (typeArrHills === arrHillsSmoothNoise) {
			// & SmoothNoise

			// >>> Right
			if (okRightSmoothNoise === true && this.xSmoothNoise + 30 < 400) {
				this.xSmoothNoise += 3;
			}

			// ? Left
			if (okLeftSmoothNoise === true && this.xSmoothNoise - 30 > 0) {
				this.xSmoothNoise -= 3;
			}

			ctx.drawImage(myCar, this.xSmoothNoise - 30, arrHillsSmoothNoise[this.xSmoothNoise] - 40);

			// ^ End
		} else if (typeArrHills === arrHillsNoise) {
			// & Noise
			
			// >>> Right
			if (okRightNoise === true && this.xNoise + 30 < 1000) {
				console.log(12);
				this.xNoise += 3;
			}

			// ? Left
			if (okLeftNoise === true && this.xNoise - 30 > 600) {
				this.xNoise -= 3;
			}

			ctx.drawImage(myCar, this.xNoise - 30, arrHillsNoise[this.xNoise - 600] - 40);

			// ^ End
		}
	}
}

let car = new Car(60, 660);

// @ Update
function animate() {
	drawBack(0);
	drawBack(600);
	drawHills(arrHillsSmoothNoise, 0);
	drawHills(arrHillsNoise, 600);
	car.drawCar(arrHillsSmoothNoise);
	car.drawCar(arrHillsNoise);

	requestAnimationFrame(animate);
}
animate();

// @ Event for array SmoothNoise
addEventListener('keydown', function (e) {
	if (e.keyCode === 37) {
		okLeftSmoothNoise = true;
	}

	if (e.keyCode === 39) {
		okRightSmoothNoise = true;
	}
});

addEventListener('keyup', function (e) {
	if (e.keyCode === 37) {
		okLeftSmoothNoise = false;
	}

	if (e.keyCode === 39) {
		okRightSmoothNoise = false;
	}
});



// @ Event for array Noise
addEventListener('keydown', function (e) {
	if (e.keyCode === 65) {
		okLeftNoise = true;
	}

	if (e.keyCode === 68) {
		okRightNoise = true;
	}
});

addEventListener('keyup', function (e) {
	if (e.keyCode === 65) {
		okLeftNoise = false;
	}

	if (e.keyCode === 68) {
		okRightNoise = false;
	}
});

// ^ End