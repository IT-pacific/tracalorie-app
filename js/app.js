class calorieTracker {
  constructor(meal, workout) {
    this._caloriesLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
    this._render();

    document.getElementById('limit').value = this._caloriesLimit;
  }

  //  public methods
  addMeal(meal) {
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    // this._meals.push(meal);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      delete this._meals[index];
      Storage.removeMeal(id);
      this._render();
    }
  }

  addWorkout(workout) {
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    // this._workouts.push(workout);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      delete this._workouts[index];
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAllFromLocatStorage();
    this._render();
  }

  setLimit(limit) {
    this._caloriesLimit = limit;
    Storage.setCalorieLimit(limit);
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  // private methods
  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById('calories-total');
    // if (this._totalCalories < 0) {
    //   totalCaloriesEl.parentElement.style.background = 'darkred';
    // }
    totalCaloriesEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    document.getElementById('calories-limit').innerHTML = this._caloriesLimit;
  }

  _displayCaloriesConsumed() {
    const totalCaloriesConsumed = this._meals.reduce(
      (acc, meal) => acc + meal.calories,
      0
    );
    document.getElementById('calories-consumed').innerHTML =
      totalCaloriesConsumed;
  }

  _displayCaloriesBurned() {
    const totalCaloriesBurned = this._workouts.reduce(
      (acc, workout) => acc + workout.calories,
      0
    );
    document.getElementById('calories-burned').innerHTML = totalCaloriesBurned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const progressEl = document.getElementById('calorie-progress');

    const caloriesRemaining = this._caloriesLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = caloriesRemaining;

    if (caloriesRemaining <= 0) {
      caloriesRemainingEl.parentElement.classList.remove('bg-light');
      caloriesRemainingEl.parentElement.classList.add('bg-danger');
      progressEl.classList.add('bg-danger');
    } else {
      caloriesRemainingEl.parentElement.classList.remove('bg-danger');
      caloriesRemainingEl.parentElement.classList.add('bg-light');
      progressEl.classList.remove('bg-danger');
    }
  }

  _displayCalorieProgress() {
    let progressPercentage = (this._totalCalories / this._caloriesLimit) * 100;
    progressPercentage = Math.min(progressPercentage, 100);

    document.getElementById(
      'calorie-progress'
    ).style.width = `${progressPercentage}%`;
  }

  _displayNewMeal(meal) {
    const mealItems = document.getElementById('meal-items');
    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meal.id);
    mealEl.innerHTML = `
     <div class="card-body">
       <div class="d-flex align-items-center justify-content-between">
         <h4 class="mx-1">${meal.name}</h4>
         <div
           class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
         >
           ${meal.calories}
         </div>
         <button class="delete btn btn-danger btn-sm mx-2">
           <i class="fa-solid fa-xmark"></i>
         </button>
       </div>
     </div>
     `;

    // while (mealItems.firstChild) {
    //   mealItems.firstChild.remove();
    // }

    mealItems.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutItems = document.getElementById('workout-items');
    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id);
    workoutEl.innerHTML = `
     <div class="card-body">
       <div class="d-flex align-items-center justify-content-between">
         <h4 class="mx-1">${workout.name}</h4>
         <div
           class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
         >
           ${workout.calories}
         </div>
         <button class="delete btn btn-danger btn-sm mx-2">
           <i class="fa-solid fa-xmark"></i>
         </button>
       </div>
     </div>
     `;

    // while (workoutItems.firstChild) {
    //   workoutItems.firstChild.remove();
    // }

    workoutItems.appendChild(workoutEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = (Date.now() * Math.random()).toFixed(0);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = (Date.now() * Math.random()).toFixed(0);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = localStorage.getItem('calorieLimit');
    }
    return calorieLimit;
  }

  static setCalorieLimit(limit) {
    localStorage.setItem('calorieLimit', limit);
  }

  static getTotalCalories(defaultCalories) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static saveMeal(meal) {
    let meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeMeal(id) {
    let meals = Storage.getMeals();
    meals = meals.filter((meal) => meal.id !== id);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  static saveWorkout(workout) {
    let workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    let workouts = Storage.getWorkouts();
    workouts = workouts.filter((workout) => workout.id !== id);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAllFromLocatStorage() {
    localStorage.removeItem('meals');
    localStorage.removeItem('workouts');
    localStorage.removeItem('totalCalories');
  }
}

class App {
  constructor() {
    this._tracker = new calorieTracker();

    this._loadEventListeners();

    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));

    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const meal = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    if (meal.value === '' || calories.value === '') {
      alert('Fill all fields!');
      return;
    }

    if (type === 'meal') {
      const meal1 = new Meal(meal.value, +calories.value);
      this._tracker.addMeal(meal1);
    } else {
      const workout1 = new Workout(meal.value, +calories.value);
      this._tracker.addWorkout(workout1);
    }

    meal.value = '';
    calories.value = '';

    // const collapseItem = document.getElementById(`collapse-${type}`);
    // const bsCollapse = new bootstrap.Collpase(collapseItem, { toggle: true });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure ?')) {
        const id = e.target.closest('.card').dataset.id;

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      name = item.firstElementChild.firstElementChild.innerText.toLowerCase();

      if (name.indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';

    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please enter limit');
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = '';

    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();

// console.log(document.getElementById('collapse-meal'));
