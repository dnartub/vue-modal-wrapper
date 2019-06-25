<template>
  <div class="modal-wrapper" v-bind:class="{'no-footer-body': !footerVisible}">
    <el-dialog
      :modal="true"
      :visible="true"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="destroy"
      :close-on-press-escape="dismissOnEsc"
      :show-close="btnDismissVisible"
	  :top="top ? top : '15vh'"
      >

      <span class="el-dialog__title" slot="title" v-if="header != null">{{headerText}}</span>

      <component
		  :style="{ 'height': height ? height : '50vh' }"
          :is="componentName"
          v-bind="componentProps"
          v-on:modalEvents:onOk="modalEvents.onOk = $event"
          v-on:modalEvents:onCancel="modalEvents.onCancel = $event"
          v-on:modalEvents:onDismiss="modalEvents.onDismiss = $event"
          v-on:modalEvents:onEsc="modalEvents.onEsc = $event"
          v-on:modalEvents:dispatchOk="onOk"
          v-on:modalEvents:dispatchCancel="onCancel"
          />

      <div v-if="footerVisible" slot="footer" class="dialog-footer">
        <el-button v-if="btnCancelVisible" @click="onCancel">{{btnCancelText}}</el-button>
        <el-button v-if="btnOkVisible" type="primary" @click="onOk" :loading="btnOkLoading">{{btnOkText}}</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script src="./modal-wrapper.ts" lang="ts"></script>
<style lang="scss">
  @import './modal-wrapper.scss';
</style>

