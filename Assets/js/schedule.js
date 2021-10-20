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

/*** functions for displaying all timeblock rows ***/
function displayTimeblockRows(cTime) {
  const cHour = cTime.hour();

  //working hours are 9-5 or 9-17
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

function getTextAreaBackgroundClass(hour, currentHour) {
  return hour < currentHour ? 'past' 
    : hour === currentHour ? 'present' 
    : 'future';
}

