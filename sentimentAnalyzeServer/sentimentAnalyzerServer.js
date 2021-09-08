const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    console.log("Entra URL Emotion");
    console.log(getNLUInstance());
});

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {
              'targets': [
                'Juan', 'negative', 'positive', 'is'
              ]
            }
          }
      };
      getNLUInstance().analyze(analyzeParams).then(analysisResults => {
        return res.send(JSON.stringify(analysisResults.result));
        
      })
      .catch(err => {
        console.log('error:', err);
      });
});

app.get("/text/emotion", (req,res) => {
    console.log("Entra Text Emotion");
    console.log(getNLUInstance());
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': {
              'targets': [
                'Juan'
              ]
            }
          }
      };
      getNLUInstance().analyze(analyzeParams).then(analysisResults => {
        return res.send(JSON.stringify(analysisResults.result));
        
      })
      .catch(err => {
        console.log('error:', err);
      });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
});