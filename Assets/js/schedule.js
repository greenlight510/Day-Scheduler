class TimeblockObj {
  constructor(hour, todo) {
    this.hour = hour;
    this.todo = todo;
  }
}

window.onload = function() {
  const cTimeblocks = getCurrentTimeblocks();
  const cTime = moment();

  displayCurrentDate(cTime);
  displayTimeblockRows(cTime);

  document.querySelector('.container')
    .addEventListener('click', function(event) {
      containerClicked(event, cTimeblocks);
    });
  setTimeblockText(cTimeblocks);
};

function getCurrentTimeblocks() {
  const cTimeblocks = localStorage.getItem('timeblockObjects');
  return cTimeblocks ? JSON.parse(cTimeblocks) : [];
}

function displayCurrentDate(cTime) {
  document.getElementById('currentDay')
    .tContent = cTime.format('dddd, MMMM Do');
}

/*** Functions to display timeblock rows ***/
function displayTimeblockRows(cTime) {
  const cHour = cTime.hour();

  //Working hours 9am to 6pm
  for (let i = 9; i <= 18; i ++) {
    const timeblock = createTimeblockRow(i);
    const hourCol = createCol(createHourDiv(i), 1);
    const tArea = createCol(createTextArea(i, cHour), 10);
    const saveBtn = createCol(createSaveBtn(i), 1);
    appendTimeblockColumns(timeblock, hourCol, tArea, saveBtn);
    document.querySelector('.container').appendChild(timeblock);
  }
}

function createTimeblockRow(hourId) {
  const timeblock = document.createElement('div');
  timeblock.classList.add('row');
  timeblock.id = `timeblock-${hourId}`;
  return timeblock;
}

function createCol(element, colSize) {
  const col = document.createElement('div');
  col.classList.add(`col-${colSize}`,'p-0');
  col.appendChild(element);
  return col;
}

function createHourDiv(hour) {
  const hourCol = document.createElement('div');
  hourCol.classList.add('hour');
  hourCol.textContent = fHour(hour);
  return hourCol;
}

function fHour(hour) {
  const hString = String(hour);
  return moment(hString, 'h').format('hA');
}

function createTextArea(hour, cHour) {
  const tArea = document.createElement('textarea');
  tArea.classList.add(getTextAreaBackgroundClass(hour, cHour));
  return tArea;
}

function getTextAreaBackgroundClass(hour, cHour) {
  return hour < cHour ? 'past' 
    : hour === cHour ? 'present' 
    : 'future';
}

function createSaveBtn(hour) {
  const saveBtn = document.createElement('button');
  saveBtn.classList.add('saveBtn');
  saveBtn.innerHTML = '<i class="fas fa-save"></i>';
  saveBtn.setAttribute('data-hour', hour);
  return saveBtn;
}

function appendTimeblockColumns(timeblockRow, hourCol, textAreaCol, saveBtnCol) {
  const innerCols = [hourCol, textAreaCol, saveBtnCol];
  for (let col of innerCols) {
    timeblockRow.appendChild(col);
  }
}

/***Functions for local storage ***/
function containerClicked(event, timeblockList) {
  if (isSaveButton(event)) {
    const timeblockHour = getTimeblockHour(event);
    const textAreaValue = getTextAreaValue(timeblockHour);
    placeTimeblockInList(new TimeblockObj(timeblockHour, textAreaValue), timeblockList);
    saveTimeblockList(timeblockList);
  }
}

function isSaveButton(event) {
  return event.target.matches('button') || event.target.matches('.fa-save');
}

function getTimeblockHour(event) {
  return event.target.matches('.fa-save') ? event.target.parentElement.dataset.hour : event.target.dataset.hour;
}

function getTextAreaValue(timeblockHour) {
  return document.querySelector(`#timeblock-${timeblockHour} textarea`).value;
}

function placeTimeblockInList(newTimeblockObj, timeblockList) {
  if (timeblockList.length > 0) {
    for (let savedTimeblock of timeblockList) {
      if (savedTimeblock.hour === newTimeblockObj.hour) {
        savedTimeblock.todo = newTimeblockObj.todo;
        return;
      }
    }
  } 
  timeblockList.push(newTimeblockObj);
  return;
}


