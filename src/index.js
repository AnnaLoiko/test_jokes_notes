import axios from 'axios'

let tagBtnAddNote       = document.getElementById('add_note');
let tagBtnRemoveNote    = document.getElementById('remove_notes');
let tagSearchField      = document.querySelector('.search-field');
let tagWrapList         = document.querySelector('.notes-list');
let listItems           = [];
let listColors          = [];
let urlApi              = 'https://api.chucknorris.io/jokes/random';

tagBtnAddNote.addEventListener( 'click', () => {
    ajax(urlApi, renderList);
});

tagBtnAddNote.addEventListener( 'click', () => {
    var serialObj = JSON.stringify(listItems);
    localStorage.setItem('isData', serialObj);
});

tagBtnRemoveNote.addEventListener ( 'click',
    () => { 
        tagWrapList.innerHTML = '';
        listItems = []; 
        localStorage.clear(); 
    });

tagSearchField.oninput = () => {
    let valueField = tagSearchField.value.trim();
    let filterArr = listItems.filter( item => { 
        return item.value.toLowerCase().includes( valueField.toLowerCase()) ||  valueField == item.id;
    });
    renderList(filterArr);
}

window.onload = () => {
    if (localStorage.getItem('isData')) {
        listItems = JSON.parse(localStorage.getItem("isData"));
        renderList(listItems);
    }
}
const renderList = data  => {  
    tagWrapList.innerHTML = "";  

    data.forEach( (element, index) => {
        let divItem = renderItemDiv( element, index );          
        tagWrapList.appendChild(divItem);           
    });

    var serialObj = JSON.stringify(listItems);
    localStorage.setItem('isData', serialObj);
}
 
const renderItemDiv = (element, index) => {   
    let htmlItem        = renderElem( 'div' , 'note', tagWrapList);
    let tagContent      = renderElem( 'div' , 'content', htmlItem);
    let tagWrapBtn      = renderElem( 'div' , 'overlay', htmlItem);
    let tagBtnWarning   = renderBtn( 'btn-warning' , ' edit <i class="fa fa-pencil"></i>', tagWrapBtn);
    let tagBtnDanger    = renderBtn( 'btn-danger' , ' Delete <i class="fa fa-times"></i>', tagWrapBtn);
    

    ( element.value.length && element.value.length >= 150 ) ? element.value = element.value.slice(0, 150) + "..." : element.value; 

    tagContent.textContent = element.value;

    listColors.push( randColor() );
    element.color = listColors[index];
    htmlItem.style.background = listColors[index];   

    tagBtnDanger.onclick = () => {
        listItems.splice(index, 1);
        localStorage.clear();
        renderList(listItems);
    }
    tagBtnWarning.onclick = () => {
        let editText = prompt('Редактирование заметки', element.value);
        if (editText === null) {return};
        tagContent.textContent = editText;
        element.value = editText;
        renderList(listItems);
    }   
    return htmlItem;
}

const ajax = (url, callback) => {
    axios.get(url)
    .then(response => listItems.push(response.data))
    .then(response => callback(listItems))
    .catch(error => console.log('error:', error));
}

let renderElem = ( tag , cls, tagWrap) => {
    let elem = document.createElement(tag);
    elem.classList.add(cls);
    tagWrap.appendChild(elem);
    return elem;
}

let renderBtn = (cls , inner, tagWrap) => {
    let tagBtn = document.createElement('button');
    tagBtn.innerHTML = inner;
    tagBtn.classList.add('btn', cls);
    tagWrap.appendChild(tagBtn);
    return tagBtn;
}

let randColor = () => {
    return 'rgb('+ randomInteger(0,255) +',' + randomInteger(0,255) +','+ randomInteger(0,255) +')';
}

function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}