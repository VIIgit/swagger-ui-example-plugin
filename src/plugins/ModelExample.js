import React, { Component } from 'react';
import PropTypes from "prop-types";

import {stringify} from '../immutable-converter';

import OneOfSelector from './OneOfSelector';
import {fromJS} from 'immutable';
import {extractModel} from './oneOfExample';

class ModelExample extends Component {
  static propTypes = {
    manualMode: PropTypes.bool,
    getComponent: PropTypes.func.isRequired,
    selectedOneOfOptions: PropTypes.object,
    oneOfOptions: PropTypes.object,
    patchedSchemaJS: PropTypes.object,
    memoizedSampleFromSchema: PropTypes.func.isRequired
  } 

  constructor(props) {
    super(props);    
    this.state = {
      manualMode: false,
      oneOfOptions: undefined,
      selectedOneOfOptions: {},
      patchedSchemaJS: undefined      
    };
    this.patchSchema = this.patchSchema.bind(this);
  }

  componentWillMount() {
    this.patchSchema();
  }

  getExampleComponent ( sampleResponse, examples, HighlightCode ) {
    
    if ( examples && examples.size ) {
        return examples.entrySeq().map( ([ key, example ]) => {
        let exampleValue = stringify(example);
        
        return (<div key={ key }>
            <h5>{ key }</h5>
            <HighlightCode className="example" value={ exampleValue } />
        </div>)
        }).toArray()
    }

    if ( sampleResponse ) { 
        let sampleResponseStr = stringify(sampleResponse);
        return <HighlightCode className="example" value={ sampleResponseStr } />
    }
    return null;
  }

  patchSchema(changedState){

    var {manualMode, selectedOneOfOptions} = this.state;
    
    var oneOfExtractModelSetting = Object.assign( {
      manualMode: manualMode,
      oneOfOptions: undefined,
      selectedOneOfOptions: selectedOneOfOptions,
      patchedSchemaJS: undefined
    },changedState);

    oneOfExtractModelSetting = extractModel(this.props, oneOfExtractModelSetting);
    
    this.setState({
      manualMode: oneOfExtractModelSetting.manualMode,
      oneOfOptions: oneOfExtractModelSetting.oneOfOptions,
      selectedOneOfOptions: oneOfExtractModelSetting.selectedOneOfOptions,
      patchedSchemaJS: oneOfExtractModelSetting.patchedSchemaJS
    });
  }

  render() {
    const {Original, schemaParseConfig, memoizedSampleFromSchema, highlightCode} = this.props;
    const {manualMode, oneOfOptions, selectedOneOfOptions, patchedSchemaJS} = this.state;

    if( oneOfOptions){
      const example = memoizedSampleFromSchema(patchedSchemaJS, schemaParseConfig);
      const exampleComponent =  this.getExampleComponent(example, undefined, highlightCode);
      const orderedSchema = fromJS(patchedSchemaJS);
      const updatedProps = Object.assign({}, this.props, {example: exampleComponent, schema: orderedSchema});
        
      return <div>
        <Original {...updatedProps} />
        <OneOfSelector 
          manualMode={manualMode}
          oneOfOptions={manualMode ? oneOfOptions: undefined }
          selectedOneOfOptions={manualMode ? selectedOneOfOptions :{}}
          onSelectedOneOfOptionChanged={this.patchSchema} 
        />
      </div>
    }
    return <Original {...this.props} />
  }
}

export default ModelExample;