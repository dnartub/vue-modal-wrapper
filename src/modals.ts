import Vue from 'vue'
import ModalWrapperComponent from "./modal-wrapper.vue"

/**
 * $modals api
 * 
 * Install as childs of root:
 *   rootInstance = new Vue({...});
 *   Modals.install(rootInstance);
 * */
class Modals{
    /**
     * install $modal api
     * remark: set modals to <body> is unacceptable in Vue-logic
     * see https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375
     * @param parent
     */
    public static install(parent: any) {
        Vue.prototype.$modals = new Modals(parent);
    }


    /**  Parent-components stack     */
    private parents: any;

    
    /** List of opened windows
     * {
     *      id: window unique identificator
     *      wrapper - modal-wrapper component
     *      options - modal-wrapper component options ( pass in 'show' function)
     * }
     */
    private windows:any = []; 

    /**
     * First parent component included all modal-wrapper components by default
     * @param parent
     */
    constructor(parent: any) {
        this.parents = [parent];
    }

    /**
     * Show modal by options
     * @param options
     */
    show(options: any) {
        // parent for modal-wrapper component
        let parentObject: any = this.parents[this.parents.length - 1];

        // create class of modal-wrapper component
        let ModalWrapperClass = Vue.extend({
            extends: ModalWrapperComponent,
        });

        // create instance of modal-wrapper component (child for parentObject)
        // triggered vue-lifecycle-hook 'created' (modal-wrapper component)
        let instance = new ModalWrapperClass({
            parent: parentObject, 
            propsData: options // options passing to modal-wrapper as props
        }); 

        // create $el of modal-wrapper component
        // triggered vue-lifecycle-hook 'mounted' (modal-wrapper component)
        instance.$mount(); 

        // add $el as child of parent $el
        parentObject.$el.appendChild(instance.$el);
    }

    /**
     * Set new parent component for subsequent modals
     * remark: usefull on programaticaly fullscreen
     * @param parent
     */
    setParent(parent: any) {
        this.parents.push(parent);
    }

    /**
     * Set previos parent component for subsequent modals
     * */
    recoverParent() {
        if (this.parents.length > 1) {
            this.parents.pop();
        }
    }

    /**
     * Add modal-wrapper data of opened window 
     * (see modal-wrapper component vue-lifecycle-hook 'created')
     * @param modalObject
     */
    addWindow(modalObject) {
        this.windows.push(modalObject);
    }

    /**
     * Remove all dynamic data of modal window by id
     * @param id
     */
    removeWindow(id) {
        // find by id
        var removeIndex = this.windows
            .map((item) => { return item.id; })
            .indexOf(id);
        if (removeIndex !== -1) {
            // instance of modal-wraper component
            let modalWrapper = this.windows[removeIndex].wrapper;
            // carefull destroying of modal-wraper component
            modalWrapper.$el.parentNode.removeChild(modalWrapper.$el);
            modalWrapper.$destroy();
            // remove from opened window data
            this.windows.splice(removeIndex, 1);
        }
    }

    /**
     *  Close all modal windows
     * */
    closeAll() {
        let ids = this.windows.map((item) => { return item.id; });
        ids.forEach(id => this.removeWindow(id));
    }
}
