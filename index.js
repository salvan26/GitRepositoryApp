const search = document.querySelector(".repository__search");
const autocomplete = document.querySelector('.repository__autocomplete');
const repositoryList = document.querySelector('.repository__list');
const gitAPI = 'https://api.github.com/search/repositories?q=';
const app = document.querySelector('.repository_form')


function clearElem (parent){
    parent.innerHTML = "";
}
function clearValue (element){
    element.value = "";
}

function createChild (parent, child){
    parent.append(child)
}

function  delBtnClickHandler (){
    const elem = this.parentNode;
    repositoryList.removeChild(elem);
}

function  createRepository( { name, owner, stargazers_count }){
    return `<li class="repository__li">
        <p class = "repository__item"> Name: ${name}</p>
        <p class = "repository__item"> Owner: ${owner.login} </p>
        <p class = "repository__item"> Stars: ${stargazers_count}</p>
        <button class = "repository__button button-close"></button>
         </li> `;
}

function createNewElement(item){
  const newElement = document.createElement('li');
  newElement.innerHTML = item;
  return newElement.firstChild;
}

function repoClickHandler(repo){
    const repoli = createRepository(repo);
    const newRepositoryItem = createNewElement(repoli);
    createChild(repositoryList, newRepositoryItem);
    const delRepoBtn = newRepositoryItem.querySelector('.button-close');
    delRepoBtn.addEventListener('click', delBtnClickHandler);
    clearValue(search);
}


function autocompleteSearch(RepoDate){
    if (autocomplete.firstChild)  clearElem(autocomplete);
    return RepoDate.forEach( elem => {
        const newItem = `<li class = "autocomplete__li">${elem.name}</li>`;
        const newElement =  createNewElement(newItem);
        createChild(autocomplete, newElement);
        newElement.addEventListener('click', ()=> repoClickHandler(elem));
    })
}

async function  getRepoData(repoName){
  return  await fetch(`${gitAPI}${repoName}`)
      .then( response => response.json())
      .then( res => res.items.slice(0,5))
      .then( res => autocompleteSearch(res))
      .catch( e => console.log('Error', e));
}


const debounce = (cb, debounceTime) => {
    let debounceActive;
    return function () {
        clearTimeout(debounceActive);
        debounceActive = setTimeout(() =>  
          cb.apply( this, arguments), debounceTime);
    }
}

const debounceRepoDate = debounce(getRepoData, 300);

function windowEscHandler(evt){
    if(evt.keyCode == 27) {
        clearElem(autocomplete);
        window.removeEventListener('keydown', windowEscHandler);
        window.removeEventListener('click', windowClickHandler);
        search.addEventListener('click', searchClickHandler);
    }
}

function windowClickHandler(evt){
    if( evt.target!== search ) {
        clearElem(autocomplete);
        window.removeEventListener('keydown', windowEscHandler);
        window.removeEventListener('click', windowClickHandler);
        search.addEventListener('click', searchClickHandler);
    }
}

function searchClickHandler(evt) {
  if (evt.key === 'Enter') {
      console.log('Enter pressed');
      evt.preventDefault();
  }
    const newRequest = evt.target.value;
    newRequest ? debounceRepoDate(newRequest) : clearElem(autocomplete);
    window.addEventListener('keydown', windowEscHandler);
    window.addEventListener('click', windowClickHandler);
    search.removeEventListener('click', searchClickHandler);
}

function formEnterHandler(event){
    if(event.keyCode =='Enter') 
      event.preventDefault()
}

app.addEventListener('keydown', formEnterHandler);
search.addEventListener('input', searchClickHandler);