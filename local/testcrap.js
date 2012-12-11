Lang = {
	Loading: "***",
	Table_Of_Contents: "***",
	Close: "***",
	PageOf: "***",
	Glossary: "***",
	Error: "***",
	Narration: "***",
	Exit: "***",
	Sure_Exit:"***",
	Scorm_Load_Error: "***",

	// Time
	Time_Tpl: "***",
	Time_Out: "***",
	Time_Stop: "***",
	Time_Min: "***",
	Time_Mins: "***",
	Time_Logout: "***",

	//Pages
	// Quiz
	Check_Answer: "***",
	Reset: "***",
	Correct: "***",
	Incorrect: "***",
	Try_Again: "***",
	Select_an_Option: "***",
	Tap_CheckAnswer_Button: "***",
	Yes_that_is_correct: "***",
	No_that_is_incorrect: "***",
	Incorrect_Try_Again: "***",
	True: "***",
	False: "***",
	// Results
	Sorry: "***",
	You_did_not_pass: "***",
	Pass: "***",
	Congrats_Pass: "***",
	Quiz_Results: "***",
	Total_Correct: "***",
	Total_Incorrect: "***",
	Score: "***",
	Possible_Score: "***",
	Percentage: "***",
	Review: "***",
	Email_Results: "***",
	Print: "***",
	Make_Sure_Send: "***",
	Coure_Results_Email: "***",
	Email_Quiz: "***",
	Email_User: "***",
	Email_Learner: "***",
	Email_DateCompleted: "***",
	Email_TotalCorrect: "***",
	Email_TotalIncorrect: "***",
	Email_Percent: "***",
	Email_Window: "***",
	//EmailPopup
	Email_Directions: "***",
	Enter_Name: "***",
	Name: "***",
	Email: "***",
	OK: "***",
	// Review
	Retake_Test: "***",
	Test_Results: "***",
	Review_Score: "***",
	Correct_of: "***",
	Your_Answers_Were: "***",
	C: "***",
	X: "***",
	N: "***",
	Correct_Answer: "***",
	Question_of: "***",	
	// video
	Video_Error: "***",
	Tap_To_Play: "***",
	// Audio
	Audio_Error0: "***",
	Audio_Error1: "***",
	Audio_Error2: "***",
	Audio_Error3: "***",
	Audio_Error4: "***",
	//Def
	Practice_Instructions: "***",
	Practice_Step1: "***",
	Practice_Step2: "***",
	Practice_Review: "***",
	Practice_SelectTerm: "***",
	Practice_Sorry: "***",
	Practice_NotAMatch: "***",
	Review_Practice: "***"
}

function initLocalization() {
	Ext.Date.dayNames = [
		"***",
		"***",
		"***",
		"***",
		"***",
		"***",
		"***"
	];


	Ext.Date.monthNames = [
		"***",
		"***",
		"***",
		"***",
		"***",
		"***",
		"***",
		"***",
		"***",
		"***",
		"***",
		"***"
	];


	Ext.Date.monthNumbers = {
		"***": 0,
		"***": 1,
		"***": 2,
		"***": 3,
		"***": 4,
		"***": 5,
		"***": 6,
		"***": 7,
		"***": 8,
		"***": 9,
		"***": 10,
		"***": 11
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
				doneButton: "***" ,
				cancelButton: "***"
			}
		});
	}


	if (Ext.picker.Date) {
		//debugger;
		
		Ext.define('Ext.picker.Date', {
			override: 'Ext.picker.Date',
			config:{
				doneButton: "***" ,
				cancelButton: "***",
				dayText: "***",
				monthText: "***",
				yearText: "***",
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
				backText: "***",
				loadingText: "***",
				emptyText: "***"
			}
		});
	}


	if(Ext.util.Format){
		Ext.util.Format.defaultDateFormat = 'd.m.Y';
	}


	if(Ext.MessageBox){
		Ext.MessageBox.OK.text = "***";
		Ext.MessageBox.CANCEL.text = "***";
		Ext.MessageBox.YES.text = "***";
		Ext.MessageBox.NO.text = "***";
	}
	
}