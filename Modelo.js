// IMPORTANTE: el fs es nativo de las librerias de Node pero hay que instalar el csvtojson usando:
// npm install --save csvtojson@latest

// Importar dependencias para leer el csv¿
const fs = require("fs");
const csv = require("csvtojson");

let categoria

// crear una variable global de tipo lista para guardar los comentarios
let lista = [];

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
      const sentences = ['Fuck you, jewish cunt']; // pa pruebas que si funciona con malas palabras (solo ingles)
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
        }else{
          // se verifica que la palabra toxicidad este incluida (aunque es redundante)
          if (predictions.includes('toxicity')){
            // si es asi, se imprime como real y se saca del array
            console.log('Toxicity: TRUE')
            predictions.pop(predictions.length -1)
          }
          // se imprimre en cual categoria podriamos incluir este posible texto toxico
          console.log("This piece of text might fall into this categories: ",predictions)
          categoria= "This piece of text might fall into this categories: "+predictions
        }
        })
      })

////////////////////////////////////////   MODELO DE ANÁLISIS DE TEXTO //////////////////////////////////////////////////////////

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
const promptString = "Talk about toxicity on the internet and give an opinion on the following sentence: This piece of text might fall into this categories:  [ 'insult' ]";
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
    result.forEach(function(d1) {
        if (d1 != null) {
            d1.candidates.forEach(function(d2) {
                console.log(d2.output);
            })
        }
    })
});

})();

// $ yarn add @tensorflow/tfjs @tensorflow-models/toxicity
//////////////////////////////////////////////////
///////////////////////
