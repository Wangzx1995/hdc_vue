import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);
// import '@/element-variables.scss'
/* 全局修改默认配置,不需要再代码中一个一个修改 */
// ElementUI.Select.methods.deletePrevTag = () => {};
// ElementUI.Select.methods.selectOption = () => {};
// ElementUI.Button.props.size.default = "mini";
// ElementUI.Input.props.size.default = "mini";
// ElementUI.InputNumber.props.size.default = "mini";
// ElementUI.Select.props.size.default = "mini";
// ElementUI.Cascader.props.size.default = "mini";
// ElementUI.Form.props.size.default = "mini";
ElementUI.Table.props.border.default = true;
// ElementUI.Table.props.size.default = "mini";
// ElementUI.Table.props.stripe.default = true;
// ElementUI.Radio.props.size.default = "small";
// ElementUI.RadioGroup.props.size.default = "small";
// ElementUI.Checkbox.props.size.default = "small";
// ElementUI.CheckboxGroup.props.size.default = "small";
// ElementUI.Tooltip.props.openDelay.default = 200;
// ElementUI.Popover.props.openDelay.default = 200;
ElementUI.Dialog.props.closeOnClickModal.default = false;
