/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/* Thank you Visual Idiot for your free icon set
   (http://dribbble.com/shots/587469-Free-16px-Broccolidryiconsaniconsetitisfullof-icons) */

require(['jquery', 'sakai/sakai.api.core'], function($, sakai) {

    /**
     * @name sakai.todo
     *
     * @class todo
     *
     * @description
     * The To-do widget lists tasks and to-do's on a page or personal dashboard
     * This version does not support roles yet
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.todo = function(tuid, showSettings) {


        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var $rootel = $('#' + tuid);

        // Elements
        var $todoAddTodoButton = $('#todo_add_todo_button', $rootel);
        var $todoAddTodoForm = $('#todo_add_todo_form', $rootel);
        var $todoAddTodoTitle = $('#todo_add_todo_title', $rootel);
        var $todoTitleShort = $('#todo_title_short', $rootel);
        var todoCheckbox = '.todo_checkbox';
        var todoRemove = '.todo_remove';

        // Containers
        var $todoTodosListContainer = $('#todo_todos_list_container', $rootel);

        // Templates
        var todoTodosListTemplate = 'todo_todos_list_template';

        // Widget variables
        var todoData = {
            'todos': []
        };


        ///////////////////////
        // Utility functions //
        ///////////////////////

        /**
         * Renders the list of todos in the widget
         */
        var renderToDos = function() {
            $todoTodosListContainer.html(
                sakai.api.Util.TemplateRenderer(todoTodosListTemplate, {
                    'todos': todoData.todos || false,
                    'tuid': tuid
                })
            );
        };

        /**
         * Fetches the todos from the system
         */
        var getToDos = function() {
            sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {
                if (success) {
                    if (data.todos) {
                        todoData = data;
                    } else {
                        todoData = {
                            'todos': []
                        };
                    }
                }
                renderToDos();
            });
        };

        /**
         * Saves the todos to the system
         */
        var saveToDos = function() {
            sakai.api.Widgets.saveWidgetData(tuid, todoData, function(success, data) {
                renderToDos();
            }, true);
        };

        /**
         * Triggers a save of the changed state of a todo
         * Executed on change of a checkbox value
         */
        var tickedTodoBox = function() {
            todoData.todos[$(this).attr('data-arrid')].completed = $(this).is(':checked');
            saveToDos();
        };

        /**
         * Removes a todo from the list
         */
        var removeTodo = function() {
            todoData.todos.splice($(this).attr('data-arrid'), 1);
            saveToDos();
        };


        ////////////////////
        // Event Handlers //
        ////////////////////

        /**
         * Adds binding to various elements of the widget
         */
        var addBinding = function() {
            $rootel.on('change', todoCheckbox, tickedTodoBox);
            $rootel.on('click', todoRemove, removeTodo);
            var validateOpts = {
                'rules': {
                    todo_add_todo_title: {
                        minlength: 3
                    }
                },
                'messages': {
                    todo_add_todo_title: {
                        minlength: $todoTitleShort.text()
                    }
                },
                'submitHandler': function(form, validator){
                    todoData.todos.push({
                        'completed': false,
                        'description': $todoAddTodoTitle.val()
                    });
                    $todoAddTodoTitle.val('');
                    saveToDos();
                    return false;
                }
            };
            sakai.api.Util.Forms.validate($todoAddTodoForm, validateOpts, true);
        };


        ////////////////////
        // Initialization //
        ////////////////////

        /**
         * Initializes the widget
         */
        var doInit = function() {
            addBinding();
            getToDos();
        };

        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad('todo');

});
