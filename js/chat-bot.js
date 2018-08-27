function chatBot() {

	// current user input
	this.input;

	/**
	 * respondTo
	 *
	 * return nothing to skip response
	 * return string for one response
	 * return array of strings for multiple responses
	 *
	 * @param input - input chat string
	 * @return reply of chat-bot
	 */
	 var everyQuestion = [];
	 var count = 0;
	this.respondTo = function(input) {

		this.input = input.toLowerCase();

		if(!isNaN(input)||this.match('start')){
				var questionNums = [];
				if(this.match('start'))
					var len = 10;
				else{
				if(input >= 1 && input <= 247)
				 	var len = input;
				else
					return 'Please enter a number between 1 and 247';
				}
				for (var i = 0; i < len; i++) {
					questionNums[i] = 167;
				}
				if(count+len>=246){
					count = 0;
					everyQuestion = [];
				}
				for (var i = 0; i < len; i++) {
					var num = (Math.random() * 247);
					num = Math.floor(num);
					if (everyQuestion.indexOf(num) != -1)
						i--;
					else{
						questionNums[i] = num;
						everyQuestion[count] = num;
						count++;
					}
				}
				return questionNums;
		}
	else if(this.match('missed'))
			return 'missedFunc';
	else if(this.match('help'))
		return 'help';
	else if(this.match('closest')||this.match('where'))
		return 'find';
	else if(this.match('need')||this.match('require'))
		return 'need';
	else if(this.match('when')||this.match('open')||this.match('closed'))
		return 'time';
	else if(this.match('what is this')||this.match('who'))
		return 'I\'m a bot made to help prepare you for your drivers exam! Type \'Help\' to see everything I can do right now!';
	else if(this.match('hello there'))
		return 'General Keobi!';
	else if(this.match('hey')||this.match('hello')||this.match('howdy')||this.match('hi'))
		return 'Hey!';
	else
		return 'I don\'t know that command unfortunantly. Type help to see the commands I know!'
}

	/**
	 * match
	 *
	 * @param regex - regex string to match
	 * @return boolean - whether or not the input string matches the regex
	 */
	this.match = function(regex) {

		return new RegExp(regex).test(this.input);
	}
}

function setUpTest(questionNums, len){
	for (var i = 0; i < len; i++) {
	questionNums[i] = -1;
}

for (var i = 0; i < len; i++) {
	var num = (Math.random() * 247);
	num = Math.floor(num);
	if (questionNums.indexOf(num) != -1)
		i--;
	else
		questionNums[i] = num;
}
return questionNums;
}
