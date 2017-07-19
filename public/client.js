var divall;
var divkonva;
var signedIn = false;
var started = false;
var models;
var layer;

window.onload = function() {
	divall = document.getElementById('all');
	divkonva = document.getElementById('konva');
	socket = io(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/');

	socket.on('update', function(data) {
		console.log('retrieved ' + data.a + ' mode='+socket.io.engine.transport.name);
	});

	// divkonva.addEventListener('mousemove', mousemove);
	document.addEventListener('keydown', doc_keyDown, false);


	ready();
	/*
<div class='header'>
	<div class='header_strip'>
		<div class='header_strip_tag'>Thunder </div>
		<svg height='80' width='53' class='header_strip_tag'>
			<circle cx='28' cy='30' r='20' stroke='#606060' stroke-width='2' fill='red' />
		</svg>
		<div class='header_strip_tag'> Assist</div>
	</div>
</div>
<a href='#' onclick='signOut();'>Sign out</a><br/>
<a href='#' onclick='GoogleAuth.disconnect();'>Revoke</a><br/>
<a href='#' onclick='grant();'>Upgrade To Contacts</a><br/>

	gapi.load('auth2', function(){
		gapi.auth2.init({
			fetch_basic_profile: false,
			scope: ['profile', 'openid']
		});
	});
	*/
}

function doc_keyDown(e) {
	if (!signedIn && !started) {
		if (e.keyCode == 81) { // Q
			signInDemo();
		}
	}
}

function getMousePos(evt) {
	var rect = divkonva.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function send(x) {
	console.log('reporting...');
	socket.emit('report', {a:x});
	sentPos = pos;
}

function mousemove(e) {
	pos = getMousePos(e);
	send(pos.x);
}

function grant() {

}

function signInDemo() {
	console.log('sign in demo');
	signedIn = true;
	onSignIn({
		getBasicProfile: function () {
			return {
				getId: function() {
					return 1;
				},
				getName: function() {
					return 'demo';
				},
				getGivenName: function() {
					return 'john';
				},
				getFamilyName: function() {
					return 'smith';
				},
				getEmail: function() {
					return 'demo@demo.de';
				},
				getImageUrl: function() {
					return '';
				},
			};
		},
		getAuthResponse: function() {
			return {
				id_token: '#demo_token#',
			};
		},
	});
}

function signOut() {
	signedIn = false;
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
		auth2.disconnect();
		location.reload();
		//gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
	});
}

function onSignIn(googleUser) {
	// Useful data for your client-side scripts:
	signedIn = true;
	ready();
	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId()); // Don't send this directly to your server!
	console.log('Full Name: ' + profile.getName());
	console.log('Given Name: ' + profile.getGivenName());
	console.log('Family Name: ' + profile.getFamilyName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail());

	/*
	document.getElementById('avatar').setAttribute('src', profile.getImageUrl());
	document.getElementById('avatar').setAttribute('style', 'visibility: visible');
	document.getElementById('g-signin2').setAttribute('style', 'visibility: collapse');
	*/

	document.getElementById('bar').className = 'top_right';
	document.getElementById('all').classList.remove('bgg');

	document.getElementById('g-signin2').style.display = 'none';
	document.getElementById('signInDemo').style.display = 'none';
	document.getElementById('signOut').style.display = 'inline';


	// The ID token you need to pass to your backend:
	var id_token = googleUser.getAuthResponse().id_token;
	console.log('ID Token: ' + id_token);
}

function ready() {
	if (!started && signedIn) {
		started = true;
		//
		// first we need to create a stage
		var stage = new Konva.Stage({
			container: 'konva',   // id of container <div>
			width: window.innerWidth,
			height: window.innerHeight,
		});
		// then create layer
		layer = new Konva.Layer();

		if (localStorage.haveInitialSync === true) {
// A: user been there recently and have local replica of the data
//     Start immediately and initiate background sync
			models = JSON.parse(localStorage.models);
			ensureView();
			syncronize(function() {
				//
			});
		} else {
// B: no local data
//     Wait for initial sync
			syncronize(function() {
				localStorage.haveInitialSync = true;
				ensureView();
			});
		}


		/*
		// create our shape
		var circle = new Konva.Circle({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			radius: 70,
			fill: 'red',
			stroke: 'black',
			draggable: true,
			strokeWidth: 4
		});

		// add the shape to the layer
		layer.add(circle);

		var pentagon = new Konva.RegularPolygon({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			sides: 5,
			radius: 70,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 4,
			shadowOffsetX : 20,
			shadowOffsetY : 25,
			shadowBlur : 40,
			draggable: true,
			opacity : 0.5
		});
		layer.add(pentagon);
		*/

		// add the layer to the stage
		stage.add(layer);
	}
}

function syncronize(callback) {



	if (localStorage.models != null) {
		models = JSON.parse(localStorage.models);
	} else {
		models = {rects: []};
	}
	// ...


	if (models.rects.length <= 0) {
		// starting set
		var rect = {
			  x: 1
			, y: 1
			, w: 50
			, h: 50
			, _id: newGuid
		};
		models.rects.push(rect);
		// models.rects[rect._id] = rect;
	}

	console.log('syncronize - callback');
	callback();
}

function ensureView() {
	models.rects.forEach(function(element) {
		if (element.__view == null) {
			var rect = element.__view = new Konva.Rect({
				x: element.x,
				y: element.y,
				width: element.w,
				height: element.h,
				fill: 'green',
				stroke: 'black',
				draggable: true,
				strokeWidth: 4,
			});
			// add cursor styling
			rect.on('mouseover', function() {
				document.body.style.cursor = 'pointer';
			});
			rect.on('mouseout', function() {
				document.body.style.cursor = 'default';
			});
			rect.on('dblclick', function() {
				var rect = {
					x: 1
					, y: 1
					, w: 50
					, h: 50
					, _id: newGuid
				};
				models.rects.push(rect);
				ensureView();

			});
			rect.on('dragend', function(o) {
				console.log(o);
				console.log(typeof rect.x());
				console.log(rect.x());
				element.x = rect.x();
				element.y = rect.y();
				localStorage.models = JSON.stringify(models, replacer);
				console.log(localStorage.models);
			});
			// add the shape to the layer
			layer.add(rect);
		}
	}, this);


}

function replacer(key, value)
{
	if (key=='__view') return undefined;
	else return value;
}

function newGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
