// IMPORTANTE: el fs es nativo de las librerias de Node pero hay que instalar el csvtojson usando:
// npm install --save csvtojson@latest

// Importar dependencias para leer el csv¿
const fs = require("fs");
const csv = require("csvtojson");
const express = require("express")

const app = express()
const port = 3000

// crear una variable global de tipo lista para guardar los comentarios
let lista = '';
app.get('/resultados',(req,res)=>{
  res.status(200).send('<h1>Hola desde resultados</h1>')
})
app.get('/', (req,res)=>{
  (async () => {
    // re iniciar la lista vacia
    lista = '';
    // Cargar los comentarios
    const comments = await csv().fromFile("ListaDeComentarios.csv");

    // recorrer los comentarios y sacar el contenido
    comments.forEach(comment =>{
      // desestrcuturar el comentario para sacar su contenido
      const {comentarios} = comment;
      // quitar saltos de linea innecesarios
      const comenString=comentarios.replace(/(\r\n|\n|\r)/gm,"");
      // agregar a la lista
      lista = lista + (comenString + " ")
    })

    
    //Implementando el modelo Toxicity Classifier
    //importar el modelo de tensorflow

    require('@tensorflow/tfjs');
    const toxicity = require('@tensorflow-models/toxicity');


    // //Estableciendo el threshold
    const threshold = 0.8;


/////////////////////////////////Clasificador de toxicidad/////////////////////////////////////////////////////////

    toxicity.load(threshold).then(model => {
      const sentences = ['son of a bitch, you are everything I was talking about']; // pa pruebas que si funciona con malas palabras (solo ingles)
      // sentences.push(lista); //esta parte es para que ingrese el String de los comentarios en el array
      // console.log(sentences); // solo lo agregue para ver como imprimia el array
      model.classify(sentences).then(predictions => {

        predictions = predictions.map(predictions => ({
          // aqui tomo solo la etiqueta y otros datos en la cual cae el texto
          label: predictions['label'],
          probability: predictions.results[0]['probabilities'][1],
          match: predictions.results[0]['match']
        }))
        predictions = predictions.filter(p => p.match).map(p => p.label)
        // evaluo si existe alguna coincidencia con las categorias de toxicidad
        if (predictions.length == 0){
          // si no cae en ninguna categoria entonces probablemente no es toxico
          console.log("probably not toxic")
          res.status(200).send('<p>Probably not toxic</p>')
        }else{
          // se verifica que la palabra toxicidad este incluida (aunque es redundante)
          if (predictions.includes('toxicity')){
            // si es asi, se imprime como real y se saca del array
            console.log('Toxicity: TRUE')
            predictions.pop(predictions.length -1)
          }
          // se imprimre en cual categoria podriamos incluir este posible texto toxico
          const predic = predictions.toString()
          // res.status(200).send('<p>Toxicity: TRUE</p>')
         /////////////////// res.status(200).send(`<p>Toxicity: TRUE</p><br><p>This piece of text might fall into these categories: ${predic}</p>`)
          console.log("This piece of text might fall into this categories: ",predictions)

          //////////////////////   MODELO DE ANÁLISIS DE TEXTO //////////////////////

          const express = require('express');
          require('dotenv').config()
          const app = express();
          //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          const {
              TextServiceClient
          } = require("@google-ai/generativelanguage");
          const {
              GoogleAuth
          } = require("google-auth-library");
          //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          const API_KEY = process.env.API_KEY;
          //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          const client = new TextServiceClient({
              authClient: new GoogleAuth().fromAPIKey(API_KEY),
          });
          //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          const promptString = `Could you define the following terms: ${predictions.toString()}, and provide a summary of how to prevent this behavior on the internet?`;
          console.log(promptString);
          //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          client.generateText({
              model: 'models/text-bison-001',
              temperature: 0.7,
              candidateCount: 1,
              top_k: 40,
              top_p: 0.95,
              max_output_tokens: 1024,
              stop_sequences: [],
              prompt: {
                  text: promptString,
              },
          }).then(result => {
            // console.log('siuuu');
              result.forEach(function(d1) {
                  if (d1 != null) {
                      d1.candidates.forEach(function(d2) {
                          console.log(d2.output);
                          res.status(200).send(`
                          <!DOCTYPE html>
                          <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                              <title>ToxicScan</title>
                          </head>
                          <body>
                              <style>
                                  body {
                                      font-family: Arial, sans-serif;
                                  }
                                  .card-header{
                                      background-color: #6ab7d5;
                                      color: #f5f5f3;
                                      font-weight: bold;
                                  }
                          
                                  .center-image {
                                      display: block;
                                      margin-left: auto;
                                      margin-right: auto;
                                      padding: 3rem;
                                  }
                          
                                  .blockquote-footer{
                                      background-color: #979797;
                                      color: #f5f5f3;
                                      font-weight: bold;
                                  }
                          
                                  .navbar-brand {
                              display: flex;
                              align-items: center;
                            }
                                  .navbar-brand img {
                                  vertical-align: middle;
                                  margin-right: 10px; /* Ajusta este valor según sea necesario */
                              }
                          
                              .navbar-brand span {
                                  vertical-align: middle;
                                  display: inline-block;
                                  font-size: 180%;
                                  background-color:#ff4500;
                                  color: #f5f5f3;
                                  border-radius: 0.5rem;
                                  padding: 0.5rem;
                               }
                          
                               footer {
                                position: relative;
                                text-align: center;
                              }
                          
                              footer img {
                                width: 100%;
                                max-height: 200px;
                                display: block;
                                margin: 0 auto;
                                transform: rotate(180deg);  
                              }
                          
                              p{
                                  background-color:#f5f5f3;
                                  margin: 2rem;
                              }
                          
                                </style>
                          
                                <nav class="navbar bg-body-tertiary">
                                  <div class="container-fluid">
                                    <a class="navbar-brand" href="#">
                                      <img src="https://cdn.worldvectorlogo.com/logos/reddit-logo-new.svg" alt="Logo" width="15%" height="15%" class="d-inline-block align-text-top">
                                      <span>ToxicScan</span>
                                    </a>
                                  </div>
                                </nav>
                          
                          
                                <div class="card">
                                  <div class="card-header">
                                      Toxicity: TRUE
                                  </div>
                                  <div class="card-body">
                                    <blockquote class="blockquote mb-0">
                                      <p>${d2.output}</p>
                                      <footer class="blockquote-footer">This piece of text might fall into these categories: ${predic}<cite title="Source Title">. 💀</cite></footer>
                                    </blockquote>
                                  </div>
                                </div>
                                <img src="https://www.shutterstock.com/image-illustration/toxicity-quality-degree-being-toxic-250nw-2223347193.jpg" alt="" class="center-image ">
                                <footer>
                                  <img src="https://media.istockphoto.com/id/1338139079/vi/vec-to/nh%E1%BB%8F-gi%E1%BB%8Dt-d%E1%BA%A7u-n%C6%B0%E1%BB%9Bc-s%E1%BB%91t-ho%E1%BA%B7c-s%C6%A1n-%C4%91%C6%B0%E1%BB%A3c-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng-ch%E1%BA%A5t-nh%E1%BB%9Dn-%C4%91en-nh%E1%BB%8F-gi%E1%BB%8Dt-tr%C3%AAn-n%E1%BB%81n.jpg?s=170667a&w=0&k=20&c=uLMBB1w5fXkuPY8CJwbabxOgVgMFQKbmFwtyq2GXCvU=" alt="">
                                </footer>
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
                              
                           
                          </body>
                          </html>



`)
                      })
                  }
              })
          });
        }
        })
      })

})();
})

app.listen(port, ()=>{
  console.log(`Server is running on port http://localhost:${port}`)
})

// $ yarn add @tensorflow/tfjs @tensorflow-models/toxicity
//////////////////////////////////////////////////
///////////////////////

{/* <style>
p {
  font-family: Arial, sans-serif;
  margin-bottom: 10px;
}

p.toxic {
  color: red;
  font-weight: bold;
}

p.categories {
  font-style: italic;
}

p.output {
  color: green;
}
</style>

<p class="toxic">Toxicity: TRUE</p>
<p class="categories">This piece of text might fall into these categories: ${predic}</p>
<p class="output">${d2.output}</p> */}