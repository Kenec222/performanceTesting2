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
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";




import './number.less';

export const Number = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Number"),
    nestingLevel: 'inline',
    classNames: {
      main: ns.css("number"),
      negative: ns.css("number-negative"),
      positive: ns.css("number-positive"),
      zero: ns.css("number-zero")
    },
    defaults: {
      event: UU5.Common.Tools.events.number,
      thousandSeparator: '&nbsp;',
      decimalSeparator: ',',
      regexpNumberParts: /\B(?=(\d{3})+(?!\d))/g,
      regexpNotDigit: /(\D)/g
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    country: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
    thousandSeparator: PropTypes.string,
    decimalSeparator: PropTypes.string,
    minDecimalLength: PropTypes.number,
    maxDecimalLength: PropTypes.number,
    rounded: PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      country: undefined,
      value: null,
      onChange: null,
      thousandSeparator: null,
      decimalSeparator: null,
      minDecimalLength: null,
      maxDecimalLength: null,
      rounded: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState: function () {
    this._specifiedThouSep = !!this.props.thousandSeparator;
    this._specifiedDecSep = !!this.props.decimalSeparator;
    let opts = this._initOptions(this.props);

    return {
      country: opts.country,
      thousandSeparator: opts.thousandSeparator,
      decimalSeparator: opts.decimalSeparator
    };
  },

  componentWillMount: function () {
    UU5.Environment.EventListener.registerNumber(this.getId(), this._onChange);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this._specifiedThouSep = !!nextProps.thousandSeparator;
      this._specifiedDecSep = !!nextProps.decimalSeparator;
      let opts = this._initOptions(nextProps);

      this.setState({
        thousandSeparator: opts.thousandSeparator,
        decimalSeparator: opts.decimalSeparator,
        country: opts.country
      });
    }
  },

  componentWillUnmount: function () {
    UU5.Environment.EventListener.unregisterNumber(this.getId(), this._onChange);
  },

  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  getCountry() {
    return this.state.country;
  },

  setCountry(country, setStateCallback) {
    this.setOptions({ country }, setStateCallback);
    return this;
  },

  getDecimalSeparator() {
    return this.state.decimalSeparator;
  },

  setDecimalSeparator(decimalSeparator, setStateCallback) {
    if (decimalSeparator) this._specifiedDecSep = true;
    else this._specifiedDecSep = false;

    this.setOptions({decimalSeparator: decimalSeparator}, setStateCallback);

    return this;
  },

  getThousandSeparator() {
    return this.state.thousandSeparator;
  },

  setThousandSeparator(thousandSeparator, setStateCallback) {
    if (thousandSeparator) this._specifiedThouSep = true;
    else this._specifiedThouSep = false;

    this.setOptions({thousandSeparator: thousandSeparator}, setStateCallback);

    return this;
  },

  setOptions(opt, setStateCallback) {
    let country = opt.country !== undefined ? opt.country : this.state.country;
    let thousandSeparator = opt.thousandSeparator !== undefined ? opt.thousandSeparator : this.state.thousandSeparator;
    let decimalSeparator = opt.decimalSeparator !== undefined ? opt.decimalSeparator : this.state.decimalSeparator;

    if (country) {
      let separators = this._getFormatByCountry(this.props.value, country);
      if (!thousandSeparator || !this._specifiedThouSep) {
        thousandSeparator = separators.thousandSeparator;
      }
      if (!decimalSeparator || !this._specifiedDecSep) {
        decimalSeparator = separators.decimalSeparator;
      }
    }

    this.setState({ country, thousandSeparator, decimalSeparator }, setStateCallback);

    return this;
  },

  onChangeDefault(opt) {
    this.setOptions(opt);

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _initOptions(props) {
    let country = props.country ? props.country : this.state && this.state.country || props.country;
    let thousandSeparator = props.thousandSeparator;
    let decimalSeparator = props.decimalSeparator;

    if (!thousandSeparator || !decimalSeparator) {
      let separators = country ?
        this._getFormatByCountry(props.value, country) :
        { thousandSeparator: this.getDefault("thousandSeparator"), decimalSeparator: this.getDefault("decimalSeparator") };
      thousandSeparator = thousandSeparator || separators.thousandSeparator;
      decimalSeparator = decimalSeparator || separators.decimalSeparator;
    }

    return { country, thousandSeparator, decimalSeparator };
  },

  _onChange(opt) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this, opt);
    } else {
      this.onChangeDefault(opt);
    }
    return this;
  },

  _formatNumber(){
    let number = this.props.value;

    if (number !== null) {
      let numberParts = number.toString().split('.');

      if (this.props.rounded !== null && this.props.rounded <= 0) {
        number = UU5.Common.Tools.round10(parseFloat(number), this.props.rounded);
      } else if (numberParts.length > 1) {
        if (this.props.maxDecimalLength && this.props.maxDecimalLength < numberParts[1].length) {
          numberParts[1] = numberParts[1].slice(0, this.props.maxDecimalLength - numberParts[1].length);
        }
        number = +numberParts.join('.');
      }

      let separators = this._getSeparators();

      let numberPartsRounded = number.toString().split('.');
      numberPartsRounded[0] = numberPartsRounded[0].replace(this.getDefault().regexpNumberParts, separators.thousandSeparator);

      let result = numberPartsRounded[0];
      if (numberPartsRounded.length > 1 || this.props.minDecimalLength) {
        result += separators.decimalSeparator + UU5.Common.Tools.ljust((numberPartsRounded[1] || 0), this.props.minDecimalLength, '0');
      }

      return result;
    }
  },

  _getSeparators() {
    return { decimalSeparator: this.state.decimalSeparator, thousandSeparator: this.state.thousandSeparator };
  },

  _getFormatByCountry(number, country) {
    country = country ? country.toLowerCase() : country;
    let result;
    if (number) {
      if (UU5.Environment.numberFormat[country]) {
        result = UU5.Environment.numberFormat[country];
      } else {
        result = this._getFormatFromNumber(number, country);
      }
    } else {
      result = { decimalSeparator: this.getDefault("decimalSeparator"), thousandSeparator: this.getDefault("thousandSeparator") };
    }
    return result;
  },

  _getFormatFromNumber(number, country){
    let localizedSeparators = number.toLocaleString(country);

    let matchNoNumber = localizedSeparators.toString().match(this.getDefault().regexpNotDigit);
    if (matchNoNumber && matchNoNumber[0] == '-') {
      matchNoNumber.shift();
    }

    let deciSeparator = null;
    let thouSeparator = null;
    if (matchNoNumber) {
      let count = matchNoNumber.length;
      if (count > 1) {
        deciSeparator = matchNoNumber[count - 1];
        thouSeparator = this._checkSpace(matchNoNumber[count - 2]);

      } else if (count == 1) {
        if (this.props.value < -999 || this.props.value > 999) {

          thouSeparator = this._checkSpace(matchNoNumber[count - 2]);
          deciSeparator = null;
        } else {
          thouSeparator = null;
          deciSeparator = matchNoNumber[count - 1];
        }
      } else {
        thouSeparator = null;
        deciSeparator = null;
      }
    }

    return {decimalSeparator: deciSeparator, thousandSeparator: thouSeparator}
  },

  _checkSpace(separator){
    if (separator == ' ') {
      separator = '&nbsp;';
    }
    return separator;
  },

  _getMainAttrs(){
    var mainAttrs = this.getMainAttrs();
    let number = this.props.value;
    if (number !== null) {
      if (number < 0) {
        mainAttrs.className += ' ' + this.getClassName().negative;
      } else if (number == 0) {
        mainAttrs.className += ' ' + this.getClassName().zero;
      } else {
        mainAttrs.className += ' ' + this.getClassName().positive;
      }
    }
    return mainAttrs;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    let mainAttrs = this._getMainAttrs();
    let numAttrs = {dangerouslySetInnerHTML: {__html: this._formatNumber(this.props.value)}};
    let result = <span {...mainAttrs} {...numAttrs} />;

    if (this.isDisabled()) {
      result = (
        <span {...mainAttrs}>
          <span {...numAttrs} />
          {this.getDisabledCover()}
        </span>
      );
    } else {
      result = <span {...mainAttrs} {...numAttrs} />;
    }

    return this.getNestingLevel() ? result : null;
  }
  //@@viewOff:render
});

export default Number;