// Init
import * as Template from "./Templates.js" 

const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hslCol = {blue: [207, 57], red: [0,50], orange: [39, 51], purple: [300, 47], teal: [180, 40], green: [107, 31]};

var daysShowing = parseInt((document.body.offsetWidth - 513) / 60);
var prev_daysShowing = daysShowing;
var categories = JSON.parse(localStorage.categories);
var date = new Date();
var today = date.toDateString();

var app;
var datesRow;
var container;
var boardTable;

$(function() {
    app = $(".app");
    datesRow = $(".dates tr");
    container = $(".menu ul");
    boardTable = $(".board-table tbody");

    $(".newhabit").click(drawAddHabitPopUp);
    $(".prev").click(left);
    $(".next").click(right);

    create(date);
});




// Event Listeners

$(".menu ul").sortable({
    deactivate: function(e, ui) {
        var index = ui.item.index();
        var name = ui.item[0].dataset.name;
        var item = categories.find(x => x.name == name);

        categories = categories.filter(x => x.name != name);
        categories.splice(index, 0, item);
        
        redraw(date);
        updateStorage();
    }
});

$(window).resize(() => {
    daysShowing = parseInt((document.body.offsetWidth - 513) / 60); 
      if (daysShowing != prev_daysShowing) {
        clear();
        create(new Date());       
        prev_daysShowing = daysShowing;
      }
});

window.addEventListener("keydown", event => {
    if (event.code === 'ArrowLeft') {
		left();
	}
    else if (event.code === "ArrowRight") {
        right();
    }
    else if (event.code === "Escape") {
        closePopUp();
    }
});




// Functions

    // Edit Habit

var oldName;
function renameHabit() {
    var newName = $(".newHabit .habitname").first()[0].value;
    categories.find(x => x.name == oldName).name = newName;
    localStorage.setItem("categories", JSON.stringify(categories));
    
    redraw(date);
    closePopUp();
}

function drawAddHabitPopUp() {
    var popup = document.createElement("div");
    popup.className = "overlay"
    popup.innerHTML = Template.habitPopUp;

    app.append(popup)
    $(".overlay :is(.close, .cancel)").click(closePopUp);
    $(".modal-button").click(addHabit);
}

function addHabit() {
    var name = $(".newHabit .habitname").first()[0].value;
    categories.push({name: name, color: "green", dates:{}})
    updateStorage();
    
    redraw(date);
    closePopUp();
}

function deleteHabit() {
    if (confirm(`Deleting ${oldName}?`)) {
        categories = categories.filter(x => x.name != oldName);
        updateStorage();
        redraw(date);
        closePopUp();
    }
}

function closePopUp() {
    $(".overlay").remove();
}

function drawEditPopUp(element) {
    var name = $(element).closest(".menuItemLI").find(".draggable span").text();
    oldName = name;
    var popup = document.createElement("div");
    popup.className = "overlay"
    popup.innerHTML = Template.editPopUp(name);
    
    $(popup).find(".overlay :is(.close, .cancel)").click(closePopUp);
    $(popup).find(".modal-button").click(renameHabit);
    $(popup).find(".delete-button").click(deleteHabit);
    app.append(popup)
}

    // Color Picker

function drawPicker(element) {
    element.innerHTML = element.innerHTML + Template.colorPicker;
    $(".twitter-picker span").click((e) => colorChange(e.target));
    $(".picker-wrapper").mouseleave((e) => e.target.remove());
}

function colorChange(element) {
    var name = $(element).closest(".menuItemLI").find(".draggable span").text();
    var col = element.title
    
    categories.find(x => x.name == name).color = col;
    updateStorage();
    redraw(date)
}


function left() {
    date.setDate(date.getDate() - (daysShowing + 1));
    redraw(date)
}

function right() {
    date.setDate(date.getDate() + daysShowing + 1);
    redraw(date)
}

function redraw(date) {
    clear();
    date.setDate(date.getDate() + daysShowing + 1);
    create(date);
}

function clear() {
    datesRow.html("");
    container.html("");
    boardTable.html("");
}

function create(date) {
    createDates(new Date(date.toDateString()));
    createCategories(date);
}

function createDates(dateObject) {
    for (let i = daysShowing; i >= 0; i--) {
        var td = document.createElement("td");
        td.innerHTML = '<div><div class="month"></div><div class="date"></div><div class="day"></div></div>';
        
        if (dateObject.toDateString() == today) {
            td.className = "today";
            $(td).find("div").className = "circle";
        }
        
        var day = Days[dateObject.getDay()];
        if (day == "Sat" || day == "Sun") {
            td.classList.add("weekend");
        }

        $(td).find(".month").text(Months[dateObject.getMonth()]);
        $(td).find(".date").text(dateObject.getDate());
        $(td).find(".day").text(day);
        
        datesRow.prepend(td);
        dateObject.setDate(dateObject.getDate() - 1);
    }
}

function createCategories(dateObject) {
    for (let categorie of categories) {
        var li = document.createElement("li");
        li.className = "menuItemLI";
        li.setAttribute("data-name", categorie.name);
        li.innerHTML = Template.categorieContainer(categorie);

        $(li).find(".color-picker-wrapper").click((e) => drawPicker(e.target));
        $(li).find(".ion-edit").click((e) => drawEditPopUp(e.target));
        ;
        $(li).find("span").text(categorie.name);


        container.append(li);

        var newDate = new Date(dateObject.toDateString());
        createCells(createRow(categorie), categorie, newDate);
    }
    date = newDate;
}

function createRow(categorie) {
    var row = document.createElement("tr");
    row.addEventListener("click", (e) => toggleState(e.target, categorie));


    boardTable.append(row);
    return row;
}

function createCells(row, categorie, dateObject) {
    for (let i = daysShowing; i >= 0; i--) {
        var td = document.createElement("td");
        let date = parseDate(dateObject);
        td.classList.add(categorie.color);

        // today
        if (dateObject.toDateString() == today) { 
            td.classList.add("today");
        }

        // Weekend
        var day = Days[dateObject.getDay()];
        if (day == "Sat" || day == "Sun") {
            td.classList.add("weekend");
        }

        td.setAttribute("data-date", date);
        fillCell(td, categorie, date);
        row.prepend(td);
        dateObject.setDate(dateObject.getDate() - 1);
    }

    colorizeRow(row, categorie);
}


function colorizeRow(row, categorie, date) {
    var index = daysShowing + 1;

    while (--index >= 0) {
        var date = row.children[index].dataset.date;
        if(categorie.dates[date] == null) continue;

        index = colorizeStreak(row, categorie, date, index);
    }
}

function colorizeStreak(row, categorie, date, index) {
    var stateList = streakCount(categorie, date);
    var streak = stateList.filter(x => x == "done").length;
    if (streak > categorie.longestStreak) categorie.longestStreak = streak;

    for (var i in stateList) {
        if (index < 0) return;

        colorizeCell(row.children[index], categorie, streak, (i == 0 && streak > 0));

        if (stateList[i] == "done") streak--;
        index--;
    }
    return index;
}

function fillCell(td, categorie, date) {
    var state = categorie.dates[date];
    
    if (state == null) {
        td.setAttribute("data-descr-done", categorie.name);
        return
    } else if (state == "done") {
        td.classList.add("done");
        td.setAttribute("data-descr-done", "skip");
    } else if (state == "skip") {
        td.classList.add("skip");
        td.setAttribute("data-descr-done", "unmark");
    }
}

function streakCount(categorie, date) {
    var dateObject = new Date(date);
    var streak = [];

    while(true) {
        var state = categorie.dates[parseDate(dateObject)];
        if (state == null) break;

        streak.push(state);
        dateObject.setDate(dateObject.getDate() - 1);
    }
    return streak;
}

function colorizeCell(td, categorie, strike, isWrite) {
    if (isWrite) {
        let element = document.createElement("p");
        element.innerText = strike;
        element.className = "streak-count";
        td.append(element);
    }
    td.style.background = `hsl(${hslCol[categorie.color][0]}, ${(strike * 10 / 2) + "%"}, ${hslCol[categorie.color][1]}%)`;
}

function toggleState(td, categorie) {
    var classList = td.classList;

    if (classList.contains("skip")) { // uncheck
        classList.remove("skip");
        td.setAttribute("data-descr-done", categorie.name);

        delete categorie.dates[td.dataset.date]
        
    } else if (classList.contains("done")) { // skip
        classList.add("skip");
        classList.remove("done");
        td.setAttribute("data-descr-done", "unmark");

        categorie.dates[td.dataset.date] = "skip"
    } else { // done
        classList.add("done");
        td.setAttribute("data-descr-done", "skip");

        categorie.dates[td.dataset.date] = "done";
    }

    updateStorage();
    redraw(date);
}




function parseDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function updateStorage() { localStorage.setItem("categories", JSON.stringify(categories)); }