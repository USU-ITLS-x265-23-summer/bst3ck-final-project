console.log("Starting client js");
localStorage.setItem("selClient",null);

// Global variable Set Up
let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, 
    minimumFractionDigits: 0
});


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

    console.log(clientStr);

    if(localStorage.getItem("selClient")==clientStr) {
        console.log("Already on this client");
    } else {

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
                            clientproject += `</div>`;

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

                                    projTasks +=`<div class="add-task-btn">`
                                    projTasks +=`    <img src="./images/blue-add-button.svg" alt="Add Client Task" id="clientProjId-${item.clientProjectId}-add">`
                                    projTasks +=`</div>`

                                    $(`#clientProjId-${item.clientProjectId}`).append(projTasks);

                                },       //End Success Validation Function
                                error: function(XMLHttpRequest, textStatus, errorThrown){
                                    addNewBtn =`<div class="add-task-btn">`
                                    addNewBtn +=`    <img src="./images/blue-add-button.svg" alt="Add Client Task" id="clientProjId-${item.clientProjectId}-add">`
                                    addNewBtn +=`</div>`
                    
                                    $(`#clientProjId-${item.clientProjectId}`).append(addNewBtn);                        
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

    }
}