//Budget controller
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
        ID = 0;
      }


      //Create new item based on inc or exp type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income (ID, des, val);
      }

      //Push it into our data structure
      data.allItems[type].push(newItem);

      //Return the element
      return newItem;
    },
    testing: function () {
      console.log(data);
    }
  };

})();

//UI Controller
var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };

  return  {
    getinput: function() {
      return {
        type: $(DOMstrings.inputType).val(), // will be either inc or exp
        description: $(DOMstrings.inputDescription).val(),
        value: $(DOMstrings.inputValue).val()
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      //Create html string with placeholder text
      if(type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;

          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//Global app controller
var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    $(DOM.inputBtn).click(ctrlAddItem);
    $(document).keypress(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };



  var ctrlAddItem = function() {
    var input, newItem;
    //1. get the field input data
    input = UICtrl.getinput();

    //2. ghe the add item to the budget budgetController
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3. add the new item to the UI
    UICtrl.addListItem(newItem, input.type);

    //4. calculate the budget

    //5. display the budget on the UI

  };

return {
  init: function() {
    console.log("app started");
    setupEventListeners();
  }
};

})(budgetController, UIController);

controller.init();
