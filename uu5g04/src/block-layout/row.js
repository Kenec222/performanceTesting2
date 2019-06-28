/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from 'react';
import PropTypes from "prop-types";
import createReactClass from 'create-react-class';
import * as UU5 from "uu5g04";
import { TAG, css, Font } from "./config.js";

export const Row = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: TAG + "Row",
    nestingLevelList: UU5.Environment.getNestingLevelList("box"),
    classNames: {
      main: () => css`
        margin: 4px 0;
        width: 100%;
        padding: 3px 0 4px;
      `,
      ellipsis: () => css`
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      `
    },
    opt: {
      pureRender: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: PropTypes.oneOf(["s", "m"]),
    weight: PropTypes.oneOf(["primary", "normal", "secondary"]),
    ellipsis: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      weight: "normal",
      ellipsis: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs() {
    let attrs = this.getMainAttrs();

    let classNames = [Font[this.props.weight]()];
    if (this.props.size === "s") classNames.push(Font.sizeS());
    if (this.props.ellipsis) classNames.push(this.getClassName("ellipsis"));

    classNames.forEach(className => {
      attrs.className += " " + className;
    });

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      this.getNestingLevel()
        ? (
          <div {...this._getMainAttrs()}>
            {this.getChildren()}
            {this.getDisabledCover()}
          </div>
        ) : null
    );
  }
  //@@viewOff:render
});

export default Row;