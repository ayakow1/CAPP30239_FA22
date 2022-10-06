/*
this is a
block comment
*/

let num = 100; //integer
let num1 = 200;

console.log(num1);

let anonFun = function () {
  console.log("hello");
};

anonFun();

(function () {
  console.log("Hello");
})(); //This loads function immediately

(() => console.log(100))(); //This loads function immediately

function foo() {
  console.log(num);
}

let foo1 = () => console.log(num);

foo1 = () => console.log(num1);

let arr = ["foo", 123, ["zar", "car"]];

console.log(arr[0]);

// set item in array
arr[1] = "barbar";

arr.push("par");

console.log(arr);

arr.splice(2, 1); // 2=delete 2nd index, 1=number of elements to delete

console.log(arr);

let newArr = ["cow", "turtle", "goat"];

for (let item of newArr) {
  console.log(item); // item is element
}

for (let i in newArr) {
  console.log(i + " " + newArr[i]); // i is number
}

newArr.forEach((item, i) => console.log(i + " " + item));

let obj = {
  name: "Jill",
  age: 85,
  job: "Cactus Hunter",
};

console.log(obj.name);
console.log(obj["name"]);

obj.job = "Barista";

for (let key in obj) {
  let value = obj[key];
  console.log(`${key}: ${value}`); //Template literal
}

//let txt1 = "hello" + key + " more text here" + foo;
//let txt2 = `Hello ${key} more text here ${foo}`;

let fall = 72;
console.log(typeof fall);

for (let i = 0; i < 10; i++) {
  console.log(i);
}

let val = 80;

if (val > 80) {
  console.log("good");
} else if (val > 50) {
  console.log("okay");
} else {
  console.log("terrible");
}

let y = val >= 80 ? console.log("good") : console.log("not good");

let newVar = document.getElementById("example");

newVar.innerHTML += "<h1>Hello World</h1><p>new paragraph</p>";
