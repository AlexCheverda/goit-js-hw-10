import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    searchList: document.querySelector('.country-list'),
    searchInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    const searchName = String(refs.searchInput.value);
    clrCountryContainer();

    if (searchName.trim()) {
        fetchCountries(searchName)
            .then(countries => {
                if (countries.length > 10) {
                    Notiflix.Notify.info(
                        'Too many matches found. Please enter a more specific name.'
                    );    
                } else if (countries.length >= 2 && countries.length < 10) {
                    makeMarkupCountries(countries);
                } else {
                    makeMarkupCountry(countries);
            }
            })
            .catch(error => {
                Notiflix.Notify.failure('Ooops, there is no country with that name');
            });
    }
}

function clrCountryContainer() {
    refs.searchList.innerHTML = '';
    refs.searchInfo.innerHTML = '';
}

function makeMarkupCountries(countries = []) {
    clrCountryContainer();
    const markupCountries = countries
        .map(country => {
        return `
        <li class="country-list__item">
        <img class="country-list__icon" width="40px" height="30px"
        src="${country.flags.svg}" alt="${country.name.official}">
        <span class="country-list__countryName">
        ${country.name.official}
        </span>
        </li>`;
    })
        .join('');
    refs.searchList.innerHTML = markupCountries;
}

function makeMarkupCountry(countries = []) {
    clrCountryContainer();
    const markupCountries = countries
        .map(country => {
        return `
        <div class="country-info__item">
          <img class="country-list__icon" src="${country.flags.svg}" alt="${country.name.official
            }" width="40px" height="30px" />
          <h2 class="country-info__title">${country.name.official}</h2>
        </div>
        <div class="article-wrapper">
          <p class="country-info__article">
            Capital:
          </p><span class="country-info__span">${country.capital}</span>
        </div>
        <div class="article-wrapper">
          <p class="country-info__article">
            Population:
          </p><span class="country-info__span">${country.population}</span>
        </div>
        <div class="article-wrapper">
          <p class="country-info__article">
            Languages:
          </p><span class="country-info__span">${Object.values(
                country.languages
            ).join(',')}</span>
        </div>`;
    })
        .join('');
    refs.searchInfo.innerHTML = markupCountries;
}