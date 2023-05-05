import {authors, books, genres, BOOKS_PER_PAGE} from './data.js'

let matches = books;
let page = 1;
let range = [0, 36];
const items = document.querySelector('[data-list-items]')
const searchCancel = document.querySelector('[data-search-cancel]')
const settingsCancel = document.querySelector('[data-settings-cancel]')
const settingsForm = document.querySelector('[data-settings-form]')
const listClose = document.querySelector('[data-list-close]')
const headerSearch = document.querySelector('[data-header-search]')
const headerSettings = document.querySelector('[data-header-settings]')
const listBtn = document.querySelector('[data-list-button]')
const searchOverlay = document.querySelector('[data-search-overlay]')
const settingsOverlay = document.querySelector('[data-settings-overlay]')
const settingsTheme = document.querySelector('[data-settings-theme]')
const searchFormBtn = document.querySelector('[form="search"]')
const searchTitle = document.querySelector('[data-search-title]')
const searchAuthor = document.querySelector('[data-search-authors]')
const searchGenre = document.querySelector('[data-search-genres]')
const listActive = document.querySelector('[data-list-active]')
const listDescription = document.querySelector('[data-list-description]')
const listSubtitle = document.querySelector('[data-list-subtitle]')
const listTitle = document.querySelector('[data-list-title]')
const listBlur = document.querySelector('[data-list-blur]')
const listImage = document.querySelector('[data-list-image]')
const searchForm = document.querySelector('[data-search-form]')

if (!matches || !Array.isArray(matches)) throw new Error('Source required');
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

const css = {
  day: {
    dark: '10, 10, 20',
    light: '255, 255, 255'
  },
  night: {
    dark: '255, 255, 255',
    light: '10, 10 ,20'
  }
};


const createPreview = ({ author, id, image, title }) => {
    const preview = document.createElement('button');
    preview.classList = 'preview';
    preview.setAttribute('data-preview', id);
  
    preview.innerHTML = /* html */ `
      <img class="preview__image" src="${image}" alt="${title}">
      <div class="preview__content">
        <h2 class="preview__title">${title}</h2>
        <h3 class="preview__author">${author}</h3>
      </div>
    `;
  
    return preview;
  };
  
  let fragment = document.createDocumentFragment();
  let extracted = matches.slice(range[0], range[1]);
  
  for (const { author, image, title, id } of extracted) {
    const preview = createPreview({
      author,
      id,
      image,
      title,
    });
  
    fragment.appendChild(preview);
  }



const genresFragment = document.createDocumentFragment()
let element = document.createElement('option')
element.value = 'any'
element.innerText = 'All Genres'
genresFragment.appendChild(element)

for (const [id, name] of Object.entries(genres)) {
    let element = document.createElement('option')
    element.value = id
    element.innerText = name
    genresFragment.appendChild(element)
}

searchGenre.appendChild(genresFragment)

const authorsFragment = document.createDocumentFragment()
let element2 = document.createElement('option')
element2.value = 'any'
element2.innerText = 'All Authors'
authorsFragment.appendChild(element2)

for (const [id, name] of Object.entries(authors)) {
    let element2 = document.createElement('option')
    element2.value = id
    element2.innerText = name
    authorsFragment.appendChild(element2)
}

searchAuthor.appendChild(authorsFragment)



settingsTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
const v = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

if (settingsTheme.value === 'night') {
  document.documentElement.style.setProperty('--color-dark', css['night'].dark);
  document.documentElement.style.setProperty('--color-light', css['day'].light);
}

if (v === 'night') {
  document.documentElement.style.setProperty('--color-dark', css['night'].dark);
  document.documentElement.style.setProperty('--color-light', css['day'].light);
}

settingsOverlay.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);
  document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
  document.documentElement.style.setProperty('--color-light', css[result.theme].light);
  settingsOverlay.open = false;
});

////////////////////////////////////////////////////////////////////////////////////////////////////////



listBtn.innerText = `Show more (${books.length - [page * BOOKS_PER_PAGE]})`

listBtn.innerHTML = /* html */ [
    `<span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>`,
]


listBtn.addEventListener('click', () => {
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = (page + 1) * BOOKS_PER_PAGE;
  const fragment = document.createDocumentFragment();

  for (let i = startIndex; i < endIndex && i < matches.length; i++) {
    const book = matches[i];
    const { author, image, title, id } = book;

    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
      <img class="preview__image" src="${image}">
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;

    fragment.appendChild(element);
  }

  items.appendChild(fragment);

  page++;

  const remaining = matches.length - endIndex;
  listBtn.disabled = endIndex >= matches.length;
  listBtn.textContent = `Show more (${remaining})`;
});



searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(searchForm);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (let i = 0; i < matches.length; i++) {
    const book = matches[i];

    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }
  }
  
  const dataListMessage = document.querySelector('[data-list-message]');

  if (result.length < 1) {
    dataListMessage.classList.add('list__message_show');
    items.innerHTML = '';
  } else {
    dataListMessage.classList.remove('list__message_show');
    items.innerHTML = '';
      
    const fragment = document.createDocumentFragment();
      
    for (const book of result) {
      const { author, image, title, id } = book;
      
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);
    
      element.innerHTML = `
        <img class="preview__image" src="${image}">
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
      
      fragment.appendChild(element);
    }
      
    items.appendChild(fragment);
  }

  searchOverlay.open = false;
  listBtn.disabled = true

});

fragment = document.createDocumentFragment()
extracted = books.slice(0, 36)
    
for (const { author, image, title, id } of extracted) {
  //const { author: authorId, id, image, title } = props
        
  const element = document.createElement('button')
  element.classList = 'preview'
  element.setAttribute('data-preview', id)
  
  element.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `
        fragment.appendChild(element)
    }
    
  items.appendChild(fragment)






const div = document.querySelector('.header__logo');

  div.addEventListener('click', () => {
    // searchForm.reset(); // clear the search filters
    items.innerHTML = ''; // reset the search results to the default list
    listBtn.disabled = false
    for (const { author, image, title, id } of extracted) {
      //const { author: authorId, id, image, title } = props
            
      const element = document.createElement('button')
      element.classList = 'preview'
      element.setAttribute('data-preview', id)
    
      element.innerHTML = /* html */ `
                <img
                    class="preview__image"
                    src="${image}"
                />
                
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            `
            fragment.appendChild(element)
            
        }

        items.appendChild(fragment)
        
  });


////////////////////////////////////////////////////////////////////////////////////////////////////


items.addEventListener('click', (event) => {
  listActive.open = true;

  let pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;
    const previewId = node?.dataset?.preview;
    console.log(previewId)
    for (const singleBook of matches) {
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }
  }

  if (!active) return;
  listImage.setAttribute('src', active.image)
  listBlur.style.backgroundImage = `url(${active.image})`;
  listTitle.textContent = active.title;
  listSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
  listDescription.textContent = active.description;
});


listClose.addEventListener('click', (event)=>{

  listActive.close = true

})



// Listeners

searchCancel.addEventListener('click', () => { searchOverlay.open = false })
settingsCancel.addEventListener('click', () => { settingsOverlay.open = false })
headerSettings.addEventListener('click', () => { settingsOverlay.open = true })
settingsForm.addEventListener('submit', () => { settings.submit })
listClose.addEventListener('click', () => { listActive.open = false })
headerSearch.addEventListener('click', () => { searchOverlay.open = true ; searchTitle.focus(); })