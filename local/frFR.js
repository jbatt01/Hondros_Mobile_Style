Lang = {
	Loading: "Loading...",
	Table_Of_Contents: "Table of Contents",
	Close: "Close",
	PageOf: "Page {1} of {2}",
	Glossary: "Glossary",
	Error: "Error",
	Narration: "Narration",
	Exit: "Exit",
	Sure_Exit:"Are you sure you want to exit the course?",
	Scorm_Load_Error: "Could not establish link with tracking system.",

	// Time
	Time_Tpl: "Time - {h}:{m}:{s}",
	Time_Out: "Time Out",
	Time_Stop: "You have been idle in the course for more than {min}. You must be actively engaged in the course.",
	Time_Min: "minute",
	Time_Mins: "minutes",
	Time_Logout: "You have been inactive in the course for more than {min}. Regulatory requirements mandate students be actively engaged in the the course and those who arn't to be logged out. You'll be logged out now.",

	//Pages
	// Quiz
	Check_Answer: "Check Answer",
	Reset: "Reset",
	Correct: "Correct",
	Incorrect: "Incorrect",
	Try_Again: "Try Again",
	Select_an_Option: "Select an Option.",
	Tap_CheckAnswer_Button: "Tap the \"Check Answer\" button.",
	Yes_that_is_correct: "Yes, that is correct.",
	No_that_is_incorrect: "No, that is incorrect.",
	Incorrect_Try_Again: "That is incorrect. Try again.",
	True: "True",
	False: "False",
	// Results
	Sorry: "Sorry!",
	You_did_not_pass: "You did not pass this course.",
	Pass: "Pass!",
	Congrats_Pass: "Congratulations! That's a passing score.",
	Quiz_Results: "Quiz Results",
	Total_Correct: "Total Correct:",
	Total_Incorrect: "Total Incorrect:",
	Score: "Score:",
	Possible_Score: "Possible Score:",
	Percentage: "Percentage:",
	Review: "Review",
	Email_Results: "Email Results",
	Print: "Print",
	Make_Sure_Send: "Make sure you finish sending this email so the results will be sent to the appropriate person.",
	Coure_Results_Email: "Course results for the {title} course.",
	Email_Quiz: "Quiz: ",
	Email_User: "User: ",
	Email_Learner: "Learner: ",
	Email_DateCompleted: "Date completed: ",
	Email_TotalCorrect: "Total Correct Questions: ",
	Email_TotalIncorrect: "Total Incorrect Questions: ",
	Email_Percent: "Percent Correct: ",
	Email_Window: "Email Window",
	//EmailPopup
	Email_Directions: "<b>Directions:</b> Enter your name (the quiz taker) and email address (the quiz taker's email) and tap <b>OK</b> to finish sending the results."
	Enter_Name: "Enter Name",
	Name: "Name:",
	Email: "Email:",
	OK: "OK",
	// Review
	Retake_Test: "Retake Test",
	Test_Results: "Test Results:",
	Review_Score: "Score {score}%",
	Correct_of: "{1} of {2} correct",
	Your_Answers_Were: "Your answers were:",
	C: "C",
	X: "X",
	N: "&nbsp;",
	Correct_Answer: "Correct Answer:",
	Question_of: "Question {1} of {2} - {status}",	
	// video
	Video_Error: "Video Error!",
	Tap_To_Play: "Tap to Play",
	// Audio
	Audio_Error0: "Audio Error",
	Audio_Error1: "Error: fetching process aborted by user",
	Audio_Error2: "Error: error occurred when downloading",
	Audio_Error3: "Error: error occurred when decoding",
	Audio_Error4: "Error: audio not supported",
	//Def
	Practice_Instructions: "Tap the terms to see the definition. When you are done reviewing tap the Practice Terms button to practice what you just learned.",
	Practice_Step1: "Step 1: Tap a term",
	Practice_Step2: "Step 2: Tap the matching definition",
	Practice_Review: "REVIEW TERMS",
	Practice_SelectTerm: "Please select a term first!",
	Practice_Sorry: "Sorry",
	Practice_NotAMatch: "That is not a match",
	Review_Practice: "PRACTICE TERMS"

}

function initLocalization() {

	Ext.Date.dayNames = [
		'Lundi',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];


	Ext.Date.monthNames = [
		'Januar',
		'Februar',
		'Marc',
		'April',
		'Maj',
		'Junij',
		'Julij',
		'Avgust',
		'September',
		'Oktober',
		'November',
		'December'
	];


	Ext.Date.monthNumbers = {
		'Jan': 0,
		'Feb': 1,
		'Mar': 2,
		'Apr': 3,
		'Maj': 4,
		'Jun': 5,
		'Jul': 6,
		'Avg': 7,
		'Sep': 8,
		'Okt': 9,
		'Nov': 10,
		'Dec': 11
	};


	Ext.Date.getShortMonthName = function(month) {
		return Date.monthNames[month].substring(0, 3);
	};


	Ext.Date.getShortDayName = function(day) {
		return Date.dayNames[day].substring(0, 3);
	};


	Ext.Date.getMonthNumber = function(name) {
	  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
	};


	Ext.Date.parseCodes.S.s = '(?:st|nd|rd|th)';


	if (Ext.picker.Picker){
		Ext.define('Ext.picker.Picker', {
			override: 'Ext.picker.Picker',
			config:{
				doneButton: 'Fait' ,
				cancelButton: 'Annuler'
			}
		});
	}


	if (Ext.picker.Date) {
		//debugger;
		
		Ext.define('Ext.picker.Date', {
			override: 'Ext.picker.Date',
			config:{
				doneButton: 'Fait' ,
				cancelButton: 'Annuler',
				dayText: 'Jour',
				monthText: 'Mois',
				yearText: 'Année',
				slotOrder: ['day', 'month', 'year']   
			}			
		});
	}
	
	
	if(Ext.IndexBar){
		Ext.define('Ext.IndexBar', {
			override: 'Ext.IndexBar',
			config:
			{
				letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
			}
		});
	}


	if(Ext.NestedList){
		Ext.define('Ext.NestedList', {
			override: 'Ext.NestedList',
			config:{
				backText: 'Retour',
				loadingText: 'Chargement...',
				emptyText: 'Aucune donnée trouvée'
			}
		});
	}


	if(Ext.util.Format){
		Ext.util.Format.defaultDateFormat = 'd.m.Y';
	}


	if(Ext.MessageBox){
		Ext.MessageBox.OK.text = 'OK';
		Ext.MessageBox.CANCEL.text = 'Annuler';
		Ext.MessageBox.YES.text = 'Oui';
		Ext.MessageBox.NO.text = 'Non';
	}
};