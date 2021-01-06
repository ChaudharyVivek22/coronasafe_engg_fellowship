const fs = require("fs");

/* Setup Date module */
const getDate = () => {
  let today = new Date();
  return today.toISOString().slice(0, 10);
};

/* ALL FUNCTIONS FOR TODO */
const DB_PATH = "./database.json";

const initFileSys = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, `{"inProgress":[],"allCompleted":[]}`);
  }
};

const getData = () => {
  const contents = fs.readFileSync(DB_PATH);
  const data = JSON.parse(contents);
  return data;
};

const setData = (data) => {
  const dataString = JSON.stringify(data);
  fs.writeFileSync(DB_PATH, dataString);
};

// command add
const addTodo = (task) => {
  if (task === undefined || task == "") {
    console.log("Error: Missing todo string. Nothing added!");
  } else {
    let data = getData();
    data.inProgress.push(task);
    setData(data);
    console.log(`Added todo: "${task}"`);
  }
};

// command ls
const showRemainTodo = () => {
  let data = getData().inProgress;
  let len = data.length;
  data = data.reverse();
  if (len > 0) {
    data.forEach((item, index) => {
      console.log(`[${len - index}] ${item}`);
    });
  } else {
    console.log("There are no pending todos!");
  }
};

// command del
const deleteTodo = (todoNum) => {
  let data = getData();
  if (todoNum > data.inProgress.length || todoNum == 0) {
    console.log(`Error: todo #${todoNum} does not exist. Nothing deleted.`);
  } else if (todoNum === undefined || todoNum === null) {
    console.log("Error: Missing NUMBER for deleting todo.");
  } else {
    data.inProgress.splice(todoNum - 1, 1);
    setData(data);
    console.log(`Deleted todo #${todoNum}`);
  }
};

// command done
const completeTodo = (todoNum) => {
  let data = getData();
  if (todoNum > data.inProgress.length || todoNum == 0) {
    console.log(`Error: todo #${todoNum} does not exist.`);
  } else if (todoNum === undefined || todoNum === null) {
    console.log("Error: Missing NUMBER for marking todo as done.");
  } else {
    let completedTask = data.inProgress.splice(todoNum - 1, 1);
    data.allCompleted.push(completedTask[0]);
    setData(data);
    console.log(`Marked todo #${todoNum} as done.`);
  }
};

// command help
const showUsage = () => {
  console.log("Usage :-");
  console.log(`$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`);
};

// command report
const showStats = () => {
  let todayDate = getDate();
  let data = getData();
  let pending = data.inProgress.length;
  let completed = data.allCompleted.length;
  console.log(`${todayDate} Pending : ${pending} Completed : ${completed}`);
};

const showHTML = () => {
  let data = getData();
  let inP = data.inProgress;
  let allc = data.allCompleted;
  inP.forEach((item) => {
    console.log(`<li>${item}</li>`);
  });
  allc.forEach((item) => {
    console.log(`<li>${item}</li>`);
  });
};

/* TODO APP STARTS HERE */
let command = process.argv[2];
let argument = process.argv[3];
initFileSys();
switch (command) {
  case "add":
    addTodo(argument);
    break;
  case "ls":
    showRemainTodo(argument);
    break;
  case "del":
    deleteTodo(argument);
    break;
  case "done":
    completeTodo(argument);
    break;
  case "help":
    showUsage();
    break;
  case "report":
    showStats();
    break;
  case "html":
    showHTML();
    break;
  case undefined:
    showUsage();
    break;
  default:
    console.log("\x1b[91mCommand not found!!\x1b[0m");
    break;
}
