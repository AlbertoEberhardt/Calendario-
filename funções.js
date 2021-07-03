var meses = {
    mes:["Janeiro ", "Fevereiro ", "Março ", "Abril ", "Maio ", "Junho ", "Julho ", "Agosto ", "Setembro ", "Outubro ", "Novembro ", "Dezembro "],
    dias_no_mes: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}
var TXTmes = ""
function Iniciar_Eventos(){
    var prox_mes = document.getElementById("prox_mes")
    var ant_mes = document.getElementById("ant_mes")
    var ano_label = document.getElementById("ano")
    prox_mes.addEventListener("click", Avancar_Mes)
    ant_mes.addEventListener("click", Retornar_Mes)
    ano_label.addEventListener("dblclick", Selecao_de_ano)
    Estilo_pre_pronto()
    Abrir_no_mes_Atual(ano_label, prox_mes)
}
function Selecao_de_ano(){
    var ano_digitado = Number(window.prompt("Digite o ano que voçê deseja"))
    var diferenca = 0
    var total = 0
    if(ano_digitado != 0){
        if( ano_digitado > Number(this.innerHTML)){
            diferenca = ano_digitado - Number(this.innerHTML)
            total = diferenca * 12
            for (let s = 0; s < total; s++){
                document.getElementById("prox_mes").click()
            }
        }else{
            diferenca = Number(this.innerHTML) - ano_digitado
            total = diferenca * 12
            for (let s = 0; s < total; s++){
                document.getElementById("ant_mes").click()
            }
        }
    }
}
function Avancar_Mes(){
    TXTmes = mes.innerHTML + " "
    meses.mes.forEach(function(item, index){
        if(TXTmes.match(item)){
            mes.innerHTML = meses.mes[index + 1]
            if(index == 11){
                // Ativa a função para avançar um ano quando chegar em Dezembro
                Trocar_de_Ano(1)
                Exibir_Calendario_do_Mes(index, meses.dias_no_mes[11], meses.dias_no_mes[0],null, 1)
            }else{
                Exibir_Calendario_do_Mes(index, meses.dias_no_mes[index],meses.dias_no_mes[index + 1], null, 1)
            }
        }
    })
}
function Retornar_Mes(){
    TXTmes = mes.innerHTML + " "
    meses.mes.forEach(function(item, index){
        if(TXTmes.match(item)){
            mes.innerHTML = meses.mes[index - 1]
            if(index == 0){
                // Ativa a função para retornar um ano quando chegar em Janeiro
                Trocar_de_Ano(-1)
                Exibir_Calendario_do_Mes(index, meses.dias_no_mes[0], meses.dias_no_mes[index], meses.dias_no_mes[Dois_Meses_Atras_dias_totais(index)], -1)
            }else{
               Exibir_Calendario_do_Mes(index, meses.dias_no_mes[index],meses.dias_no_mes[index - 1], meses.dias_no_mes[Dois_Meses_Atras_dias_totais(index)], -1)
            }  
        }
    })
}
function Trocar_de_Ano(indice){
    Label_ano = document.querySelector("label#ano")
    Number_ano = Label_ano.innerHTML
    Number_ano = Number(Number_ano)
    if(indice == -1){
        Label_ano.innerHTML = Number_ano - 1
        mes.innerHTML = meses.mes[11]
    }else{
        Label_ano.innerHTML = Number_ano + 1
        mes.innerHTML = meses.mes[0]
    }
    Ano_bisexto(Number(Label_ano.innerHTML))
}

function Ano_bisexto(Ano){
    if(Ano % 4 == 0){
        meses.dias_no_mes.splice(1, 1, 29)
    }else{
        meses.dias_no_mes[1] = 28
    }
}

function Dois_Meses_Atras_dias_totais(p){
    if(p >= 2){
        return p - 2
    }else if (p == 0){
        return 10
    }else{
        return meses.dias_no_mes.length - 1
    }
}

function Exibir_Calendario_do_Mes(index, dias_mes_atual, dias_totais, dias_dois_meses_atras, direcao){
    //index => quando clicado em avançar/retornar informa o indice do mes clicado
    //dias_mes_atual => quando clicado em avançar/retornar recebe o total de dias do mes que foi clicado.
    //dias_totais => recebe quantos dias tem no mes seguinte quando clicado em avançar, quando clicado em retornar informa o total de dias do mes anterior ao mes que sofreu evento de clique ocorreu.
    //dias_dois_meses_atras recebe o total de dias de dois meses atras, para caso necessário completar o calendário, quando o primeiro dia do mês não é um domingo.
    //direcao  indica a direcao da troca de mes, 1= direita (próximo) e -1 = esquerda (anterior)
    // 42 elementos com a classe dia
    if(direcao == 1){
        var qual_Linha = []
        var qual_dia_semana = []
        // dias_da_semana somente os numeros pares de 0 a 12 representam os dias a semana (domingo, segunda, etc..)
        for (let c = 1; c <= 6; c++){
            for(let i = 0; i <= 12; i = i + 2){
                if(Number(document.getElementById("semana" + c).childNodes[i].innerHTML) == dias_mes_atual){
                    qual_Linha.push(c)
                    qual_dia_semana.push(i)
                    //Agora eu consigo identificar qual o dia da semana corresponde ao último dia do mês, assim como a posicão dele no calendario.
                }
            }
        }
        var dia = 1
        var N_da_Semana = Numero_da_Semana(Number(qual_dia_semana[qual_dia_semana.length-1]))
        var identificar_fim = 0
        var identificar_semana = 0
        for (var c = 1; c <= 6; c++){
            for(var i = N_da_Semana; i <= 12; i = i + 2){
                document.getElementById("semana" + c).childNodes[i].innerHTML = dia
                dia++
                if(dia > dias_totais){
                    identificar_fim = i
                    identificar_semana = c
                    dia = 1
                }
            }
            N_da_Semana = 0
        }
        N_da_Semana = Numero_da_Semana(Number(qual_dia_semana[qual_dia_semana.length-1]))
        Completar_Calendario(index, null, N_da_Semana, dias_mes_atual, 1)
        Cinzar_dias_outro_mes(identificar_fim + 2, identificar_semana)
        Estilo_Primeira_linha()

    }else if(direcao == -1){
        var posicao_ultimo_dia_do_mes = 0
        for(let c = 0; c <= 12 ; c = c + 2){
            if(Number(document.getElementById("semana1").childNodes[c].innerHTML) == 1){
                c - 2 < 0 ? posicao_ultimo_dia_do_mes = 12 : posicao_ultimo_dia_do_mes = c - 2;
                //ultização de if Ternário, onde eu escrevo a condição, coloco ponto de interrogação, a primeira intrução é executada se a condição me satisfaz, senão é feita a intrução ordenada após os dois pontos (":").
            }
        }
       //Agora eu sei em qual dia da semana o ultimo dia do mes anterior corresponde, essa informação fica aramazenada em "posicao_ultimo_dia_do_mes" 
        var dia = dias_totais
        var posicoes_dos_dias = posicao_ultimo_dia_do_mes
       for(let p = 6; p > 0; p--){
            for (let j = posicoes_dos_dias; j >= 0; j = j -2){
                document.getElementById("semana" + p).childNodes[j].innerHTML = dia
                dia --
                if(dia == 0){
                    dia = dias_dois_meses_atras
                }
            }
            posicoes_dos_dias = 12
        }
        //Identificar_pos_do_dia_um()
        Completar_Calendario(index, dias_totais, posicao_ultimo_dia_do_mes + 2, null, -1)
    }
}
function Numero_da_Semana(d){
    if(d == 12){
        return 0
    }else{
        return d + 2
    }
}
function Completar_Calendario(index, dt, n, d, sentido_clique){
    /* 
    index => recebe o indice que indica o nome/quantos dias tem o mes anterior ao exibido na tela -> isto quando eu clico em avançar.
    Quando eu clico em retornar exibe o indice do mês que aparece na tela.

    dt => indica o total de dias do mes que ira aprecer na tela ao clicar em voltar, quando clicado em avançar seu valor é ///null///        
    n => indica a posicão do primeiro dia no calendario (lembrando que as posições vão de 0 a 12, sempre pulando 2, para a próxima posição),
    quando clicado em voltar exibe a posição do primeiro dia do mes em que ocorreu o evento do clique, para depois poder formar o calendário do mes anterior apartir do seu ultimo dia, até o primeiro.

    d => recebe o total de dias do mes anterior, ao que aparece no calendario 
    */
    var linha = 0
    if(sentido_clique == 1){
        for(let g = n - 2; g >= 0; g = g - 2){
            document.getElementById("semana1").childNodes[g].innerHTML = d
            d--
        }
    }else{
        //Primeiramente tenho que identificar se o dia primeiro está na primeira linha, caso não esteja eu tenho que identificar a posição dele e coloca-lo na primeira linha.
        //Segundamente tenho que achar em qual linha fica o último dia.
        for(let j = 1; j <= 3; j++){
            for(let c = 0; c <= 12; c = c + 2){
                if(Number(document.getElementById("semana" + j).childNodes[c].innerHTML) == 1){
                    if(j == 1){
                        //Se o dia primeiro já está na primeira linha...
                        for(let v = 4; v <= 6; v++){
                            for(let l = 0; l <= 12; l = l + 2){
                                if(Number(document.getElementById("semana" + v).childNodes[l].innerHTML) == dt){
                                    
                                    var contagem_dias = 1
                                    linha = v
                                    var continuar_escrevendo_em = l + 2
                                    Cinzar_dias_outro_mes(l + 2, v)
                                    for(let z = linha; z <= 6; z++){
                                        for(let x = continuar_escrevendo_em; x <= 12; x = x + 2){
                                            document.getElementById("semana" + z).childNodes[x].innerHTML = contagem_dias
                                            contagem_dias++
                                        }
                                    }
                                    break
                                }
                            }
                        }
                        break
                    }else{
                        // Se o dia primeiro não está na primeira linha...
                        var dia_da_semana = c
                        var backup_dia_da_semana = dia_da_semana
                        let dia = 1
                        //dt é o total de dias do mês
                        j = 4
                        c = 13
                        if(index == 0){
                            index = meses.dias_no_mes.length
                        }
                        for(let p = 1; p <= 6; p++){
                            for(let g = dia_da_semana; g <= 12; g = g + 2){
                                document.getElementById("semana" + p).childNodes[g].innerHTML = dia
                                dia++
                                if(dia > meses.dias_no_mes[index-1]){
                                    dia = 1
                                    Cinzar_dias_outro_mes(n, p)
                                }
                            }
                            dia_da_semana = 0
                        }
                        break
                    }
                }
            }
        }
        Completar_Calendario(null, null, backup_dia_da_semana, meses.dias_no_mes[Dois_Meses_Atras_dias_totais(index)], 1)
        //Preciso saber quantos dias tem dois meses anteriores ao que foi clicado em retornar, para poder completar o calendario, por isso chamei a função acima.
        Estilo_Primeira_linha()
    }
}

function Estilo_pre_pronto(){
    //Estilo Pronto do mês de janeiro de 2021, pois aindo não foi clicado em avnçar ou retornar para se obter os valores necessários para aplicar o estilo dinamicamente.
    document.getElementById("semana1").childNodes[0].style = "color: rgb(236, 122, 122);"
    for(let c = 2; c < 10; c = c + 2){
        document.getElementById("semana1").childNodes[c].style = "color: gray;"
    }
    for(let c = 2; c <= 12; c = c + 2){
        document.getElementById("semana6").childNodes[c].style = "color: gray;"
    }
}

function Estilo(){
    //Reseta o estilo das cores dos dias, para poder ser aplicado de acordo com cada mês.
    for(let c = 1; c <= 6; c++){
        for(let i = 2; i <= 12; i = i + 2){
            document.getElementById("semana" + c).childNodes[i].style = "color: black;"
        }
    }
    for(let c = 1; c < 7; c++){
        document.getElementById("semana" + c).childNodes[0].style = "color: red;"
    }
}

function Cinzar_dias_outro_mes(pos1, linha_pos1){
    /* pos1 => recebe a posição do primeiro dia do mes seguinto do que é exibido na tela

    linha_pos1 => identifica a linha do primeiro dia do mes seguinte do que é exibido na tela  */
    
    Estilo()
    if(pos1 > 12){
        //Quando o mes exibido na tela termina num sábado.
        linha_pos1++
        pos1 = 0
    }
    for (let c = linha_pos1 ; c <= 6; c++){
        for(let i = pos1; i <= 12; i = i + 2){
            if(i == 0){
                //Domingos
                document.getElementById("semana" + c).childNodes[i].style = "color: rgb(236, 122, 122);" 
            }else{
                document.getElementById("semana" + c).childNodes[i].style = "color: gray;"
            }
            if(i == 12){
                pos1 = 0
            }
        }
    }
}
function Estilo_Primeira_linha(){
    // Define o estilo da primeira linha do calendário, caso o mês não comece num Domingo.
    var indice = 0
    var cores = ["color: gray;", "color: rgb(236, 122, 122);"]
    var Txt_numero = document.getElementById("semana1").childNodes[indice].innerHTML
    while(Number(Txt_numero) != 1){
        indice == 0 ? document.getElementById("semana1").childNodes[indice].style = cores[1] : document.getElementById("semana1").childNodes[indice].style = cores[0];
        indice += 2
        Txt_numero = document.getElementById("semana1").childNodes[indice].innerHTML
    }
}
function Abrir_no_mes_Atual(V_ano_label, prox_mes){
    var data = new Date()
    var dia = data.getDate()// Tem o dia
    var mes = new Date()
    var N_mes = mes.getMonth()//Tem o mes em forma de array
    var ano = new Date()
    var N_ano = ano.getFullYear() // Tem o ano
    if(N_ano == Number(V_ano_label.innerHTML)){
        for(let c = 0; c < N_mes; c++){
            prox_mes.click()
        }
    }else{
        Diferenca_entre_anos = N_ano - Number(V_ano_label.innerHTML)
        let Total_cliques = (Diferenca_entre_anos*12) + N_mes
        for(let c = 0; c < Total_cliques; c++){
            prox_mes.click()
        }
    }
    var Dias_Iguais = []
    var posicão_Linha = []
    var posicao_Dia_da_Semana = []
    for( let c = 1; c <= 6; c++){
        for(let i = 0; i <= 12; i += 2){
            var TXT_dias_Calendario = document.getElementById("semana" + c).childNodes[i].innerHTML
            var N_dias_Calendario = Number(TXT_dias_Calendario)
            if(N_dias_Calendario == dia){
                Dias_Iguais.push(N_dias_Calendario)
                posicão_Linha.push(c)
                posicao_Dia_da_Semana.push(i)
            }
        }
    }
    if(Dias_Iguais.length > 1 && dia > 15){
        //Dois dias repetidos e fim do mes, usar o indice 1
        document.getElementById("semana" + posicão_Linha[1]).childNodes[posicao_Dia_da_Semana[1]].style = "color: blue"
    }else if (Dias_Iguais.length > 1 && dia < 15 || Dias_Iguais.length == 1){
        //Dois dias repetidos e inicio do mes, usar o indice 0
        document.getElementById("semana" + posicão_Linha[0]).childNodes[posicao_Dia_da_Semana[0]].style = "color: blue"
    }
}
window.addEventListener("load", Iniciar_Eventos())