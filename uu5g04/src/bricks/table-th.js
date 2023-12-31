/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./table-th.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "table-th", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Table.Th"),
    nestingLevelList: UU5.Environment.getNestingLevelList("boxCollection", "inline"),
    classNames: {
      main: ns.css("table-th uu5-common-text"),
      //bg: 'uu5-common-bg'
    },
    defaults: {
      parentTagName: "UU5.Bricks.Table.Tr",
    },
    opt: {
      nestingLevelWrapper: true,
    },
    errors: {
      invalidParent: "Parent of this component is not Table.",
    },
    editMode: {
      enableWrapper: false,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    colSpan: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    rowSpan: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
  },

  getDefaultProps: function () {
    return {
      colSpan: null,
      rowSpan: null,
    };
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  UNSAFE_componentWillMount: function () {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && (parent.isTable || parent.isTr))) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainProps: function () {
    const props = this.getMainAttrs();
    //this.props.background && (props.className += ' ' + this.getClassName().bg);
    this.props.colSpan && (props.colSpan = this.props.colSpan);
    this.props.rowSpan && (props.rowSpan = this.props.rowSpan);
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? (
      <th {...this._getMainProps()}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </th>
    ) : null;
  },
  //@@viewOff:render
});
