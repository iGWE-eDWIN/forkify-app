import icons from '../../img/icons.svg';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  _clear() {
    this._parentElement.innerHTML = '';
  }
  /**
   *
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if reder=false
   * @this {Object} View instance
   */
  render(data, render = true) {
    // handling error message for resultView
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    // console.log(markup);

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    // coverting markup string to DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // console.log(newDOM);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(curElements);
    // looping over newElement and curElement at the same time
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl);
      // console.log(curEl, newEl.isEqualNode(curEl));
      // comparing them

      // update change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // update change ATTRIBUTE
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const markup = `
       <div class="spinner">
        <svg>
         <use href="${icons}#icon-loader"></use>
        </svg>
       </div>
       `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="recipe">
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `;
    this._clear;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
