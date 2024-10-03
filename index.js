class ApplicationView {
    constructor(){
        this.app = document.getElementById('app');
        this.searchField = this.createElement('input', 'search-field');
        this.searchField.setAttribute('type', 'text');
        this.searchField.setAttribute('placeholder', 'Введите текст...');
        this.wrapper = this.createElement('div', 'wrapper');
        this.repositoryList = this.createElement('ul', 'repositoryList');
        this.favotiteRep = this.createElement('div', 'favotite-rep');
        this.buttonClose = this.createElement('button', 'button-close')
        this.wrapper.append(this.searchField);
        this.wrapper.append(this.repositoryList);
        
        
        this.app.append(this.wrapper);
        this.app.append(this.favotiteRep);

        
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if(elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    clearValue (element){
        element.value = "";
    }

   createRepository( { name, owner, stargazers_count }){
        return `<li class="repository__li">
            <p class = "repository__item"> Name: ${name}</p>
            <p class = "repository__item"> Owner: ${owner.login} </p>
            <p class = "repository__item"> Stars: ${stargazers_count}</p>
            <button class = "repository__button button-close"></button>
             </li> `;
    }

    repoClickHandler(repo){
        const repoli = createRepository(repo);
        const newRepositoryItem = createNewElement(repoli);
        createChild(repositoryList, newRepositoryItem);
        const delRepoBtn = newRepositoryItem.querySelector('.button-close');
        delRepoBtn.addEventListener('click', delBtnClickHandler);
        clearValue(this.searchField);
    }

    createChild (parent, child){
        parent.append(child)
    }

    delBtnClickHandler (){
        const elem = this.parentNode;
        repositoryList.removeChild(elem);
    }

    createNewElement(item){
        const newElement = document.createElement('li');
        newElement.innerHTML = item;
        return newElement.firstChild;
      }

      autocomplete(repData){
        const newItem = this.createElement('li');
        newItem.innerHTML = `<p>${repData.name}</p>`;
        const newElement = this.createNewElement(newItem);
        this.repositoryList.append(newItem);
        this.createChild(this.repositoryList, newElement);
        newElement.addEventListener('click', ()=> repoClickHandler(elem));
  
    }

    

    
}


class Search {
    constructor(ApplicationView) {
        this.ApplicationView = ApplicationView;
        this.ApplicationView.searchField.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 300))
    }

    debounce = (fn, debounceTime) => {
        let timer;
    
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, debounceTime)
        }
     };
   
     updateUsers(response, isUpdate = false) {
        let users;
        if (response.ok) {
            if (!isUpdate) {
                this.clearField();
            }
            response.json().then((res) => {
                if (res.items) {
                    users = res.items;
                    users.forEach(user => this.ApplicationView.autocomplete(user));
                } else {
                    this.clearField();
                }
            });
        } else {
            console.log('Error 1' + response.status);
        }
    } 

    searchUsers() {
        if (this.ApplicationView.searchField.value) {
            this.loadUsers(this.ApplicationView.searchField.value).then(response => this.updateUsers(response))
        } else {
            this.clearField();
        }
    }
    
    async loadUsers(searchValue) {
        return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`);
    }
    clearField () {
        this.ApplicationView.repositoryList.innerHTML = '';
    }
}

new Search(new ApplicationView());
