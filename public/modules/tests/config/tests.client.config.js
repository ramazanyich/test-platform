'use strict';

// Configuring the Tests module
angular.module('tests').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Tests', 'tests', 'dropdown', '/tests(/create)?');
        Menus.addSubMenuItem('topbar', 'tests', 'List tests', 'tests');
        Menus.addSubMenuItem('topbar', 'tests', 'New Test', 'tests/create');
    }
]);
