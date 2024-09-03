"use strict";

function calculate(){

    var amount = document.getElementById("amount");
    var apr = document.getElementById("apr");
    var years = document.getElementById("years");
    var zipcode = document.getElementById("zipcode");
    var payment = document.getElementById("payment");
    var total = document.getElementById("total");
    var totalinterest = document.getElementById("totalinterest");

    //Presume que tudo isso é válido.
    //Converta os juros de porcentagem para decimais e converte de taxa
    // anual para taxa mensal. Converte o período de pagamento em ano para o número de pagamento mensais.

    var principal = parseFloat(amount.value);
    var interest = parseFloat(apr.value) / 100 / 12;
    var payments = parseFloat(years.value) * 12;

    // Calcula o valor do pagamento mensal.
    var x = Math.pow(1 + interest, payments);
    var monthly = (principal*x*interest)/(x-1);

{/**Se o resultado é um número finito, a entrada do usuário estava correta 
e temos resultados significativos para exibir  */}

    if(isFinite(monthly)){
        // Preenche os campos de saída, arredondando para 2 casas decimais
        payment.innerHTML = monthly.toFixed(2);
        total.innerHTML = ((monthly * payments)-principal).toFixed(2);

        //Salva a entrada do usuário para que possamos recuperá-la na próxima vez 
        // que ele visitar
        save(amount.value, apr.value, years, value, zipcode,value);

        try { // Captura quaisquer errors que ocorram dentro destas chaves
            getLenders(amount.value, apr.value, years,value, zipcode,value);

        }
        catch(e){/**E ignora esses erros */}

        {/* Por fim, traça o gráfico do saldo devedor,
             dos juros e dos pagamentos do capital*/}

        chart(principal, interest,monthly,payments);
    }
    else{
        payment.innerHTML = ""; // Apaga o conteúdo desses elemetos
        total.innerHTML = "";
        totalinterest.innerHTML = "";
        chart(); // Sem argumentos, apaga o gráfico
    }
};

{/** Salvando a entrada do usuário como propriedades do objeto localStorage. 
    Essas propriedades ainda existirão quando o usuário visitar no futuro;
    Esse recurso de armazenamento não vai funcionar em alguns navegadores (o Firefox, por exemplo).
 */}
function save(amount, apr, years, zipcode){
    if(window.localStorage){
        //Só faz isso se o navegador suportar
        localStorage.loan_amount = amount;
        localStorage.loan_apr = apr;
        localStorage.loan_years = years;
        localStorage.loan_zipcode = zipcode;

    }
};

{/** Tenta restaurar os campos de entrada automaticamente quando o documento
    é carregado pela primeira vez. */}
window.onload = function(){

    if (window.localStorage && localStorage.loan_amount){
        document.getElementById("amount").value = localStorage.loan_amount;
        document.getElementById("apr").value = localStorage.loan_apr;
        document.getElementById("years").value = localStorage.loan_years;
        document.getElementById("zipcode").value = localStorage.loan_zipcode;

    }
};

{/**Passa a entrada do usuário para um script no lado do servidor que (teoricamente) pode 
    retornar uma LISTA de links para financeiras locais interessadas em faze empréstimos. 
    
    Aqui não constém uma implementação real desse serviço de busca de financeiras...
    Mas se o serviço existisse...*/}

function getLenders(amount, apr, years, zipcode){
    //Verificação se o navegador não suporta o objeto XMLHttpRequest, não faz nada
    if (!window.XMLHttpRequest) return;

    //Localiza o elemento para exibir a lista de financeiras
    var ad = document.getElementById("lenders");
    if(!ad) return // Encerra se não há ponto de saída
    //Codifica a entrada do usuario como parâmetro de consulta em um URL

    var url = "getLenders.php"+ //Url do serviço mais dados do usuário na String de consulta
        "?amt=" + encodeURIComponent(amount) + 
        "&apr=" + encodeURIComponent(apr) +
        "&yrs=" + encodeURIComponent(years) +
        "&zip=" + encodeURIComponent(loan_zipcode);

    // Busca conteúdo desse URL usando o objeto XMLHttpsRequest 
    var req = new XMLHttpRequest();
    req.open("GET", url); // Um pedido GET da Http para URL
    req.send(null); //Envia pedido sem corpo

    
    {/** Antes de retornar, registra uma função de rotina de tratamento de evento
        que será chamada em um momento posterior, quando a respota do servidor de HTTP chegar. 
        Programação assícrona - lado do Client.
    */}
    req.onreadystatechange = function(){

        if(req.readyState == 4 && req.status == 200){
            var response = req.responseText; // Respota HTTP válida e completa
            var lenders = JSON.parse(response); // Analisa em um array JS

            //Converte o array de obejetos lender em uma String HTML
            var list = "";
            for(var i = 0; i < lenders.length; i++){
                list += "<li><a href='"+ lenders[i].url + "'>" +
                lenders[i].name + "</a>";
            }

            //Exibe o código HTML no elemento acima.
            ad.innerHTML = "<ul>"+ list + "</ul>";
        }
    }
}
  