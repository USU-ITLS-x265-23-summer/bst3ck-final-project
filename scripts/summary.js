console.log("Starting goals js");

$(document).ready(function(){
   
    // Pull Personal Goals
    loadPersonalGoals();

    // Pull Tasks
    loadTaskList();

    // Pull Client
    loadClientList();

    // Add Click Button Scripts
    $(document).on("click","#add-peronal-goal", function() {
        // selectdGoal = $(this).parent(".main-items").attr("id");
        addPersonalGoal();
    });
});

function addPersonalGoal() {
    alert("Add New Goal Form");
}

function loadPersonalGoals() {

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

function loadTaskList() {

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