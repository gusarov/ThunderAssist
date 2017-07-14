var wrapper;
var signedIn = true;
var started = false;

window.onload = function() {
    wrapper = document.getElementById('wrapper');
    socket = io('http://' + window.location.hostname + ':' +window.location.port + '/');

	socket.on('update', function(data){
		console.log('retrieved ' + data.a + ' mode='+socket.io.engine.transport.name);
	});

	// wrapper.addEventListener('mousemove', mousemove);

    ready();
    /*
<div class='header'>
    <div class='header_strip'>
        <div class='header_strip_tag'>Thunder </div>
        <svg height="80" width="53" class='header_strip_tag'>
            <circle cx="28" cy="30" r="20" stroke="#606060" stroke-width="2" fill="red" />
        </svg>
        <div class='header_strip_tag'> Assist</div>
    </div>
</div>
<a href="#" onclick="signOut();">Sign out</a><br/>
<a href="#" onclick="GoogleAuth.disconnect();">Revoke</a><br/>
<a href="#" onclick="grant();">Upgrade To Contacts</a><br/>

    gapi.load('auth2', function(){
        gapi.auth2.init({
            fetch_basic_profile: false,
            scope: ['profile', 'openid']
        });
    });
    */
}

function getMousePos(evt) {
	var rect = wrapper.getBoundingClientRect();
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

function signOut() {
    signedIn = false;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        auth2.disconnect();
        //gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
    });
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    signedIn = true;
    ready();
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    /*
    document.getElementById('avatar').setAttribute("src", profile.getImageUrl());
    document.getElementById('avatar').setAttribute("style", "visibility: visible");
    document.getElementById('g-signin2').setAttribute("style", "visibility: collapse");
    */

    document.getElementById('center').setAttribute("style", "visibility: collapse");

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}

function ready() {
    if(!started && signedIn){
        started = true;
        //
        // first we need to create a stage
        var stage = new Konva.Stage({
            container: 'wrapper',   // id of container <div>
            width: 500,
            height: 500
        });
        // then create layer
        var layer = new Konva.Layer();

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

        // add the layer to the stage
        stage.add(layer);
    }
}
