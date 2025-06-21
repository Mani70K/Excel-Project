let topRow = document.querySelector(".top_row");
// left col cells creation
let leftCol = document.querySelector(".left_col");
// grid
let grid = document.querySelector(".grid");
let displayArea = document.querySelector(".display-selected-cell");
let formulaBar = document.querySelector(".formula-bar");
let boldBtn = document.querySelector(".bold-btn");
let italicBtn = document.querySelector(".italic-btn");
let underlineBtn = document.querySelector(".underline-btn");
let fontSizeInput = document.querySelector(".font-size-input");
let fontFamilyInput = document.querySelector(".font-family-input");
let alignmentContainer = document.querySelector(".alignment-container");
let centerAlignBtn = document.querySelector(".center");
let addSheetBtn = document.querySelector(".add-sheet-btn");
let sheetList = document.querySelector(".sheets-list");

let lastActiveSheet = document.querySelector(".active-sheet");

for (let i = 0; i < 26; i++) {
  let div = document.createElement("div");
  div.setAttribute("class", "cell");
  div.textContent = String.fromCharCode(65 + i);
  topRow.appendChild(div);
}

for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.setAttribute("class", "cell");
  div.textContent = i;
  leftCol.appendChild(div);
}
// 2 d loop -> columns*rows

for (let i = 0; i < 100; i++) {
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  for (let j = 0; j < 26; j++) {
    let div = document.createElement("div");
    div.setAttribute("class", "cell");

    div.setAttribute("contentEditable", "true");
    //   every cell identification required
    div.setAttribute("rId", i);
    div.setAttribute("cId", j);
    row.appendChild(div);

    div.addEventListener("click", function (e) {
      formulaBar.value = div.textContent;
    });

    div.addEventListener("input", function (e) {
      formulaBar.value = div.textContent;
    });
  }
  grid.appendChild(row);
}

function initialRendering() {
  displayArea.value = "A1";
  let firstCell = document.querySelector(`.grid .cell[rId="0"][cId="0"]`);
  firstCell.style.minWidth = "4.8rem";
  firstCell.style.height = "1.21rem";
  firstCell.style.border = "2px solid green";
  centerAlignBtn.classList.add("selected");
  firstCell.focus();
}

let sheetDB = [];
function initialization() {
  initialRendering();
  let localDB = [];
  for (let i = 0; i < 100; i++) {
    let rowArr = [];
    for (let j = 0; j < 26; j++) {
      let cellObj = {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        color: "black",
        bgColor: "white",
        fontSize: 16,
        fontFamily: "arial",
        hAlign: "center",
        value: "",
        formula: "",
        children: [],
      };
      rowArr.push(cellObj);
    }
    localDB.push(rowArr);
  }
  sheetDB.push(localDB); // push the db of the first sheet
}
initialization();
let db=sheetDB[0];


function getrIdcIdAddress(address) {
  let cId = address.charCodeAt(0) - 65;
  let rId = Number(address.slice(1)) - 1;
  return {
    rId: rId,
    cId: cId,
  };
}

let allGridCells = document.querySelectorAll(".grid .cell");
for (let cell of allGridCells) {
  cell.addEventListener("click", function (e) {
    let previousAddress = displayArea.value;
    let obj = getrIdcIdAddress(previousAddress);

    let previousCell = document.querySelector(
      `.grid .cell[rId="${obj.rId}"][cId="${obj.cId}"]`
    );
    previousCell.style.minWidth = "5rem";
    previousCell.style.height = "1.4rem";
    previousCell.style.border = "0.1px solid gray";
    previousCell.style.borderRight = "none";
    previousCell.style.borderTop = "none";

    let rid = cell.getAttribute("rId");
    let cid = cell.getAttribute("cId");

    rid = Number(rid);
    cid = Number(cid);

    displayArea.value = String.fromCharCode(65 + cid) + (rid + 1);
    cell.style.minWidth = "4.8rem";
    cell.style.height = "1.21rem";
    cell.style.border = "2px solid green";

    let cellObj = db[rid][cid];

    fontSizeInput.value = cellObj.fontSize;
    fontFamilyInput.value = cellObj.fontFamily;
    boldBtn.classList.remove("selected");
    italicBtn.classList.remove("selected");
    underlineBtn.classList.remove("selected");

    let childObj = alignmentContainer.children;
    for (let child of childObj) {
      // iterate over all the alignment buttons and remove selected class
      child.classList.remove("selected");
    }

    if (cellObj.isBold) {
      boldBtn.classList.add("selected");
    }
    if (cellObj.isItalic) {
      italicBtn.classList.add("selected");
    }
    if (cellObj.isUnderline) {
      underlineBtn.classList.add("selected");
    }

    let TextAlignment = cellObj.hAlign; // Alignment of the cell

    // Now add selected class to the current selected button
    for (let child of childObj) {
      if (child.classList.contains(TextAlignment)) {
        child.classList.add("selected");
      }
    }
  });
}

formulaBar.addEventListener("input", function (e) {
  let currentCellAddress = displayArea.value;
  let obj = getrIdcIdAddress(currentCellAddress);
  let currentSelectedCell = document.querySelector(
    `.grid .cell[rId="${obj.rId}"][cId="${obj.cId}"]`
  );
  currentSelectedCell.textContent = formulaBar.value;
});

boldBtn.addEventListener("click", function (e) {
  let currentCellAddress = displayArea.value;
  let { rId, cId } = getrIdcIdAddress(currentCellAddress);
  let currentCell = document.querySelector(
    `.grid .cell[rId="${rId}"][cId="${cId}"]`
  );

  let currentCellObj = db[rId][cId];

  if (currentCellObj.isBold) {
    currentCellObj.isBold = false;
    currentCell.style.fontWeight = "normal";
    boldBtn.classList.remove("selected");
  } else {
    currentCellObj.isBold = true;
    currentCell.style.fontWeight = "bold";
    boldBtn.classList.add("selected");
  }
});

italicBtn.addEventListener("click", function (e) {
  let currentCellAddress = displayArea.value;
  let { rId, cId } = getrIdcIdAddress(currentCellAddress);
  let currentCell = document.querySelector(
    `.grid .cell[rId="${rId}"][cId="${cId}"]`
  );

  let currentCellObj = db[rId][cId];

  if (currentCellObj.isItalic) {
    currentCellObj.isItalic = false;
    currentCell.style.fontStyle = "normal";
    italicBtn.classList.remove("selected");
  } else {
    currentCellObj.isItalic = true;
    currentCell.style.fontStyle = "italic";
    italicBtn.classList.add("selected");
  }
});

underlineBtn.addEventListener("click", function (e) {
  let currentCellAddress = displayArea.value;
  let { rId, cId } = getrIdcIdAddress(currentCellAddress);
  let currentCell = document.querySelector(
    `.grid .cell[rId="${rId}"][cId="${cId}"]`
  );

  let currentCellObj = db[rId][cId];

  if (currentCellObj.isUnderline) {
    currentCellObj.isUnderline = false;
    currentCell.style.textDecoration = "none";
    underlineBtn.classList.remove("selected");
  } else {
    currentCellObj.isUnderline = true;
    currentCell.style.textDecoration = "underline";
    underlineBtn.classList.add("selected");
  }
});

fontSizeInput.addEventListener("change", function (e) {
  let fontSize = fontSizeInput.value;
  let currentCellAddress = displayArea.value;
  let { rId, cId } = getrIdcIdAddress(currentCellAddress);
  let currentCell = document.querySelector(
    `.grid .cell[rId="${rId}"][cId="${cId}"]`
  );
  let currentCellObj = db[rId][cId];
  currentCellObj.fontSize = fontSize;
  currentCell.style.fontSize = fontSize + "px";
  currentCell.style.lineHeight = fontSize + "px";
});

fontFamilyInput.addEventListener("change", function (e) {
  let fontFamily = fontFamilyInput.value;

  let currentCellAddress = displayArea.value;
  let { rId, cId } = getrIdcIdAddress(currentCellAddress);
  let currentCell = document.querySelector(
    `.grid .cell[rId="${rId}"][cId="${cId}"]`
  );
  let currentCellObj = db[rId][cId];
  currentCellObj.fontFamily = fontFamily;
  currentCell.style.fontFamily = fontFamily;
});

alignmentContainer.addEventListener("click", function (e) {
  if (e.target != alignmentContainer) {
    // this means that we are clicking on the alignment buttons only
    let classesArr = e.target.classList;
    let alignmentPosition = classesArr[classesArr.length - 1]; // left, center, right

    // current cell
    let currentCellAddress = displayArea.value;
    let { rId, cId } = getrIdcIdAddress(currentCellAddress);
    let currentCell = document.querySelector(
      `.grid .cell[rId="${rId}"][cId="${cId}"]`
    );

    let currentCellObj = db[rId][cId];

    currentCell.style.textAlign = alignmentPosition;
    currentCellObj.hAlign = alignmentPosition;

    let childObj = alignmentContainer.children;

    for (let child of childObj) {
      // iterate over all the alignment buttons and remove selected class
      child.classList.remove("selected");
    }
    e.target.classList.add("selected"); // now, add selected button to the clicked button
  }
});

addSheetBtn.addEventListener("click", function (e) {
  lastActiveSheet.classList.remove("active-sheet");
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet");
  sheet.classList.add("active-sheet");
  sheet.setAttribute("sheetidx", sheetList.children.length);
  sheet.textContent = "Sheet " + (sheetList.children.length + 1);
  lastActiveSheet = sheet;
  sheetList.appendChild(sheet);
  initialization();
  db=sheetDB[sheetList.children.length - 1]; // get the db of the newly created sheet
  setinitUI(); // set the UI of the newly created sheet
});

sheetList.addEventListener("click", function (e) {
  if(e.target!=sheetList){
    lastActiveSheet.classList.remove("active-sheet");
    e.target.classList.add("active-sheet");
    let clickedSheetIdx=e.target.getAttribute("sheetidx");
    lastActiveSheet = e.target;

    db=sheetDB[clickedSheetIdx];
    setinitUI(); // set the UI of the newly selected sheet
  }
});

function setinitUI() {
  for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 26; j++) {
          //    set all the properties on ui with matching rid,cid
          let cellObject = db[i][j];
          let tobeChangedCell = document.querySelector(`.grid .cell[rId='${i}'][cId='${j}']`);
          tobeChangedCell.innerText = cellObject.value;
          tobeChangedCell.style.color = cellObject.color;
          tobeChangedCell.style.backgroundColor = cellObject.backgroundColor;
          tobeChangedCell.style.fontFamily = cellObject.fontFamily;
          tobeChangedCell.style.textAlign = cellObject.halign;
          tobeChangedCell.style.textDecoration = cellObject.underline == false ? "none" : "underline";
          tobeChangedCell.style.fontStyle = cellObject.italic == false ? "normal" : "italic";
          tobeChangedCell.style.fontSize = cellObject.fontSize;
      }
  }
}
