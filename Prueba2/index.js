const puppeteer = require ('puppeteer');

(async()=>{


    const navegador=await puppeteer.launch({
        headless:false,
        defaultViewport: null,
    });


    const page = await navegador.newPage()
    await page.goto('https://www.reddit.com/r/AskReddit/')

    await page.waitForSelector('[slot="full-post-link"]')

    const titulos= await page.evaluate(()=>{
        const items= document.querySelectorAll('[slot="full-post-link"]')

        const arr=[]
        for(let i of items){
            const c={}
            c.name = i.ariaLabel;
            c.url =i.href;
            arr.push(c)
        }

        return arr
    })
    console.log(titulos)

})()



// document.querySelectorAll('[slot="full-post-link"]')

//document.querySelector('[slot="title"]')