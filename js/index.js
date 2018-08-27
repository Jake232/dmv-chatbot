$(function() {
	var questions = [];
	var missed = [];
	var len = 0;
	var score = 0;
	var total = 0;
	var invalid = 0;
	var currentQuestion = -1;
	var totalMissed = 0;

	var you = 'You';
	var robot = 'Bot';

	// slow reply by 400 to 800 ms
	var delayStart = 400;
	var delayEnd = 800;

	// initialize
	var bot = new chatBot();
	var chat = $('.chat');
	var waiting = 0;
	$('.busy').text(robot + ' is typing...');

	// submit user input and get chat-bot's reply
	var submitChat = function() {

		var input = $('.input input').val();
		if(input == '') return;
		document.getElementById("box").placeholder = "";
		$('.input input').val('');
		updateChat(you, input);
		if(currentQuestion == -1){
			var reply = bot.respondTo(input);

			if(reply == null) return;

			var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
			$('.busy').css('display', 'block');
			waiting++;
			setTimeout( function() {
				if(typeof reply === 'string') {
					if(reply == 'missedFunc')
						displayMissedQuestions();
					else if(reply == 'help')
						helpMe();
					else if(reply == 'find')
						getLocation();
					else if(reply == 'need')
						need();
					else if(reply == 'time')
						time();
					else
						updateChat(robot, reply);
				}
				//It has to be an array of ints for question numbers
				else {
					len = 0;
					score = 0;
					total = 0;
					for(var r in reply) {
						questions[r] = reply[r];
						++len;
						++total;
					}
					askQuestionsAndFinalPrompt();
				}
				if(--waiting == 0) $('.busy').css('display', 'none');
			}, latency);
		}
		//Theres a quiz going on so take input as an answer
		else{
			checkUserAnswer(input, currentQuestion);
		}
	}

/*
** Function that calls another function to check if the users input was correct
** and updates accordingly.
** takes in the users answer(string) as well as the question number(int)
*/
function checkUserAnswer(input, currentQuestion){
	check = inputVsComputer(input);
	if(invalid == 0){
		if(check == 1){
			updateChatCustom('correct', 'Correct!');
			++score;
		}
		else{
			updateChatCustom('incorrect', 'Incorrect.');
			if(len!=0){updateChatCustom('null','');}
			if(missed.indexOf(currentQuestion) == -1){
			missed[totalMissed] = currentQuestion;
			++totalMissed;
			}
		}
	}else
		updateChat(robot, 'Please try again');
	askQuestionsAndFinalPrompt();
}

/*
** Gets user input (char) and converts it to the corresponding int value
** Gets the int value for the correct answer and checks if they match
** Takes in the users input(char)
*/
function inputVsComputer(input){
	var user = document.getElementById(currentQuestion).querySelectorAll("li");
	var computer = document.getElementById(currentQuestion).querySelectorAll("#a");
	var correct = computer[0].innerHTML;
	var ui = -1;
	if(input.toLowerCase() == 'a')
		ui = user[0].innerHTML;
	else if(input.toLowerCase() == 'b')
		ui = user[1].innerHTML;
	else if(input.toLowerCase() == 'c'){
		if(user.length>2)
			ui = user[2].innerHTML;
		else {
			updateChat(robot, 'Please Enter \'A\', \'B\', \'C\', or \'D\'');
			++len;
			invalid = 1;
			return;
		}
	}
	else if(input.toLowerCase() == 'd'){
		if(user.length>3)
			ui = user[3].innerHTML;
		else {
			updateChat(robot, 'Please Enter \'A\', \'B\', \'C\', or \'D\'');
			++len;
			invalid = 1;
			return;
		}
	}
	else {
		updateChat(robot, 'Please Enter \'A\', \'B\', \'C\', or \'D\'');
		++len;
		invalid = 1;
		return;
	}
	if(ui == correct)
		return 1;
	else
		return 0;
}


/*
**  Prints the question and checks if you have submitted the final answer, if so,
**provides the final prompt
**Takes in no input
*/
	function askQuestionsAndFinalPrompt(){
		invalid = 0;
		if(len == 0){
			var fin = (score/total)*100;
			if(fin<80)
				updateChatCustom('txt', 'You didn\'t pass<br />Final Score: '+fin);
			else
				updateChatCustom('txt', 'Great Job!<br />Final Score: '+fin);

			currentQuestion = -1;
		}
		else{
			document.getElementById("box").placeholder = "Please Enter \'A\', \'B\', \'C\', or \'D\'";
			--len;
			var q = document.getElementById(questions[len]).querySelectorAll("h3");
			var ans = displayAnswers(questions[len]);
			updateChatCustom('ques', '~'+q[0].innerHTML+'~'+'<br /><br />'+ans);
			currentQuestion = questions[len];
		}
	}


/*
**Gets all the answers for the current question and puts it into a string
**Takes in the current question(int)
*/
	function displayAnswers(question){
		var x = document.getElementById(question).querySelectorAll("li");
		var qn = x.length;
		var ret = "";
		if(qn == 2){ret='A. '+x[0].innerHTML+'<br />B. '+x[1].innerHTML;}
		else if(qn==3){ret='A. '+x[0].innerHTML+'<br />B. '+x[1].innerHTML+'<br />C. '+x[2].innerHTML;}
		else{ret='A. '+x[0].innerHTML+'<br />B. '+x[1].innerHTML+'<br />C. '+x[2].innerHTML+'<br />D. '+x[3].innerHTML;}
		return ret;
	}


/*
**Works the same as the above question however, adds a span tag to bold the
**correct answer
**Takes in the current question(int)
*/
	function displayAnswersBR(question){
		var x = document.getElementById(question).querySelectorAll("li");
		var computer = document.getElementById(question).querySelectorAll("#a");
		var correct = computer[0].innerHTML;

		var qn = x.length;
		var ret = "";


		for(var i=0; i<x.length; i++){
			if(i==0){
				if(x[i].innerHTML == correct)
					ret = ret+'<span class=\'ans-right\'>A. '+x[i].innerHTML+'</span><br />';
				else
					ret = ret+'A. '+x[i].innerHTML+'<br />';
			}
			else if(i==1){
				if(x[i].innerHTML == correct)
					ret = ret+'<span class=\'ans-right\'>B. '+x[i].innerHTML+'</span><br />';
				else
					ret = ret+'B. '+x[i].innerHTML+'<br />';
			}
			else if(i==2){
				if(x[i].innerHTML == correct)
					ret = ret+'<span class=\'ans-right\'>C. '+x[i].innerHTML+'</span><br />';
				else
					ret = ret+'C. '+x[i].innerHTML+'<br />';
			}
			else if(i==3){
				if(x[i].innerHTML == correct)
					ret = ret+'<span class=\'ans-right\'>D. '+x[i].innerHTML+'</span><br />';
				else
					ret = ret+'D. '+x[i].innerHTML+'<br />';
			}
		}
		return ret;
	}
/*
**Prints the bots response (default)
**Takes in the party ('you', or 'bot') and response text(String)
*/
	var updateChat = function(party, text) {
		var style = 'you';
		if(party != you) {
			style = 'other';
		}
		if(style == 'other'){
		var line = $('<div id="other-div"><span class="party"></span> <span class="text"></span></div>');
		line.find('.party').addClass(style);
		line.find('.text').addClass(style+'-text').text(text);
		chat.append(line);
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
		}
		else{
			var line = $('<div id="you-div"><span class="text"></span> <span class="party"></span></div> ');
			line.find('.text').addClass(style+'-text').text(text);
			line.find('.party').addClass(style);
			chat.append(line);
			chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
			updateChatCustom('null','');
		}
	}

/*
**Upodate chat with custom id for styling
**Takes in custom class cls(String) and response text(String)
*/
	var updateChatCustom = function(cls, text){
		if(cls == 'help'){
			var check = 0;
			for(var i=0; i<text.length; i++){
				if(text.charAt(i)=='\'' && check == 0){
					var temp = [text.slice(0, i), '<span class="finally">', text.slice(i+1)].join('');
					text = temp;
					check = 1;
				}else if(text.charAt(i)=='\'' && check == 1){
					var temp = [text.slice(0, i), '</span>', text.slice(i+1)].join('');
					text = temp;
					check = 0;
				}
			}
			var line = $('<div id="other-div"><span class="spec"></span> <span class="text"></span></div>');
			line.find('.text').addClass(cls+'-text').html(text);
			chat.append(line);
			chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
		}
		else if(cls == 'ques'){
			var check = 0;
			for(var i=0; i<text.length; i++){
				if(text.charAt(i)=='~' && check == 0){
					var temp = [text.slice(0, i), '<span class="finally">', text.slice(i+1)].join('');
					text = temp;
					check = 1;
				}else if(text.charAt(i)=='~' && check == 1){
					var temp = [text.slice(0, i), '</span>', text.slice(i+1)].join('');
					text = temp;
					check = 0;
				}
			}
			var line = $('<div id="other-div"><span class="spec"></span> <span class="text"></span></div>');
			line.find('.text').addClass(cls+'-text').html(text);
			chat.append(line);
			chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
		}
		else if(cls == 'null'){
			var line = $('<div><span class="spec"></span> <span class="text"></span></div>');
			line.find('.text').addClass(cls+'-text').html('<br />');
			chat.append(line);
			chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
		}
		else{
		var line = $('<div id="other-div"><span class="spec"></span> <span class="text"></span></div>');
		line.find('.text').addClass(cls+'-text').html(text);
		chat.append(line);
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	}
	}

	// event binding
	$('.input').bind('keydown', function(e) {
		if(e.keyCode == 13) {
			submitChat();
		}
	});
	$('.input a').bind('click', submitChat);

	// initial chat state
	updateChatCustom('ques', 'Welcome to the DMV Practice Test Chatbot! Type ~Start~ to start with 10 questions. To do a different amount please enter that number or type ~Help~ to see a list of all possible commands.');


/*
**Checks what questions the user has missed and prints them out
**Does not take in any parameters
*/
	function displayMissedQuestions(){
		if(totalMissed == 0)
			updateChat(robot, 'You have not missed any this session :)');
		else{
			for(var i=0; i<totalMissed; i++){
					var q = document.getElementById(missed[i]).querySelectorAll("h3");
					var ans = displayAnswersBR(missed[i]);
					updateChatCustom('ques', '~'+q[0].innerHTML+'~'+'<br /><br />'+ans);
				}
			}
	}


/*
**Help Command that lists all of the possible functions
**Does not take in any parameters
*/
	function helpMe(){
		updateChat(robot, 'Here are the commands you can currently use:');
		updateChatCustom('ques', '~Start~ will start a new test 10 questions<br /><br />~1~ through ~247~ will start a new test with that many questions<br /><br />~Missed~ Will show you all of the questions you have missed in this session<br /><br />~Where~ Will show you the closest DMV to take your test at.<br /><br />~Need~ Will display all of the requirements to obtain a beginners permit<br /><br />~When~ will tell you if your DMV is still open, if not, it will tell you the next time they should be.');
	}

/*
**Creates an alert to ask for user input
**Does not take in any parameters
*/
	function getLocation() {
			updateChat(robot, 'Please allow me to see your location');
	    if (navigator.geolocation){
	        navigator.geolocation.getCurrentPosition(showPosition);
					} else {
	        updateChat(robot, "Geolocation is not supported by this browser.");
	    }
	}


/*
**Finds closest DMV to users location
**Takes in users coordinants(double[])
*/
	function showPosition(position){
			var closest = 99999999;
			var ret = -1;
			var locations = [
			{city: "Abbeville", latitude: '34.168368', longitude: '-82.408237'},
			{city:"Aiken", latitude:'33.551998', longitude:'-81.694513'},
			{city: "Allendale",latitude: '32.990948',longitude: '-81.284468'},
			{city: "Anderson",latitude: '34.499721',longitude: '-82.613322'},
			{city: "Bamberg",latitude: '33.310831',longitude: '-81.033952'},
			{city: "Barnwell",latitude: '33.248188',longitude: '-81.346580'},
			{city: "Batesburg",latitude: '33.900557',longitude: '-81.542846'},
			{city: "Beaufort",latitude: '32.416467',longitude: '-80.738440'},
			{city: "Belton",latitude: '34.522131',longitude: '-82.492577'},
			{city: "Bennettsville",latitude: '34.637628',longitude: '-79.700548'},
			{city: "Bishopville",latitude: '34.209038',longitude: '-80.254021'},
			{city: "Bluffton",latitude: '32.261513',longitude: '-80.858579'},
			{city: "Blythewood",latitude: '34.178284',longitude: '-80.973772'},
			{city: "Camden",latitude: '34.237951',longitude: '-80.616409'},
			{city: "Charleston-Leeds Avenue",latitude: '32.847428',longitude: '-80.014933'},
			{city: "Charleston-Lockwood Boulevard",latitude: '32.789078',longitude: '-79.959880'},
			{city: "Charleston-Mount Pleasant",latitude: '32.832169',longitude: '-79.822786'},
			{city: "Chester",latitude: '34.694699',longitude: '-81.192081'},
			{city: "Chesterfield",latitude: '34.731527',longitude: '-80.077055'},
			{city: "Columbia-O'neil Court",latitude: '34.069893',longitude: '-80.954336'},
			{city: "Columbia-Shop Road",latitude: '33.968958',longitude: '-81.002290'},
			{city: "Conway",latitude: '33.911361',longitude: '-79.045481'},
			{city: "Darlington",latitude: '34.304129',longitude: '-79.986822'},
			{city: "Dillon",latitude: '34.433491',longitude: '-79.358303'},
			{city: "Edgefield",latitude: '33.807122',longitude: '-81.935997'},
			{city: "Florence",latitude: '34.196369',longitude: '-79.706039'},
			{city: "Fort Mill",latitude: '35.075662',longitude: '-80.936110'},
			{city: "Fountain Inn",latitude: '34.707370',longitude: '-82.230059'},
			{city: "Gaffney",latitude: '35.070848',longitude: '-81.679992'},
			{city: "Georgetown",latitude: '33.385306',longitude: '-79.313591'},
			{city: "Greenville-Saluda Dam",latitude: '34.856955',longitude: '-82.462964'},
			{city: "Greenville-University Ridge",latitude: '34.839696',longitude: '-82.402005'},
			{city: "Greenwood",latitude: '34.171688',longitude: '-82.161335'},
			{city: "Greer",latitude: '34.949919',longitude: '-82.212100'},
			{city: "Hampton",latitude: '32.861260',longitude: '-81.092307'},
			{city: "Irmo-Ballentine",latitude: '34.142336',longitude: '-81.237470'},
			{city: "Kingstree",latitude: '33.678011',longitude: '-79.814712'},
			{city: "Ladson",latitude: '32.993465',longitude: '-80.095103'},
			{city: "Lake City",latitude: '33.851115',longitude: '-79.764301'},
			{city: "Lancaster",latitude: '34.724934',longitude: '-80.732531'},
			{city: "Laurens",latitude: '34.496274',longitude: '-81.978559'},
			{city: "Lexington",latitude: '33.987905',longitude: '-81.249558'},
			{city: "Manning",latitude: '33.670293',longitude: '-80.250450'},
			{city: "Marion",latitude: '34.187474',longitude: '-79.333997'},
			{city: "McCormick",latitude: '33.905589',longitude: '-82.273638'},
			{city: "Moncks Corner",latitude: '33.205596',longitude: '-79.986141'},
			{city: "Myrtle Beach",latitude: '33.709287',longitude: '-78.879464'},
			{city: "Myrtle Beach Commons",latitude: '33.684746',longitude: '-78.942045'},
			{city: "Newberry",latitude: '34.291637',longitude: '-81.596162'},
			{city: "North Augusta",latitude: '33.556572',longitude: '-81.930698'},
			{city: "North Myrtle Beach",latitude: '33.885807',longitude: '-78.685339'},
			{city: "Orangeburg",latitude: '33.470681',longitude: '-80.846644'},
			{city: "Pickens",latitude: '34.857765',longitude: '-82.672436'},
			{city: "Ridgeland",latitude: '32.490415',longitude: '-80.985268'},
			{city: "Rock Hill",latitude: '34.995381',longitude: '-81.099652'},
			{city: "Saint George",latitude: '33.180841',longitude: '-80.561426'},
			{city: "Saint Matthews",latitude: '33.661694',longitude: '-80.787486'},
			{city: "Saluda",latitude: '34.011361',longitude: '-81.778251'},
			{city: "Seneca",latitude: '34.678627',longitude: '-82.989282'},
			{city: "Spartanburg-Fairforest Road",latitude: '34.973262',longitude: '-81.997579'},
			{city: "Spartanburg-Southport Road",latitude: '34.914171',longitude: '-81.906713'},
			{city: "Sumter",latitude: '33.940479',longitude: '-80.325706'},
			{city: "Union",latitude: '34.726996',longitude: '-81.628232'},
			{city: "Walterboro",latitude: '32.883707',longitude: '-80.698083'},
			{city: "Winnsboro",latitude: '34.371204',longitude: '-81.104247'},
			{city: "Woodruff",latitude: '34.736932',longitude: '-82.033239'}
		];
		for(var i in locations){
			var distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, locations[i].latitude, locations[i].longitude);
			if(distance < closest){
				closest = distance;
				ret = i;
			}
		}
		updateChatCustom('ques', 'The closest DMV to you is '+'~'+locations[ret].city+'~');
	}


/*
**Calculates the distance from 2 longitudes and latitudes
**Takes in two locations coordinants(double)
*/
	function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1);
	  var a =
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
	    Math.sin(dLon/2) * Math.sin(dLon/2);
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	  var d = R * c; // Distance in km
	  return d;
	}


/*
**Converts between degree and radians
**takes in a number(double)
*/
	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	}


/*
**Tells you what you need to bring and do to take the test
**Does not take in any parameters
*/
	function need(){
		updateChatCustom('asdf', 'When you apply for a beginner’s permit, you must pass the vision and knowledge tests, and you must bring documents such as your original birth certificate, social security card, and two proofs of your current, physical address. The United States Citizens\' Checklist (SCDMV Form MV-93) has a complete list of accepted documents.If you\'re an international customer, the requirements are different. The International Customers\' Checklist (SCDMV Form MV-94) has a complete list of accepted documents.<br /><br />You must be at least 15 to apply for a regular or motorcycle beginner’s permit. If you are under 18, you must bring an adult with you to sign your application.<br /><br />More information can be found at <a href="http://www.scdmvonline.com/Driver-Services/Drivers-License/Beginner-Permits" target="_blank">http://www.scdmvonline.com/Driver-Services/Drivers-License/Beginner-Permits</a>');
	}


/*
**Tells the user if DMV is open for testing
**Takes in no parameters
*/
	function time(){
		var curr = new Date();
		updateChat(robot, 'Disclaimer: Hours are subject to change and are not adjusted for holidays, check with your local DMV if you are not sure!');

//Sunday
		if(curr.getDay() == 0){
			updateChat(robot, 'Your local DMV should be open at 8:30 on Monday')
			return;
		}

//Saturday
	else if(curr.getDay() == 6){
		updateChat(robot, 'Please allow me to see your location');
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(part2);
	  else
			updateChat(robot, "Geolocation is not supported by this browser.");
	}

//Too Early
		else if(curr.getHours()<9||((curr.getHours()==9)&&curr.getMinutes()<=30)){
			if(curr.getDay() == 2){
				updateChat(robot, 'Your local DMV should open at 9:30 AM.');
				return;
			}
			else if(curr.getDay()==1||curr.getDay()==3||curr.getDay()==4||curr.getDay()==5){
				if(curr.getHours()<8||((curr.getHours()==8)&&(curr.getMinutes()<30))) {
					updateChat(robot, 'Your local DMV should open at 8:30 AM.');
					return;
				}
				else
					updateChat(robot, 'Your local DMV should be open and testing until 4:30 today!');
			}
			else{
				updateChat(robot, 'Please allow me to see your location');
				if (navigator.geolocation){
					navigator.geolocation.getCurrentPosition(part2);
				} else {
					updateChat(robot, "Geolocation is not supported by this browser.");
				}
			}
		}

//Still Open
		else if(curr.getHours()<16||((curr.getHours()==16)&&(curr.getMinutes()<=30))){
			if(curr.getHours()==16)
				updateChat(robot, 'If they are still testing today I\'d hurry! They stop testing today at 4:30.');
			else
				updateChat(robot, 'Your local DMV should be open and testing until 4:30 today!');
		}

//Too Late
		else if(curr.getHours()>16||(curr.getHours()==16&&curr.getMinutes()>=30)){
			if(curr.getDay()==1||curr.getDay()==3||curr.getDay()==4)
			 updateChat(robot, "Your local DMV should open at 8:30 AM tomorrow");
			else if(curr.getDay()==2)
				updateChat(robot, "Your local DMV will open at 9:30 AM tomorrow");
		else{
			updateChat(robot, 'I need to check your location to get your local DMV\'s hours!');
	    if (navigator.geolocation)
	        navigator.geolocation.getCurrentPosition(part2);
			else
	        updateChat(robot, "Geolocation is not supported by this browser.");
			}
		}

//Just in case
		else
			updateChat(robot, 'I\'m having trouble determining this right now, sorry!')

	}


/*
**Checks for the closest DMV to see if they live next to a DMV thats open
**on Saturdays
**Takes in users coordinants(double[])
*/
	function part2(position){
		//I know I shoud re-use the other function to get the closest city, however, I cannot get it to return correctly so here we are
		var closest = 99999999;
		var ret = -1;
		var locations = [
		{city: "Abbeville", latitude: '34.168368', longitude: '-82.408237'},
		{city:"Aiken", latitude:'33.551998', longitude:'-81.694513'},
		{city: "Allendale",latitude: '32.990948',longitude: '-81.284468'},
		{city: "Anderson",latitude: '34.499721',longitude: '-82.613322'},
		{city: "Bamberg",latitude: '33.310831',longitude: '-81.033952'},
		{city: "Barnwell",latitude: '33.248188',longitude: '-81.346580'},
		{city: "Batesburg",latitude: '33.900557',longitude: '-81.542846'},
		{city: "Beaufort",latitude: '32.416467',longitude: '-80.738440'},
		{city: "Belton",latitude: '34.522131',longitude: '-82.492577'},
		{city: "Bennettsville",latitude: '34.637628',longitude: '-79.700548'},
		{city: "Bishopville",latitude: '34.209038',longitude: '-80.254021'},
		{city: "Bluffton",latitude: '32.261513',longitude: '-80.858579'},
		{city: "Blythewood",latitude: '34.178284',longitude: '-80.973772'},
		{city: "Camden",latitude: '34.237951',longitude: '-80.616409'},
		{city: "Charleston-Leeds Avenue",latitude: '32.847428',longitude: '-80.014933'},
		{city: "Charleston-Lockwood Boulevard",latitude: '32.789078',longitude: '-79.959880'},
		{city: "Charleston-Mount Pleasant",latitude: '32.832169',longitude: '-79.822786'},
		{city: "Chester",latitude: '34.694699',longitude: '-81.192081'},
		{city: "Chesterfield",latitude: '34.731527',longitude: '-80.077055'},
		{city: "Columbia-O'neil Court",latitude: '34.069893',longitude: '-80.954336'},
		{city: "Columbia-Shop Road",latitude: '33.968958',longitude: '-81.002290'},
		{city: "Conway",latitude: '33.911361',longitude: '-79.045481'},
		{city: "Darlington",latitude: '34.304129',longitude: '-79.986822'},
		{city: "Dillon",latitude: '34.433491',longitude: '-79.358303'},
		{city: "Edgefield",latitude: '33.807122',longitude: '-81.935997'},
		{city: "Florence",latitude: '34.196369',longitude: '-79.706039'},
		{city: "Fort Mill",latitude: '35.075662',longitude: '-80.936110'},
		{city: "Fountain Inn",latitude: '34.707370',longitude: '-82.230059'},
		{city: "Gaffney",latitude: '35.070848',longitude: '-81.679992'},
		{city: "Georgetown",latitude: '33.385306',longitude: '-79.313591'},
		{city: "Greenville-Saluda Dam",latitude: '34.856955',longitude: '-82.462964'},
		{city: "Greenville-University Ridge",latitude: '34.839696',longitude: '-82.402005'},
		{city: "Greenwood",latitude: '34.171688',longitude: '-82.161335'},
		{city: "Greer",latitude: '34.949919',longitude: '-82.212100'},
		{city: "Hampton",latitude: '32.861260',longitude: '-81.092307'},
		{city: "Irmo-Ballentine",latitude: '34.142336',longitude: '-81.237470'},
		{city: "Kingstree",latitude: '33.678011',longitude: '-79.814712'},
		{city: "Ladson",latitude: '32.993465',longitude: '-80.095103'},
		{city: "Lake City",latitude: '33.851115',longitude: '-79.764301'},
		{city: "Lancaster",latitude: '34.724934',longitude: '-80.732531'},
		{city: "Laurens",latitude: '34.496274',longitude: '-81.978559'},
		{city: "Lexington",latitude: '33.987905',longitude: '-81.249558'},
		{city: "Manning",latitude: '33.670293',longitude: '-80.250450'},
		{city: "Marion",latitude: '34.187474',longitude: '-79.333997'},
		{city: "McCormick",latitude: '33.905589',longitude: '-82.273638'},
		{city: "Moncks Corner",latitude: '33.205596',longitude: '-79.986141'},
		{city: "Myrtle Beach",latitude: '33.709287',longitude: '-78.879464'},
		{city: "Myrtle Beach Commons",latitude: '33.684746',longitude: '-78.942045'},
		{city: "Newberry",latitude: '34.291637',longitude: '-81.596162'},
		{city: "North Augusta",latitude: '33.556572',longitude: '-81.930698'},
		{city: "North Myrtle Beach",latitude: '33.885807',longitude: '-78.685339'},
		{city: "Orangeburg",latitude: '33.470681',longitude: '-80.846644'},
		{city: "Pickens",latitude: '34.857765',longitude: '-82.672436'},
		{city: "Ridgeland",latitude: '32.490415',longitude: '-80.985268'},
		{city: "Rock Hill",latitude: '34.995381',longitude: '-81.099652'},
		{city: "Saint George",latitude: '33.180841',longitude: '-80.561426'},
		{city: "Saint Matthews",latitude: '33.661694',longitude: '-80.787486'},
		{city: "Saluda",latitude: '34.011361',longitude: '-81.778251'},
		{city: "Seneca",latitude: '34.678627',longitude: '-82.989282'},
		{city: "Spartanburg-Fairforest Road",latitude: '34.973262',longitude: '-81.997579'},
		{city: "Spartanburg-Southport Road",latitude: '34.914171',longitude: '-81.906713'},
		{city: "Sumter",latitude: '33.940479',longitude: '-80.325706'},
		{city: "Union",latitude: '34.726996',longitude: '-81.628232'},
		{city: "Walterboro",latitude: '32.883707',longitude: '-80.698083'},
		{city: "Winnsboro",latitude: '34.371204',longitude: '-81.104247'},
		{city: "Woodruff",latitude: '34.736932',longitude: '-82.033239'}
	];
	for(var i in locations){
		var distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, locations[i].latitude, locations[i].longitude);
		if(distance < closest){
			closest = distance;
			ret = i;
		}
	}
	var date = new Date();
	var user = locations[ret].city;
	if(user == 'Aiken'||user == 'Charleston-Leeds Avenue'||user == 'Florence'||user == 'Greenville-Saluda Dam'||user == 'Lexington'||user == 'Rock Hill'){
		if(date.getDay()==5)
			updateChat(robot, 'Your local DMV should be open at 9 AM Saturday.');
		else if(date.getDay() == 6 && date.getHours()>=9){
				if(date.getHours()>=15||(date.getHours()==14&&date.getMinutes()>=30))
					updateChat(robot, 'Your local DMV should be open at 8:30 on Monday.');
				else if(date.getHours()==14)
					updateChat(robot, 'Your local DMV should be open until 3, but I\'d hurry if you want to test today');
				else
					updateChat(robot, 'Your local DMV should be open until 3 PM today, try to stop in by at least 2:30 PM.');
			}
		else
				updateChat(robot, 'Your local DMV should be open at 9 AM today.');
	}
	else {
		updateChat(robot, 'Your local DMV shold open at 8:30 AM on Monday');
	}
}
});
