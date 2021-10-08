// Init

const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hslCol = {blue: [207, 57], red: [0,50], orange: [39, 51], purple: [300, 47], teal: [180, 40], green: [107, 31], grey: [0, 53]};

var daysShowing = parseInt((document.body.offsetWidth - 513) / 60);
var prev_daysShowing = daysShowing;
var categories = JSON.parse(localStorage.categories);
var Date1 = new Date();
var backUpDate = Date1;
var Today = Date1.toDateString();

var app = document.querySelector(".app");
var datesRow = document.querySelector(".dates tr");
var container = document.querySelector(".menu ul");
var boardTable = document.querySelector(".board-table tbody");


// Start
create(Date1);

$(".menu ul").sortable({
    deactivate: function(e, ui) {
        var index = ui.item.index();
        var name = ui.item[0].dataset.name;
        var item = categories.find(x => x.name == name);

        categories = categories.filter(x => x.name != name);
        categories.splice(index, 0, item);
        
        redraw(Date1);
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
})

// Event Listener
window.addEventListener("keydown", event => {
    if (event.code == 'ArrowLeft') {
		left();
	}
    else if (event.code == "ArrowRight") {
        right();
    }
    else if (event.code == "Escape") {
        closePopUp();
    }
});

// Functions

function updateStorage() { localStorage.setItem("categories", JSON.stringify(categories)); }
    
// Edit Habit

var oldName;
function renameHabit() {
    var newName = $(".newHabit .habitname").first()[0].value;
    categories.find(x => x.name == oldName).name = newName;
    localStorage.setItem("categories", JSON.stringify(categories));
    
    redraw(Date1);
    closePopUp();
}

function drawAddHabitPopUp() {
    var popup = document.createElement("div");
    popup.className = "overlay"
    popup.innerHTML = `
    <div class="overlay">
        <div class="modal-dialog">
            <div class="modal-content" role="document">
                <div class="modal-header"><button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><a class="modal-title">Create Habit</a></div>
                    <div class="newHabit">
                    <div class="field"><a class="label">Habit</a><input type="text" class="habitname" name="habitname" placeholder="e.g. walk the dog" value="${name}" maxlength="40"></div>
                    <div class="field"><button class="modal-button" tabindex="0">Create Habit</button><a class="modal-button cancel">Cancel</a></div>
                    <div class="clear">
                    </div>
                </div>
            </div>
        </div>
    </div>`

    app.append(popup)
    $(".overlay :is(.close, .cancel)").click(closePopUp);
    $(".modal-button").click(addHabit);
}

function addHabit() {
    var name = $(".newHabit .habitname").first()[0].value;
    categories.push({name: name, color: "green", dates:{}})
    updateStorage();
    
    redraw(Date1);
    closePopUp();
}

function deleteHabit() {
    if (confirm(`Deleting ${oldName}?`)) {
        categories = categories.filter(x => x.name != oldName);
        updateStorage();
        redraw(Date1);
        closePopUp();
    }
}

function closePopUp() {
    document.querySelector(".overlay").remove();
}

function drawPopUp(element) {
    var name = element.closest(".menuItemLI").querySelector(".draggable span").innerText;
    oldName = name;
    var popup = document.createElement("div");
    popup.className = "overlay"
    popup.innerHTML = `
    <div class="overlay">
        <div class="modal-dialog">
            <div class="modal-content" role="document">
                <div class="modal-header"><button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><a class="modal-title">Edit Habit</a></div>
                    <div class="newHabit">
                    <div class="field"><a class="label">Habit</a><input type="text" class="habitname" name="habitname" placeholder="e.g. walk the dog" value="${name}" maxlength="40"></div>
                    <div class="field"><a class="delete-button"><i class="ion-close-round"></i><span>delete</span></a><button class="modal-button tabindex="0">Edit Habit</button><a class="modal-button cancel">Cancel</a></div>
                    <div class="clear">
                    </div>
                </div>
            </div>
        </div>
    </div>`
    
    app.append(popup)
    $(".overlay :is(.close, .cancel)").click(closePopUp);
    $(".modal-button").click(renameHabit);
    $(".delete-button").click(deleteHabit);
}

// Color Picker

function drawPicker(element) {
    var picker = `
    <div class="picker-wrapper" onmouseleave="this.remove()">
    <div class="twitter-picker twitter-picker">
      <div class="triangle"></div>
      <div style="padding: 15px 9px 9px 15px;"><span>
          <div title="green" tabindex="0" style="background: var(--green); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
        </span><span>
          <div title="blue" tabindex="0" style="background: var(--blue); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
        </span><span>
          <div title="orange" tabindex="0" style="background: var(--orange); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
        </span><span>
          <div title="red" tabindex="0" style="background: var(--red); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
        </span><span>
          <div title="purple" tabindex="0" style="background: var(--purple); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
        </span><span>
          <div title="grey" tabindex="0" style="background: var(--grey); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
        </span><span>
          <div title="teal" tabindex="0" style="background: var(--teal); height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"></div>
        </span>
        <div style="position: relative;"></div>
        <div style="clear: both;"></div>
      </div>
    </div>
  </div>`

    element.innerHTML = element.innerHTML + picker;
    $(".twitter-picker span").click((e) => colorChange(e.target));
}

function colorChange(element) {
    var name = element.closest(".menuItemLI").querySelector(".draggable span").innerText;
    var col = element.title
    
    categories.find(x => x.name == name).color = col;
    updateStorage();
    redraw(Date1)
}


function left() {
    Date1.setDate(Date1.getDate() - (daysShowing + 1));
    redraw(Date1)
}

function right() {
    Date1.setDate(Date1.getDate() + daysShowing + 1);
    redraw(Date1)
}

function redraw(date) {
    clear();
    date.setDate(date.getDate() + daysShowing + 1);
    create(date);
}

function clear() {
    datesRow.innerHTML = "";
    container.innerHTML = "";
    boardTable.innerHTML = "";
}

function create(date) {
    createDates(new Date(date.toDateString()));
    createCategories(date);
}

function createDates(dateObject) {
    for (let i = daysShowing; i >= 0; i--) {
        var td = document.createElement("td");
        td.innerHTML = '<div><div class="month"></div><div class="date"></div><div class="day"></div></div>';
        
        if (dateObject.toDateString() == Today) {
            td.className = "today";
            td.querySelector("div").className = "circle";
        }
        
        var day = Days[dateObject.getDay()];
        if (day == "Sat" || day == "Sun") {
            td.classList.add("weekend");
        }

        td.querySelector(".month").innerText = Months[dateObject.getMonth()];
        td.querySelector(".date").innerText = dateObject.getDate();
        td.querySelector(".day").innerText = day;
        datesRow.prepend(td);

        dateObject.setDate(dateObject.getDate() - 1);
    }
}

function createCategories(dateObject) {
    for (categorie of categories) {
        var li = document.createElement("li");
        li.className = "menuItemLI";
        li.setAttribute("data-name", categorie.name);
        li.innerHTML = `
            <div class="menuItem" id="controls"><i class="ion-edit"></i></div>
            <div class="color-picker-wrapper" id="controls" onclick="drawPicker(this)">
            <div class="color-picker" style="background-color: var(--${categorie.color});"></div>
            </div><a class="draggable">
            <div><span>Categorie</span>
            <div class="above"></div>
            </div>
            </a>
        `
        li.querySelector("span").innerText = categorie.name;
        li.querySelector(".ion-edit").onclick = e => drawPopUp(e.target);

        container.append(li);

        var newDate = new Date(dateObject.toDateString());
        createCells(createRow(), categorie, newDate);
    }
    Date1 = newDate;
}

function createRow() {
    var row = document.createElement("tr");
    boardTable.append(row);
    return row;
}

function createCells(row, categorie, dateObject) {
    for (let i = daysShowing; i >= 0; i--) {
        var td = document.createElement("td");
        let date = parseDate(dateObject);
        td.classList.add(categorie.color);

        if (dateObject.toDateString() == Today) { 
            td.classList.add("today");
        }

        var day = Days[dateObject.getDay()];
        if (day == "Sat" || day == "Sun") {
            td.classList.add("weekend");
        }

        td.setAttribute("data-date", date);
        td.addEventListener("click", (e) => toggleState(e.target, categorie));
        fillCell(td, categorie, date);
        row.prepend(td);

        dateObject.setDate(dateObject.getDate() - 1);
    }

    var index = daysShowing + 1;
    while (--index >= 0) {
        var td = row.children[index];
        var date = td.dataset.date;
        var first = true;
        
        if(categorie.dates[date] == null) continue;

        var streakList = streakCount(categorie, date);
        var streak = streakList.filter(x => x == "done").length;

        if (streak > categorie.longestStreak) categorie.longestStreak = streak;

        for (var state of streakList) {
            colorizeCell(row.children[index], categorie, streak, (first && streak > 0));
            first = false;
            if (state == "done") streak--;

            index--;
        }
    }
}

function parseDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
    if (isWrite) td.innerText = strike;
    td.style.background = `hsl(${hslCol[categorie.color][0]}, ${(strike * 10 / 2) + "%"}, ${hslCol[categorie.color][1]}%)`;
}

function streakState(categorie, date) {
    date.setDate(date.getDate() - 1);
    return categorie.dates[parseDate(date)];
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
    redraw(Date1);
}