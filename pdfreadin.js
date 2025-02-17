var pdfreader = require('pdfreader');
const {Rule} = require("pdfreader");
let raamatupidamine = [];
let bilanss = [];
let dates = [];
let tabel;
let page;

const nbCols = 3;
const cellPadding = 48; // each cell is padded to fit 40 characters
const columnQuantitizer = (item) => parseFloat(item.x) >= 18;

const padColumns = (array, nb) =>
    Array.apply(null, {length: nb}).map((val, i) => array[i] || []);
// .. because map() skips undefined elements

const mergeCells = (cells) => (cells || [])
    .map((cell) => cell.text).join('') // merge cells
    .substr(0, cellPadding).padEnd(cellPadding, ' '); // padding

const renderMatrix = (matrix) => (matrix || [])
    .map((row, y) => padColumns(row, nbCols)
        .map(mergeCells)
        .join(' | ')
    ).join('\n');

var table = new pdfreader.TableParser();


new pdfreader.PdfReader().parseFileItems("uploads/Aruanne_14058782.pdf", function (err, item) {
    if (!item || item.page) {
        // end of file, or page
        console.log(renderMatrix(table.getMatrix()));
        console.log('PAGE:', item.page);
        table = new pdfreader.TableParser(); // new/clear table for next page
        page = item.page;
    }
    if (page == 4) {

        if (item.text && item.text !== " ") {
            if (item.text == "Bilanss") {
                tabel = 1;
                const item_text = item.text;
                let objekt = {
                    [item_text]: {}
                };
                raamatupidamine.push(objekt);
            }

            if (tabel == 1) {
                if (dates.length !== 2) {
                    if (parseFloat(item.x) > 18 && parseFloat(item.x) < 30) {
                        dates.push(item.text);
                    }

                } else if (dates.length == 2) {
                    if (parseFloat(item.x) < 18) {
                        const item_text = item.text;
                        bilanss.push(item.text);
                    } else if (parseFloat(item.x) > 22 && parseFloat(item.x) < 26) {
                        let key = bilanss[bilanss.length - 1]
                        let date = dates[1];
                        const item_text = item.text;

                    } else if (parseFloat(item.x) > 18 && parseFloat(item.x) < 22) {
                        let key = bilanss[bilanss.length - 1]
                        let date = dates[0];
                        const item_text = item.text;
                        let objekt = {
                            [key]: {
                                [date]: item_text
                            }
                        };
                        bilanss[bilanss.length - 1] = objekt;
                    }
                    console.log("Raamatupidamine " + raamatupidamine);
                    console.log("Dates " + dates);
                    console.log("Tabel " + tabel);
                    console.log("Page " + page);
                    console.log("Bilanss " + bilanss);

                }
            }
        }


    }

// accumulate text items into rows object, per line
//console.log("Item.text activated")

// console.log(item.text + " X.axis: " + parseFloat(item.x) + " Y.axis: " + parseFloat(item.y))
// table.processItem(item, columnQuantitizer(item));
})

;