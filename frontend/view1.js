/**
 * Hello Sift. View callbacks.
 */

'use strict';

/* globals document, Sift */
var ldButton;
var ncButton;
var ncCount = 0;

/**
 * Called by the framework when the loadView callback in frontend/controller.js calls the resolve function or returns a value
 *
 * Parameters:
 * @value: {
 *  sizeClass: {
 *      previous: {width: 'compact'|'full', height: 'compact'|'full'},
 *      current: {width: 'compact'|'full', height: 'compact'|'full'}
 *    },
 *    type: 'email-detail'|'summary',
 *    data: {object} (data object returned by the load or resolve methods in the controller)
 *  }
 */
Sift.View.presentView = function (value) {
  console.log('hello-sift: presentView: ', value);

  /*
  * Example code below can be removed
  */
  // Simple dom updates for the data we received after transition is over.
  updateDOM('width', value.sizeClass.current.width);
  updateDOM('height', value.sizeClass.current.height);
  updateDOM('message', value.data.message);
  updateDOM('type', value.type);

  if(!ldButton) {
    ldButton = document.getElementById('load-data');
    ldButton.addEventListener('click', function () {
      console.log('hello-sift: ldButton clicked');
      Sift.Controller.loadData({key: 'TOTAL'}).then(function(result) {
        console.log('hello-sift: loadData returned: ', result);
        var msg = 'No data yet. Please run your DAG.';
        if(result) {
          msg = result + ' emails from @gmail.com in your inbox';
        }
        document.getElementById('data').textContent = msg;
      });
    });
  }

  if(!ncButton) {
    ncButton = document.getElementById('notify-controller');
    ncButton.addEventListener('click', function () {
      ncCount++;
      console.log('hello-sift: ncButton clicked: ', ncCount);
      Sift.View.notifyListeners('ncButton-pressed', ncCount);
    });
  }
};

/**
 * Called when a sift starts to transition between size classes
 *
 * Parameters:
 * @value: {
 *  sizeClass: {
 *    previous: {width: 'compact'|'full', height: 'compact'|'full'},
 *    current: {width: 'compact'|'full', height: 'compact'|'full'}
 *  },
 *  type: 'email-detail'|'summary'
 * }
 */
Sift.View.willPresentView = function (value) {
  console.log('hello-sift: willPresentView: ', value);

  /*
  * Example code below can be removed
  */
  // Depict how often this event is fired while transitions take place
  showTransitions('width', value.sizeClass);
  showTransitions('height', value.sizeClass);

  var m = document.getElementById('message');
  if(!m){
    console.info('Missing dom element for example:', m);
    return;
  }
  m.textContent = 'will present view';
  m.style.color = '#ED1651';
};

/**
 * Listens for 'count' events from the Controller
 */
Sift.Controller.addEventListener('count', function () {
  document.getElementById('data').textContent = 'New data: emails from \'gmail.com\' in your inbox';
});

function updateDOM(elem, value){
  var e = document.getElementById(elem);
  if(!e){
    console.info('Missing dom element for example:', elem);
    return;
  }
  if(parent){
    e.textContent = value;
    e.style.color = '#231F20';
  }
}

function showTransitions(aspect, parent){
  if(!parent || !parent.current || !parent.previous){
    console.error('No data for this transition');
    return;
  }
  var current = parent.current[aspect];
  var previous = parent.previous[aspect];
  var e = document.getElementById(aspect);
  if(!e){
    console.info('Missing dom element for example:', aspect);
    return;
  }

  if(current !== previous){
    e.textContent = previous + ' > ' + current;
    e.style.color = '#ED1651';
  }
}
