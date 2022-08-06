import React from 'react'
import { useDrop } from 'react-dnd'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './ViewportPane.css'

const ViewportPane = function (props) {
  const { children, onDrop, viewportIndex, className: propClassName } = props
  const [{ hovered, highlighted }, drop] = useDrop({
    accept: 'thumbnail',
    drop: (droppedItem, monitor) => {
      const canDrop = monitor.canDrop()
      const isOver = monitor.isOver()

      if (canDrop && isOver && onDrop) {
        const { StudyInstanceUID, displaySetInstanceUID } = droppedItem

        onDrop({ viewportIndex, StudyInstanceUID, displaySetInstanceUID })
      }
    },
    collect: (monitor) => ({
      highlighted: monitor.canDrop(),
      hovered: monitor.isOver(),
    }),
  })

  const snackbar = useSnackbarContext()
  const logger = useLogger()

  useEffect(() => {
    if (isStudyLoaded) {
      viewportData.forEach((displaySet) => {
        loadAndCacheDerivedDisplaySets(displaySet, studies, logger, snackbar)
      })
    }
  }, [studies, viewportData, isStudyLoaded, snackbar])

  const getViewportPanes = () =>
    layout.viewports.map((layout, viewportIndex) => {
      const displaySet = viewportData[viewportIndex]

      if (!displaySet) {
        return null
      }

      const data = {
        displaySet,
        studies,
      }

      // JAMES TODO:

      // Use whichever plugin is currently in use in the panel
      // unless nothing is specified. If nothing is specified
      // and the display set has a plugin specified, use that.
      //
      // TODO: Change this logic to:
      // - Plugins define how capable they are of displaying a SopClass
      // - When updating a panel, ensure that the currently enabled plugin
      // in the viewport is capable of rendering this display set. If not
      // then use the most capable available plugin

      const pluginName = !layout.plugin && displaySet && displaySet.plugin ? displaySet.plugin : layout.plugin

      const ViewportComponent = _getViewportComponent(
        data, // Why do we pass this as `ViewportData`, when that's not really what it is?
        viewportIndex,
        children,
        availablePlugins,
        pluginName,
        defaultPluginName
      )

      return (
        <ViewportPane
          onDrop={setViewportData}
          viewportIndex={viewportIndex} // Needed by `setViewportData`
          className={classNames('viewport-container', {
            active: activeViewportIndex === viewportIndex,
          })}
          key={viewportIndex}
        >
          {ViewportComponent}
        </ViewportPane>
      )
    })

  const ViewportPanes = React.useMemo(getViewportPanes, [
    layout,
    viewportData,
    studies,
    children,
    availablePlugins,
    defaultPluginName,
    setViewportData,
    activeViewportIndex,
  ])

  return (
    <>
      <div
        className={classNames(
          'viewport-drop-target',
          { hovered: hovered },
          { highlighted: highlighted },
          propClassName
        )}
        ref={drop}
        data-cy={`viewport-container-${viewportIndex}`}
      >
        {children}
      </div>
      <div
        data-cy="viewprt-grid"
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${numRows}, ${rowSize}%)`,
          gridTemplateColumns: `repeat(${numColumns}, ${colSize}%)`,
          height: '100%',
          width: '100%',
        }}
      >
        {ViewportPanes}
      </div>
    </>
  )
}

ViewportPane.propTypes = {
  children: PropTypes.node.isRequired,
  viewportIndex: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default ViewportPane
