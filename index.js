import express, { response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
const host = "localhost";
const porta = 3000;
const app = express();

var times = [];

app.listen(porta, host, () => {
    console.log(`Aplicação rodando em http://${host}:${porta}`)
});

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: "segredodasessao",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Atividade Final</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <h2 class="mx-auto" style="width: 200px;">Bem-vindo!</h2>
            </div>
        </nav>

        <div class="card d-flex flex-row justify-content-between mx-auto" style="width: 28rem; margin-top: 5rem">
            <div class="card-body text-center me-auto">
                <h5 class="card-title">Cadastrar</h5>
                <p class="card-text">Crie sua conta aqui!</p>
                <a href="/signin" class="btn btn-primary">Sign In</a>
            </div>
            <div class="card-body text-center">
                <h5 class="card-title">Entrar</h5>
                <p class="card-text">Acesse sua conta aqui!</p>
                <a href="/login" class="btn btn-primary">Log In</a>
            </div>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `);
});

app.get("/menu", verificaLog, (req, res) => {
    let ultimoAcesso = req.cookies?.ultimoAcesso;
    const data = new Date();
    res.cookie("ultimoAcesso", data.toLocaleString());

    let resposta = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Atividade Final</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/menu">MENU</a>
                <h5 class="d-flex p-2 mx-auto">Último acesso: ${ultimoAcesso || "Primeiro acesso"}</h5>
                <form method="POST" action="/logout"><button onclick="alerta()" type="submit" style="border: none; outline: none; background: none; padding: 0; margin: 0;"><a href="" style="pointer-events: none;">Log Out</a></button></form>
            </div>
        </nav>
        <div class="text-center">
            <h1>Bem-vindo(a), ${req.session?.dadosLogin?.usuario}!</h1>
            <ul class="list-group mt-1 mx-auto mt-5" style="width: 24rem;">
                <li class="list-group-item active" aria-current="true">Gerenciamento de Equipes e Jogadores</li>
                <li class="list-group-item"><a href="/cdstrEquipe">Cadastrar Equipe</a></li>
                <li class="list-group-item"><a href="/cdstrJogador">Cadastrar Jogadores nas Equipes</a></li>
                <li class="list-group-item"><a href="/chcrEquipe">Checar Lista de Equipes</a></li>
            </ul>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        <script>
        function alerta(){
            alert("Logout efetuado com sucesso!");
        }
        </script>
        </html>    
    `;

    res.setHeader("Content-Type", "text/html")
    res.write(resposta);
    res.end();
});

app.get("/cdstrEquipe", verificaLog, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Atividade Final</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/menu">MENU</a>
            </div>
        </nav>

        <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Equipes</h1>
            <form method="POST" action="/dcnrEquipe" class="row g-3 m-3 p-3 bg-light">
            <div class="col-md-4">
                <label for="eqip" class="form-label">Nome da Equipe</label>
                <input type="text" class="form-control" id="eqip" name="eqip">
            </div>
            <div class="col-md-4">
                <label for="capt" class="form-label">Nome do Capitão</label>
                <input type="text" class="form-control" id="capt" name="capt">
            </div>
            <div class="col-md-4">
                <label for="contat" class="form-label">Telefone ou contato WhatsApp do Capitão</label>
                <input type="number" class="form-control" id="contat" name="contat">
            </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Cadastrar</button>
            </div>
            </form>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `);
});

app.post("/dcnrEquipe", (req, res) => {
    const {eqip, capt, contat} = req.body;

    if(eqip && capt && contat){
        times.push({eqip, capt, contat});
        res.redirect("/chcrEquipe");
    } else {
        let resposta = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Atividade Final</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/menu">MENU</a>
            </div>
        </nav>

        <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Equipes</h1>
            <form method="POST" action="/dcnrEquipe" class="row g-3 m-3 p-3 bg-light">
            <div class="col-md-4">
                <label for="eqip" class="form-label">Nome da Equipe</label>
                <input type="text" class="form-control" id="eqip" name="eqip" value="${eqip}">
        `;
        if(!eqip){
            resposta += `<div><h6 class="text-danger">Por favor, informe o nome da equipe</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-md-4">
                <label for="capt" class="form-label">Nome do Capitão</label>
                <input type="text" class="form-control" id="capt" name="capt" value="${capt}">
        `;
        if(!capt){
            resposta += `<div><h6 class="text-danger">Por favor, informe o nome do capitão da equipe</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-md-4">
                <label for="contat" class="form-label">Nome do Fabricante</label>
                <input type="number" class="form-control" id="contat" name="contat" value="${contat}">
        `;
        if(!contat){
            resposta += `<div><h6 class="text-danger">Por favor, digite o contato do capitão</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Cadastrar</button>
            </div>
            </form>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
        `;

        res.send(resposta);
    }
});

app.get("/chcrEquipe", verificaLog, (req, res) => {
    let resposta = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atividade Final</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    </head>
    <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/menu">MENU</a>
        </div>
    </nav>
    `;
    if(times.length == 0){
        resposta += `<h1 class="text-danger mx-auto" style="width: 30rem;">Não há equipes cadastradas no sistema</h1>`;
    } else {
        for(let i = 0; i < times.length; i++){
            resposta += `
    <div class="container shadow p-3 bg-body rounded text-center">
        <h1 class="text-center border m-3 p-3 bg-light">Equipe ${times[i].eqip} / Capitão: ${times[i].capt}</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Top</th>
                    <th scope="col">Jungle</th>
                    <th scope="col">Mid</th>
                    <th scope="col">Atirador</th>
                    <th scope="col">Suporte</th>
                    <th scope="col">Telefone ou contato do Capitão</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${times[i].top || "Não definido"} 
            `;
            if(times[i].top){
                resposta += `
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Dados</button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>Nickname: ${times[i].tNick}</li>
                                <li>Elo: ${times[i].tElo}</li>
                                <li>Sexo: ${times[i].tSexo}</li>
                            </ul>
                        </div>
                `;
            }
            resposta += `
                    </td>
                    <td>${times[i].jungle || "Não definido"}
            `;
            if(times[i].jungle){
                resposta += `
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Dados</button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>Nickname: ${times[i].jNick}</li>
                                <li>Elo: ${times[i].jElo}</li>
                                <li>Sexo: ${times[i].jSexo}</li>
                            </ul>
                        </div>
                `;
            }
            resposta += `      
                    </td>
                    <td>${times[i].mid || "Não definido"}
            `;
            if(times[i].mid){
                resposta += `
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Dados</button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>Nickname: ${times[i].mNick}</li>
                                <li>Elo: ${times[i].mElo}</li>
                                <li>Sexo: ${times[i].mSexo}</li>
                            </ul>
                        </div>
                `;
            }
            resposta += `
                    </td>
                    <td>${times[i].atirador || "Não definido"}
            `;
            if(times[i].atirador){
                resposta += `
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Dados</button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>Nickname: ${times[i].aNick}</li>
                                <li>Elo: ${times[i].aElo}</li>
                                <li>Sexo: ${times[i].aSexo}</li>
                            </ul>
                        </div>
                `;
            }
            resposta += `
                    </td>
                    <td>${times[i].suporte || "Não definido"}
            `;
            if(times[i].suporte){
                resposta += `
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Dados</button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>Nickname: ${times[i].sNick}</li>
                                <li>Elo: ${times[i].sElo}</li>
                                <li>Sexo: ${times[i].sSexo}</li>
                            </ul>
                        </div>
                `;
            }
            resposta += `
                    </td>
                    <td>${times[i].contat}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <br><hr><br>
        `;
        }
    }
    resposta += `
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </html>
    `;

    res.send(resposta);
});

app.get("/cdstrJogador", verificaLog, (req, res) => {
    let resposta = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Atividade Final</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/menu">MENU</a>
            </div>
        </nav>

        <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Jogadores</h1>
            <form method="POST" action="/dcnrJogador" class="row g-3 m-3 p-3 bg-light">
            <div class="col-md-5">
                <label for="nome" class="form-label">Nome do Jogador</label>
                <input type="text" class="form-control" id="nome" name="nome">
            </div>
            <div class="col-md-5">
                <label for="nick" class="form-label">Nickname in-game</label>
                <input type="text" class="form-control" id="nick" name="nick">
            </div>
            <div class="col-md-2">
                <label for="funcao" class="form-label">Função</label>
                <select class="form-select" id="funcao" name="funcao">
                <option selected disabled value="">Selecione</option>
                <option>Top</option>
                <option>Jungle</option>
                <option>Mid</option>
                <option>Atirador</option>
                <option>Suporte</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="elo" class="form-label">Elo do Jogador</label>
                <select class="form-select" id="elo" name="elo">
                <option selected disabled value="">Selecione</option>
                <option>Ferro</option>
                <option>Bronze</option>
                <option>Prata</option>
                <option>Ouro</option>
                <option>Platina</option>
                <option>Esmeralda</option>
                <option>Diamante</option>
                <option>Mestre</option>
                <option>Grão-Mestre</option>
                <option>Desafiante</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="sexo" class="form-label">Sexo</label>
                <input type="text" class="form-control" id="sexo" name="sexo">
            </div>
            <div class="col-md-4">
                <label for="equipe" class="form-label">Equipe</label>
                <select class="form-select" id="equipe" name="equipe">
                <option selected disabled value="">Selecione</option>
    `;
        if(times.length == 0){
            resposta += `</select><div><h6 class="text-danger">Não há equipes cadastrados no sistema</h6></div>`;
        } else {
            for(let i = 0; i < times.length; i++){
                resposta += `<option>${times[i].eqip}</option>`;
            }
            resposta += `</select>`;
        }
        resposta += `
            </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Cadastrar</button>
            </div>
            </form>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `;

    res.send(resposta);
});

app.post("/dcnrJogador", verificaLog, (req, res) => {
    const {nome, nick, funcao, elo, sexo, equipe} = req.body;

    if(nome && nick && funcao && elo && sexo && equipe){
        let eqipN;
        for(let i = 0; i < times.length; i++){
            if(times[i].eqip == equipe){
                eqipN = i;
                i += times.length;
            }
        }

        if(funcao == 'Top'){
            times[eqipN].top = nome;
            times[eqipN].tNick = nick;
            times[eqipN].tElo = elo;
            times[eqipN].tSexo = sexo;
        } else if(funcao == 'Jungle'){
            times[eqipN].jungle = nome;
            times[eqipN].jNick = nick;
            times[eqipN].jElo = elo;
            times[eqipN].jSexo = sexo;
        } else if(funcao == 'Mid'){
            times[eqipN].mid = nome;
            times[eqipN].mNick = nick;
            times[eqipN].mElo = elo;
            times[eqipN].mSexo = sexo;
        } else if(funcao == 'Atirador'){
            times[eqipN].atirador = nome;
            times[eqipN].aNick = nick;
            times[eqipN].aElo = elo;
            times[eqipN].aSexo = sexo;
        } else if(funcao == 'Suporte'){
            times[eqipN].suporte = nome;
            times[eqipN].sNick = nick;
            times[eqipN].sElo = elo;
            times[eqipN].sSexo = sexo;
        }

        res.redirect("/chcrEquipe");
    } else {
        let resposta = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Atividade Final</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/menu">MENU</a>
            </div>
        </nav>

        <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Jogadores</h1>
            <form method="POST" action="/dcnrJogador" class="row g-3 m-3 p-3 bg-light">
            <div class="col-md-5">
                <label for="nome" class="form-label">Nome do Jogador</label>
                <input type="text" class="form-control" id="nome" name="nome" value="${nome}">
        `;
        if(!nome){
            resposta += `<div><h6 class="text-danger">Por favor, insira o nome do jogador</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-md-5">
                <label for="nick" class="form-label">Nickname in-game</label>
                <input type="text" class="form-control" id="nick" name="nick" value="${nick}">
        `;
        if(!nick){
            resposta += `<div><h6 class="text-danger">Por favor, insira o nickname do jogador</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-md-2">
                <label for="funcao" class="form-label">Função</label>
                <select class="form-select" id="funcao" name="funcao">
                <option selected disabled value="">Selecione</option>
                <option>Top</option>
                <option>Jungle</option>
                <option>Mid</option>
                <option>Atirador</option>
                <option>Suporte</option>
                </select>
        `;
        if(!funcao){
            resposta += `<div><h6 class="text-danger">Por favor, selecione a função do jogador</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-md-4">
                <label for="elo" class="form-label">Elo do Jogador</label>
                <select class="form-select" id="elo" name="elo">
                <option selected disabled value="">Selecione</option>
                <option>Ferro</option>
                <option>Bronze</option>
                <option>Prata</option>
                <option>Ouro</option>
                <option>Platina</option>
                <option>Esmeralda</option>
                <option>Diamante</option>
                <option>Mestre</option>
                <option>Grão-Mestre</option>
                <option>Desafiante</option>
                </select>
        `;
        if(!elo){
            resposta += `<div><h6 class="text-danger">Por favor, selecione a elo do jogador</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-md-4">
                <label for="sexo" class="form-label">Sexo</label>
                <input type="text" class="form-control" id="sexo" name="sexo" value="${sexo}">
        `;
        if(!sexo){
            resposta += `<div><h6 class="text-danger">Por favor, insira o sexo do jogador</h6></div>`;
        }
        resposta += `
            </div>
            <div class="col-md-4">
                <label for="equipe" class="form-label">Equipe</label>
                <select class="form-select" id="equipe" name="equipe">
                <option selected disabled value="">Selecione</option>
    `;
        if(times.length == 0){
            resposta += `</select><div><h6 class="text-danger">Não há equipes cadastrados no sistema</h6></div>`;
        } else {
            for(let i = 0; i < times.length; i++){
                resposta += `<option>${times[i].eqip}</option>`;
            }
            resposta += `</select>`;
            if(!equipe){
                resposta += `<div><h6 class="text-danger">Por favor, selecione a equipe do jogador</h6></div>`;
            }
        }
        resposta += `
            </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Cadastrar</button>
            </div>
            </form>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `;

    res.send(resposta);
    }
});



//LOGIN



app.get("/signin", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Atividade Final</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
        <div class="container">
        <h1 class="text-center border m-3 p-3 bg-light">Sign In</h1>
        <form method="POST" action="/signar" class="col g-3 m-3 p-3 bg-light">
            <div class="col-8 mx-auto">
                <label for="usuario" class="form-label">Nome de Usuário</label>
                <input type="text" class="form-control" id="user" name="user" aria-describedby="emailHelp">
            </div>
            <div class="col-8 mx-auto">
                <label for="senha" class="form-label">Senha</label>
                <input type="password" class="form-control" id="pass" name="pass">
            </div>
            <div class="col-8 mx-auto">
                <label for="senha2" class="form-label">Repetir Senha</label>
                <input type="password" class="form-control" id="pass2" name="pass2">
            </div>
            <div class="row m-3">
                <button type="submit" class="btn btn-primary col-5 ms-auto me-5" style="width: 11rem;">Criar Conta</button>
                <a class="btn btn-secondary col-5 me-auto" href="/" style="width: 11rem;">Voltar</a>
            </div>
        </form>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>    
    `);
});

app.post("/signar", (req, res) => {
    const {user, pass, pass2} = req.body;

    if(user && pass && (pass == pass2)){
        req.session.dadosLogin = {
            logado: true,
            usuario: user,
            senha: pass
        };
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Atividade Final</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
                <div class="container shadow p-3 bg-body rounded text-center">
                    <p class="fs-2">Conta criada com sucesso!</p>
                    <p class="fs-4">Clique <a href="/menu">aqui</a> para voltar ao menu principal.</p>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>
        `);
    } else {
        let resposta = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Atividade Final</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
            <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Sign In</h1>
            <form method="POST" action="/signar" class="row g-3 m-3 p-3 bg-light">
                <div class="col-8 mx-auto">
                    <label for="usuario" class="form-label">Nome de Usuário</label>
                    <input type="text" class="form-control" id="user" name="user" value="${user}" aria-describedby="emailHelp">
        `;
        if(!user){
            resposta += `<div><h6 class="text-danger">Por favor, informe o seu Nome de Usuário</h6></div>`;
        }
        if(user == req.session?.dadosLogin?.usuario){
            resposta += `<div><h6 class="text-danger">Você já está usando este nome de usuário</h6></div>`;
        }
        resposta += `
                </div>
                <div class="col-8 mx-auto">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="pass" name="pass" value="${pass}">
        `;
        if(!pass){
            resposta += `<div><h6 class="text-danger">Por favor, informe a sua Senha</h6></div>`;
        } else if(pass != pass2){
            resposta += `<div><h6 class="text-danger">As senhas não são iguais</h6></div>`;
        }

        resposta += `
                </div>
                <div class="col-8 mx-auto">
                    <label for="senha2" class="form-label">Repetir Senha</label>
                    <input type="password" class="form-control" id="pass2" name="pass2" value="${pass2}">
                </div>
                <div class="row m-3">
                    <button type="submit" class="btn btn-primary col-5 ms-auto me-5" style="width: 11rem;">Criar Conta</button>
                    <a class="btn btn-secondary col-5 me-auto" href="/" style="width: 11rem;">Voltar</a>
                </div>
            </form>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html> 
        `;
        res.send(resposta);
    }
});

app.get("/login", (req, res) => {
    if(!req.session.dadosLogin){
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Atividade Final</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
                <div class="container shadow p-3 bg-body rounded text-center">
                    <p class="fs-2">Você ainda não criou sua conta</p>
                    <p class="fs-4">Clique <a href="/signin">aqui</a> para ser direcionado para a página de Sign In.</p>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Atividade Final</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
            <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Log In</h1>
            <form method="POST" action="/logar" class="row g-3 m-3 p-3 bg-light">
                <div class="col-8 mx-auto">
                    <label for="usuario" class="form-label">Usuário</label>
                    <input type="text" class="form-control" id="user" name="user" aria-describedby="emailHelp">
                </div>
                <div class="col-8 mx-auto">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="pass" name="pass">
                </div>
                <div class="row m-3">
                    <button type="submit" class="btn btn-primary col-5 ms-auto me-5" style="width: 11rem;">Criar Conta</button>
                    <a class="btn btn-secondary col-5 me-auto" href="/" style="width: 11rem;">Voltar</a>
                </div>
            </form>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>   
        `);
    }
});

app.post("/logar", (req, res) => {
    const {user, pass} = req.body;

    if(user == req.session?.dadosLogin?.usuario && pass == req.session?.dadosLogin?.senha){
        req.session.dadosLogin.logado = true;
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Atividade Final</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
                <div class="container shadow p-3 bg-body rounded text-center">
                    <p class="fs-2">Login efetuado com sucesso!</p>
                    <p class="fs-4">Clique <a href="/menu">aqui</a> para voltar ao menu principal.</p>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>
        `);
    } else {
        let resposta = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Atividade Final</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
            <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Log In</h1>
            <form method="POST" action="/logar" class="row g-3 m-3 p-3 bg-light">
                <div class="col-8 mx-auto">
                    <label for="usuario" class="form-label">Usuário</label>
                    <input type="text" class="form-control" id="user" name="user" value="${user}" aria-describedby="emailHelp">
        `;
        if(user != req.session?.dadosLogin?.usuario){
            resposta += `<div><h6 class="text-danger">Usuário inválido</h6></div>`;
        }
        resposta += `
                </div>
                <div class="col-8 mx-auto">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="pass" name="pass" value="${pass}">
        `;
        if(pass != req.session?.dadosLogin?.senha){
            resposta += `<div><h6 class="text-danger">Senha incorreta</h6></div>`;
        }

        resposta += `
                </div>
                <div class="row m-3">
                    <button type="submit" class="btn btn-primary col-5 ms-auto me-5" style="width: 11rem;">Criar Conta</button>
                    <a class="btn btn-secondary col-5 me-auto" href="/" style="width: 11rem;">Voltar</a>
                </div>
            </form>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>  
        `;

        res.send(resposta);
    }
});

app.post("/logout", (req, res) => {
    if(req.session.dadosLogin){
        req.session.dadosLogin.logado = false;
    }
    res.redirect("/");
});

function verificaLog(req, res, next){
    if(req.session?.dadosLogin?.logado){
        next();
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Atividade Final</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
                <div class="container shadow p-3 bg-body rounded text-center">
                    <p class="fs-2">Você não está logado</p>
                    <p class="fs-4">Clique <a href="/">aqui</a> para voltar a pagina inicial e criar ou entrar na sua conta</p>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>   
        `);
    }
}