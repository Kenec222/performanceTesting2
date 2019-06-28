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

import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import StepperItem from "./stepper-item.js";
import ClassNames from '../core/common/class-names.js';
import "./stepper.less";

const StepperContext = UU5.Common.Context.create();

export const withStepperContext = Component => {
  if (!UU5.Common.Context.isSupported()) return Component;
  let forwardRef = React.forwardRef((props, ref) => {
    return (
      <StepperContext.Consumer>{context => <Component {...context} {...props} ref={ref} />}</StepperContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export const Stepper = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ResizeMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Stepper"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("stepper"),
      wrapper: ns.css("stepper-wrapper"),
      horizontal: ns.css("stepper-horizontal"),
      vertical: ns.css("stepper-vertical"),
      visibility: ns.css("stepper-visibility"),
      hideText: ns.css("stepper-hide-texts"),
      mini: ns.css("stepper-mini"),
      leftAlignment: ns.css("stepper-left-alignment"),
      rightAlignment: ns.css("stepper-right-alignment"),
      centerAlignment: ns.css("stepper-center-alignment"),
      inner: ns.css("stepper-inner")
    },
    defaults: {
      childTagName: "UU5.Bricks.Stepper.Item"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: PropTypes.oneOf(["s", "m", "l", "xl"]),
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    onClick: PropTypes.func,
    elevation: PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    topVisitedStep: PropTypes.number,
    currentStep: PropTypes.number,
    hideText: PropTypes.bool,
    alignment: PropTypes.oneOf(["left", "center", "right"]),
    itemProps: PropTypes.shape({
      bgStyle: PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      borderRadius: PropTypes.string,
      elevation: PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    })
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      orientation: "horizontal",
      onClick: null,
      elevation: null,
      topVisitedStep: 0,
      currentStep: 0,
      hideText: undefined,
      alignment: "left",
      itemProps: { bgStyle: "transparent", borderRadius: null, elevation: null }
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      firstRender: true
    };
  },
  componentDidUpdate(prevProps, prevState) {
    //fix for safari mac and ios wrong width of element , widht didn't change on resize and keept his width
    if (this.state.hideText !== prevState.hideText) {
      let domNode = this.findDOMNode();
      let domNodeSibling = domNode.nextSibling;
      let parentNode = domNode.parentNode;
      parentNode.removeChild(domNode);
      parentNode.insertBefore(domNode, domNodeSibling)
    }

  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  onResize_(oldWidth, newWidth) {
    this.setState(nextState => {
      let hideText;
      if (this.props.orientation === "horizontal") {
        hideText = this._getComponentWidth() > newWidth;
      } else {
        hideText = this._getComponentWidth() < (this.props.size === "s" ? 81 : (this.props.size === "m" ? 100 : (this.props.size === "l" ? 130 : 140 )));
      }
      if (nextState.hideText !== hideText) {
        return {
          hideText,
          firstRender: false
        };
      } else if (nextState.firstRender === this.state.firstRender) {
        return {
          firstRender: false
        };
      } else {
        return null;
      }
    });
  },
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    let hideText = this.props.hideText === undefined ? this.state.hideText : this.props.hideText;

    mainAttrs.className += " " + this.getClassName().wrapper;
    if (hideText) {
      mainAttrs.className += " " + this.getClassName().hideText;
    }
    if (this.state.firstRender) {
      mainAttrs.className += " " + this.getClassName().visibility;
    }
    if (this.state.hideText || this._hasItemsWithLabel()) {
      mainAttrs.className += " " + this.getClassName().mini;
    }
    if (this.props.alignment) {
      mainAttrs.className += " " +
      ((this.props.alignment === "center") ? this.getClassName().centerAlignment : (this.props.alignment === "right") ? this.getClassName().rightAlignment : this.getClassName().leftAlignment);
    }
    return mainAttrs;
  },

  _getComponentWidth() {
    // retrun complete width of component
    let width;
    let stepper = this.findDOMNode();
    if (this.props.orientation !== "vertical") {
      let origStyle = stepper.style.cssText;
      let origClassName = stepper.className;
      stepper.style.display = "inline-flex";
      stepper.classList.remove(this.getClassName().hideText);
      if (!this._hasItemsWithLabel()) stepper.classList.remove(this.getClassName().mini);
      width = stepper.getBoundingClientRect().width;
      stepper.style.cssText = origStyle;
      stepper.className = origClassName;
    } else {
      width = stepper.getBoundingClientRect().width;
    }
    return width;
  },
  _hasItemsWithLabel() {
    let children = this.props.children;
    if (!Array.isArray(children)) children = [children];
    return children.every(child => {
      return !child || child.props.children == null;
    });
  },
  _renderChildren() {
    let itemProps = {
      bgStyle: this.props.bgStyle,
      borderRadius: this.props.borderRadius,
      ...this.props.itemProps
    }

    let children = this.props.children;
    if (!Array.isArray(children)) children = [children];
    let result = children.map((child, index) => {
      if (index < 9) {
        return (
          <StepperContext.Provider
            value={{
              index: index,
              colorSchema: this.props.colorSchema,
              topVisitedStep: this.props.topVisitedStep,
              currentStep: this.props.currentStep,
              onClick: this.props.onClick,
              size: this.props.size,
              disabled: index > this.props.topVisitedStep ? true : false,
              itemProps: itemProps
            }}
            key={index}
          >
            {child}
          </StepperContext.Provider>
        );
      } else {
        return null;
      }
    });
    return result;
  },
  //@@viewOff:componentSpecificHelpers
  //@@viewOn:render
  render() {
    let innerClassNames = [this.getClassName().inner];
    if (this.props.elevation) {
      innerClassNames.push(ClassNames.elevation + this.props.elevation);
    }
    if (this.props.orientation === "horizontal") {
      innerClassNames.push(this.getClassName().horizontal);
    } else if (this.props.orientation === "vertical") {
      innerClassNames.push(this.getClassName().vertical);
    }
    return this.getNestingLevel() ?
      <div {...this._getMainAttrs()}>
        <div className={innerClassNames.join(" ")}>{this._renderChildren()}</div>
        {this.getDisabledCover()}
      </div>
      : null;
  }
  //@@viewOff:render
});

Stepper.Item = withStepperContext(StepperItem);
Stepper.Context = StepperContext;
export default Stepper;