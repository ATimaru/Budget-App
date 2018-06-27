//Budget controller
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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

      deletItem: function(type, id) {
        var ids, index;

        //id = 6
        //data.allItems[type][id]
        //ids = [1 2 4 6 8]
        //index = 3

        ids = data.allItems[type].map(function(current) {
          return current.id;
        });
        index = ids.indexOf(id);

        if (index !== -1) {
          data.allItems[type].splice(index, 1);
        }
      },

    calculateBudget: function() {

      //calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
          data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur){
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur){
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;
    //+ or - before number and 2 decimal points comma separating thousands
    //2310.4567 -> + 2,310.46

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 2310 -> 2,310
    }
    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  return  {
    getinput: function() {
      return {
        type: $(DOMstrings.inputType).val(), // will be either inc or exp
        description: $(DOMstrings.inputDescription).val(),
        value: parseFloat($(DOMstrings.inputValue).val())
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      //Create html string with placeholder text
      if(type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;

          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

      deleteListItem: function(selectorID) {
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);

      },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus(); //shifts the focus on the first element (description)

    },

    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      $(DOMstrings.budgetLabel).text(formatNumber(obj.budget, type));
      $(DOMstrings.incomeLabel).text(formatNumber(obj.totalInc, 'inc'));
      $(DOMstrings.expensesLabel).text(formatNumber(obj.totalExp, 'exp'));
      $(DOMstrings.percentageLabel).text(obj.percentage);

      if (obj.percentage > 0) {
        $(DOMstrings.percentageLabel).text(obj.percentage + '%');
      } else {
        $(DOMstrings.percentageLabel).text('---');
      }
    },

    displayPercentages: function(percentages) {
      var fields = $(DOMstrings.expensesPercLabel);

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index){
        if(percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
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

    $(DOM.container).click(ctrlDeleteItem)

  };

  var updatePercentages = function() {

    //1. Calculate updatePercentages
    budgetCtrl.calculatePercentages();

    //2. Read percentages from the budget Controller
    var percentages = budgetCtrl.getPercentages();
    //3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  }

  var updateBudget = function() {
    //1. calculate the budget
    budgetCtrl.calculateBudget();

    //2. return the budget
    var budget = budgetCtrl.getBudget();

    //3. display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    //1. get the field input data
    input = UICtrl.getinput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //2. ghe the add item to the budget budgetController
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. add the new item to the UI
      UICtrl.addListItem(newItem, input.type);

      //4. Clear the fields
      UICtrl.clearFields();

      //5. calculate and update the budget
      updateBudget();

      //6. Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemId, splitID, type, ID;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemId) {

      splitID = itemId.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. delete the item from the data structure
      budgetCtrl.deletItem(type, ID);
      //2. delete the item from UI
      UICtrl.deleteListItem(itemId);

      //3. update and show the new budget
      updateBudget();

      //4. Calculate and update percentages
      updatePercentages();
    }
  };


return {
  init: function() {
    console.log("app started");
    UICtrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1
    });
    setupEventListeners();
  }
};

})(budgetController, UIController);

controller.init();
