# vue-modal-wrapper
Show vue-component in modal window with programing interaction between parent-wrapper-child components.

Remark: Wrapped via [element-ui dialog](https://element.eleme.io/#/en-US/component/dialog)

#### Install:
```javascript
// when created root vue-component
rootInstance = new Vue({...});
Modals.install(rootInstance);
```


#### Example:

Custom component:

```javascript
import SomeComponent from "../some-component.vue";

this.$modals.show({
    header: "Show SomeComponent",
    component: SomeComponent,
    props: {
        model: "model for some component"
    },
    width: "content",
    buttons: {
        'ok': {
            label: 'Confirm',
            callback: (result) => {
                console.log('modal closed. SomeCompenent return result = ', result)
            }
        },
    }
});
```

Modal-wrapped SomeComponent:
```javascript
export default {
    name: "some-component",
    props: [
        "model",
    ],
    mounted() {
        this.$emit("modalEvents:onOk", this.save);
    },
    methods: {
        save: function () {
            console.log('hello from some-component. model=', this.model);
            // result passed through modal-wrapper component to caller component callback
            return "success result for parent"
        },
        clickOk: function () {
            // this.save will be called in modal-wrapper component
            this.$emit('modalEvents:dispatchOk');
        }
    }
}
```

## $modals api

| Api | Arguments | Description |
| -------- | 
| show| options: Object| Show modal by options |
| setParent| parent: Vue| Set new parent component for subsequent modals. Remark: usefull on programaticaly fullscreen |
| recoverParent| | Set previos parent component for subsequent modals |
| closeAll| | Close all modal windows |

## show options

| Property | Type | Default| Description |
| -------- | 
| header| string| '' |Header text of modal window |
| footer| boolean| true |Header text of modal window |
| component| Vue-component options | required | Options for create vue-component in modal content |
| props| Object| null | Data passing to `component`. Remark: if some props is not described in `component` props, this one passed to $attr |
| height| string| '50vh' |css style for height |
| buttons| Object| 'Ok'/'Cancel'/Dismiss enable/ESC enable | Options for buttons  |

## buttons options

| Property | Options | Type | Default| Description |
| -------- | 
| 'ok' |  |  | | Options for confirm button |
|      | label  | string | 'Ok' | Button Text |
|      | visible  | boolean | true | Is button visible |
|      | callback  | Function(childResult:Object) | null | Call after susscefuly modal-result|
| 'cancel' |  |  | | Options for cancel button |
|      | label  | string | 'Cancel' | Button Text |
|      | visible  | boolean | true | Is button visible |
|      | callback  | Function() | null | Call after cancel modal-result|
| 'dismiss' |  |  | | Options for cancel button |
|      | visible  | boolean | true | show dismiss button |
|      | onEsc  | boolean | true | close on ESC |

## emits from child component

| $emit | Description |
| -------- | 
| $emit('modalEvents:onOk', callback) | Call function `callback` on click confirm button. If `callback` result is succesfull this one passing to parent 'ok'.callback and close modal window |
| $emit('modalEvents:onCancel', callback) | Call function `callback` on click cancel button. If `callback` result is succesfull modal window closes and call 'cancel'.callback|
| $emit('modalEvents:onDismiss', callback) | Call function `callback` on click dismiss button. If `callback` result is succesfull modal window closes and call 'cancel'.callback|
| $emit('modalEvents:onEsc', callback) | Call function `callback` on press ESC. If `callback` result is succesfull modal window closes and call 'cancel'.callback|
| $emit('modalEvents:dispatchOk') | click confirm button |
| $emit('modalEvents:dispatchCancel') | click cancel button |
