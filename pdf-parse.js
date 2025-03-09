const fs = require('fs');
const pdf = require('pdf-parse');
const eng = require('./eng.json');


const dataFolder = "./uploads";



function parsePage(items) {
    let objectKey;
    let reportname;
    let date;
    let aruanne = [];
    let isTabel = 0;
    const companyname = items[1].str;
    for (const [index, item] of items.entries()) {
        if (item.str && item.str !== " ") {
            if ((item.str === "Bilanss" || item.str === "Kasumiaruanne") && parseInt(item.height) == 14) {
                isTabel = true;
                reportname = eng[item.str];
            }
            if (isTabel == 1) {
                if (!date) {
                    if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 364) {
                        date = item.str;
                    }
                }
                else if (date) {
                    if (parseFloat(item.transform[4]) < 300) {
                        objectKey = eng[item.str];
                    }
                    else if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 364) {
                        aruanne.push({
                            [objectKey] : [item.str]
                        })

                    }
                }

            }
        }
        if (index == 5 && isTabel == 0) {
            break;
        }

    }


    if (!isTabel) {
        throw new Error("The document is in unfamiliar format to the system");
        //return 
    }
    return report = {
        companyname: companyname,
        date: date,
        [reportname]: aruanne
    };

}



async function render_page(pageData, file, page) {

    //check documents https://mozilla.github.io/pdf.js/
    const render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: true


    }

    const textContent = await pageData.getTextContent(render_options);
    try {
        return parsePage(textContent.items);
    }
    catch (err) {
        console.error(file, "Page" + page, err.message);
    }


}


function parsePDF(dataBuffer, file) {

    const pdfDataExtracted = [];

    const options = {
        pagerender: async function (pageData) {
            const page = (pageData.pageIndex) + 1;
            if (page == 4 || page == 5) {
                    pdfDataExtracted
                        .push(await render_page(pageData, file, page));
            }


        }

    }



        pdf(dataBuffer, options).then(function (data) {
            console.log(JSON.stringify(pdfDataExtracted
                , null, 2));


            // console.log(JSON.stringify(pdfDataExtracted
            // , null, 2));


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

        })


    

}




fs.readdirSync(dataFolder).forEach(file => {
    let dataBuffer = fs.readFileSync(dataFolder + "/" + file)
    parsePDF(dataBuffer, file);
}

);


