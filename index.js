class Search {
    constructor() {
        this.app = document.getElementById('app');
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('placeholder', 'Введите текст...');
        this.app.append(this.input)
    }
}

new Search();