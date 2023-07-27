console.log("Starting goals js");
// localStorage.setItem("selClient",null);

$(document).ready(function(){
    
    $.ajax({
        type: "GET",
        url: "http://www.bksteckler.com/klokke/pullGoalTasks.php",
        async   : true,
        success: function (data) {

            console.log(data);

            data.forEach(function(item, index) {
            
                goalItem = "";
                    
                goalItem +=`<div class="main-items splitColumn-50" id="goal-${item.clientProjectId}">`;
                goalItem +=`    <div class="card-title splitColumn-100">`;
                goalItem +=`        <h2>${item.projectTitle}</h2>`;
                goalItem +=`    </div>`;
                goalItem +=`    <hr>`;
                goalItem +=`    <div class="pgoal-desc">${item.projectDescription}</div>`;
                goalItem +=`    <div class="pgoals-spec">`;
                goalItem +=`        <div class="pgoal-details">`;
                goalItem +=`            <div class="pgoal-details-lbl">Target Date: </div>`;
                goalItem +=`            <div class="pgoal-details-val">${getFormatLongDate(item.targetDate)}</div>`;
                goalItem +=`        </div>`;
                goalItem +=`        <div class="pgoal-details">`;
                goalItem +=`            <div class="pgoal-details-lbl">Est. Hours: </div>`;
                goalItem +=`            <div class="pgoal-details-val">${item.estHours}</div>`;
                goalItem +=`        </div>`;
                goalItem +=`        <div class="pgoal-details">`;
                goalItem +=`            <div class="pgoal-details-lbl">Goal Value: </div>`;
                goalItem +=`            <div class="pgoal-details-val">${item.goalValue}</div>`;
                goalItem +=`        </div>`;
                goalItem +=`    </div>`;
                goalItem +=`</div>`;

                $("#goal-objs").append(goalItem);
                
                //Loop and Set Tasks for each project                
                $.ajax({
                    type: "GET",
                    url: "http://www.bksteckler.com/klokke/pullProjectTasks.php",
                    async: true,
                    data: {"clientProjectId":"clientProjId-" + item.clientProjectId},
                    success: function (dataTasks) {
                        console.log(data);

                        taskDetails = "";

                        taskDetails +=`<div class="pgoal-tasks">`;
                        taskDetails +=`    <ol class="pTasks">`;

                        dataTasks.forEach(function(itemTask, index) {

                            taskDetails +=`     <li class="pgoal-tasks-dtls">`;
                            taskDetails +=`         <div class="pgoal-act-desc">${itemTask.taskName}</div>`;
                            taskDetails +=`         <div class="pgoal-task-sub">`;
                            taskDetails +=`             <div class="pgoal-act-date">${getFormattedDate(itemTask.taskStartDate)}</div>`;
                            taskDetails +=`             <div class="pgoal-act-hours">${itemTask.hourAlotment}</div>`;
                            taskDetails +=`         </div>`;
                            taskDetails +=`     </li>`;

                        });

                        taskDetails +=`    </ol>`;
                        taskDetails +=`</div>`;
                        taskDetails +=`<div class="add-pgoal-task">`;
                        taskDetails +=`    <img src="./images/blue-add-button.svg" alt="Add Personal Goal Task">`;
                        taskDetails +=`</div>`;
        
                        $(`#goal-${item.clientProjectId}`).append(taskDetails);

                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        taskDetails =`<div class="add-pgoal-task">`;
                        taskDetails +=`    <img src="./images/blue-add-button.svg" alt="Add Personal Goal Task">`;
                        taskDetails +=`</div>`;
        
                        $(`#goal-${item.clientProjectId}`).append(taskDetails);

                    }
                });
                
            });
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });

    $(document).on("click",".add-pgoal-task", function() {
        selectdGoal = $(this).parent(".main-items").attr("id");
        addTaskForm(selectdGoal);
    });

});

function addTaskForm(selectdGoal) {
    addNewForm ="";
    addNewFormId = `addForm-${selectdGoal}`;

    addNewForm += `<div class="new-pgoal-task" id="addForm-${selectdGoal}">`
    addNewForm += ` <div class="new-pgoal-title">Add Personal Goal Activity</div>`
    addNewForm += ` <form class="test">`
    addNewForm += `     <div class="new-fields goal-activity">`
    addNewForm += `         <label for="activity-desc">Goal Activity</label>`
    addNewForm += `         <input type="text" class="activity-desc" name="activity-desc" id="activity-desc">`
    addNewForm += `     </div>`

    addNewForm += `     <div class="new-fields goal-time">`
    addNewForm += `         <label for="activity-desc">Estimated Time (hrs)</label>`
    addNewForm += `         <input type="text" class="activity-hour" name="activity-desc" id="activity-desc">`
    addNewForm += `     </div>`

    addNewForm += `     <button type="button" class="submitBtn" id="addFormBtn-${selectdGoal}">Add New</button>`
    addNewForm += ` </form>`
    addNewForm += `</div>`

    $(addNewForm).insertBefore(`#${selectdGoal} .add-pgoal-task`);

    $(`#${selectdGoal} .add-pgoal-task`).addClass("hidden");

    $(document).on("click",`#addFormBtn-${selectdGoal}`, function() {
        
        selectdGoalForm = $(this).parent().parent().attr("id");
        selectdGoal = $(this).parent().parent().parent().attr("id");
        addNewFormSubmit(selectdGoalForm, selectdGoal);

    });

}

function addNewFormSubmit(submittedForm, selectdGoal) {
    alert(`form submitted: ${submittedForm}`);
    $(`#${selectdGoal} .add-pgoal-task`).removeClass("hidden");

    $(`#${submittedForm}`).remove();

}
