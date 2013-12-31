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


    $actionTable.dataTable( {
        "bJQueryUI": true,
        "aaData": dashboard.data.actions,
        "sProcessing":true,
        "bScrollCollapse": (Helpers.isIOS ? false : true),
        "bScrollInfinite": (Helpers.isIOS ? false : true),
        "sScrollY": (Helpers.isIOS ? null : height),
        "bStateSave": true,
        "sDom": 't<"F">',
        "fnRowCallback":function( tr, rowData, rowNum, rowNumFull ) {
            //After cells are rendered with basic data, spice them up with jQuery
            var cell_style={fontWeight:'bold',textAlign:'center',whiteSpace:'nowrap'};

            var $cell1 = $('td:eq(0)', tr);
            var $cell2 = $('td:eq(1)', tr);
            var $cell3 = $('td:eq(2)', tr);
            var $cell4 = $('td:eq(3)', tr);
            var $cell5 = $('td:eq(4)', tr);

            $cell1
                .css(cell_style)
                .text(rowData.action_id);

            director_support.plugins.actions.setCellToDate(rowData.date_plan_due,$cell3,cell_style);
            director_support.plugins.actions.setCellToDate(rowData.date_final_due,$cell4,cell_style);
            director_support.plugins.actions.setCellToDate(rowData.date_closed,$cell5,cell_style,'Open');


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
            {
                sTitle: "ID",
                mDataProp: "action_id"
            }
            ,{
                sTitle: "Assigned",
                mDataProp: "assigned_to"
            }
            ,{
                sTitle: "Plan Due",
                mDataProp: "date_plan_due"
            }
            ,{
                sTitle: "Final Due",
                mDataProp: "date_final_due"
            }
            ,{
                sTitle: "Closed",
                mDataProp: "date_closed"
            }

        ]
    } );


    var $headerdiv = $('#'+director_support.widgetDivName(widget,numberDrawn,'header'));
    var $addForm = director_support.plugins.actions.addForm();
    $addForm.appendTo($content);


    if  (dashboard.permissions.add_action)
	{
    var longUrl=event_pages.options.root+'director/action/add/';
    var $dd = $("<div>")
        .addClass("dropdown btn-group")
        .appendTo($headerdiv);

    var $dd_a = $("<button>")
        .addClass("btn dropdown-toggle btn-mini")
        .attr({dataToggle:"dropdown"})
        .text("Add Action Item")
        .appendTo($dd);
    $("<span>")
        .addClass("caret")
        .appendTo($dd_a);
    var $ul = $("<ul>")
        .addClass("dropdown-menu")
        .appendTo($dd);
    var $l1 = $("<li>")
        .appendTo($ul);
    $("<a>")
        .attr({href:"#"})
        .text("Quick Add")
        .click(function(){
            $addForm.modal('show');
        })
        .appendTo($l1);

    var $l2 = $("<li>")
        .appendTo($ul);
    $("<a>")
        .attr({href:longUrl})
        .text("Detailed Add")
        .click(function(){
            document.location.href=longUrl;
        })
        .appendTo($l2);
	}
};



director_support.plugins.actions.functionFormatDetails=function(table,tr) {
    var rowData = table.fnGetData( tr );

    var $details = $('<div>')
        .css({padding:'10px',width:'100%'});

    var desc = "";
    if (rowData.action_notes){
        desc+="<b>Notes: </b>"+rowData.action_notes+"<br/>";
    }
    if (rowData.description){
        desc+="<b>Description: </b>"+rowData.description+"<br/>";
    }
    if (rowData.current_status){
        desc+="<b>Current Status: </b>"+rowData.current_status+"<br/>";
    }

    var $tr = $('<div>')
        .html(desc);

//    var output = obs.observation_date;
//    var dtg_moment =  moment(output);
//    if (output && dtg_moment.isValid()){
//        output = dtg_moment.fromNow();
//    }
//
//    var url = event_pages.options.root + "admin/director/programobservation/" + obs.id;
//    var $editLink = $('<a>')
//        .attr({href:url,target:'_new'})
//        .appendTo($tr);
//    $('<i>')
//        .addClass('icon icon-pencil')
//        .tooltip({title:'Edit this observation',trigger:'hover',placement:'left'})
//        .appendTo($editLink);
//
//    var url_quad = event_pages.options.root + "director/quadchart/" + obs.id;
//    var $shownLink = $('<a>')
//        .attr({href:url_quad,target:'_blank'})
//        .css({margin:'6px'})
//        .appendTo($tr);
//    $('<i>')
//        .addClass('icon icon-th-large')
//        .tooltip({title:'Show Quad Chart',trigger:'hover',placement:'right'})
//        .appendTo($shownLink);
//
//    $('<span>')
//        .text('Observation from '+output+": ")
//        .appendTo($tr);
//
//    var $obs = director_support.plugins.actions.recordObs(obs);
//    $obs.appendTo($tr);

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

    var date_data = Helpers.dateFromPythonDate(date,'');
    if (date_data) {
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

director_support.plugins.actions.addForm=function(){
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
        .html("Add an action")
        .appendTo($header);

    var $body=$("<form>")
        .addClass("modal-body")
        .appendTo($form);
    //----------------
    $("<input>")
        .attr({type:'text',name:'action_id',placeholder:'ID of action'})
        .appendTo($body);
    $("<input>")
        .attr({type:'text',maxLength:120,name:'description',placeholder:'Short description'})
        .appendTo($body);
    $("<input>")
        .attr({type:'text',name:'assigned_to',placeholder:'Assigned To'})
        .appendTo($body);
    $("<textarea>")
        .attr({name:'action_notes',placeholder:'Detailed task description'})
        .appendTo($body);
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
