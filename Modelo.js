// IMPORTANTE: el fs es nativo de las librerias de Node pero hay que instalar el csvtojson usando:
// npm install --save csvtojson@latest

// Importar dependencias para leer el csv
const fs = require("fs");
const csv = require("csvtojson");

// crear una variable global de tipo lista para guardar los comentarios
let lista = [];
(async () => {
    // re iniciar la lista vacia
    lista = [];
    // Cargar los comentarios
    const comments = await csv().fromFile("ListaDeComentarios.csv");

    // recorrer los comentarios y sacar el contenido
    comments.forEach(comment =>{
      // desestrcuturar el comentario para sacar su contenido
      const {comentarios} = comment;
      // quitar saltos de linea innecesarios
      const comenString=comentarios.replace(/(\r\n|\n|\r)/gm,"");
      // agregar a la lista
      lista.push(comenString)
    })
    console.log(lista)
})();


//Implementando el modelo Toxicity Classifier

//importar el modelo de tensorflow

require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');


//Estableciendo el threshold
const threshold = 0.9;


//Cargamos el modelo 

toxicity.load(threshold).then(model => {
  const sentences = ['ListaDeComentarios.csv'];

  model.classify(sentences).then(predictions => {
    console.log(predictions); 
    })
  })