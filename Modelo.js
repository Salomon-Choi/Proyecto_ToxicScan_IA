// IMPORTANTE: el fs es nativo de las librerias de Node pero hay que instalar el csvtojson usando:
// npm install --save csvtojson@latest

// Importar dependencias para leer el csv¿
const fs = require("fs");
const csv = require("csvtojson");

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


    // //Cargamos el modelo 

    toxicity.load(threshold).then(model => {
      const sentences = ['Fuck you, jewish cunt']; // pa pruebas que si funciona con malas palabras (solo ingles)
      // sentences.push(lista); //esta parte es para que ingrese el String de los comentarios en el array
      // console.log(sentences); // solo lo agregue para ver como imprimia el array
      model.classify(sentences).then(predictions => {

        predictions = predictions.map(predictions => ({
          // aqui tomo solo la etiqueta y otros datos en la cual cae el texto
          label: predictions['label'],
          probabilitie: predictions.results[0]['probabilities'][1],
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
        }
        })
      })
})();
