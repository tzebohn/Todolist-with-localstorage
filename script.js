//localStorage.clear(); //Clear localstorage, for testing purposes only

//We need to read from local storage
let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];

//When program starts call the render function to display the saved tasks
document.addEventListener("DOMContentLoaded", renderTasks);

console.log(tasks)
//Function takes input and adds task to array.
function addTask() {
    //Get the current task from input
    let user_input = document.getElementById("myInput").value.trim(); //Remove trailing whitespaces

    if (!user_input){
        return;
    }
    //First check if the task already exists
    let exists = checkDuplicate(user_input); //exists is a boolean
    if (exists) {
        console.log('Task already exists. Are you sure you want to add anyways?');
    }
    else {
        tasks.push(user_input);
        //Update local storage
        updateLocalstorage();
        //Render it on the screen
        renderTasks();
        //Clear input after adding
        document.getElementById("myInput").value = "";
    }
}

//Function displays the current tasks in array by creating new div elements for each task in task-container
function renderTasks(){
    //Select the task-container to display
    let taskContainer = document.querySelector(".task-container");
    //Clear existing content to prevent rendering previous elements
    taskContainer.innerHTML="";

    //Iterate through the array and display each one
    tasks.forEach((element, index) =>{
        console.log(index, element);
        //Create a new div element
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        //Create check button
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");

        //Create task label for the task text
        const taskLabel = document.createElement("span");
        taskLabel.classList.add("task-text");
        taskLabel.textContent = element;
        taskLabel.dataset.index = index; //Assign an index for each taskLabel element, makes it easier for us to modify array
        taskLabel.addEventListener("dblclick", handleEdit);

        //Create a delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");

        //Add event listener for delete button
        deleteBtn.addEventListener("click", deleteTask);

        //Append elements to outer div
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskLabel);
        taskDiv.appendChild(deleteBtn);

        //Append to task container
        taskContainer.append(taskDiv);

    });
}

function handleEdit(e) {
    //Get the location of where the double click happened
    taskLabel = e.target; //returns where the event happened
    const index = taskLabel.dataset.index;

    //console.log("editing task text.");
    //Create an input element
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskLabel.textContent; 
    input.classList.add("task-edit");

    //Replace the span with the input
    taskLabel.replaceWith(input);
    input.focus(); //Automatically focus on the input

    //Save the edit when the user presses Enter or clicks away
    input.addEventListener("blur", () => {
        setTimeout(saveEdit, 0);
    });

    input.addEventListener("keydown", (e) =>{
        if (e.key === "Enter") {
            saveEdit();
        }
    });

    function saveEdit() {
        //console.log("Saving");
        //Convert the input back to a span with the new text
        const newLabel = document.createElement("span");
        const newText = input.value.trim(); //Get the new text from user
        newLabel.classList.add("task-text");
        newLabel.textContent = newText || tasks[index]; //Add the newText or if it's empty go back to old text
        newLabel.dataset.index = index;

        //Reattach the same event listener
        newLabel.addEventListener("dblclick", handleEdit);

        input.replaceWith(newLabel);

        //Update the array and localstorage
        tasks[index] = newLabel.textContent;
        updateLocalstorage();
    }


}

function deleteTask(e) {
    //Get the parent task div container
    const taskDiv = e.target.closest(".task"); //.task is the name of the div container we created that holds the checkbox, task-text and delete button

    //Find the span inside .task-text
    const taskLabel = taskDiv.querySelector(".task-text");
    //Get the text and index inside of taskLabel
    const text = taskLabel.textContent;
    const index = taskLabel.dataset.index;
    
    //Remove from the array and update localstorage
    tasks.splice(index, 1); //second parameter indicates to remove only 1 element
    updateLocalstorage();

    //Rerender everything
    renderTasks();

}

function updateLocalstorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

//Function checks for duplicates
function checkDuplicate(user_input) {
    //Iterate through the array
    for(let element of tasks) {
        if (element.toLowerCase() === user_input.toLowerCase()) {
            return true;
        }
    }
    return false;
}

