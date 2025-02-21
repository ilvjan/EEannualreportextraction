var pdfreader = require('pdfreader');
let raamatupidamine = [];
let bilanss = [];
let dates = [];
let tabel;
let page;


function getdate(itemx) {
    if (parseFloat(itemx) > 22 && parseFloat(itemx) < 26) return 1;
    if (parseFloat(itemx) > 18 && parseFloat(itemx) < 22) return 0;
}


new pdfreader.PdfReader().parseFileItems("uploads/Montonio_Finance_OU-aruanne_2023.pdf", function (err, item) {
    if (!item || item.page) {
        // end of file, or page
        console.log('PAGE:', item.page);
       // table = new pdfreader.TableParser(); // new/clear table for next page
        page = item.page;
    }
    if (page == 5) {

        if (item.text && item.text !== " ") {
            if (item.text.includes("bilanss")) {
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
                    if (parseFloat(item.x) < 18 ) {
                        let obj = {[item.text] : {}};
                        bilanss.push(obj);
                    } else if (parseFloat(item.x) > 18 && parseFloat(item.x) < 26 ) {
                        let key = Object.values(bilanss[bilanss.length - 1])[0];
                        let date = dates[getdate(item.x)];
                        let item_text = item.text;
                        console.log(Object.keys(key));
                        if (key.hasOwnProperty(date)) {
                            let obj = Object.values(key)[getdate(item.x)];
                            item_text = obj + item_text;
                        }
                        key[date] = item_text;

                    }
                    console.log("Raamatupidamine " + raamatupidamine);
                    console.log("Dates " + dates);
                    console.log("Tabel " + tabel);
                    console.log("Page " + page);
                    console.log(JSON.stringify(bilanss));

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