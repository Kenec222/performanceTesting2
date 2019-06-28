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



import {P} from './factory.js';
import Row from './row';
import Section from './section';

import './cookies-info.less';

export const CookiesInfo = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("CookiesInfo"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'smallBox'),
    classNames: {
      main: ns.css("cookies-info")
    },
    opt: {
      nestingLevelRoot: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.shape({
      header: PropTypes.any,
      chapters: PropTypes.arrayOf(
        PropTypes.shape({
          header: PropTypes.any,
          // array of contents
          rows: PropTypes.arrayOf(PropTypes.any)
        })
      )
    }),
    headerLevel: PropTypes.oneOf(['0', '1', '2', '3', '4', '5', '6', 0, 1, 2, 3, 4, 5, 6]),
    chapterLevel: PropTypes.oneOf(['0', '1', '2', '3', '4', '5', '6', 0, 1, 2, 3, 4, 5, 6])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      data: {},
      headerLevel: 1,
      chapterLevel: 2
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getChapters: function (chaptersData) {
    var collection = this;
    return chaptersData && chaptersData.map(function (chapter, i) {
        var paragraphs = chapter.rows.map(function (content, j) {
          return (
            <P content={content} key={j}/>
          )
        });

        return (
          <Row header={chapter.header} key={i} level={collection.props.chapterLevel}>
            {paragraphs}
          </Row>
        )
      });
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    var data = this.props.data;
    var chapters = this._getChapters(data.chapters);

    return (
      <Section
        {...this.getMainPropsToPass()}
        header={data.header}
        level={this.props.headerLevel}
        nestingLevel={this.getNestingLevel()}
      >
        {chapters}
      </Section>
    );
  }
  //@@viewOff:render
});

export default CookiesInfo;