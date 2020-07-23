

function populateUFs() {   
    const ufSelect = document.querySelector("select[name=uf]")
    
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {


        for( const state of states) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }

    })
}

populateUFs()


function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")


    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => {
        

        for( const city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })
}




document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)
    
// Itens de coleta
// pegar todos os li´s
const itemsToColllect = document.querySelectorAll(".items-grid li")

for (const item of itemsToColllect){
    item.addEventListener("click", handleSelectedItem)
}



const collectedItems = document.querySelector("input[name=items]")

//const é uma constante e let é uma variável ela pode mudar de valores depois 
//diferente do const.    
let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target
    
    // Adicionar ou remover em javascript utilizamos a propriedade 
    // toggle.
    // Se quisermos só remover adicionamos a propriedade (remove). 
    // Se fosse para adicionar utilizamos o (add).

    itemLi.classList.toggle("selected")

    const itemId = event.target.dataset.id 

    console.log('ITEM ID: ', itemId)
    
    // verificar se existem itens selecionados, se sim 
    // pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId // isso será true ou false
        return itemFound
    })

    // se já estiver selecionado, tirar da seleção

     if( alreadySelected >= 0) {
        // tirar da seleção
        const filteredItems = selectedItems.filter( item => {
            const itemDifferent = item != itemId
            return itemDifferent
        })

        selectedItems = filteredItems
    } else {
        //se não estiver selecionado
        // adicionar à seleção
        selectedItems.push(itemId)
    }

    console.log('selectedItems: ', selectedItems)

    // atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
    
}