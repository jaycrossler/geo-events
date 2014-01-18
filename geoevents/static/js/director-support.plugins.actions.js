director_support.plugins.organizationActions=function(widget,numberDrawn,$content){
    return director_support.plugins.actions.buildTable(widget,numberDrawn,$content);
};
//----------------------------------------

director_support.plugins.actions = {};
director_support.plugins.actions.openRow=null;

director_support.plugins.actions.buildTable=function(widget,numberDrawn,$content){

    //Add Each Program Observation to the timeline
    _.each(dashboard.data.actions,function(action){
        director_support.plugins.actions.addTimelineItem(action);
    });

    //Build a scrollable datatable
    var $actionTable = $('<table>')
        .attr({cellpadding:0,cellspacing:0,border:0})
        .addClass("display")
        .appendTo($content);

    var height = director_support.widgetContentHeight(widget)-49+'px';

    var actions_data = dashboard.data.actions;
    if (widget.data && widget.data.category) {
        //There is a category specified, so only show those that match the title of this widget
        actions_data = _.filter(actions_data, function(item){return item.category == widget.data.category});
    }

    actions_data = actions_data || [];
    $actionTable.dataTable( {
        "bJQueryUI": true,
        "aaData": actions_data,
        "sProcessing":true,
        "bScrollInfinite": (Helpers.isIOS ? false : true),
        "sScrollY": (Helpers.isIOS ? null : height),
        "sDom": 't<"F">',
        "fnRowCallback":function( tr, rowData, rowNum, rowNumFull ) {
            //After cells are rendered with basic data, spice them up with jQuery
            var cell_style={fontWeight:'bold',textAlign:'center',whiteSpace:'nowrap'};

            var $cell1 = $('td:eq(0)', tr);  //Hot
            director_support.plugins.actions.setCellHotness(rowData.hotness,$cell1,cell_style);

            var $cell2 = $('td:eq(1)', tr)  //ID
                .css(cell_style)
                .text(rowData.action_id);
            var $cell3 = $('td:eq(2)', tr);  //Summary
            var $cell4 = $('td:eq(3)', tr);  //OPR
            var $cell5 = $('td:eq(4)', tr);  //Due
            director_support.plugins.actions.setCellToDate(rowData.date_final_due,$cell5,cell_style);
            var $cell6 = $('td:eq(5)', tr);  //Status
            director_support.plugins.actions.setCellToDate(rowData.date_closed,$cell6,cell_style,'Open');


            $(tr).on('click',function(){
                var tr = this;
                if (director_support.plugins.actions.openRow){
                    $actionTable.fnClose(director_support.plugins.actions.openRow);
                    director_support.plugins.actions.openRow = null;
                }else{
                    $actionTable.fnOpen( tr, director_support.plugins.actions.functionFormatDetails($actionTable, tr), 'details' );
                    director_support.plugins.actions.openRow = tr;
                }
            });

            $(tr).data('action',rowData);

            $(tr).drop(function( ev, dd ){
                var $target = $(dd.target);
                var actionData = $target.data('action');
                var actionID = actionData.id;

                var $source = $(dd.proxy);
                var reportData = $source.data('report');
                var reportID = reportData.id;

                var url = event_pages.options.root + "director/report/link/" + reportID + '/related_actions/'+ actionID+'/';
                $.post(url, function(data,status,xhr){
                    console.log(data);
                });
                $( this ).toggleClass('dropped');
            });

        },

        "aoColumns": [
            {   sTitle: "Hot",
                mDataProp: "hotness"
            }
            ,{
                sTitle: "ID",
                mDataProp: "action_id"
            }
            ,{
                sTitle: "Summary",
                mDataProp: "description"
            }
            ,{
                sTitle: "OPR/Assigned to",
                mDataProp: "assigned_to"
            }
            ,{
                sTitle: "Due",
                mDataProp: "date_final_due"
            }
            ,{
                sTitle: "Status",
                mDataProp: "date_closed"
            }

        ]
    } );


    var $headerdiv = $('#'+director_support.widgetDivName(widget,numberDrawn,'header'));
    var $addForm = director_support.plugins.actions.addForm(widget);
    $addForm.appendTo($content);


    if  (dashboard.permissions.add_action){
        var longUrl=event_pages.options.root+'director/action/add/';
        $("<a>")
            .addClass("btn btn-mini")
            .attr({href:"#"})
            .text("Quick Add")
            .click(function(){
                $addForm.modal('show');
            })
            .appendTo($headerdiv);

        $("<a>")
            .addClass("btn btn-mini")
            .attr({href:longUrl})
            .text("Detailed Add")
            .click(function(){
                document.location.href=longUrl;
            })
            .appendTo($headerdiv);
	}
};


director_support.plugins.actions.functionFormatDetails=function(table,tr) {
    var rowData = table.fnGetData( tr );

    var $details = $('<div>')
        .css({padding:'10px',width:'100%'});

    var desc = "";
    if (rowData.originator){
        desc+="<b>Tasker: </b>"+rowData.originator+"<br/>";
    }
    var dates = [];
    if (rowData.date_assigned && rowData.date_assigned!="None"){
        dates.push("<b>Assigned: </b>"+rowData.date_assigned);
    }
    if (rowData.date_updated && rowData.date_updated!="None"){
        dates.push("<b>Updated: </b>"+rowData.date_updated);
    }
    if (rowData.date_plan_due && rowData.date_plan_due!="None"){
        dates.push("<b>Plan Due: </b>"+rowData.date_plan_due);
    }
    if (rowData.date_final_due && rowData.date_final_due!="None"){
        dates.push("<b>Due: </b>"+rowData.date_final_due);
    }
    if (rowData.date_closed && rowData.date_closed!="None"){
        dates.push("<b>Closed: </b>"+rowData.date_closed);
    }
    desc += dates.join(", ")+"<br/>";

    if (rowData.action_notes){
        desc+="<b>Notes: </b>"+rowData.action_notes+"<br/>";
    }
    if (rowData.current_status){
        desc+="<b>Current Status: </b>"+rowData.current_status+"<br/>";
    }

    var $tr = $('<div>')
        .html(desc);

    $tr.appendTo($details);

    return $details;
};


director_support.plugins.actions.addTimelineItem=function(action){

    var existingEvents = _.find(dashboard.data.timeline_events,function(p){
        return (p.title==action.action_id) ;});

    if (!existingEvents) {
        var desc = "";
        var post_date=Helpers.dateFromPythonDate(action.date_assigned,moment());
        if (post_date) {
            post_date=post_date.calendar();
        } else {
            post_date=action.date_assigned;
        }

        if (action.assigned_to) desc+='<b>Assigned To:</b> '+action.assigned_to+"<br/>";
        if (action.current_status) desc+='<b>Status:</b> '+action.current_status+"<br/>";
        desc +="<b>Assigned: </b>"+post_date+"<br/>";

        var plan_due = Helpers.dateFromPythonDate(action.date_plan_due,moment());
        var final_due = Helpers.dateFromPythonDate(action.date_final_due,moment());
        if (action.date_plan_due) desc+='<b>Plan Due:</b> '+plan_due.calendar()+"<br/>";
        if (action.date_final_due) desc+='<b>Final Due:</b> '+final_due.calendar()+"<br/>";

        dashboard.data.timeline_events.push({
            start: moment(action.date_final_due),
            createdAt: moment(action.created),
            date: action.date_assigned,
            title: action.action_id,
            details: desc,
            link: "/", //TODO: Add link to observation edit
            type: 'Action',
            className: 'timeline-item-rfi', //TODO: Create new classes
            status: action.status,
            group: 'Action'
        });
    }
};

director_support.plugins.actions.setCellToDate=function(date,$cell,cell_style,empty_text){
//Thai Colors:    var days_colors = ['red','yellow','pink','green','orange','blue','purple'];
    var days_colors = ['maroon','white','orange','green','gold','lightblue','darkblue'];

    var date_data = Helpers.dateFromPythonDate(date,'');
    if (date_data) {
        var day_of_week = moment.day();
        var day_color = days_colors[day_of_week];
        cell_style.backgroundColor = day_color;

        $cell
            .css(cell_style)
            .tooltip({title:date_data.calendar(),action:'hover'})
            .text(date_data.fromNow());
        if (Helpers.dateCameBefore(date_data)) $cell.css({color:'red'});
    } else {
        $cell
            .css(cell_style)
            .text(empty_text||"--");
    }
};

director_support.plugins.actions.setCellHotness=function(hotness,$cell,cell_style){

    var hotness_icons = ['','hot1.png','hot2.png','hot3.png','hot4.gif','hot5.gif','hot6.gif'];
    var hotness_dir = event_pages.options.staticRoot + "images/hotness/";

    hotness = parseInt(hotness);
    var hotness_image_string = '';
    var hotness_icon = hotness_dir + hotness_icons[hotness];
    if (hotness > 3) {
        cell_style.backgroundColor = 'red';
    }
    if (hotness > 1) {
       hotness_image_string = "<img src='"+hotness_icon+"'/> ("+hotness+")";
    }
    $cell
        .css(cell_style)
        .html(hotness_image_string);
};

director_support.plugins.actions.addForm=function(widget){
    var $form = $("<div>")
        .addClass("modal hide fade")
        .attr({tabindex:-1,role:'dialog',ariaLabelledby:"popup_header", ariaHidden:"true"});

    var $header=$("<div>")
        .addClass("modal-header")
        .appendTo($form);
    $("<button>")
        .addClass("close")
        .attr({type:"button",dataDismiss:"modal",ariaHidden:"true"})
        .html("&times;")
        .click(function(){
            $form.modal('hide');
        })
        .appendTo($header);
    $("<h3>")
        .html("Add an action/tasker")
        .appendTo($header);

    var $body=$("<form>")
        .addClass("modal-body")
        .appendTo($form);
    //----------------
//    $("<input>")
//        .attr({type:'text',name:'hotness',placeholder:'1', length:2})
//        .appendTo($body);

    var $hotness = $("<input>")
        .attr({type:'text',name:'hotness',placeholder:'Hotness (from 0 to 5'})
        .css({display:'none'})
        .appendTo($body);
    var hotness_items = [{title:0},
        {title:1,imgSrc:'/static/images/hotness/hot1.png'},
        {title:2,imgSrc:'/static/images/hotness/hot2.png'},
        {title:3,imgSrc:'/static/images/hotness/hot3.png'},
        {title:4,imgSrc:'/static/images/hotness/hot4.gif'},
        {title:5,imgSrc:'/static/images/hotness/hot5.gif'}];
    Helpers.buildBootstrapInputDropdown('Hotness',hotness_items,$hotness)
        .appendTo($body);

    $("<input>")
        .attr({type:'text',name:'action_id',placeholder:'ID of action'})
        .appendTo($body);
    $("<input>")
        .attr({type:'text',maxLength:120,name:'description',placeholder:'Summary'})
        .appendTo($body);
    $("<input>")
        .attr({type:'text',name:'assigned_to',placeholder:'OPR(s) assigned to'})
        .appendTo($body);
    $("<textarea>")
        .attr({name:'action_notes',placeholder:'Detailed tasker description'})
        .appendTo($body);
    if (widget.data && widget.data.category){
        $("<input>")
            .attr({type:'text',name:'category',value:widget.data.category})
            .css({display:'none'})
            .appendTo($body);
    }
    $("<input>")
        .attr({type:'text',name:'owning_organization',value:dashboard.org})
        .css({display:'none'})
        .appendTo($body);
    $("<input>")
        .attr({type:'text',name:'originator',value:dashboard.current_user})
        .css({display:'none'})
        .appendTo($body);

    $("<br>")
        .appendTo($body);
    //----------------

    var $footer=$("<div>")
        .addClass("modal-footer")
        .appendTo($form);
    $("<button>")
        .addClass("btn")
        .attr({dataDismiss:"modal",ariaHidden:"true"})
        .html("Close")
        .click(function(){
            $form.modal('hide');
        })
        .appendTo($footer);
    $("<button>")
        .addClass("btn")
        .attr({dataDismiss:"modal",ariaHidden:"true"})
        .html("Submit")
        .click(function(e){
            e.preventDefault();

            $.post(event_pages.options.root+'director/action/new/',
                $body.serialize(),function(data,status,xhr){
                    console.log(data);
                    if (data.status=='created'){
                        $form.modal('hide');
                        $body[0].reset();

                        //TODO: Refresh just the widget to reload data
                        document.location.reload();
                    }
                }
            );
        })
        .appendTo($footer);


    return $form;
};
