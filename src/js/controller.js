import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// import { async } from 'regenerator-runtime';
// console.log(icons);

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultView.update(model.getSearchResultPage());

    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);

    // console.log(model.state.recipe);

    // const recipe = model.state.recipe;
    // console.log(recipe);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    // console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    // console.log(resultView);

    // get search querry
    const query = searchView.getQuery();
    if (!query) return;

    // load search query
    await model.loadSearchResult(query);

    // render search result

    // console.log(model.state.search.results);
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultPage());

    // Render initia pagination button
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (gotoPage) {
  // console.log(gotoPage);
  // Render NEW results
  resultView.render(model.getSearchResultPage(gotoPage));

  // Render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // updating the recipe serving (in state)
  model.updateServings(newServings);
  // updating the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddbookmarked = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);

  // Update recipe
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe)

    // Show loading Spinner
    addRecipeView.renderSpinner();

    // upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    // window.pushState(null, '', `${model.state.recipe.id}`);
    history.pushState(null, '', `${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('*', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddbookmarked);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addhandlerUpload(controlAddRecipe);
};
init();
