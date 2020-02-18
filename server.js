const express = require('express')
const server = express()
const nunjucks = require('nunjucks')


server.use(express.static('public'))

// Habilitar body do formulário
server.use(express.urlencoded({extended: true}))

// Conexão com banco
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

nunjucks.configure("./", {
    express: server,
    noCache: true,
})


// Renderizar Página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

// Pegar dados do formulário
server.post("/", function(req, res) {
    const name = req.body.name 
    const email = req.body.email 
    const blood = req.body.blood

    // Puxar para o array
    // donors.push({
    //     name: name,
    //     blood: blood,
    // })

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // Valores para o banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
})

server.listen(3001, function() {
    console.log("Servidor iniciado.")
})