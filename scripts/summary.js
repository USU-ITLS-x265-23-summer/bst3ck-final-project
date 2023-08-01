console.log("Starting goals js");

var goalLink = false;
var taskLink = false;

$(document).ready(function(){
   
    // Pull Personal Goals
    loadPersonalGoals();

    // Pull Tasks
    loadTaskList();

    // Pull Client
    loadClientList();

    // Add Click Button Scripts
    $(document).on("click","#add-peronal-goal", function() {
        addPersonalGoal();
    });

    $(document).on("click","#add-task", function() {
        addTask();
    });

});



function loadPersonalGoals() {
    $(".personal-goal").remove();
    $.ajax({
        type: "GET",
        url: "http://www.bksteckler.com/klokke/pullGoalTaskSummary.php",
        async   : true,
        success: function (data) {

            data.forEach(function(item, index) {
                
                hasTask = true;
                if(item.taskName==null) {hasTask = false;}

                goalItem = "";

                goalItem += `        <div class="personal-goal" id="Goal-${item.clientProjectId}">`
                goalItem += `            <div class="goal-desc splitColumn-50">`
                goalItem += `                <div class="goal-title">${item.projectTitle}</div>`
                if(hasTask){
                    goalItem += `                <div class="last-activity"><span class="la-title">Last Activity: </span>${item.taskName}<span class="days-ago">${item.dayAgo} days ago</span></div>`
                }
                goalItem += `            </div>`
                goalItem += `            <div class="goal-status splitColumn-50">`
                goalItem += `                <div class="goal-percentage">${item.perComp}</div>`
                goalItem += `                <div class="goal-progress">`
                goalItem += `                    <div class="goal-complete" style="width:${item.perComp}"></div>`
                goalItem += `                </div>`
                goalItem += `                <div class="goal-dates">`
                goalItem += `                    <div class="goal-ss-date">${getShortDate(item.startDate)}</div>`
                goalItem += `                    <div class="goal-ss-date">${getShortDate(item.targetDate)}</div>`
                goalItem += `                </div>`
                goalItem += `            </div>`
                goalItem += `        </div>`

                $(goalItem).insertAfter("#personalGoalSummary hr");

            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("errored Out");
        }
    });

}

function addPersonalGoal() {
    
    addNewGoal = "";

    addNewGoal +=`<div class="add-new-div" id="addForm-goal">`;
    addNewGoal +=`    <div class="add-new-title">Add a Personal Goal</div> `;
    addNewGoal +=`    <form>`;
    addNewGoal +=`        <div class="form-row">`;
    addNewGoal +=`            <div class="new-fields" id="activity-desc-div">`;
    addNewGoal +=`                <label for="activity-desc">Enter a title of your long term personal goal</label>`;
    addNewGoal +=`                <input type="text" class="activity-desc" name="activity-desc" id="activity-desc">`;
    addNewGoal +=`            </div>`;
    addNewGoal +=`        </div>`;
    addNewGoal +=`        <div class="form-row task-row">`;
    addNewGoal +=`            <div class="new-fields" id="start-date-div">`;
    addNewGoal +=`                <label for="goal-start-date">Start Date</label>`;
    addNewGoal +=`                <input type="text" class="activity-hour" name="goal-start-date" id="goal-start-date">`;
    addNewGoal +=`            </div>`;
    addNewGoal +=`            <div class="new-fields" id="target-date-div">`;
    addNewGoal +=`                <label for="target-date">Target Date</label>`;
    addNewGoal +=`                <input type="text" class="activity-hour" name="target-date" id="target-date">`;
    addNewGoal +=`            </div>`;
    addNewGoal +=`            <div class="new-fields" id="estimated-hrs-div">`;
    addNewGoal +=`                <label for="estimated-hrs">Estimated Time (hrs)</label>`;
    addNewGoal +=`                <input type="text" class="activity-hour" name="estimated-hrs" id="estimated-hrs">`;
    addNewGoal +=`            </div>`;
    addNewGoal +=`            <div class="new-fields" id="goal-value-div">`;
    addNewGoal +=`                <label for="goal-value">Goal Value</label>`;
    addNewGoal += `                 <select name="goal-value" id="goal-value">`;                    
    addNewGoal += `                     <option value="Family">Family</option>`;
    addNewGoal += `                     <option value="Personal">Personal</option>`;
    addNewGoal += `                     <option value="Professional">Professional</option>`;
    addNewGoal += `                     <option value="Spiritual">Spiritual</option>`;
    addNewGoal += `                 </select>`;
    addNewGoal +=`            </div>`;
    addNewGoal +=`        </div>`;
    addNewGoal +=`        <div class="form-row" >`;
    addNewGoal +=`            <div class="new-fields" id="goal-details-div">`;
    addNewGoal +=`                <label for="goal-details">Explain your what you want to accomplish</label>`;
    addNewGoal +=`                <textarea name="goal-details" rows="4" cols="65" id="goal-details"></textarea>`;
    addNewGoal +=`            </div>`;
    addNewGoal +=`        </div>`;
    addNewGoal +=`        <div class="form-row">`;
    addNewGoal +=`            <button type="button" class="submitBtn" id="addFormBtn-goal">Add New</button>`;
    addNewGoal +=`        </div>`;
    addNewGoal +=`    </form>`;
    addNewGoal +=`</div>`;

    $(addNewGoal).insertAfter("#add-peronal-goal");
    $("#add-peronal-goal").addClass("hidden");
    
    if (!goalLink) {
        $(document).on("click","#addFormBtn-goal", function() {
            addGoals();
        });
        goalLink = true;
    };

}

function addGoals() {

    $.ajax({
        type: "POST",
        url: "http://bksteckler.com/klokke/postGoals.php",
        data: JSON.stringify({
            "activity-desc": $("#activity-desc").val(),
            "goal-start-date": $("#goal-start-date").val(),
            "target-date": $("#target-date").val(),
            "estimated-hrs":$("#estimated-hrs").val(),
            "goal-value":$("#goal-value").val(),
            "goal-details":$("#goal-details").val()
        }),
        success: function() {
            $("#add-peronal-goal").removeClass("hidden");
            $("#addForm-goal").remove();
            loadPersonalGoals();            
        }
    });


}

function loadTaskList() {

    $(".task-item").remove();
    $(".task-hr").remove();

    $.ajax({
        type: "GET",
        url: "http://www.bksteckler.com/klokke/pullTaskSummary.php",
        async   : true,
        success: function (data) {
            
            taskCounter = 0;

            data.forEach(function(item, index) {
                taskItem ="";

                if(taskCounter>0) {
                    taskItem += `<hr class="task-hr">`
                }
                taskCounter += 1;

                taskItem += `<div class="task-item" id="taskId-${item.taskId}">`;
                taskItem += ``;
                taskItem += `    <div class="complete">`;
                if(item.currentStatus == "Complete"){
                    taskItem += `        <svg fill="currentColor" aria-hidden="true" width="15" height="15" viewBox="0 0 20 20" focusable="false"><path d="M10 2a8 8 0 110 16 8 8 0 010-16zm3.36 5.65a.5.5 0 00-.64-.06l-.07.06L9 11.3 7.35 9.65l-.07-.06a.5.5 0 00-.7.7l.07.07 2 2 .07.06c.17.11.4.11.56 0l.07-.06 4-4 .07-.08a.5.5 0 00-.06-.63z" fill="currentColor"></path></svg>`;
                } else {
                    taskItem += `        <svg fill="currentColor" aria-hidden="true" width="15" height="15" viewBox="0 0 20 20" focusable="false"><path d="M10 3a7 7 0 100 14 7 7 0 000-14zm-8 7a8 8 0 1116 0 8 8 0 01-16 0z" fill="currentColor"></path></svg>`;
                }
                taskItem += `    </div>`;
                taskItem += `    <div class="task-breakdown">`;
                taskItem += `        <div class="task-main">`;
                taskItem += `            <span class="task-title">${item.taskName}</span>`;
                taskItem += `            <span class="task-due">${item.dueDate}</span>`;
                taskItem += `        </div>`;
                taskItem += `        <div class="task-submenu">`;
                
                if(item.clientName == null){
                    taskItem += `            <div class="task-client">${item.projectTitle}</div>`;
                } else {
                    taskItem += `            <div class="task-client">${item.clientName}</div>`;
                }
                taskItem += `            <div class="priority">`;
                quad="";
                if(item.urgent == "1"){
                    taskItem += `                <div class="task-urgent">Urgent</div>`;
                    quad="U";
                } else {
                    taskItem += `                <div class="task-urgent">Not Urgent</div>`;
                    quad="N";
                }
                if(item.important == "1"){
                    taskItem += `                <div class="task-importance">Important</div>`;
                    quad += "I";
                } else {
                    taskItem += `                <div class="task-importance">Not Import</div>`;
                    quad += "N";
                }

                taskItem += `            </div>`;
                taskItem += `        </div>`;
                taskItem += `    </div>`;
                
                selectQuad = "";

                switch(quad) {
                    case "UI":
                        selectQuad = 1;
                        break;
                    case "NI":
                        selectQuad = 2;
                        break;
                    case "UN":
                        selectQuad = 3;
                        break;
                    case "NN":
                        selectQuad = 4;
                }

                taskItem += `    <div class="matrix quad${selectQuad}">`;
                taskItem += `        <div class="import">`;
                taskItem += `            <div class="urgent"></div>`;
                taskItem += `            <div class="notUrgent"></div>`;
                taskItem += `        </div>`;
                taskItem += `        <div class="notImport">`;
                taskItem += `            <div class="urgent"></div>`;
                taskItem += `            <div class="notUrgent"></div>`;
                taskItem += `        </div>`;
                taskItem += `    </div>`;
                taskItem += `</div>`;

                $(taskItem).insertBefore("#taskSummary #add-task");

            });

        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("errored Out");
        }
    });

}

function addTask() {

    var clientSelect;

    $.ajax({
        type: "GET",
        url: "http://www.bksteckler.com/klokke/test.php",
        async   : true,
        success: function (data) {
            
            addNewTask = "";

            addNewTask += `<div class="add-new-div fillDiv" id="addForm-task">`;
            addNewTask += `     <div class="add-new-title">Add a New Task</div> `;
            addNewTask += `     <form>`;
            addNewTask += `         <div class="form-row task-row">`;
            addNewTask += `             <div class="new-fields" id="Task-client-div">`;
            addNewTask += `                 <label for="Task-client">Select the client to be billed for this task</label>`;
            addNewTask += `                 <select name="Task-client" id="Task-client">`;
            addNewTask += `                     <option value="0">Personal Goal</option>`;

            data.forEach(function(item, index) {
                addNewTask += `                 <option value="${item.clientId}">${item.clientName}</option>`;
            });
            addNewTask += `                 </select>`;
            addNewTask += `             </div>`;
            addNewTask += `             <div class="new-fields" id="projec-client-div">`;
            addNewTask += `             </div>`;
            addNewTask += `        </div>`;
            addNewTask += `        <div class="form-row task-row">`;
            addNewTask += `            <div class="new-fields" id="Task-title-div">`;
            addNewTask += `                <label for="Task-title">New Task Name</label>`;
            addNewTask += `                <input type="text" class="activity-desc" name="Task-title" id="Task-title">`;
            addNewTask += `            </div>`;
            addNewTask += `        </div>`;
            addNewTask += `        <div class="form-row task-row stop-wrap">`;
            addNewTask += `            <div class="new-fields" id="start-date-div">`;
            addNewTask += `                <label for="start-date">Start Date</label>`;
            addNewTask += `                <input type="text" class="activity-hour" name="start-date" id="start-date">`;
            addNewTask += `            </div>`;
            addNewTask += `            <div class="new-fields" id="end-date-div">`;
            addNewTask += `                <label for="end-date">Due Date</label>`;
            addNewTask += `                <input type="text" class="activity-hour" name="end-date" id="end-date">`;
            addNewTask += `            </div>`;
            addNewTask += `            <div class="new-fields" id="bill-rate-div">`;
            addNewTask += `                <label for="bill-rate">Bill Rate</label>`;
            addNewTask += `                <input type="text" class="activity-hour" name="bill-rate" id="bill-rate">`;
            addNewTask += `            </div>`;
            addNewTask += `        </div>`;
            addNewTask += `        <div class="form-row task-row stop-wrap">`;
            addNewTask += `            <div class="new-fields" id="urgency-div">`;
            addNewTask += `                <label for="urgency">Urgency</label>`;
            addNewTask += `                 <select name="urgency" id="urgency">`;
            addNewTask += `                     <option value="1">Urgent</option>`;
            addNewTask += `                     <option value="0">Not Urgent</option>`;
            addNewTask += `                 </select>`;
            addNewTask += `            </div>`;
            addNewTask += `            <div class="new-fields" id="importance-div">`;
            addNewTask += `                <label for="importance">Due Date</label>`;
            addNewTask += `                 <select name="importance" id="importance">`;
            addNewTask += `                     <option value="1">Important</option>`;
            addNewTask += `                     <option value="0">Not Important</option>`;
            addNewTask += `                 </select>`;
            addNewTask += `            </div>`;
            addNewTask += `        </div>`;

            addNewTask += `        <div class="form-row task-row">`;
            addNewTask += `            <button type="button" class="submitBtn" id="addFormBtn-task">Add New</button>`;
            addNewTask += `        </div>`;
            addNewTask += `    </form>`;
            addNewTask += `</div>`;

            $(addNewTask).insertAfter("#add-task");
            $("#add-task").addClass("hidden");
            
            if (!taskLink) {
                $(document).on("click","#addFormBtn-task", function() {
                    createNewTask();
                });

                $(document).on("change","#Task-client", function() {
                    addProjectSelector($(this).val());
                });
                taskLink = true;
            }
    
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("errored Out");
        }
    });
}


function addProjectSelector(clientId){
    addNewTask = "";
    
    $.ajax({
        type: "GET",
        url: "http://www.bksteckler.com/klokke/pullProjectPer.php",
        async: true,
        data: {"clientId":`clientId-${clientId}`},
        success: function (data) {
            hasChildren = false;
            addNewTask += `                 <label for="projec-client">Select the specific project</label>`;
            addNewTask += `                 <select name="projec-client" id="projec-client">`;            
            data.forEach(function(item, index) {
                if(item.projectTitle){
                    addNewTask += `                 <option value="${item.clientProjectId}">${item.projectTitle}</option>`;
                } else {
                    addNewTask += `                 <option value="none">No Projects Found</option>`;
                }
            });
            addNewTask += `                 </select>`;
            
            $("#projec-client-div").html(addNewTask);
            // return addNewTask;
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $("#projec-client-div").html(addNewTask);
        }
    });
}



function createNewTask() {

    $.ajax({
        type: "POST",
        url: "http://bksteckler.com/klokke/postTask.php",
        data: JSON.stringify({
            "Task-title": $("#Task-title").val(),
            "start-date": $("#start-date").val(),
            "end-date":$("#end-date").val(),
            "bill-rate":$("#bill-rate").val(),
            "importance":$("#importance").val(),
            "urgency":$("#urgency").val(),
            "Task-client":$("#projec-client").val()

        }),
        success: function() {
            $("#add-task").removeClass("hidden");
            $("#addForm-task").remove();
            loadTaskList();
        }
    });

}


function loadClientList() {
    $.ajax({
        type: "GET",
        url: "http://www.bksteckler.com/klokke/pullClientSummary.php",
        async   : true,
        success: function (data) {
            console.log(data);

            clientProj = "";
            prevClient = "";

            clientProj += `<div class="client">`;

            data.forEach(function(item, index) {

                if(prevClient == "") {
                    
                    clientProj += `    <h3 class="client-name">${item.clientName}</h3>`;
                    clientProj += `    <ol class="project-list">`;

                } else if (item.clientName != prevClient) {
                    
                    clientProj += `    </ol>`;
                    clientProj += `</div>`;
                    clientProj += `<hr class="task-hr">`;

                    clientProj += `    <h3 class="client-name">${item.clientName}</h3>`;
                    clientProj += `    <ol class="project-list">`;

                }
                prevClient = item.clientName;
    
                clientProj += `        <li>`;
                clientProj += `            <div class="client-project">`;
                clientProj += `                <div class="project-title">${item.projTitle}`;
                clientProj += `                </div>`;
                clientProj += `                <div class="project-summary">`;
                clientProj += `                    <div class="project-budget">${USDollar.format(item.projBudget)}</div>`;
                clientProj += `                    <div class="project-billed">${USDollar.format(item.projBilled)}</div>`;
                clientProj += `                    <div class="project-remaining">${USDollar.format(item.projRemain)}</div>`;
                clientProj += `                </div>`;
                clientProj += `            </div>`;
                clientProj += `        </li>`;

            });

            clientProj += `     </ol>`;
            clientProj += ` </div>`;
            clientProj += `</div>`;

            $("#project-summary").append(clientProj);
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("errored Out");
        }
    });
           
}