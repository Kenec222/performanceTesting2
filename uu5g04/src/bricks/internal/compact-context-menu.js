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

//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import ns from "../bricks-ns.js";

import { ClassNames, Helpers } from "./context-menu-helpers.js";
//@@viewOff:imports

export const CompactContextMenu = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("CompactContextMenu"),
    classNames: {
      main: ns.css("compact-context-menu"),
      ul: ns.css("context-menu-ul"),
      ...ClassNames
    },
    lsi: () => UU5.Environment.Lsi.Bricks.contextMenu
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let levels = this._getLevels(this.props.content || this.props.children);
    return {
      levels,
      currentLevel: this.getId()
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ levels: this._getLevels(nextProps.content || nextProps.children) });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isContextMenu() {
    return true;
  },

  reset() {
    this._changeLevel(this.getId());
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _getLevels(children) {
    let levels = {};

    let iterateSubmenu = (children, key, parentKey) => {
      let levelContent;

      if (key === this.getId()) {
        levelContent = [];
      } else {
        levelContent = [
          <UU5.Bricks.ContextMenu.Item
            key="backButton"
            onClick={opt => this._changeLevel(parentKey, opt.event)}
            label={Helpers.getBackItemContent(this.getLsiComponent("backButton"))}
          />,
          <UU5.Bricks.ContextMenu.Item key="divider" divider />
        ];
      }

      React.Children.toArray(children).forEach(child => {
        if (React.isValidElement(child)) {
          let id = child.props.id || UU5.Common.Tools.generateUUID();
          let childProps = { ...child.props, content: null, children: null, parent: this.props.parent };
          childProps.id = id;
          childProps.className = childProps.className
            ? `${child.props.className} ${this.getClassName("compactItem")}`
            : this.getClassName("compactItem");
          let content = child.props.content || child.props.children;

          if (child.props.label && content) {
            iterateSubmenu(content, id, key); // dive

            childProps.label = Helpers.getNestingItemLabel(child.props.label, child.props.icon);
            childProps.className += ` ${this.getClassName("compactSubmenuItem")}`;
            childProps.icon = undefined;
            childProps.onClick = opt => this._changeLevel(id, opt.event);
          }

          levels[key] = levelContent;
          child = React.cloneElement(child, childProps);
        }

        levelContent.push(child);
      });

      return levelContent;
    };

    let id = this.getId();
    levels[id] = iterateSubmenu(children, id, id);

    return levels;
  },

  _changeLevel(currentLevel, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.setState({ currentLevel });
  },

  _renderChildren() {
    let children = this.state.levels[this.state.currentLevel];

    if (!children) {
      return this.state.levels[this.getId()];
    } else {
      return children;
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._renderChildren();
  }
  //@@viewOff:render
});

export default CompactContextMenu;