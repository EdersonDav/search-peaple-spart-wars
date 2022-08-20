const reset = () =>{
  document.getElementById("name").innerHTML = '';
  document.getElementById("birth_year").innerHTML = '';
  document.getElementById("gender").innerHTML = '';
  document.getElementById("output-related").innerHTML = ''
  document.getElementById("related").style.display = "none";
}

// Funçã 3
// Função searchAPI recebe uma url e busca o resultado dessa url
const searchAPI = async (url) =>{
  try{
    // faz a requisição para api
    const response = await fetch(url);
    
    // pega o json do resultado 
    const data = await response.json(response);
    
    // retorna o json do resultado
    return data
    
  }catch(err){
    // se der erro mostra no console a mensagem de erro e retorna vazio
    console.log('Error ' + err.message)
    return {}
  }
  
}

// -------------------------------------------------------------

// Funçã 4
// Função getRelatedPeaplePlanet recebe a url do planeta e o nome da pessoa que foi pesquisada
// e busca os dados de um planeta e dpois as pessoas residentes
const getRelatedPeaplePlanet = async (url, name) => {
  try{
    // results é o array de pessoas relacionados
    const results = [];
    
    if(url){
      // Se existir a url do planeta é feita a requisição chamando a função searchAPI
      const dataPlanet = await searchAPI(url);
      
      // Se vier os dados de residents no planeta, é feita a busca de pessoas
      if(dataPlanet.residents.length){
        
        // Fazendo o for nas urls de pessoas residentes e bucando cada pessoa
        // se a quantidade de pessoas no array results for menor que 3
        for await (let people of dataPlanet.residents){
          if(results.length < 3){
            const data = await searchAPI(people);
            
            // Ve se veio o resultado de uma pessoa e ve se o nome não é o mesmo que foi pesquisado
            // se vier o resultado e for uma pessoa diferente adiciona essa pessoa no array results
            if(data.name && data.name !== name){
              results.push(data)
            }
          }
        }
      }
    }
    
    return results;
  }catch(err){
    // se der erro mostra no console a mensagem de erro e retorna vazio
    console.log('Error ' + err.message)
    return []
  }
}

// -------------------------------------------------------------

// Funçã 2
// Função getShowResults pega o que foi digitado e chama todas as funções para fazer as requisições 
const getShowResults = async () => {
  try{
    reset()
    // Pega o nome que foi digitado
    let query = $("#one").val().toLowerCase();
    
    // Passa a url com o nome que foi digitado para searchAPI
    const res = await searchAPI(`https://swapi.dev/api/people/?search=${query}`)
    const data = res.results[0];

    // Pessoas relacionadas "Pessoas do mesmo planeta" ------
    // Array de pessoas relacionadas
    let relateds = []
    
    // Manda o planeta e o nome da pessoa pesquisada para a função getRelatedPeaplePlanet 
    // que busca pessoas pelo planeta
    const relatedsPeaplePlanet = await getRelatedPeaplePlanet(data.homeworld, data.name);

    // Se vier adiciona os valores em relateds
    if(relatedsPeaplePlanet.length){
      relateds = relatedsPeaplePlanet
    }
    
    // ----------------------

    // Coloca o resultado no html
    let name = "NAME: " + data.name;
    let birth_year = "BIRTH YEAR: " + data.birth_year;
    let gender = "GENDER: " + data.gender;
    
    document.getElementById("name").innerHTML = name;
    document.getElementById("birth_year").innerHTML = birth_year;
    document.getElementById("gender").innerHTML = gender;

    document.getElementById("output").style.visibility = "visible";

    // Mostra no consoles as pessoas relacionadas
    console.log(relateds)
    

    // Adiciona pessoas relacionadas no html
    if(relateds.length){
      relateds.forEach(peaple => {
        document.getElementById("output-related").innerHTML += `<h2>NAME: ${peaple.name} </h2>`
      })
      document.getElementById("related").style.display = "block";
    }


    $("#output").css("animation-play-state", "running");
    
    
  }catch(err){
    // se der erro mostra no console a mensagem de erro
    console.log('Error ' + err.message)
  }
} 
// -------------------------------------------------------------




// Funçã 1
window.onload = () => {
  // Chama a função getShowResults quando clica no botão submit
 $("#submit").click(getShowResults);
};

// -------------------------------------------------------------