// const puppeteer = require ('puppeteer');

// (async()=>{


//     const navegador=await puppeteer.launch({
//         headless:false,
//         defaultViewport: null,
//     });


//     const page = await navegador.newPage()
//     await page.goto('https://www.reddit.com/r/AskReddit/comments/185zlzu/people_still_working_from_home_hows_it_going/')

//     await page.waitForSelector('[slot="comment"]')

//     const titulos= await page.evaluate(()=>{
//         const items= document.querySelectorAll('[slot="comment"]')

//         const arr=[]
//         for(let i of items){
//             const c={}
//             c.comentario=i.innerText
//             arr.push(c)
//         }

//         return arr
//     })
//     console.log(titulos)

// })()



const puppeteer = require('puppeteer');

(async () => {
    const navegador = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await navegador.newPage();
    await page.goto('https://www.reddit.com/r/AskReddit/comments/185zlzu/people_still_working_from_home_hows_it_going/');

    // Esperar a que se carguen los comentarios
    await page.waitForSelector('[slot="comment"]');

    // Simular desplazamiento hacia abajo para cargar más comentarios
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const scrollInterval = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, 100);
        });
    });

    // Extraer los comentarios
    const titulos = await page.evaluate(() => {
        const items = document.querySelectorAll('[slot="comment"]');

        const arr = [];
        items.forEach((item) => {
            const c = {};
            c.name = item.innerText;
            arr.push(c);
        });

        return arr;
    });

    console.log(titulos);

    // Cerrar el navegador
    //await navegador.close();
})();
