'use strict';
angular.module('GleanApp.services')

  .factory('Utils', Utils);



//####################################
//####################################
//  GENERAL UTILS SERVICE
//####################################
//####################################

/**
 * @ngdoc service
 * @name Utils
 * @description
 * Service for global data manipulation needs
 */
function Utils() {
	var service = {
		isEmptyObject: isEmptyObject
	};

	return service;


	/**
    * @ngdoc function
    * @name isEmptyObject
    * @description
    * Method to check whether the given obj has any custom properties set on it.
    * @param {object} obj Object to be checked
    * @returns {boolean} returns true if the object is empty. 
    */
	function isEmptyObject(obj) {
	    for(var prop in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
	        return false;
	      }
	    }
	    return true;
	  }
}
