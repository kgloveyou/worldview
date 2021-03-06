import React from 'react';
import PropTypes from 'prop-types';
import Scrollbar from '../../util/scrollbar';
import { isConditional } from '../../../modules/vector-styles/util';
class VectorStyleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeVectorStyle: props.activeVectorStyle
    };
  }

  /**
   * Pass vector style to model after selection
   * @param {String} id | custom VectorStyle Id
   */
  onChangeVectorStyle(vectorStyleId) {
    const { layer, clearStyle, setStyle, groupName } = this.props;
    setTimeout(function() {
      if (vectorStyleId === layer.id) {
        clearStyle(layer, vectorStyleId, groupName);
      } else {
        setStyle(layer, vectorStyleId, groupName);
      }
    }, 0);
    this.setState({ activeVectorStyle: vectorStyleId });
  }

  /**
   * Apply logic to render correct vectorStyle selection
   * @param {String} id | Legend Id
   */
  customLegend(styleLayerObject) {
    const { activeVectorStyle } = this.state;
    var description = styleLayerObject['source-description'] || styleLayerObject.id;
    const isConditionalStyling = styleLayerObject.paint ? isConditional(styleLayerObject.paint['line-color'] || styleLayerObject.paint['circle-color'] || styleLayerObject.paint['fill-color']) : false;

    return isConditionalStyling ? this.renderLegendMultiItem(styleLayerObject,
      styleLayerObject.id,
      description)
      : this.renderSelectorItemSingle(
        styleLayerObject,
        styleLayerObject.id,
        description,
        activeVectorStyle === styleLayerObject.id
      );
  }

  /**
   * Render classification legend when there are conditionals in the vectorstyles
   * @param {Object} vectorStyle | VectorStyle object
   * @param {String} id | colormap Id
   * @param {String} description | Colormap name
   */
  renderLegendMultiItem(vectorStyle, vectorStyleId, description) {
    const caseDefaultClassName =
      'wv-palette-selector-row ';
    const array = Array.from(vectorStyle.paint['line-color'] || vectorStyle.paint['circle-color'] || vectorStyle.paint['fill-color']);
    array.shift();
    const organizedArray = [];
    let temp = [];
    const chunk = 2;
    // https://stackoverflow.com/a/8495740/4589331
    for (let i = 0, j = array.length; i < j; i += chunk) {
      temp = array.slice(i, i + chunk);
      if (temp.length === 2) {
        const obj = {};
        if (temp[0].length === 3 &&
          typeof temp[0][2] === 'string' &&
          typeof temp[1] === 'string'
        ) {
          obj.label = temp[0][2];
          obj.color = temp[1];
          organizedArray.push(obj);
        } else {
          console.warn('Irregular conditional');
        }
      } else if (temp.length === 1 && typeof temp[0] === 'string') {
        organizedArray.push({ label: 'Default', color: temp[0] });
      } else {
        console.warn('Irregular conditional');
      }
    }
    return organizedArray.map((obj, i) => (
      <div key={vectorStyleId + i} className={caseDefaultClassName}>
        <label>
          <span
            className="wv-palettes-class"
            style={{ backgroundColor: obj.color }}
          >
            &nbsp;
          </span>
          <span className="wv-palette-label">{obj.label}</span>
        </label>
      </div>
    )
    );
  }

  /**
   * Render classification customs when there is only one
   * Color in colormap
   * @param {Object} vectorStyle | VectorStyle object
   * @param {String} id | colormap Id
   * @param {String} description | Colormap name
   * @param {Boolean} isSelected | is this colormap active
   */
  renderSelectorItemSingle(vectorStyle, vectorStyleId, description, isSelected) {
    const color = vectorStyle.paint
      ? vectorStyle.paint['line-color'] || vectorStyle.paint['circle-color'] || vectorStyle.paint['fill-color']
      : 'rgb(255, 255, 255)';
    const caseDefaultClassName =
      'wv-palette-selector-row wv-checkbox wv-checkbox-round gray ';
    const checkedClassName = isSelected ? 'checked' : '';
    return (
      <div key={vectorStyleId} className={caseDefaultClassName + checkedClassName}>
        <input
          id={'wv-palette-radio-' + vectorStyleId}
          type="radio"
          name="wv-palette-radio"
          onClick={() => this.onChangeVectorStyle(vectorStyleId)}
        />
        <label htmlFor={'wv-palette-radio-' + vectorStyleId}>
          <span
            className="wv-palettes-class"
            style={{ backgroundColor: color }}
          >
            &nbsp;
          </span>
          <span className="wv-palette-label">{description}</span>
        </label>
      </div>
    );
  }

  render() {
    const { index, vectorStyles, layer } = this.props;
    var vectorStyleId = layer.vectorStyle.id;
    var vectorStyle = vectorStyles[vectorStyleId];
    var vectorStyleLayers = vectorStyle.layers;

    var uniqueStyleLayers = vectorStyleLayers.filter(function(a) {
      if (!this[a.id]) {
        this[a.id] = true;
        return true;
      }
    }, Object.create(null));
    return (
      <div
        className="wv-palette-selector settings-component noselect"
        id={'wv-palette-selector' + index}
      >
        <h2 className="wv-header">Vector Styles</h2>
        <Scrollbar style={{ maxHeight: '200px' }}>
          {uniqueStyleLayers.map(styleLayerObject => {
            if (styleLayerObject && styleLayerObject) {
              var item = this.customLegend(styleLayerObject);
              return item;
            }
          })}
        </Scrollbar>
      </div>
    );
  }
}

VectorStyleSelect.propTypes = {
  activeVectorStyle: PropTypes.string,
  clearStyle: PropTypes.func,
  groupName: PropTypes.string,
  index: PropTypes.number,
  layer: PropTypes.object,
  setStyle: PropTypes.func,
  vectorStyles: PropTypes.object
};

export default VectorStyleSelect;
