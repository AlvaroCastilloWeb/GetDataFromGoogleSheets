const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API =
  'https://script.google.com/macros/s/AKfycbyxlkr2ojn_2xqGcLknhzG2xUohHdXj8363E1s97_pjdF4setlkHVT4MLQwtJzY0kpp/exec?action=getUsers&';

const initalLimit = 0;
const Limit = 10;
var Page = 0;
var count = 4;

const createUrl = (limit = Limit, offset = initalLimit) => {
  return `${API}?offset=${offset}&limit=${limit}`;
};

const addPage = () => {
  savePage(Page);
  const page = Page * Limit + initalLimit;
  Page++;
  return page;
};

const savePage = (page) => {
  localStorage.setItem('pagination', page + 5);
};

const getData = async (offset) => {
  try {
    const res = await fetch(createUrl(Limit, offset));
    const products = await res.json();

    let output = products.map((product) => {
      return Card(product);
    });
    let newItem = document.createElement('section');
    newItem.classList.add('Item');
    newItem.innerHTML = output;
    $app.appendChild(newItem);
  } catch (error) {
    console.log('error', error.message);
  }
};

const loadData = () => {
  const offset = addPage();
  count = offset;
  getData(offset);
};

const intersectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadData();
      }
    });
  },
  {
    rootMargin: '0px 0px 100% 0px',
  }
);

function Card(product) {
  return `
          <article class="Card">
            <img src="${product.Portada}" alt="${product.Titulo}"/>
            <h2>
              ${product.Titulo === '' ? ' Sin titulo ' : product.Titulo}
              <small>${product.Reproducciones}</small>
            </h2>
          </article>`;
}

function ClearLocalStorage() {
  window.onbeforeunload = function () {
    localStorage.removeItem('pagination');
    return '';
  };
}

function unobserve() {
  intersectionObserver.unobserve($observe);
}

intersectionObserver.observe($observe);
ClearLocalStorage();
