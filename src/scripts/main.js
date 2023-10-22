const addEl = document.querySelector('.js-add-book');
const closeEl = document.querySelector('.js-close');
const bodyEl = document.querySelector('.js-body')


addEl.addEventListener('click', () => {
    document.querySelector('.bg-form').style.display = 'flex';

    bodyEl.classList.add('disableScroll');
})

closeEl.addEventListener('click', () => {
    document.querySelector('.bg-form').style.display = 'none';

    bodyEl.classList.remove('disableScroll')
})


