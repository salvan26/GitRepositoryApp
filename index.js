
class RepositoryManager {
    constructor() {
        this.searchInput = document.querySelector('.repository-search-input');
        this.searchInput.setAttribute('placeholder', 'Поиск репозитория...');
        this.autocompleteList = document.querySelector('.repository-autocomplete-list');
        this.repositoryList = document.querySelector('.repository-list');
        this.repositories = [];
    }

    async searchRepositories(query) {
        if (query !== "" && query !== undefined &&  query.trim()){
        
        const apiResponse = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`);
        const data = await apiResponse.json();
        return data.items.slice(0, 5);}
    }

    async loadRepositories(query) {
        try {
            const repositories = await Promise.all(
                [query].map(async (term) => {
                    const result = await this.searchRepositories(term);
                    return result.map(repo => ({ ...repo }));
                })
            );
            return repositories.flat().reduce((acc, repo) => acc.concat(repo), []);
        } catch (error) {
            console.error('Ошибка при загрузке репозиториев:', error);
            return [];
        }
    }

    createRepositoryItem(repo) {
        return `
            <p>Name:${repo.name}</p>\n
            <p>Owner:${repo.owner.login}</p>\n
            <p>Stars:${repo.stargazers_count}</p>
            <button class="repository-delete-button">X</button>
        `;
    }

    addRepositoryToList(repo) {
        const item = this.createRepositoryItem(repo);
        const li = document.createElement('li');
        li.innerHTML = item;
        this.repositoryList.appendChild(li);
        li.querySelector('.repository-delete-button').addEventListener('click', () => this.removeRepository(li));
        this.autocompleteList.innerHTML = '';
        this.clearInput();
    }

    removeRepository(element) {
        element.remove();
    }

    clearInput() {
        this.searchInput.value = '';
    }

    updateAutocomplete(query) {
        this.autocompleteList.innerHTML = '';
        this.loadRepositories(query).then(repos => {
            repos.forEach(repo => {
                const li = document.createElement('li');
                li.textContent = repo.name;
                li.addEventListener('click', () => this.addRepositoryToList(repo));
                this.autocompleteList.appendChild(li);
            });
        }).catch(error => {
            console.error('Ошибка при обновлении автодополнения:', error);
        });
    }

    handleInputChange(event) {
        const query = event.target.value;
        this.updateAutocomplete(query);
    }

    handleEnterPress(event) {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        this.handleInputChange(event);
    }

    debounce = (fn, debounceTime) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, debounceTime);
        };
    };

    init() {
        this.searchInput.addEventListener('input', this.debounce(this.handleInputChange.bind(this), 500));
        this.searchInput.addEventListener('keypress', this.handleEnterPress.bind(this));
        this.repositoryList.addEventListener('click', (e) => {
            if (e.target.classList.contains('repository-delete-button')) {
                e.stopPropagation();
                this.removeRepository(e.target.closest('.repository-item'));
            }
        });
    }
}

// Создаем экземпляр класса и инициализируем его
const repositoryManager = new RepositoryManager();
repositoryManager.init();
