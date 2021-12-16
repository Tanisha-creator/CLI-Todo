//const { create } = require("domain");
const fs = require("fs");
const args = process.argv;
//console.log(args);
const cwd = args[1].slice(0,-7);
//console.log(cwd);

if(fs.existsSync(cwd+'task.txt') === false){
    // creates task.txt
    let createStream = fs.createWriteStream('task.txt');
    createStream.end();
}

if(fs.existsSync(cwd+'completed.txt') === false){
    // creates complted.txt
    let createStream = fs.createWriteStream('completed.txt');
    createStream.end();
}

const infoFunction = () =>{
    const usageText = `
    Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics
    `

console.log(usageText);
};

// Function to list all tasks
const listOfTasks = () =>{
    let data = [];         // initially there is no tasks
    const fileData = fs.readFileSync(cwd+'task.txt').toString();
    data = fileData.split('\n');

    let filteredData = data.filter(function(value){
        return value !== '';
    });

    if(filteredData.length ===0){
        console.log("There are no pending tasks!");
    }

    for(let i=0;i<filteredData.length;i++){
        console.log(i+1 + '. '+filteredData[i]);
    }
};

// Function to add new task
const addTasks = () =>{
    const pr = args[3];
    const newTask = args[4];
    if(newTask){
        let data =[];
        const fileData = fs.readFileSync(cwd+'task.txt').toString();
        
        // write old tasks and new task in task.txt
        fs.writeFile(cwd+'task.txt',fileData + newTask + ' [' + pr +']' + '\n', 
        function (err){
            if(err) throw err;

            console.log('Added task: "' + newTask + '" with priority '+ pr);
        });
    }
    else{
        console.log("Error: Missing tasks string. Nothing added!")
    }
};

// Function to delete a task
const deleteTask = () =>{
    const deleteIndex = args[3];
    if(deleteIndex){
        let data =[];
        const fileData = fs.readFileSync(cwd+'task.txt').toString();
        data = fileData.split('\n');

        let filteredData = data.filter(function(value){
            return value !=='';
        });
        
        // Check if the deleteIndex is invalid
        if(deleteIndex>filteredData.length || deleteIndex<1){
            console.log("Error: task with index #"+ deleteIndex + " does not exist. Nothing deleted.");
        }
        else{
            // Delete the task at deleteIndex
            filteredData.splice(filteredData.length-deleteIndex,1);
            const newData = filteredData.join('\n');
            fs.writeFile(cwd+'task.txt', newData, function(err){
                if(err) throw err;

                console.log("Deleted task #"+ deleteIndex);
            });
        }
    }
    else{
        console.log("Error: Missing NUMBER for deleting tasks.");
    }
};

// Function to mark a task as done
const taskDone = () =>{
    const doneIndex = args[3];

    if(doneIndex){
        let data = [];
        const fileData = fs.readFileSync(cwd+'task.txt').toString();
        const doneTasks = fs.readFileSync(cwd+'completed.txt').toString();
        data = fileData.split('\n');
        const filteredData = data.filter(function(value){
            return value !== '';
        });
        
        // Check if the doneIndex is invalid
        if (doneIndex > filteredData.length || doneIndex <1) {
            console.log('Error: no incomplete item with index #'+ doneIndex +' exists.');
        }
        else { 
            // Removing the done task from task.txt
            const deleted = filteredData.splice(filteredData.length - doneIndex, 1);
            const newData = filteredData.join('\n');
            fs.writeFile(cwd + 'task.txt',newData,function(err) {
                    if (err) throw err;
                },
            );
            // Writing the done task in completed.txt
            fs.writeFile(cwd + 'completed.txt',deleted + '\n' + doneTasks,function(err) {
                    if (err) throw err;
                    console.log('Marked item as done.');
                }
            );
        }
    } else {
        console.log("Error: Missing NUMBER for marking tasks as done.");
    }
};

// Function to print the report
const report = () => {
    let todoData = [];
    let doneData = [];
    const todo = fs.readFileSync(cwd + 'task.txt').toString();
    const done = fs.readFileSync(cwd + 'completed.txt').toString();
    todoData = todo.split('\n');
    doneData = done.split('\n');
    let filterTodoData = todoData.filter(function(value) {
        return value !== '';
    });
    let filterDoneData = doneData.filter(function(value) {
        return value !== '';
    });

    // Pending tasks
    console.log('Pending : ' + filterTodoData.length);
    for(let i=0;i<filterTodoData.length;i++){
        console.log(i+1 + '. '+ filterTodoData[i]);
    }
    // Completed tasks
    console.log('Completed : ' + filterDoneData.length);
    for(let i=0;i<filterDoneData.length;i++){
        console.log(i+1 + '. '+ filterDoneData[i].slice(0,-4));
    }
};
  
switch (args[2]) {
    case 'add':
        {
            addTasks();
            break;
        }
  
    case 'ls':
        {
            listOfTasks();
            break;
        }
  
    case 'del':
        {
            deleteTask();
            break;
        }
  
    case 'done':
        {
            taskDone();
            break;
        }
  
    case 'help':
        {
            infoFunction();
            break;
        }
  
    case 'report':
        {
            report();
            break;
        }
  
    default:
        {
            infoFunction();
        }
}