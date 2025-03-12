const { json } = require('stream/consumers');


function openAITranslate(term){
  const OpenAI = require('openai');
  require('dotenv').config();


  return new Promise((resolve) => {


  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });

  const completion = openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      { "role": "user", "content": "Act as an Estonian accountant, translate the following annual statement accounting term into English so it would match any official guidelines and follow the industry terms. The result should be only a direct translation for API purposes. The word is:" + term },
    ],
  })


  completion.then((completion) => {
        resolve(completion.choices[0].message.content)
  })

})
  
}

function saveTranslation(term,eng_term){
  const fs = require('fs');
  const data = fs.readFileSync('eng.json');
  let jsonData = JSON.parse(data);
  console.log(jsonData);
  jsonData[term] = eng_term;
  fs.writeFileSync('eng.json', JSON.stringify(jsonData));




}


  module.exports = {
     AI : openAITranslate, 
     save : saveTranslation
    };
