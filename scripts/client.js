console.log("Starting client js");
localStorage.setItem("selClient",null);

addedBtnLink = false;
addedNewProjectLink = false;
addNewProjConfirmBtn = false;

$(document).ready(function(){
    
    $.ajax({
      type: "GET",
      url: "http://www.bksteckler.com/klokke/test.php",
      async   : true,
      success: function (data) {

            result = "";
            data.forEach(function(item, index) {
                result += `<li class='client-name' id='clientId-${item.clientId}'>${item.clientName}</li>`;
            });

            document.getElementById("fullClientList").innerHTML = result;
            
            $(document).on("click","li.client-name", function() {
                loadClient($(this).attr('id'));
            });
        },
    });

});

function loadClient(clientStr) {

    // if(localStorage.getItem("selClient")==clientStr) {
    //     // console.log("Already on this client");
    // } else {

    // }

    $("#client-projects").html("");

    localStorage.setItem("selClient",clientStr);

    $.ajax({
        type: "GET",
        url: "http://www.bksteckler.com/klokke/pullProject.php",
        async: true,
        data: {"clientId":clientStr},
        success: function (data) {

            // Set the Client Intro Section
            clientintro = `<div class="client-logo">`;
            if(data[0].clientIconPath === null){
                clientintro += `<img src="./images/Nologo.svg" alt="Client Logo">`;
            } else {
                clientintro += `<img src="${data[0].clientIconPath}" alt="Client Logo">`;
            }
            clientintro += `</div><h2 class="client-full-name">${data[0].clientName}</h2>`;
            // clientintro += "<div>Add New Project</div>";

            document.getElementById("client-intro").innerHTML = clientintro;
            
            // Loop through all the projects
            if (data[0].clientProjectId) {
                data.forEach(function(item, index) {

                        clientproject = "";

                        clientproject += `<div class="main-items client-project" id="clientProjId-${item.clientProjectId}">`;
                        clientproject += `  <div class="proj-intro">`;
                        clientproject += `      <h3 class="proj-title">${item.projectTitle}</h3>`;
                        clientproject += `      <div class="project-details">`;
                        clientproject += `          <div class="proj-start divHdr"><div class="subHeader">Start Date</div><div class="divValue">${getFormattedDate(item.startDate)}</div></div>`;
                        clientproject += `          <div class="proj-estimate-date divHdr"><div class="subHeader">Target Date</div><div class="divValue">${getFormattedDate(item.targetDate)}</div></div>`;
                        clientproject += `      </div>`;
                        clientproject += `      <div class="project-details">`;
                        clientproject += `          <div class="proj-budget divHdr"><div class="subHeader">Budget</div><div class="divValue">${USDollar.format(item.projectBudget)}</div></div>`;
                        clientproject += `          <div class="proj-billed divHdr"><div class="subHeader">Billed</div><div class="divValue">${USDollar.format(item.totalBilled)}</div></div>`;
                        clientproject += `          <div class="proj-remaining divHdr"><div class="subHeader">Remaining</div><div class="divValue">${USDollar.format(item.projectBudget-item.totalBilled)}</div></div>`;
                        clientproject += `      </div>`;
                        clientproject += `      <div class="proj-desc divHdr">`;
                        clientproject += `          <div class="subHeader">Project Description</div>`;
                        clientproject += `          <div class="divValue">${item.projectDescription}</div>`;
                        clientproject += `      </div>`;
                        clientproject += `  </div>`;
                        clientproject += `  <hr>`;
                        clientproject +=`   <div class="projTasksList" id="projTasks-${item.clientProjectId}"></div>`;
                        clientproject +=`   <div class="add-task-btn" id="${item.clientProjectId}">`
                        clientproject +=`       <img src="./images/blue-add-button.svg" alt="Add Client Task">`
                        clientproject +=`   </div>`
                        clientproject +=`</div>`;
                        
                        $("#client-projects").append(clientproject);

                        //Loop and Set Tasks for each project                
                        $.ajax({
                            type: "GET",
                            url: "http://www.bksteckler.com/klokke/pullProjectTasks.php",
                            async: true,
                            data: {"clientProjectId":"clientProjId-" + item.clientProjectId},
                            success: function (dataTasks) {

                                projTasks = `<ol class="task-list">`;
                
                                dataTasks.forEach(function(taskItem, index) {
                                    
                                    billedCosts = parseFloat(taskItem.hourAlotment) * parseFloat(taskItem.hrlyRate);
                
                                    projTasks +=`<li class="task-li">`
                                    projTasks +=`   <div class="task-dtl">`
                                    projTasks +=`       <div class="task-title">${taskItem.taskName}<span class="task-status onTime">In Progress</span></div>`
                                    projTasks +=`       <div class="task-breakdown">`
                                    projTasks +=`           <div class="hr-date project-details">`
                                    projTasks +=`               <div class="task-start-date divHdr"><div class="subHeader">Start</div><div class="divValue">${getFormattedDate(taskItem.taskStartDate)}</div></div>`
                                    projTasks +=`               <div class="task-target-date divHdr"><div class="subHeader">Due Date</div><div class="divValue">${getFormattedDate(taskItem.dueDate)}</div></div>`
                                    projTasks +=`           </div>`
                                    projTasks +=`           <div class="verticalLine"><div class="vl">&nbsp;</div><div class="vr">&nbsp;</div></div>`
                                    projTasks +=`           <div class="billables project-details">`
                                    projTasks +=`               <div class="task-hrs-spent divHdr"><div class="subHeader">Total Hours</div><div class="divValue">${taskItem.hourAlotment}</div></div>`
                                    projTasks +=`               <div class="task-bill-rate divHdr"><div class="subHeader">Hourly Rate</div><div class="divValue">${USDollar.format(taskItem.hrlyRate)}</div></div>`
                                    projTasks +=`               <div class="task-billable divHdr"><div class="subHeader">Billed Cost</div><div class="divValue">${USDollar.format(billedCosts)}</div></div>`
                                    projTasks +=`           </div>`
                                    projTasks +=`       </div>`
                                    projTasks +=`   </div>`
                                    projTasks +=`</li>`
                
                                });     //End Project Loop
                
                                projTasks += `</ol>`;

                                $(`.projTasksList#projTasks-${item.clientProjectId}`).html(projTasks);

                            },       //End Success Validation Function
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                console.log("No Tasks in the Database");                                    
                            }
                            
                        });     //End of project tasks Ajax

                });
            } else {
                console.log("Client Projects have found a null");
            };
        }, //End Success of the Project Promise
        error: function() {
            console.log("Nothing returned");
        }

    });// End Main Ajax call for a clients projects

    if(!addedBtnLink){
        $(document).on("click",".add-task-btn", function() {
            addTasktoProject($(this).attr("id"));
        });
        addedBtnLink = true;
    }

    insertNewProject = "<div class='insertNewProject'>Add New Project</div>"
    $("#client-projects").append(insertNewProject);

   
    if(!addedNewProjectLink) {
        $(document).on("click",".insertNewProject", function() {
            addNewProject();
            $(".insertNewProject").addClass("hidden");
        });
        addedNewProjectLink = true;
    }
}

function addNewProject() {

    selectdProject = localStorage.getItem("selClient");

    addNewForm ="";

    addNewForm += `<div class="new-project-client" id="newProj-${selectdProject}">`;
    addNewForm += ` <div class="new-pgoal-title">Add a New Project</div>`;
    addNewForm += ` <form class="test">`;
    addNewForm += `     <div class="newFormRow">`;
    addNewForm += `         <div class="new-fields goal-activity">`;
    addNewForm += `             <label for="activity-desc">Project Name</label>`;
    addNewForm += `             <input type="text" class="activity-desc" name="activity-desc" id="project-name">`;
    addNewForm += `         </div>`;
    addNewForm += `     </div>`;
    addNewForm += `     <div class="newFormRow">`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="start-date">Start Date</label>`;
    addNewForm += `             <input type="text" class="activity-date" name="start-date" id="start-date">`;
    addNewForm += `         </div>`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="target-date">Target Date</label>`;
    addNewForm += `             <input type="text" class="activity-date" name="target-date" id="target-date">`;
    addNewForm += `         </div>`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="budget">Budget</label>`;
    addNewForm += `             <input type="text" class="activity-hour" name="budget" id="budget">`;
    addNewForm += `         </div>`;
    addNewForm += `     </div>`;

    addNewForm += `     <div class="newFormRow">`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="projDesc">Project Decription</label>`;
    addNewForm +=`              <textarea name="projDesc" rows="4" cols="65" id="projDesc"></textarea>`;
    addNewForm += `         </div>`;
    addNewForm += `     </div>`;
    
    addNewForm += `     <div class="newFormRow">`;            
    addNewForm += `         <button type="button" class="submitBtn newProjSubBtn" id="addProject-${selectdProject}">Add New</button>`
    addNewForm += `     </div>`

    addNewForm += ` </form>`
    addNewForm += `</div>`

    $(addNewForm).insertAfter('.insertNewProject');

    if(!addNewProjConfirmBtn) {
        $(document).on("click",".newProjSubBtn", function() {
            postNewProject(selectdProject);
        });
        addNewProjConfirmBtn = true;
    }

}

function postNewProject(clientId) {
    // console.log(`Submitted Form: ${submittedForm}`);
    // console.log(`Selected Goal: ${selectdGoal}`);
    $.ajax({
        type: "POST",
        url: "http://bksteckler.com/klokke/postNewProj.php",
        data: JSON.stringify({
            "project-name":$("#project-name").val(),
            "start-date": $("#start-date").val(),
            "target-date": $("#target-date").val(),
            "budget": $("#budget").val(),
            "projDesc": $("#projDesc").val(),
            "fkClientId": clientId,
            "projStatus": "Active"
        }),
        success: function() {
            // $(submittedForm.parent().children(".add-task-btn")).removeClass("hidden");
            // $(submittedForm).remove();
            
            loadClient(localStorage.getItem("selClient"));
        }
    });


}

function addTasktoProject(selectdProject) {
    // alert(`clicked ${selectdProject}`);

    addNewForm ="";
    // addNewFormId = `addForm-${selectdProject}`;

    addNewForm += `<div class="new-pgoal-task" id="addForm-${selectdProject}">`;
    addNewForm += ` <div class="new-pgoal-title">Add a New Task</div>`;
    addNewForm += ` <form class="test">`;
    addNewForm += `     <div class="newFormRow">`;
    addNewForm += `         <div class="new-fields goal-activity">`;
    addNewForm += `             <label for="activity-desc">Task Title</label>`;
    addNewForm += `             <input type="text" class="activity-desc" name="activity-desc" id="activity-desc">`;
    addNewForm += `         </div>`;
    addNewForm += `     </div>`;
    addNewForm += `     <div class="newFormRow">`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="start-date">Start Date</label>`;
    addNewForm += `             <input type="text" class="activity-date" name="start-date" id="start-date">`;
    addNewForm += `         </div>`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="target-date">Target Date</label>`;
    addNewForm += `             <input type="text" class="activity-date" name="target-date" id="target-date">`;
    addNewForm += `         </div>`;
    addNewForm += `     </div>`;


    addNewForm += `     <div class="newFormRow">`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="est-hours">Estimated Time (hrs)</label>`;
    addNewForm += `             <input type="text" class="activity-hour" name="est-hours" id="est-hours">`;
    addNewForm += `         </div>`;
    addNewForm += `         <div class="new-fields goal-time">`;
    addNewForm += `             <label for="bill-rate">Bill Rate</label>`;
    addNewForm += `             <input type="text" class="activity-hour" name="bill-rate" id="bill-rate">`;
    addNewForm += `         </div>`;
    addNewForm += `     </div>`;
    
    
    addNewForm += `     <div class="newFormRow">`;
    addNewForm += `         <div class="new-fields goal-time" id="urgency-div">`;
    addNewForm += `             <label for="urgency">Urgency</label>`;
    addNewForm += `             <select name="urgency" id="urgency">`;
    addNewForm += `                 <option value="1">Urgent</option>`;
    addNewForm += `                 <option value="0">Not Urgent</option>`;
    addNewForm += `             </select>`;
    addNewForm += `         </div>`;
    addNewForm += `         <div class="new-fields goal-time" id="importance-div">`;
    addNewForm += `             <label for="importance">Due Date</label>`;
    addNewForm += `             <select name="importance" id="importance">`;
    addNewForm += `                 <option value="1">Important</option>`;
    addNewForm += `                 <option value="0">Not Important</option>`;
    addNewForm += `             </select>`;
    addNewForm += `         </div>`;
    addNewForm += `     </div>`;

    addNewForm += `     <div class="newFormRow">`;            
    addNewForm += `         <button type="button" class="submitBtn" id="addFormBtn-${selectdProject}">Add New</button>`
    addNewForm += `     </div>`

    addNewForm += ` </form>`
    addNewForm += `</div>`

    $(addNewForm).insertBefore(`#${selectdProject}.add-task-btn`);
    $(`#${selectdProject}.add-task-btn`).addClass("hidden");

    $(document).on("click",`#addFormBtn-${selectdProject}`, function() {
        
        selectdProjectForm = $(this).parent().parent().parent();
        selectdGoal = $(this).parent().parent().parent().attr("id");
        // parentContrainer = $(this).parent().parent().parent().parent().attr("id");
        addNewFormSubmit(selectdProjectForm, selectdGoal);

    });

}

function addNewFormSubmit(submittedForm, selectdGoal) {
    console.log(`Submitted Form: ${submittedForm}`);
    console.log(`Selected Goal: ${selectdGoal}`);
    
    $.ajax({
        type: "POST",
        url: "http://bksteckler.com/klokke/postClientProject.php",
        data: JSON.stringify({
            "activity-desc":$("#activity-desc").val(),
            "start-date": $("#start-date").val(),
            "target-date": $("#target-date").val(),
            "est-hours": $("#est-hours").val(),
            "bill-rate": $("#bill-rate").val(),
            "urgency": $("#urgency").val(),
            "importance": $("#importance").val(),
            "personalGoal": selectdGoal
        }),
        success: function() {
            $(submittedForm.parent().children(".add-task-btn")).removeClass("hidden");
            $(submittedForm).remove();
            // loadPage();

            loadClient(localStorage.getItem("selClient"));
        }
    });

}