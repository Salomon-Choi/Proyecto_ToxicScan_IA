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