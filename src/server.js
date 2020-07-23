const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")

// configurar pasta publica
// "server.use" serve para configurar o servidor 
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))


// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// consigurar caminhos da minha aplicação
// página inicial
// req: Requisição
// res: Resposta

// server.get é uma configuração de rota
server.get("/", (req, res) => {
    return res.render("index.html" , { title: "Um título"})
})



server.get("/create-pointe", (req, res) => {

    // req.query: Query Strings da nossa url
    // console.log(req.query) 

    return res.render("create-pointe.html")
})

server.post("/savepoint", (req, res) => {

    // req.body: O corpo do nosso formulário 
    // console.log(req.body)

    // inserir dados no banco de dados
    const query = `
    INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-pointe.html", { saved: true})
    }

    db.run(query, values, afterInsertData)

    
})


server.get("/search", (req, res) => {

    const search = req.query.search

    if (search == "") {
        // pesquisa vazia 
        return res.render("search-results.html", { total: 0})
    }



    // pegar os dados do banco de dados
    // SUL
    // Chapadão do sul
    // rio do sul
    // sulamericana

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
       if(err) {
            return console.log(err)
        }

        const total = rows.length

       // mostrar a página html com os dados do banco de dados 
       console.log("Aqui estão seus registros: ")
       console.log(rows)
       return res.render("search-results.html", { places: rows, total: total})
    })
    
})
//ligar o servidor
server.listen(3000)