const gridSizeY = 8;
const gridSizeX = 8;
const BACKSPACE = 8;

function parseRange(range) {
    const parts = range.split('..');
    if (parts.length === 2) {
        const start = parseInt(parts[0], 10);
        const end = parseInt(parts[1], 10);
        return Array.from({ length: end - start }, (_, i) => start + i);
    } else {
        return [parseInt(range, 10)];
    }
}

function product(arrays) {
    return arrays.reduce((acc, curr) => {
        return acc.flatMap(a => curr.map(b => [...a, b]));
    }, [[]]);
}

function coords(input) {
    const cleanedInput = input.replace(/[()]/g, '');
    const parts = cleanedInput.split(',').map(part => part.trim());
    const parsedLists = parts.map(part => parseRange(part));
    return product(parsedLists);
}


const words = [
  { num: 1, clue: "Lasso or persuade (3 words)", cells: coords("(0..8, 0)"), solution: "TOROPEIN", across: true },
  { num: 2, clue: "Midnight to noon", cells: coords("(0..2, 1)"), solution: "AM", across: true },
  { num: 3, clue: "Horrified outcry (2 words)", cells: coords("(4..8, 1)"), solution: "OHNO", across: true },
  { num: 4, clue: "Name that sounds like a data serialization format", cells: coords("(0..5, 2)"), solution: "JASON", across: true },
  { num: 5, clue: "A price tag at home might say \"99 _\"", cells: coords("(6..8, 2)"), solution: "KR", across: true },
  { num: 6, clue: "Ethnic group in Tanzania and Kenya", cells: coords("(2..8, 3)"), solution: "MAASAI", across: true },
  { num: 7, clue: "Suffix for an ideology", cells: coords("(2..5, 4)"), solution: "ISM", across: true },
  { num: 8, clue: "Topper or beanie", cells: coords("(0..3, 5)"), solution: "HAT", across: true },
  { num: 9, clue: "Global community of Muslims", cells: coords("(4..8, 5)"), solution: "UMMA", across: true },
  { num: 10, clue: "French castle getaway (2 words)", cells: coords("(0..8, 6)"), solution: "ACHATEAU", across: true },
  { num: 11, clue: "\"The\", in Toulouse", cells: coords("(0..2, 7)"), solution: "LE", across: true },
  { num: 12, clue: "Catches wind of", cells: coords("(3..8, 7)"), solution: "HEARS", across: true },

  { num: 1, clue: "Famous marble mausoleum (2 words)", cells: coords("(0..1, 0..8)"), solution: "TAJMAHAL", across: false },
  { num: 13, clue: "German grandmother", cells: coords("1, 0..3)"), solution: "OMA", across: false },
  { num: 14, clue: "Hidden advantage, in a saying", cells: coords("1, 5..8)"), solution: "ACE", across: false },
  { num: 15, clue: "Single British independent rock band member?", cells: coords("2, 2..7)"), solution: "SMITH", across: false },
  { num: 16, clue: "The saddest closure of our time", cells: coords("3, 2..5)"), solution: "OAS", across: false },
  { num: 17, clue: "Sound of realization", cells: coords("3, 6..8)"), solution: "AH", across: false },
  { num: 18, clue: "Amazing (2)", cells: coords("(4, 0..8)"), solution: "PONAMUTE", across: false },
  { num: 19, clue: "Canadian \"Hmm?\"", cells: coords("(5, 0..2)"), solution: "EH", across: false },
  { num: 20, clue: "\"_ culpa\" (Latin apology)", cells: coords("5, 5..8)"), solution: "MEA", across: false },
  { num: 21, clue: "Back home", cells: coords("(6, 0..8)"), solution: "INKALMAR", across: false },
  { num: 22, clue: "Sushi wrapper", cells: coords("(7, 0..4)"), solution: "NORI", across: false },
  { num: 23, clue: "Shorthand for upside down-country", cells: coords("(7, 5..8)"), solution: "AUS", across: false },
];

function checkSolution(obj) {
    const joinedText = obj.cells.map(cell => {
        const cellElement = document.querySelector(cellToClassName(cell));
        return cellElement ? cellElement.querySelector(".cell--content").textContent : '';
    }).join('');

    return joinedText === obj.solution;
}

function allAnswersCorrect() {
  for (let i = 0; i < words.length; i++) {
    if (!checkSolution(words[i])) {
      return false;
    }
  }
  return true;
}

// TODO: check if puzzle is filled
// based on this set popup contebnts

// T O R O P E I N
// A M · · O H N O
// J A S O N · K R
// M · M A A S A I
// A · I S M · L ·
// H A T · U M M A
// A C H A T E A U
// L E · H E A R S
//
// AUS - Shorthand for upside down-country
// EH - Canadian "Hmm?"
// NORI - Sushi wrapper
// ACHATEAU - French castle getaway
// ACE - Hidden advantage, in a saying
// LE - "The", in Toulouse
// AL - "The", in Cairo
// HEARS - Catches wind of
// HAT - Topper or beanie
// OMA - German grandmother
// AM - Midnight to noon
// UMMA - Global community of Muslims
// MEA -
// TO ROPE IN - Lasso or persuade (3 words)
// OH NO - Horrified outcry (2 words)
// TAJ MAHAL - Famous marble mausoleum (2 words)
// OAS - No longer open
// SMITH -
// IN KALMAR - King's Grill descriptor (2)

function flatten(words) {
    return words.reduce((acc, word) => {
        return acc.concat(word.cells);
    }, []);
}

function isIn(coordinate, flattenedCells) {
    return flattenedCells.some(cell => cell[0] === coordinate[0] && cell[1] === coordinate[1]);
}

function whereNotIsIn(coordinates, words) {
    const flattenedCells = flatten(words);
    return coordinates.filter(coordinate => !isIn(coordinate, flattenedCells));
}

const fullGrid = coords("(0..8, 0..8)");
const neverUsedCells = whereNotIsIn(fullGrid, words);

function allCellsAreFilled(targetText) {
    const cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
        if (cell.classList.contains('black')) {
            continue;
        }

        const contentElement = cell.querySelector('.cell--content');

        if (contentElement) {
            const textContent = contentElement.textContent.trim();
            if (textContent === '') {
                return false;
            }
        }
    }

    return true;
}

function cellToClassName(cell) {
  const [x, y] = cell;
  return (`.cell[data-x="${x}"][data-y="${y}"]`);
}
function wordToClassName(word) {
    const orientation = word.across ? "across" : "down";
    const wordString = `word--${word.num}-${orientation}`;
    return wordString;
}

function whereCellIsInWord(cell) {
    const wordNumbers = [];

    for (const word of words) {
      for (const wordCell of word.cells) {
        if (wordCell[0] === cell[0] && wordCell[1] === cell[1]) {
          wordNumbers.push(word);
          break;
        }
      }
    }

    return wordNumbers;
}

function whereCellIsFirstOfWord(cell) {
    const wordNumbers = [];

    for (const word of words) {
        if (word.cells[0][0] === cell[0] && word.cells[0][1] === cell[1]) {
            wordNumbers.push(word.num);
        }
    }

    return wordNumbers;
}

function unfocusAllClues(word) {
  const x = document.querySelector(".selected-text");
  x.textContent = "";

  const allClues = document.querySelectorAll('.clue--focused');
  allClues.forEach(word => {
      word.classList.remove('clue--focused');
  });
}

function unfocusAllWords() {
  const allCells = document.querySelectorAll('.cell--focused');
  allCells.forEach(cell => {
      cell.classList.remove('cell--focused');
  });
}

function focusClue(word) {
  const elem = document.querySelector("." + wordToClassName(word));
  if (elem) {
    elem.scrollIntoView({"behavior": "smooth", "block": "center"});
    elem.classList.add("clue--focused")
    const x = document.querySelector(".selected-text");
    x.textContent = elem.querySelector(".clues-table--clue") .textContent;
  }
}

function getFocusedWord() {
    for (const clue of words) {
        const allCellsFocused = clue.cells.every(cell => {
            const cellElement = document.querySelector(cellToClassName(cell));
            return !cellElement || cellElement.classList.contains('cell--focused');
        });

        if (allCellsFocused) {
            return clue;
        }
    }

    return null;
}

function focusWord(cells) {
    cells.forEach(cell => {
        const cellElement = document.querySelector(cellToClassName(cell));
        if (cellElement) {
            cellElement.classList.add('cell--focused');
        }
    });
}

function unfocusWriteTo() {
  const writeTo = document.querySelectorAll('.cell--focused--write-to');
  writeTo.forEach(word => {
      word.classList.remove('cell--focused--write-to');
  });

}

function makeWriteTo(cell) {
  unfocusWriteTo();
  const cellElement = document.querySelector(cellToClassName(cell));
  if (cellElement) {
    cellElement.classList.add('cell--focused--write-to');
  }
}


function onCellShiftedOverTo(cell) {
    makeWriteTo(cell);
}

function elementToCellCoords(element) {
    const x = element.getAttribute('data-x');
    const y = element.getAttribute('data-y');

    if (x !== null && y !== null) {
        return [parseInt(x), parseInt(y)];
    }

    return null;
}

function writeToCell(character) {
  document.querySelector(".cell--focused--write-to").querySelector(".cell--content").textContent = character;
}

function onWrite(event) {
  var newIndex;

  const writeTo = document.querySelector('.cell--focused--write-to');
  if (writeTo == null) {return;}

  if (event.keyCode == BACKSPACE) {
    writeToCell("");
    const cell = elementToCellCoords(writeTo);
    const word = getFocusedWord();
    unfocusWriteTo();

    const oldIndex = word.cells.findIndex(existingCell => {
        return existingCell[0] === cell[0] && existingCell[1] === cell[1];
    });

    newIndex = oldIndex - 1;
    if (oldIndex == 0) {
      newIndex = 0;
    }

    makeWriteTo(word.cells[newIndex]);
    return;
  } else {
    writeToCell(String.fromCharCode(event.keyCode));
  }

  const cell = elementToCellCoords(writeTo);
  const word = getFocusedWord();
  unfocusWriteTo();

  const oldIndex = word.cells.findIndex(existingCell => {
      return existingCell[0] === cell[0] && existingCell[1] === cell[1];
  });
  newIndex = oldIndex + 1

  if (allCellsAreFilled()) {
    if (allAnswersCorrect()) {
      enablePopupDone();
    } else {
      enablePopupFail();
    }
  }

  if (newIndex == word.cells.length) {
    // TODO: this should focus next empty word
    unfocusAllClues();
    unfocusAllWords();
    return;
  }

  makeWriteTo(word.cells[newIndex]);
}

function onClueClicked(word) {
    unfocusAllWords();
    focusWord(word.cells);
    if (word.cells.length) {
      makeWriteTo(word.cells[0]);
    }
    unfocusAllClues();
    focusClue(word);
}

function onCellClicked(cell) {
  const focusedWord = getFocusedWord();
  let sameFocusedWordAndCell = false;

  if (focusedWord != null) {
    const isCellInWord = focusedWord.cells.some(wordCell => {
      return wordCell[0] === cell[0] && wordCell[1] === cell[1];
    });

    const cellElement = document.querySelector(cellToClassName(cell));
    const hasWriteToClass = cellElement && cellElement.classList.contains('cell--focused--write-to');

    sameFocusedWordAndCell = isCellInWord && hasWriteToClass;
  }

  unfocusAllClues();
  unfocusAllWords();

  const vals = whereCellIsInWord(cell);

  if (vals.length == 0) {
    return;
  }

  let index = 0
  if (sameFocusedWordAndCell) {
    // Unfocus cell if no other alternative
    refocus()
    if (vals.length == 1) { return; }
    index = (vals.indexOf(focusedWord) + 1) % vals.length;
  }

  const word = vals[index]

  focusClue(word);
  focusWord(word.cells);
  makeWriteTo(cell);
}


function initGrid() {
    const gridElement = document.getElementById('crossword-grid');
    for (let y = 0; y < gridSizeY; y++) {
        for (let x = 0; x < gridSizeX; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'white'); // Default to white
            cell.dataset.x = x;
            cell.dataset.y = y;

            const v = document.createElement("div");
            v.classList.add('cell--index');
            cell.appendChild(v);

            if (whereCellIsFirstOfWord([x,y]).length > 0) {
              v.textContent = whereCellIsFirstOfWord([x,y])[0];
            }

            const v2 = document.createElement("span");
            v2.classList.add('cell--content');
            cell.appendChild(v2);


            if (isIn([x, y], neverUsedCells)) {
                cell.classList.remove('white');
                cell.classList.add('black');
            }

            cell.addEventListener('click', () => onCellClicked([x, y]));
            gridElement.appendChild(cell);
        }
    }
}

function initClueLists() {
    const wordsTable = document.createElement('table');
    wordsTable.classList.add('clues-table');

    // Create "Across" section
    const acrossTitleRow = document.createElement('tr');
    acrossTitleRow.innerHTML = '<td class="clues-table--title" colspan="2">Across</td>';
    wordsTable.appendChild(acrossTitleRow);

    words.forEach(word => {
        if (word.across) {
            const wordRow = document.createElement("tr");
            wordRow.classList.add(wordToClassName(word));
            wordRow.onclick = () => onClueClicked(word);
            wordRow.classList.add("clue");
            wordRow.innerHTML = `
                <td class="clues-table--index">${word.num}</td>
                <td class="clues-table--clue">${word.clue}</td>
            `;
            wordsTable.appendChild(wordRow);
        }
    });

    // Create "Down" section
    const downTitleRow = document.createElement('tr');
    downTitleRow.innerHTML = '<td class="clues-table--title" colspan="2">Down</td>';
    wordsTable.appendChild(downTitleRow);

    words.forEach(word => {
        if (!word.across) {
            const wordRow = document.createElement('tr');
            wordRow.classList.add(wordToClassName(word));
            wordRow.classList.add("clue");
            wordRow.onclick = () => onClueClicked(word);
            wordRow.innerHTML = `
                <td class="clues-table--index">${word.num}</td>
                <td class="clues-table--clue">${word.clue}</td>
            `;
            wordsTable.appendChild(wordRow);
        }
    });

    // Clear existing word lists and append the new table
    const wordContainer = document.querySelector('.clue-container');
    wordContainer.innerHTML = ''; // Clear previous content
    wordContainer.appendChild(wordsTable); // Append the new words table
}

function initCrossword() {
  refocus();
  inputField.addEventListener('blur', function() {
    refocus();
  });

  document.querySelectorAll('.popup--button_close').forEach(x => {x.onclick = disablePopup;});

    initGrid();
    initClueLists();

  function onKeyPress(event) {
    event.preventDefault();
    if (isCharacterKeyPress(event)) {
      onWrite(event);
    }
  }

  document.addEventListener('keydown', onKeyPress);
}

function refocus() {
  const inputField = document.getElementById('evilInput');
  inputField.focus();
}

function isCharacterKeyPress(evt) {
    if (event.keyCode == BACKSPACE) {
      return true;
    }
    return (String.fromCharCode(event.keyCode).match(/(\w)/g));
}



function enablePopupFail() {
  document.querySelector('.popup--darken_background').classList.add("active");
  document.querySelector('.popup--window__fail').classList.add("active");

  setTimeout(function (){
    document.querySelector('.popup--darken_background').classList.add("active_done");
  }, 0);
}
function enablePopupDone() {
  document.querySelector('.popup--darken_background').classList.add("active");
  document.querySelector('.popup--window__ok').classList.add("active");

  setTimeout(function (){
    document.querySelector('.popup--darken_background').classList.add("active_done");
  }, 0);
}

function disablePopup() {
  setTimeout(function (){
    document.querySelector('.popup--darken_background').classList.remove("active_done");
    document.querySelectorAll('.popup--window').forEach(x => x.classList.remove("active"));
  }, 0);

  setTimeout(function (){
    document.querySelector('.popup--darken_background').classList.remove("active");
  }, 200);
}

enablePopupFail();

// Call the initialization function when the page loads
window.onload = initCrossword;
