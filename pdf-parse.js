const fs = require('fs');
const pdf = require('pdf-parse');

let pdfDataExtracted = [];
const dataFolder = "./uploads";


function getDateIndex
    (xposition) {
    if (parseFloat(xposition) > 364 && parseFloat(xposition) < 426) return 1;
    if (parseFloat(xposition) > 300 && parseFloat(xposition) < 364) return 0;
}

function parsePage(items) {
    let reportname;
    let date;
    let aruanne = [];
    let isTabel = Boolean;
    const companyname = items[1].str;
    for (let item of items) {
        if (item.str && item.str !== " ") {
         if ((item.str === "Bilanss" || item.str === "Kasumiaruanne") && parseInt(item.height) == 14) {
                isTabel = true;
                reportname = item.str;
            }
            if (isTabel == 1) {
                if (!date) {
                    if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 364) {
                        date = item.str;
                    }
                }
                else if (date) {
                    if (parseFloat(item.transform[4]) < 300) {
                        let obj = { [item.str]: ""};
                        aruanne.push(obj);
                    }
                    else if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 364) {
                        let key = Object.keys(aruanne[aruanne.length - 1])[0];
                        let item_str = item.str;    
                        //console.log(Object.keys(key));
                        aruanne[aruanne.length - 1][key] = item_str;

                    }
                }

            }
            //console.log(item.transform);
        }

    }


    
    isTabel = false;
    return report = {
        companyname : companyname,
        date : date,
        [reportname]: aruanne
    };

}



async function render_page(pageData) {

    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: true


    }

    let textContent = await pageData.getTextContent(render_options);
    return parsePage(textContent.items);

}



let options = {
    pagerender: async function (pageData) {
        const page = (pageData.pageIndex) + 1;
        if (page == 4 || page == 5) {
            let pageRendered = await render_page(pageData);
            console.log(JSON.stringify(pageRendered
                , null, 2));
        }

    }

}




fs.readdirSync(dataFolder).forEach(file => {
    let dataBuffer = fs.readFileSync(dataFolder + "/" + file)
    pdf(dataBuffer, options).then(function (data) {


        // // number of pages
        // console.log(data.numpages);
        // // number of rendered pages
        //console.log(data.numrender);
        // // PDF info
        // console.log(data.info);
        // // PDF metadata
        // console.log(data.metadata);
        // // PDF.js version
        // // check https://mozilla.github.io/pdf.js/getting_started/
        // console.log(data.version);
        // PDF text
        // console.log(data.text);

    });

}
);


