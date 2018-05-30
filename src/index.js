import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

//Create audio context
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o=null
var g=null

//
class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col)
	}

	render() {
		return (
			<div
			className={this.props.boxClass}
			id={this.props.id}
			onClick={this.selectBox}
			/>
			)
	}
}


class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 14);
		var rowsArr = [];
		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;
				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box 
					boxClass={boxClass}
					key={boxId}
					boxId={boxId}
					row={i}
					col={j}
					selectBox={this.props.selectBox}
					/>
					)
			}
		}

		return (<div className="grid" style={{width: width}}>
			{rowsArr}
			</div>
			
			)
	}
}

class TopButtons extends React.Component {

	render() {
		return (
			<div className="center">
			<ButtonToolbar>
			<button className="btn btn-default" onClick={this.props.playButton}>
			Play
			</button>
			<button className="btn btn-default" onClick={this.props.pauseButton}>
			Pause
			</button><button className="btn btn-default" onClick={this.props.clear}>
			Clear
			</button><button className="btn btn-default" onClick={this.props.seed}>
			Populate
			</button>
			</ButtonToolbar>
			</div>
			)
	}
}
class BottomButtons extends React.Component {

	handleGridSelect = (evt) => {
		this.props.gridSize(evt);
	}
	handleToneSelect = (evt) => {
		this.props.toneSelect(evt);
	}
	handleSpeedSelect = (evt) => {
		this.props.speedSelect(evt);
	}
handleKeySelect = (evt) => {
		this.props.keySelect(evt);
	}
	render() {
		return (
			<div className="center dropup">
			<ButtonToolbar>
			<DropdownButton
			title="Grid Size"
			id="size-menu"
			onSelect={this.handleGridSelect}
			>
			<MenuItem eventKey="1">30x20</MenuItem>
			<MenuItem eventKey="2">40x25</MenuItem>
			<MenuItem eventKey="3">50x30</MenuItem>
			</DropdownButton>
			<DropdownButton
			title="Tone"
			id="tone-menu"
			onSelect={this.handleToneSelect}
			>
			<MenuItem eventKey="1">Sawtooth</MenuItem>
			<MenuItem eventKey="2">Triangle</MenuItem>
			<MenuItem eventKey="3">Square</MenuItem>
			<MenuItem eventKey="4">Sine</MenuItem>
			</DropdownButton>
			<DropdownButton
			title="Key"
			id="key-menu"
			onSelect={this.handleKeySelect}
			>
			<MenuItem eventKey="1">C</MenuItem>
			<MenuItem eventKey="2">Cm</MenuItem>
			<MenuItem eventKey="3">C#</MenuItem>
			<MenuItem eventKey="4">D</MenuItem>
			<MenuItem eventKey="5">Dm</MenuItem>
			<MenuItem eventKey="6">D#</MenuItem>
			<MenuItem eventKey="7">E</MenuItem>
			<MenuItem eventKey="8">Em</MenuItem>
			<MenuItem eventKey="9">F</MenuItem>
			<MenuItem eventKey="10">Fm</MenuItem>
			<MenuItem eventKey="11">F#</MenuItem>
			<MenuItem eventKey="12">G</MenuItem>
			<MenuItem eventKey="13">Gm</MenuItem>
			<MenuItem eventKey="14">G#</MenuItem>
			<MenuItem eventKey="15">A</MenuItem>
			<MenuItem eventKey="16">Am</MenuItem>
			<MenuItem eventKey="17">A#</MenuItem>
			<MenuItem eventKey="18">B</MenuItem>
			<MenuItem eventKey="19">Bm</MenuItem>
			</DropdownButton>
			<DropdownButton
			title="Speed"
			id="speed-menu"
			onSelect={this.handleSpeedSelect}
			>
			<MenuItem eventKey="1">100ms</MenuItem>
			<MenuItem eventKey="2">200ms</MenuItem>
			<MenuItem eventKey="3">400ms</MenuItem>
			<MenuItem eventKey="4">500ms</MenuItem>
			<MenuItem eventKey="5">600ms</MenuItem>
			<MenuItem eventKey="6">700ms</MenuItem>
			<MenuItem eventKey="7">800ms</MenuItem>
			<MenuItem eventKey="8">900ms</MenuItem>
			</DropdownButton>
			</ButtonToolbar>
			</div>
			)
	}
}

class Main extends React.Component {
	constructor() {
		super();
		this.speed = 200;
		this.rows = 25;
		this.cols = 40;
		this.tone = "sawtooth";
		this.key = [261.6, 329.6, 392.0]; //C

		this.state = {
			generation: 0, 
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
		}
	}


	toneGen = (type, frequency, x) => {
		o=context.createOscillator()
		g=context.createGain()
		o.connect(g)
		o.type=type
		o.frequency.value=frequency
		g.connect(context.destination)
		o.start(0)
		g.gain.exponentialRampToValueAtTime(0.000001,context.currentTime+ x)}


		selectBox = (row, col) => {
			let gridCopy = arrayClone(this.state.gridFull);
			gridCopy[row][col] = !gridCopy[row][col];
			this.setState({
				gridFull: gridCopy
			});
		}

		seed = () => {
			let gridCopy = arrayClone(this.state.gridFull);
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					if (Math.floor(Math.random() * 4) === 1) {
						gridCopy[i][j] = true;
					}
				}
			}
			this.setState({
				gridFull: gridCopy
			});
		}

		playButton = () => {
			clearInterval(this.intervalId);
			this.intervalId = setInterval(this.play, this.speed);
		}

		pauseButton = () => {
			clearInterval(this.intervalId);
		}
		clear = () => {
			var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
			this.setState({
				gridFull: grid,
				generation: 0
			})
			this.pauseButton();
		}
		gridSize = (size) => {
			switch (size) {
				case "1":
				this.cols = 30;
				this.rows = 20;
				break;
				case "2":
				this.cols = 40;
				this.rows = 25;
				break;
				default:
				this.cols = 50;
				this.rows = 30;
			}
			this.pauseButton();
			this.clear();
		}
		toneSelect = (tone) => {
			switch (tone) {
				case "1":
				this.tone = "sawtooth";
				break;
				case "2":
				this.tone = "triangle";
				break;
				case "3":
				this.tone = "square";
				break;
				default:
				this.tone = "sine";
			}
		}
			speedSelect = (speed) => {
			switch (speed) {
				case "1":
				this.speed = 100;
				this.playButton();
				break;
				case "2":
				this.speed = 200;
				this.playButton();
				break;
				case "3":
				this.speed = 300;
				this.playButton();
				break;
				case "4":
				this.speed = 400;
				this.playButton();
				break;
				case "5":
				this.speed = 500;
				this.playButton();
				break;
				case "6":
				this.speed = 600;
				this.playButton();
				break;
				case "7":
				this.speed = 700;
				this.playButton();
				break;
				case "8":
				this.speed = 800;
				this.playButton();
				break;
				default:
				this.speed = 900;
				this.playButton();
			}
		}
		keySelect = (key) => {
			switch (key) {
				case "1":
				this.key = [261.6, 329.6, 392.0];
				break;
				case "2":
				this.key = [261.6, 311.1, 392.0];
				break;
				case "3":
				this.key = [277.2, 349.2, 415.3];
				break;
				case "4":
				this.key = [293.7, 370.0, 440.0];
				break;
				case "5":
				this.key = [293.7, 349.2, 440.0];
				break;
				case "6":
				this.key = [311.1, 392.0, 466.2];
				break;
				case "7":
				this.key = [329.6, 415.3, 493.9];
				break;
				case "8":
				this.key = [329.6, 392.0, 493.9];
				break;
				case "9":
				this.key = [349.2, 440.0, 261.6];
				break;
				case "10":
				this.key = [349.2, 415.3, 261.6];
				break;
				case "11":
				this.key = [370.0, 277.2, 466.2];
				break;
				//G
				case "12":
				this.key = [392.0, 493.9, 293.7];
				break;
				//Gm
				case "13":
				this.key = [392.0, 466.2, 293.7];
				break;
				//g#
				case "14":
				this.key = [466.2, 261.6, 311.1];
				break;
				//a
				case "15":
				this.key = [440.0, 277.2, 329.6];
				break;
				//Am
				case "16":
				this.key = [440.0, 261.6, 329.6];
				break;
				//a#
				case "17":
				this.key = [466.2, 293.7, 349.2];
				break;
				//B
				case "18":
				this.key = [493.9, 311.1, 370.0];
				break;
				//Bm
				default:
				this.key = [493.9, 293.7, 370.0];
				break;
			}
		}

		play = () => {

			let g = this.state.gridFull;
			let g2 = arrayClone(this.state.gridFull);
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					let count = 0;
					if (i > 0) if (g[i - 1][j]) count++;
					if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
					if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
					if (j < this.cols - 1) if (g[i][j + 1]) count++;
					if (j > 0) if (g[i][j - 1]) count++;
					if (i < this.rows - 1) if (g[i + 1][j]) count++;
					if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
					if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
					if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
					if (!g[i][j] && count === 3) {
						g2[i][j] = true;
							if ((Math.floor(Math.random() * 75)) === 1) {
							this.toneGen(this.tone,this.key[0]	, 1)
						} else if ((Math.floor(Math.random() * 75)) === 2) {
							this.toneGen(this.tone,this.key[1], 1)
						} else if ((Math.floor(Math.random() * 75)) === 3) {
							this.toneGen(this.tone,this.key[2], 1)
						} 
					}
				}
			}
			this.setState({
				gridFull: g2,
				generation: this.state.generation + 1
			});
		}

		componentDidMount() {
			this.seed();
		//this.playButton();
	}

	render() {
		return (
			<div>
			<h1>Conway's Melody</h1>
			<TopButtons 
			playButton={this.playButton}
			pauseButton={this.pauseButton}
			clear={this.clear}
			seed={this.seed}
			/>
			<Grid 
			gridFull={this.state.gridFull}
			rows={this.rows}
			cols={this.cols}
			selectBox={this.selectBox}
			/>
			<h3> Generations: {this.state.generation}</h3>
			<BottomButtons 
			speedSelect={this.speedSelect}
			gridSize={this.gridSize}
			toneSelect={this.toneSelect}
			keySelect={this.keySelect}
			/>
			<footer className="center">
			<div className="row">
			<a href="https://github.com/escottalexander/conways-melody">View it on GitHub</a>
			</div>
			<div className="row">
			Project Created By <a href="https://github.com/escottalexander">Elliott Alexander</a>  
			</div>
			
			</footer>
			</div>
			)
	}
}

function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));

