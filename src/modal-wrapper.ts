
import Vue from 'vue'

/* emits from  'component':
 * 
 * $emit('modalEvents:onOk', callback) - set 'component' callback on click 'Ok'
 * $emit('modalEvents:onCancel', callback) - set 'component' callback on click 'Cancel'
 * $emit('modalEvents:onDismiss', callback) - set 'component' callback on click 'Dismiss'
 * $emit('modalEvents:onEsc', callback) - set 'component' callback on ESC
 * $emit('modalEvents:dispatchOk') - click Ok
 * $emit('modalEvents:dispatchCancel') - click Cancel
 */

export default {
    name: 'modal-wrapper',
    // options passed in s$modals.show
    props: [
        /*
         * header: string
         * Header text of modal window
         */
        'header',
        /*
         * footer: boolean
         * Show footer with buttons
         */
        'footer',
        /*
         * component: Vue
         * Vue-component in modal content
         */
        'component',        
        /*
         * props: Object
         * Data passing to `component`
         * remark: if some props is not described in 'component' props they are passed to $attr
         */
		'props',
        'top', // custom for element-ui
        /**
         * height: string(style)
         */
		'height',
        /**
         * width: string(style)
         */
        'width',
        /*
         * buttons: Object
         * Options for buttons
         */
        'buttons',
    ],
    data() {
        return {
            id: '',
            btnOkLoading: false,
        }
    },

    /*
     * triggered in $modals.show: new ModalWrapperClass
     */
    created() {
        // varify props passed from $modals.show
        this.checkProps();
        // register 'component'
        Vue.component(this.component.name, this.component);

        // add new window-data to this.$modals.windows
        this.id = this.newGuid();
        this.$modals.addWindow({
            id: this.id, // идентификатор окна
            wrapper: this,       // ссфлка на объект компонента окна
            options: this.$props // переданные параметры
        });
    },

    /*
     * triggered in $modals.show: instance.$mount()
     */
    mounted() {
        // width style - custom for el-dialog
        this.$nextTick(function () {
            this.$el.querySelector('.el-dialog').style.width = (this.width == null ? "50%" : this.width);
            if (this.width == 'content') {
                //display: table;
                this.$el.querySelector('.el-dialog').style.display = 'table';
                this.$el.querySelector('.el-dialog').style.width = 0;
            }
        });
    },



    computed: {
        /**
         * name of 'component'
         */
        componentName() {
            return this.component.name;
        },
        /**
         * props passed to 'component'
         */
        componentProps() {
            let extendProps: any;
            extendProps = this.$props.props;
            // passing 'modalEvents' to $attr of 'component'
            //extendProps.modalEvents = this.modalEvents;
            return extendProps;
        },
        /**
         * modal width
         */
        widthValue() {
            this.width = this.width == null ? "50%" : this.width;
            return this.width;
        },
        /**
         * header-text
         */
        headerText() {
            if (this.header == null) {
                return '';
            }
            return this.header;
        },
        /**
         * show-footer
         */
        footerVisible() {
            if (this.footer == null) {
                return true;
            }
            return this.footer;
        },
        /**
         * Text of button "Ok"
         */
        btnOkText() {
            if (this.buttons != null && this.buttons.ok != null && this.buttons.ok.label != null) {
                return this.buttons.ok.label;
            }
            return 'Ok';
        },
        /**
         * Text of button "Cancel"
         */
        btnCancelText() {
            if (this.buttons != null && this.buttons.cancel != null && this.buttons.cancel.label != null) {
                return this.buttons.cancel.label;
            }
            return 'Cancel';
        },
        /**
         * show button "Ok"
         */
        btnOkVisible() {
            if (this.buttons != null && this.buttons.ok != null && this.buttons.ok.visible != null) {
                return this.buttons.ok.visible;
            }
            return true;
        },
        /**
         * show button "Cancel" 
         */
        btnCancelVisible() {
            if (this.buttons != null && this.buttons.cancel != null && this.buttons.cancel.visible != null) {
                return this.buttons.cancel.visible;
            }
            return true;
        },
        /**
         * show button "Dismiss"
         */
        btnDismissVisible() {
            if (this.buttons != null && this.buttons.dismiss != null && this.buttons.dismiss.visible != null) {
                return this.buttons.dismiss.visible;
            }
            return true;
        },
        /**
         * Close modal by ESC
         */
        dismissOnEsc() {
            if (this.buttons != null && this.buttons.dismiss != null && this.buttons.dismiss.onEsc != null) {
                return this.buttons.dismiss.onEsc;
            }
            return true;
        },
        /**
         * 'component' callbacks on buttons event
         */
        modalEvents() {
            return {
                /*
                 * 'component' callback on Dismiss-button
                 * Result:
                 *  true - close modal window
                 *  false- do not close modal window
                 */
                onDismiss: function() {
                    return true;
                },
                /*
                 * 'component' callback on Cancel-button
                 * Result:
                 *  true - close modal window
                 *  false- do not close modal window
                 */
                onCancel: function () {
                    return true;
                },
                /*
                 * 'component' callback on Cancel-button
                 * Result:
                 *  Object - close modal window and call parent-callback with Object argument
                 *  false- do not close modal window
                 */
                onOk: async function () {
                    return true;
                },
                /*
                 * 'component' callback on ESC
                 * Result:
                 *  true - close modal window
                 *  false- do not close modal window
                 */
                onEsc: function () {
                    return true;
                },
            }
        }
    },

    methods: {
        newGuid(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        /**
         * Event on click Dismiss-button
         */
        onDismiss: function () {
            // вызов функции внутри компонента component, если она была переопределена подпиской
            if (this.modalEvents.onDismiss()) {
                // закрытие modal-wrapper
                this.destroy();
                // вызов функции вызывающего компонента (парента), после успешной обработки нажатия на кнопку
                if (this.buttons != null && this.buttons.dismiss != null && typeof this.buttons.dismiss.callback == 'function') {
                    this.buttons.dismiss.callback();
                }
            }
            else {
                console.log('[modal-wrapper] Dismiss pass fail');
            }
        },
        /**
         * Event on click Cancel-button
         */
        onCancel: function () {
            // вызов функции внутри компонента component, если она была переопределена подпиской
            if (this.modalEvents.onCancel()) {
                // закрытие modal-wrapper
                this.destroy();
                // вызов функции вызывающего компонента (парента), после успешной обработки нажатия на кнопку
                if (this.buttons != null && this.buttons.cancel != null && typeof this.buttons.cancel.callback == 'function') {
                    this.buttons.cancel.callback();
                }
            }
            else {
                console.log('[modal-wrapper] Cancel pass fail');
            }
        },
        /**
         * Event on click Ok-button
         */
        onOk: function () {
            this.btnOkLoading = true;

            // вызов функции внутри компонента component, если она была переопределена подпиской
            let okResult = this.modalEvents.onOk();
            if (okResult) {
                // закрытие modal-wrapper
                this.destroy();
                // вызов функции вызывающего компонента (парента), после успешной обработки нажатия на кнопку
                // передача okResult в callback
                if (this.buttons != null && this.buttons.ok != null && typeof this.buttons.ok.callback == 'function') {
                    this.buttons.ok.callback(okResult);
                }
            }
            else {
                console.log('[modal-wrapper]  Ok pass fail');
            }

            this.btnOkLoading = false;
        },
        /**
         * Event on press ESC
         */
        onEsc: function () {
            // вызов функции внутри компонента component, если она была переопределена подпиской
            if (this.modalEvents.onEsc()) {
                // закрытие modal-wrapper
                this.destroy();
                // вызов функции вызывающего компонента (парента), после успешной обработки нажатия на кнопку
                if (this.buttons != null && this.buttons.esc != null && typeof this.buttons.esc.callback == 'function') {
                    this.buttons.esc.callback();
                }
            }
            else {
                console.log('[modal-wrapper]  Ok pass fail');
            }
        },

        /**
         * Close modal window (destroing modal-wrapper component)
         */
        destroy: function () {
            if (this.id !== '') {
                // carefull
                this.$modals.removeWindow(this.id);
            } else {
                // not carefull!
                //this.$el.parentNode.removeChild(this.$el);
                //this.$destroy();
            }
        },

        /**
         * varify options passing in $modal.show
         */
        checkProps: function() {
            if (this.component == null) {
                throw `[modal-wrapper]: specify 'component' in options`;
            }
        },
    }
}
