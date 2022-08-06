import './ViewportGrid.css'

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { utils } from '@ohif/core'
import { useSnackbarContext, useLogger } from '@ohif/ui'
//
import ViewportPane from './ViewportPane.js'
import DefaultViewport from './DefaultViewport.js'
import EmptyViewport from './EmptyViewport.js'

const { loadAndCacheDerivedDisplaySets } = utils

const ViewportGrid = function (props) {
  const {
    activeViewportIndex,
    availablePlugins,
    defaultPlugin: defaultPluginName,
    layout,
    numRows,
    numColumns,
    setViewportData,
    studies,
    viewportData,
    children,
    isStudyLoaded,
  } = props

  const rowSize = 100 / numRows
  const colSize = 100 / numColumns

  // http://grid.malven.co/
  if (!viewportData || !viewportData.length) {
    return null
  }

  return (
    <div></div>
  )
}

ViewportGrid.propTypes = {
  viewportData: PropTypes.array.isRequired,
  supportsDrop: PropTypes.bool.isRequired,
  activeViewportIndex: PropTypes.number.isRequired,
  layout: PropTypes.object.isRequired,
  availablePlugins: PropTypes.object.isRequired,
  setViewportData: PropTypes.func.isRequired,
  studies: PropTypes.array,
  children: PropTypes.node,
  defaultPlugin: PropTypes.string,
  numRows: PropTypes.number.isRequired,
  numColumns: PropTypes.number.isRequired,
}

ViewportGrid.defaultProps = {
  viewportData: [],
  numRows: 1,
  numColumns: 1,
  layout: {
    viewports: [{}],
  },
  activeViewportIndex: 0,
  supportsDrop: true,
  availablePlugins: {
    DefaultViewport,
  },
  defaultPlugin: 'defaultViewportPlugin',
}

/**
 *
 *
 * @param {*} plugin
 * @param {*} viewportData
 * @param {*} viewportIndex
 * @param {*} children
 * @returns
 */
function _getViewportComponent(viewportData, viewportIndex, children, availablePlugins, pluginName, defaultPluginName) {
  if (viewportData.displaySet) {
    pluginName = pluginName || defaultPluginName
    const ViewportComponent = availablePlugins[pluginName]

    if (!ViewportComponent) {
      throw new Error(
        `No Viewport Component available for name ${pluginName}.
         Available plugins: ${JSON.stringify(availablePlugins)}`
      )
    }

    return <ViewportComponent viewportData={viewportData} viewportIndex={viewportIndex} children={[children]} />
  }

  return <EmptyViewport />
}

export default ViewportGrid
