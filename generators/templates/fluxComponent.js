'use strict';

/**
 * @ngdoc component
 * @name  <%= scriptAppName %>.component:<%= cameledName %>
 * @function
 * Component in the app <%= scriptAppName %>.
 */

angular.module('<%= scriptAppName %>')
.fluxComponent('<%= cameledName %>', <%= cameledName%>Controller );

<%= cameledName %>Controller.$inject = ['flux'];
function <%= cameledName %>Controller (flux)
{
	//
	// Internal
	// 
	var _self = this;

	// Defaults


	//
	// Events
	//


	//
	// Triggers
	//


	//
	// Functions
	//
}