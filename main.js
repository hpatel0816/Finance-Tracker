// Finance Tracker Project

// Global Variables
var incomeArr = [];
var expenseArr = [];
var dataType = 'income';

// HTML Element Variables
var incomeSelectEl = document.getElementById('income-select')
var expenseSelectEl = document.getElementById('expense-select')

// EventListeners
incomeSelectEl.addEventListener('click', selectIncome);
expenseSelectEl.addEventListener('click', selectExpense);
document.getElementById('add-btn').addEventListener('click', processData);

function selectIncome() {
  //Make income option active
  incomeSelectEl.classList.add('active');
  expenseSelectEl.classList.remove('active');
  dataType = 'income';
}

function selectExpense() {
  //Make expense option active
  expenseSelectEl.classList.add('active');
  incomeSelectEl.classList.remove('active');
  dataType = 'expense';
}

function processData() {
  // HTML element Variables
  var inputTitle = document.getElementById('title').value
  var inputAmount = document.getElementById('amount').value
  var inputDate = document.getElementById('date').value

  // Check if the input boxes are empty
  if (inputTitle == '' || inputAmount == '' || inputDate == ''){
    alert('You must fill in all boxes.');
  } else {
    if (dataType == 'income') {
      // Add data to income array
      incomeArr.push({
        title: inputTitle,
        amount: roundNum(+inputAmount),
        date: inputDate
      })
      // Display data entered
      updateDisplayTable();
      // Display the data stats
      displayInfo();
      // Display income to expense ratio
      drawPieChart();
      // Graph the data
      graphData();
    } else if (dataType == 'expense') {
      // Add data to expense array
      expenseArr.push({
        title: inputTitle,
        amount: roundNum(+inputAmount),
        date: inputDate
      })
      // Display data entered
      updateDisplayTable();
      // Display the data stats
      displayInfo();
      // Display income to expense ratio
      drawPieChart();
      // Graph the data
      graphData();
    }
  }
}

function updateDisplayTable() {
  //HTML element Variables
  var titleDisplay = document.getElementById('title-output')
  var amountDisplay = document.getElementById('amount-output')
  var dateDisplay = document.getElementById('date-output')
  
  // Check for dataType (income/expense) and display data accordingly

  // Income data display
  if (dataType == 'income'){
    var incomeData = incomeArr[incomeArr.length - 1];
    // Add income elements
    addTableElements('income', '+', incomeData, 'mediumseagreen');
    
  // Expense data display
  } else if (dataType == 'expense'){
    var expenseData = expenseArr[expenseArr.length - 1];
    // Add expense elements
    addTableElements('expense', '-', expenseData, 'crimson');
  }

  // Add data to output table
  function addTableElements(type, sign, data, color){
    titleDisplay.innerHTML += '<td class="' + type + '-element">' + data.title + '</td>';
    amountDisplay.innerHTML += '<td class="' + type + '-element">'+ sign + '$' + data.amount + '</td>';
    dateDisplay.innerHTML += '<td class="' + type + '-element">' + data.date + '</td>';

    var elements = document.getElementsByClassName(type + "-element");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.color = color;
      elements[i].style.fontWeight = 'bold';
    }
  }
}

function displayInfo() {
  // HTML element Variables
  var incomeDisplay = document.getElementById('income')
  var expenseDisplay = document.getElementById('expense')
  var balanceDisplay = document.getElementById('balance')

  // Display the info
  incomeDisplay.innerHTML = '$' + roundNum(incomeTotal());
  expenseDisplay.innerHTML = '$' + roundNum(expenseTotal());
  balanceDisplay.innerHTML = '$' + roundNum(totalBalance());
}

function roundNum(value){
  // Round value to 2 decimals
  return Math.round(value * 100) / 100;
}

// Calculate income
function incomeTotal(){
  var value = 0;
  for (var i = 0; i < incomeArr.length; i++){
    value += incomeArr[i].amount
  }
  return value;
}

// Calculate expense
function expenseTotal(){
  var value = 0;
  for (var i = 0; i < expenseArr.length; i++){
    value += expenseArr[i].amount
  }
  return value;
}

// Calculate balance
function totalBalance(){
  var income = incomeTotal();
  var expense = expenseTotal();

  var balance = income - expense;
  return balance;
}

// Visulaize data through pie chart
function drawPieChart() {
  // Canvas setup
  let cnv = document.getElementById('pie-chart');
  let ctx = cnv.getContext('2d');
  cnv.width = 150;
  cnv.height = 150;

  // Set Variables for Pie Chart
  var income = incomeTotal();
  var expense = expenseTotal();

  var pieRadius = 75;
  var dataTotal = income + Math.abs(expense);
  var incomeProportion = income / dataTotal;
  var expenseProportion = Math.abs(expense) / dataTotal;

  var startAngle = 0;
  var endAngle;

  // Draw income segment
  endAngle = startAngle + incomeProportion;
  
  ctx.fillStyle = 'mediumseagreen';
  ctx.beginPath();
  ctx.moveTo(cnv.width/2, cnv.height/2);
  ctx.arc(cnv.width/2, cnv.width/2, pieRadius, startAngle * 2 * Math.PI, endAngle * 2 * Math.PI);
  ctx.lineTo(cnv.width/2, cnv.height/2);
  ctx.fill();

  // Draw expense segment
  startAngle = endAngle;
  endAngle = startAngle + expenseProportion;
  
  ctx.fillStyle = 'crimson';
  ctx.beginPath();
  ctx.moveTo(cnv.width/2, cnv.height/2);
  ctx.arc(cnv.width/2, cnv.width/2, pieRadius, startAngle * 2 * Math.PI, endAngle * 2 * Math.PI);
  ctx.lineTo(cnv.width/2, cnv.height/2);
  ctx.fill();

  // Draw white circle to create donught shape
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(cnv.width/2, cnv.height/2, 40, 0, 2*Math.PI);
  ctx.fill();
}

// Financial History Graph
function graphData(){
  // Canvas setup
  var ctx = document.getElementById('myChart').getContext('2d');
  ctx.width = 550;
  ctx.height = 350;

  // Income array data points
  var incomeDataPoints = [];
  for (var i = 0; i < incomeArr.length; i++){
    getDataPoints(incomeDataPoints, incomeArr[i], i)
  }
  // Expense array data points
  var expenseDataPoints = [];
  for (var i = 0; i < expenseArr.length; i++){
    getDataPoints(expenseDataPoints, expenseArr[i], i)
  }

  // Function to get data points
  function getDataPoints(array, element, index){
    array.push({
      x: index + 1,
      y: element.amount
    })
    return array;
  }

  // Start lines from (0,0)
  incomeDataPoints.unshift({x:0, y:0})
  expenseDataPoints.unshift({x:0, y:0})

  // Create graph using chart.js
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Income',
            data: incomeDataPoints,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', 
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }, 
        {
            label: 'Expense',
            data: expenseDataPoints,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
            duration:3000
        },
        responsive:false,
        maintainAspectRatio: false
    },
  });
}
