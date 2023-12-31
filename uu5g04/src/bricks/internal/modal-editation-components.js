//@@viewOn:imports
import UU5, {createComponent} from "uu5g04";
import ns from "./bricks-editable-ns.js";
import ConfirmModal from "../confirm-modal.js";
import Icon from "../icon.js";
import Lsi from "../lsi.js";
import EditableLsi from "./bricks-editable-lsi.js";
import Css from "./css.js";
//@@viewOff:imports

//@@viewOn:revision
// coded: Martin Mach, 20.09.2020
// reviewed: -
//@@viewOff:revision

const COLUMN_PRESETS = {
  "1:1": ["s-6", "s-6"],
  "1:2": ["m-4", "m-8"],
  "2:1": ["m-8", "m-4"],
  "1:1:1": ["s-6 m-4", "s-6 m-4", "m-4"],
  "1:1:1:1": ["s-6 m-3", "s-6 m-3", "s-6 m-3", "s-6 m-3"],
};

export const PresetEditComponent = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "PresetEditComponent",
    classNames: {
      main: ns.css("row-properties-category"),
    },
    lsi: () => EditableLsi.row,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    componentProps: UU5.PropTypes.object,
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.object),
    onChangeProps: UU5.PropTypes.func,
    onChangeItems: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      componentProps: undefined,
      items: undefined,
      onChangeProps: undefined,
      onChangeItems: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._pendingOnChange;

    return {
      confirmModalOpen: false,
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _onConfirmModalRegister(modal) {
    modal.open();
  },

  _onRefuse() {
    this._pendingOnChange = undefined;

    this.setState({ confirmModalOpen: false });
  },

  _onConfirm() {
    this.setState({ confirmModalOpen: false }, this._changePreset);
  },

  _adjustItemsColWidth(items, preset) {
    if (items.length === preset.length) {
      return items.map((item, index) => {
        return {
          ...item,
          props: {
            ...item.props,
            colWidth: preset[index],
          },
        };
      });
    } else {
      this.showError(
        "ColWidth couldn't be correctly adjusted because the number of items doesnt match the number of preset's items."
      );
    }
  },

  _onChange({ value }) {
    let changeType = "safe";
    let items = Array.isArray(this.props.items) ? [...this.props.items] : [];
    let preset = COLUMN_PRESETS[value];

    if (preset.length < items.length) {
      changeType = "destructing";
      items.splice(preset.length, items.length);
    } else if (preset.length > items.length) {
      changeType = "adjusting";
      while (preset.length > items.length) {
        items.push({}); // just create an item (empty object). adjustItemsColWidth will do the rest
      }
    }
    // else { // the amount of items is just right }

    items = this._adjustItemsColWidth(items, preset);

    if (changeType === "safe" || changeType === "adjusting") {
      this._changePreset(items);
    } else if (changeType === "destructing") {
      this._pendingOnChange = items;
      this._openConfirmModal();
    }
  },

  _openConfirmModal() {
    this.setState({ confirmModalOpen: true });
  },

  _getConfirmModal() {
    return (
      <ConfirmModal
        onRefuse={this._onRefuse}
        onConfirm={this._onConfirm}
        content={this.getLsiComponent("layoutConfirmModalContent")}
        ref_={this._onConfirmModalRegister}
        size="m"
        header={this.getLsiComponent("layoutConfirmModalHeader")}
        confirmButtonProps={{
          content: this.getLsiComponent("layoutConfirmModalConfirm"),
        }}
        refuseButtonProps={{
          content: this.getLsiComponent("layoutConfirmModalCancel"),
        }}
      />
    );
  },

  _changePreset(value) {
    value = value || this._pendingOnChange || null;
    this.props.onChangeItems(value);
    this._pendingOnChange = undefined;
  },

  _getPresetValue() {
    let presetValue = null;

    if (
      Array.isArray(this.props.items) &&
      this.props.items.length &&
      !this.props.items.find((item) => item.tagName !== "UU5.Bricks.Column")
    ) {
      presetValue = Object.keys(COLUMN_PRESETS).find((colRation) => {
        let preset = COLUMN_PRESETS[colRation];
        let colNum = preset.length;

        if (colNum === this.props.items.length) {
          let result = preset.find((presetColWidth, index) => {
            let colWidth = this.props.items[index].props.colWidth;

            if (colWidth) {
              // compare built class names because of many different ways to define the colWidth prop
              let propClassName = UU5.Common.Tools.buildColWidthClassName(colWidth);
              let presetClassName = UU5.Common.Tools.buildColWidthClassName(presetColWidth);
              return propClassName !== presetClassName;
            } else {
              return true;
            }
          });

          if (!result) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    }

    return presetValue;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <>
        <UU5.Forms.Select
          label={this.getLsiComponent("columnsWidthPresetLabel")}
          value={this._getPresetValue() || "Custom"}
          onChange={this._onChange}
          labelColWidth="xs-12"
          inputColWidth="x-12"
          labelAlignment="left"
        >
          <UU5.Forms.Select.Option value="Custom" hidden />
          {Object.keys(COLUMN_PRESETS).map((colRatio, i) => (
            <UU5.Forms.Select.Option value={colRatio} key={i} />
          ))}
        </UU5.Forms.Select>
        {this.state.confirmModalOpen ? this._getConfirmModal() : null}
      </>
    );
  },
  //@@viewOff:render
});

export const ColWidthEditComponent = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "ColWidthEditComponent",
    classNames: {
      main: ns.css("colwidth-edit-component"),
    },
    lsi: () => EditableLsi.row,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    componentProps: UU5.PropTypes.object,
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.object),
    onChangeProps: UU5.PropTypes.func,
    onChangeItems: UU5.PropTypes.func,
    editedItemId: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      componentProps: undefined,
      items: undefined,
      onChangeProps: undefined,
      onChangeItems: undefined,
      editedItemId: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _isColWidth(value) {
    let result = true;

    if (typeof value === "string") {
      let colWidthArray = value.trim().split(UU5.Common.REGEXP.splitByWhiteSpace);
      result = !colWidthArray.find((colWidthPart) => !colWidthPart.match(UU5.Common.REGEXP.columnRegexp));
    } else {
      result = false;
    }

    return result;
  },

  _onChange({ value }) {
    let items = [...this.props.items];
    let editedItemIndex = items.findIndex((item) => item.id === this.props.editedItemId);
    items = items.map((item) => ({ id: item.id }));
    if (this._isColWidth(value)) {
      items[editedItemIndex].props = { colWidth: value, width: null };
    } else {
      items[editedItemIndex].props = { width: value, colWidth: null };
    }
    this.props.onChangeItems(items);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let value;
    let isColWidth = false;

    if (Array.isArray(this.props.items)) {
      if (this.props.items.length) {
        let editedItemIndex = this.props.items.findIndex((item) => item.id === this.props.editedItemId);
        value = this.props.items[editedItemIndex].props.width;

        if (!value) {
          value = this.props.items[editedItemIndex].props.colWidth;
          isColWidth = true;
        }
      } else {
        value = "";
      }
    } else {
      value = this.props.componentProps.width;

      if (!value) {
        value = this.props.componentProps.colWidth;
        isColWidth = true;
      }
    }

    if (value && isColWidth && typeof value === "object") {
      // normalize value
      value = UU5.Common.Tools.buildColWidthClassName(value)
        .replace(/uu5-col-/g, "")
        .replace(/xs|s|m|l|xl/g, (match) => `${match}-`);
    }

    return (
      <UU5.Forms.Text
        label={this.getLsiComponent("colWidthLabel")}
        message={this.getLsiComponent("colWidthTooltip")}
        value={value}
        onBlur={this._onChange}
      />
    );
  },
  //@@viewOff:render
});

export const EditItemInfo = () => (
  <div className={EditItemInfoClassNames.main}>
    <Icon icon="mdi-information" className={EditItemInfoClassNames.icon} />
    <Lsi lsi={EditableLsi.common.itemInfo} />
  </div>
);
const EditItemInfoClassNames = {
  main: Css.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #303030;
  `,
  icon: Css.css`
    color: rgba(0, 0, 0, 0.54);
    font-size: 56px;
  `,
};

export const QRCodeSize = ({ componentProps, onChangeProps, errors }) => (
  <UU5.Forms.Number
    min={32}
    step={32}
    suffix="px"
    valueType="number"
    label={<Lsi lsi={EditableLsi.qRCode.sizeLabel} />}
    value={componentProps.size}
    feedback={errors && errors.size ? "error" : undefined}
    onChange={({ value }) => onChangeProps({ size: value }, { size: value < 32 || isNaN(value) })}
    onBlur={({ value }) => onChangeProps({ size: value }, { size: value < 32 || isNaN(value) })}
  />
);

export const CardInline = ({ componentProps, onChangeProps }) => (
  <UU5.Forms.SwitchSelector
    items={[
      { content: <Lsi lsi={EditableLsi.common.valueFalse} />, value: false },
      { content: <Lsi lsi={EditableLsi.common.valueTrue} />, value: true },
    ]}
    value={componentProps.inline}
    label={<Lsi lsi={EditableLsi.card.inlineLabel} />}
    onChange={({ value }) => {
      onChangeProps({
        inline: value,
        width: value ? componentProps.width : null,
        minWidth: value ? componentProps.minWidth : null,
      });
    }}
  />
);

export const ProgressBarStriped = ({ componentProps, onChangeProps }) => (
  <UU5.Forms.SwitchSelector
    items={[
      { content: <Lsi lsi={EditableLsi.progressBar.stripedValueFalse} />, value: false },
      { content: <Lsi lsi={EditableLsi.progressBar.stripedValueTrue} />, value: true },
    ]}
    value={componentProps.striped}
    label={<Lsi lsi={EditableLsi.progressBar.stripedLabel} />}
    onChange={({ value }) => {
      onChangeProps({
        striped: value,
        animated: value ? componentProps.animated : false,
      });
    }}
  />
);

export const ProgressBarItemStriped = ({ onChangeItems, items, editedItemId }) => {
  let editedItemIndex = items.findIndex((item) => item.id === editedItemId);
  let editedItem = items[editedItemIndex];

  return (
    <UU5.Forms.SwitchSelector
      items={[
        { content: <Lsi lsi={EditableLsi.progressBar.stripedValueFalse} />, value: false },
        { content: <Lsi lsi={EditableLsi.progressBar.stripedValueTrue} />, value: true },
      ]}
      value={editedItem.props.striped}
      label={<Lsi lsi={EditableLsi.progressBar.stripedLabel} />}
      onChange={({ value }) => {
        let newItems = items.map((item) => ({ id: item.id }));
        if (!newItems[editedItemIndex].props) {
          newItems[editedItemIndex].props = {};
        }
        newItems[editedItemIndex].props.striped = value;
        newItems[editedItemIndex].props.animated = value ? newItems[editedItemIndex].animated : false;
        onChangeItems(newItems);
      }}
    />
  );
};

export const LineVertical = ({ componentProps, onChangeProps }) => (
  <UU5.Common.Fragment>
    <UU5.Forms.SwitchSelector
      items={[
        { content: <Lsi lsi={EditableLsi.line.verticalValueFalse} />, value: false },
        { content: <Lsi lsi={EditableLsi.line.verticalValueTrue} />, value: true },
      ]}
      value={!!componentProps.vertical || typeof componentProps.vertical === "number"}
      label={<Lsi lsi={EditableLsi.line.verticalLabel} />}
      onChange={({ value }) => {
        onChangeProps({ vertical: value });
      }}
    />
    <UU5.Forms.Number
      value={typeof componentProps.vertical === "number" ? componentProps.vertical : undefined}
      label={<Lsi lsi={EditableLsi.line.verticalHeightLabel} />}
      disabled={!componentProps.vertical && typeof componentProps.vertical !== "number"}
      valueType="number"
      min={1}
      suffix="px"
      onChange={({ value }) => {
        onChangeProps({ vertical: value });
      }}
    />
  </UU5.Common.Fragment>
);

export const ContentInput = ({ componentProps, onChangeProps }) => {
  let usedContentProp = componentProps.content ? "content" : "children";
  return (
    <UU5.Forms.Text
      value={componentProps[usedContentProp]}
      onBlur={({ value }) => {
        onChangeProps({ [usedContentProp]: value });
      }}
      label={<Lsi lsi={EditableLsi.common.contentLabel} />}
    />
  );
};

export const TabsItemNameFix = createComponent({
  //@@viewOn:reactLifeCycle
  getInitialState() {
    let fixedItems = this.props.items.map((item) => ({
      ...item,
      props: {
        ...item.props,
        name: item.props.name ?? UU5.Common.Tools.generateUUID(8),
      },
    }));
    this.props.onChangeItems(fixedItems);
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:render
  render() {
    return null;
  },
  //@@viewOff:render
});

export default {
  PresetEditComponent,
  ColWidthEditComponent,
  EditItemInfo,
  QRCodeSize,
  CardInline,
  ProgressBarStriped,
  ProgressBarItemStriped,
  LineVertical,
  ContentInput,
  TabsItemNameFix,
};
