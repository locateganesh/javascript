(function() {
    const to_do_heading = _$('#title');
    const to_do_form = _$('#todo-form');
    const to_do_input = _$('#todo-input');
    const to_do_list = _$('#list');
    const to_do_feedback = _$('#sc_feeback');

    class TodoApp {
        tasksArray = [];
        displayTasks() {
            const storageTasks = Storage.getTask();
            if (storageTasks && storageTasks.length) {
                storageTasks.forEach(task => {
                    this.addTaskDOM(task);
                });
                this.tasksArray = storageTasks;
            }
        }
        add() {
            to_do_form.addEventListener('submit', (e) => {
                e.preventDefault();
                let task = to_do_input.value;
                //console.log(task);
                this.addTaskDOM(task);
            });
        }
        addTaskDOM(task) {
            let taskItem = this.createElement('li', '', to_do_list, null);
            this.createElement('span', task, taskItem, [{'tabindex': '0'}]);
            this.createElement('button', '', taskItem, [{'aria-label': `Delete ${task}`}, {'class': 'delete-task'}]);
            this.removeValue(to_do_input);
            this.screenReaderFeedback(task);
            this.tasksArray.push(task);
            Storage.saveTask(this.tasksArray);
        }
        createElement(tagName, textNode, parent, attributes = null) {
            let node = document.createElement(tagName);
            if (textNode) {
                let customTextNode = document.createTextNode(textNode);
                node.appendChild(customTextNode);
            }
            if (attributes !== null) {
                for (let attribute of attributes) {
                    for (let [key, value] of Object.entries(attribute)) {
                        //console.log(key, value);
                        node.setAttribute(key, value);
                    }
                }
                
            }
            parent.appendChild(node);
            return node;
        }
        removeValue(input) {
            return input.value = '';
        }
        screenReaderFeedback(task, feedback = 'added') {
            to_do_feedback.textContent = `${task} ${feedback}`
        }
        delete() {
            to_do_list.addEventListener('click', e => {
                const li = e.target.closest('li');
                const taskName = li.querySelector('span').textContent;
                if (this.hasClass(e.target, 'delete-task')) {
                    //console.log(li, taskName);
                    to_do_list.removeChild(li);
                    //to_do_heading.focus();
                    Storage.removeTask(taskName);
                    this.screenReaderFeedback(taskName, 'removed');
                }
                //console.log(e.target.tagName)
                if (e.target.tagName === 'SPAN') {
                    li.classList.toggle('done');
                    const taskStatus = this.hasClass(li, 'done') ? 'Done' : 'Undone';
                    this.screenReaderFeedback(taskName, taskStatus)
                }
            });
        }
        hasClass(element, classNames) {
            if (element.classList.contains(classNames)) {
                return true;
            }
            return false;
        }
    }

    class Storage {
        static saveTask(arr) {
            if (localStorage) {
                localStorage.setItem('tasks', JSON.stringify(arr));
            }
        }
        static removeTask(taks){
            if (localStorage){
                const storedTasks = JSON.parse(localStorage.getItem('tasks'));
                const newArr = storedTasks.filter(item => item !== taks);
                return localStorage.setItem('tasks', JSON.stringify(newArr));
            }
        }
        static getTask() {
            if (localStorage) {
                const allTasks = localStorage.getItem('tasks');
                return allTasks ? JSON.parse(allTasks) : null;
                
            }
        }
    }

    function _$(el) {
        return document.querySelector(el)
    }
    function onDocumentRead() {
        const app = new TodoApp();
        app.add();
        app.displayTasks();
        app.delete();
    }

    // Document ready
    if (document.readyState !== 'loading') {
        onDocumentRead();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentRead);
    }

}());