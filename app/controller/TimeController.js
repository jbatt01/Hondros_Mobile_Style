Ext.define('Player.controller.TimeController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            timeBar: '#timeBar'
        }
    },

    onStartCountDown: function(pageNode) {
        //debugger;
        var time = 0;
        var tid = pageNode.id;
        if(pageNode.data.complete){
            this.totalSeconds = 0;
            this.updatePageTimer();
            return;
        }
        else
        {
            if(pageNode.data.pageTimerOverride){
                time = pageNode.data.pageTimerAmount;
            }
            else{
                if(pageNode.data.isQuiz){
                    time = Player.settings.data.quizTimerSeconds;
                }
                else{
                    time = Player.settings.data.timerSeconds;
                }
            }
        }

        this.currentTimerId = tid;
        this.createPageTimer(time);
    },

    onPageTick: function(tid) {

        if(tid != this.currentTimerId){
            return;
        }
        if(this.totalSeconds <= 0){
            Player.app.fireEvent('pageComplete');
            return;
        }
        this.totalSeconds -= 1;
        this.updatePageTimer();
        Ext.Function.defer(this.onPageTick, 1000, this, [this.currentTimerId]);
    },

    createPageTimer: function(time) {

        this.totalSeconds = time;
        this.updatePageTimer();
        Ext.Function.defer(this.onPageTick, 1000, this, [this.currentTimerId]);
    },

    updatePageTimer: function() {

        var Seconds = this.totalSeconds;
        var Days = Math.floor(Seconds / 86400);
        Seconds -= Days * 86400;
        var Hours = Math.floor(Seconds / 3600);
        Seconds -= Hours * (3600);
        var Minutes = Math.floor(Seconds / 60);
        Seconds -= Minutes * (60);

        var TimeStr = Lang.Time_Tpl.replace("{h}",this.calculateLeadingZero(Hours)).replace("{m}",this.calculateLeadingZero(Minutes)).replace("{s}",this.calculateLeadingZero(Seconds));
        //var TimeStr = "Time - "+ this.calculateLeadingZero(Hours) + ":" + this.calculateLeadingZero(Minutes) + ":" + this.calculateLeadingZero(Seconds);

        this.getTimeBar().setTitle(TimeStr);
    },

    calculateLeadingZero: function(time) {

        return (time < 10) ? "0" + time : + time;
    },

    onStartInactiveTime: function() {


        // TODO: this is getting called before settings are set
        if(!Player.settings || !Player.settings.data.activateInactiveTimer){
            return;
        }
        this.inactiveTime = 20;
        var hi = 10000;
        var lo = 0;
        var v = Math.random() * (hi - lo + 1);
        var randId = Math.floor(v) + lo;
        this.inActiveTimerId = randId;
        Ext.Function.defer(this.onInactiveTick, 1000, this,[randId]);
    },

    onInactiveTick: function(tid) {

        if(this.inActiveTimerId != tid){
            return; 
        }


        this.inactiveTime -= 1;
        if(this.inactiveTime <= 0){
            alert('die');
            return;
        }
        console.log("i:"+this.inactiveTime);
        Ext.Function.defer(this.onInactiveTick, 1000, this,[tid]);
    },

    onInActiveAlert: function() {

        var mins = Player.settings.data.timerIntMinutes;
        var minStr = '';
        if(mins == 1){
            minStr = "1 "+Lang.Time_Min;
        }
        else{
            minStr = mins+" "+Lang.Time_Mins;
        }
        this.pauseCourse();
        switch(Player.settings.data.inactiveResponse){
            case "logout":
            Ext.Msg.alert(Lang.Time_Out, Lang.Time_Logout.replace("{min}",minStr));
            break;
            case "stopRecord":
            Ext.Msg.alert(Lang.Time_Out, Lang.Time_Stop.replace("{min}",minStr));
            break;
            default:
            Ext.Msg.alert(Lang.Time_Out, Lang.Time_Stop.replace("{min}",minStr));
            break;
        }
    },

    onPauseCourse: function() {



        this.paused = true;
    },

    onUnPauseCourse: function() {


        this.paused = false;
        Ext.Function.defer(this.onCourseTick, 1000, this);
    },

    onStartCourseTimer: function() {


        this.sessionTime = 0;

        Ext.Function.defer(this.onCourseTick, 1000, this);
    },

    onCourseTick: function() {
        if(this.paused){
            return;
        }

        this.sessionTime++;
        //console.log("t:"+this.sessionTime);
        Ext.Function.defer(this.onCourseTick, 1000, this);
    },

    onPdfTimerHandler: function() {
        alert("PDF TIME UP");
    },

    onStartPdfTimer: function(pdfTime) {
        return;

        // Clear the inactive timer
        this.inActiveTimerId = '';
        activateInactiveTimer = false;
        startInactivity(0);


        var task = Ext.create('Ext.util.DelayedTask', function() {
            Player.app.fireEvent('pdfTimerHandler');
        });

        task.delay(pdfTime * 60 * 1000);
    },

    onDebugStart: function() {
        //// Player.app.fireEvent('debugStart');
        _time = (new Date()).getTime();
    },

    onDebugTick: function(name) {
        if(typeof _time != "undefined"){
            _dTime = (new Date()).getTime()-_time;
            console.log(name+":"+_dTime);
            _time = (new Date()).getTime();
        }
    },

    init: function() {

        this.getApplication().on([
        { event: 'startCountDown', fn: this.onStartCountDown, scope: this },
        { event: 'pageTick', fn: this.onPageTick, scope: this },
        { event: 'startInactiveTime', fn: this.onStartInactiveTime, scope: this },
        { event: 'inactiveTick', fn: this.onInactiveTick, scope: this },
        { event: 'inActiveAlert', fn: this.onInActiveAlert, scope: this },
        { event: 'pauseCourse', fn: this.onPauseCourse, scope: this },
        { event: 'unPauseCourse', fn: this.onUnPauseCourse, scope: this },
        { event: 'startCourseTimer', fn: this.onStartCourseTimer, scope: this },
        { event: 'courseTick', fn: this.onCourseTick, scope: this },
        { event: 'pdfTimerHandler', fn: this.onPdfTimerHandler, scope: this },
        { event: 'startPdfTimer', fn: this.onStartPdfTimer },
        { event: 'debugStart', fn: this.onDebugStart, scope: this },
        { event: 'debugTick', fn: this.onDebugTick, scope: this }
        ]);

    }

});