var meses = {
    mes:["Janeiro ", "Fevereiro ", "Março ", "Abril ", "Maio ", "Junho ", "Julho ", "Agosto ", "Setembro ", "Outubro ", "Novembro ", "Dezembro "],
    dias_no_mes: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}
var TXTmes = ""
var ano = 0
function Iniciar_Eventos(){
    var prox_mes = document.getElementById("prox_mes")
    var ant_mes = document.getElementById("ant_mes")
    prox_mes.addEventListener("click", Avancar_Mes)
    ant_mes.addEventListener("click", Retornar_Mes)
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
                //console.log(meses.dias_no_mes[0])
            }else{
                Exibir_Calendario_do_Mes(index, meses.dias_no_mes[index],meses.dias_no_mes[index + 1], null, 1)
                //console.log(meses.dias_no_mes[index + 1]) 
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
    // troca_ano recebe true caso a troca de ano
    //direcao  indica a direcao da troca de mes, 1= direita (próximo) e -1 = esquerda (anterior)
    // 42 elementos com a classe dia
    if(direcao == 1){
        var qual_Linha = []
        var qual_dia_semana = []
        // dias_da_semana somente os numeros pares de 0 a 12 e representa os dias a semana (domingo, segunda, etc..)
        for (let c = 1; c <= 6; c++){
            for(let i = 0; i <= 12; i = i + 2){
                if(Number(document.getElementById("semana" + c).childNodes[i].innerHTML) == dias_mes_atual){
                    qual_Linha.push(c)
                    qual_dia_semana.push(i)
                    //Agora eu consigo identificar qual o dia da semana corresponde ao último dia do mês, assim como a posicao dele no calendario.
                }
            }
        }
        var dia = 1
        var N_da_Semana = Numero_da_Semana(Number(qual_dia_semana[qual_dia_semana.length-1]))
        for (var c = 1; c <= 6; c++){
            for(var i = N_da_Semana; i <= 12; i = i + 2){
                document.getElementById("semana" + c).childNodes[i].innerHTML = dia
                dia++
                if(dia > dias_totais){
                    dia = 1
                }
            }
            N_da_Semana = 0
        }
        //console.log(dias_totais + " total de dias mes seguinte")
        N_da_Semana = Numero_da_Semana(Number(qual_dia_semana[qual_dia_semana.length-1]))
        Completar_Calendario(index, null, N_da_Semana, dias_mes_atual, 1)

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
                        for(let v = 4; v <= 6; v++){
                            for(let l = 0; l <= 12; l = l + 2){
                                if(Number(document.getElementById("semana" + v).childNodes[l].innerHTML) == dt){
                                    var contagem_dias = 1
                                    var linha = v
                                    var continuar_escrevendo_em = l + 2
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
                                    identificar_fim = g
                                    dia = 1
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
        //Preciso saber quantos dias tem dois meses anteriores ao que foi clicado em retornar, para poder completar o calendario, por isso chamei esse função.
    }

}
window.addEventListener("load", Iniciar_Eventos())