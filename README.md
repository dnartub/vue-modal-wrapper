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

<table>
    <tr>
        <th>Api</th>
        <th>Arguments</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>show</td>
        <td>options: Object</td>
        <td>Show modal by options</td>
    </tr>
    <tr>
        <td>setParent</td>
        <td>parent: Vue</td>
        <td>Set new parent component for subsequent modals. Remark: usefull on programaticaly fullscreen </td>
    </tr>
    <tr>
        <td>recoverParent</td>
        <td></td>
        <td>Set previos parent component for subsequent modals</td>
    </tr>
    <tr>
        <td>closeAll</td>
        <td></td>
        <td>Close all modal windows</td>
    </tr>
</table>

## show options

<table>
    <tr>
        <th>Property</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>header</td>
        <td>string</td>
        <td>''</td>
        <td>Header text of modal window</td>
    </tr>
    <tr>
        <td>footer</td>
        <td>boolean</td>
        <td>true</td>
        <td>Header text of modal window</td>
    </tr>
    <tr>
        <td>component</td>
        <td>Vue-component options</td>
        <td>required</td>
        <td>Options for create vue-component in modal content</td>
    </tr>
    <tr>
        <td>props</td>
        <td>Object</td>
        <td>null</td>
        <td>Data passing to `component`. Remark: if some props is not described in `component` props, this one passed to $attr</td>
    </tr>
    <tr>
        <td>height</td>
        <td>string</td>
        <td>'50vh'</td>
        <td>css style for height</td>
    </tr>
    <tr>
        <td>width</td>
        <td>string</td>
        <td>'50%'</td>
        <td>css style for width</td>
    </tr>
    <tr>
        <td>buttons</td>
        <td>Object</td>
        <td>'Ok'/'Cancel'/Dismiss enable/ESC enable</td>
        <td>Options for buttons</td>
    </tr>
</table>

## buttons options

<table>
    <tr>
        <th>Property</th>
        <th>Options</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>'ok'</td>
        <td></td>
        <td></td>
        <td></td>
        <td>Options for confirm button</td>
    </tr>
    <tr>
        <td></td>
        <td>label</td>
        <td>string</td>
        <td>'Ok'</td>
        <td>Button Text</td>
    </tr>
    <tr>
        <td></td>
        <td>visible</td>
        <td>boolean</td>
        <td>true</td>
        <td>Is button visible</td>
    </tr>
    <tr>
        <td></td>
        <td>callback</td>
        <td>Function(childResult:Object)</td>
        <td>null</td>
        <td>Call after susscefuly modal-result</td>
    </tr>
    <tr>
        <td>'cancel'</td>
        <td></td>
        <td></td>
        <td></td>
        <td>Options for confirm button</td>
    </tr>
    <tr>
        <td></td>
        <td>label</td>
        <td>string</td>
        <td>'Cancel'</td>
        <td>Button Text</td>
    </tr>
    <tr>
        <td></td>
        <td>visible</td>
        <td>boolean</td>
        <td>true</td>
        <td>Is button visible</td>
    </tr>
    <tr>
        <td></td>
        <td>callback</td>
        <td>Function()</td>
        <td>null</td>
        <td>Call after cancel modal-result</td>
    </tr>
    <tr>
        <td>'dismiss'</td>
        <td></td>
        <td></td>
        <td></td>
        <td>Options for dissmissing</td>
    </tr>
    <tr>
        <td></td>
        <td>visible</td>
        <td>boolean</td>
        <td>true</td>
        <td>show dismiss button</td>
    </tr>
    <tr>
        <td></td>
        <td>onEsc</td>
        <td>boolean</td>
        <td>true</td>
        <td>close on ESC</td>
    </tr>
</table>

## emits from child component

<table>
    <tr>
        <th>$emit</th>
        <th>Description</th>
    </tr>
    <tr>
        <td> $emit('modalEvents:onOk', callback) </td>
        <td>Call function `callback` on click confirm button. If `callback` result is succesfull this one passing to parent 'ok'.callback and close modal window </td>
    </tr>
    <tr>
        <td>$emit('modalEvents:onCancel', callback)</td>
        <td>Call function `callback` on click cancel button. If `callback` result is succesfull modal window closes and call 'cancel'.callback</td>
    </tr>
    <tr>
        <td>$emit('modalEvents:onDismiss', callback)</td>
        <td>Call function `callback` on click dismiss button. If `callback` result is succesfull modal window closes.</td>
    </tr>
    <tr>
        <td>$emit('modalEvents:onEsc', callback) </td>
        <td>Call function `callback` on press ESC. If `callback` result is succesfull modal window closes</td>
    </tr>
    <tr>
        <td>$emit('modalEvents:dispatchOk')</td>
        <td>click confirm button </td>
    </tr>
    <tr>
        <td>$emit('modalEvents:dispatchCancel')</td>
        <td>click cancel button</td>
    </tr>
</table>

