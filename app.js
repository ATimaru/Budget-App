//Budget controller
var budgetController = (function() {

})();

//UI budgetController
var UIController = (function() {

})();

//Global app controller
var controller = (function(budgetCtrl, UIctrl) {

  var ctrlAddItem = function() {

    //1. get the field input data

    //2. ghe the add item to the budget budgetController

    //3. add the new item to the UI

    //4. calculate the budget

    //5. display the budget on the UI
    console.log('it works');
  }

  $('.add__btn').click(ctrlAddItem);

  $(document).keypress(function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
