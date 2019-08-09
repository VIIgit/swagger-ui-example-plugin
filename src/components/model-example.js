import React from 'react';
import {default as ModelExampleOrig} from './swagger-ui/model-example';

import PropTypes from "prop-types";

import { stringify } from './swagger-ui/utils';

import OneOfSelector from './one-of-selector';
import { fromJS } from 'immutable';
import { extractModel } from './model-example/oneOfOrAnyOfExtractor';

export default class ModelExample extends ModelExampleOrig {
  
  static propTypes = {
    manualMode: PropTypes.bool,
    getComponent: PropTypes.func.isRequired,
    selectedOneOfOptions: PropTypes.object,
    oneOfOptions: PropTypes.object,
    patchedSchemaJS: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = Object.assign(
      this.state, 
      {
        manualMode: false,
        oneOfOptions: undefined,
        selectedOneOfOptions: {},
        patchedSchemaJS: undefined
      }
    );
    
    this.patchSchema = this.patchSchema.bind(this);
  }

  componentWillMount() {
  //  this.patchSchema();
  }

  getExampleComponent(sampleResponse, examples, HighlightCode) {

    if (examples && examples.size) {
      return examples.entrySeq().map(([key, example]) => {
        let exampleValue = stringify(example);

        return (<div key={key}>
          <h5>{key}</h5>
          <HighlightCode className="example" value={exampleValue} />
        </div>)
      }).toArray()
    }

    if (sampleResponse) {
      let sampleResponseStr = stringify(sampleResponse);
      return <HighlightCode className="example" value={sampleResponseStr} />
    }
    return null;
  }

  patchSchema(changedState) {

    var { manualMode, selectedOneOfOptions } = this.state;

    var oneOfExtractModelSetting = Object.assign({
      manualMode: manualMode,
      oneOfOptions: undefined,
      selectedOneOfOptions: selectedOneOfOptions,
      patchedSchemaJS: undefined
    }, changedState);

    if(this.props.fn) {
      oneOfExtractModelSetting = extractModel(this.props, oneOfExtractModelSetting, this.props.fn.memoizedSampleFromSchema);
    } else {
      console.log('NO this.props.fn.memoizedSampleFromSchem!!!!!');
    }

    this.setState({
      manualMode: oneOfExtractModelSetting.manualMode,
      oneOfOptions: oneOfExtractModelSetting.oneOfOptions,
      selectedOneOfOptions: oneOfExtractModelSetting.selectedOneOfOptions,
      patchedSchemaJS: oneOfExtractModelSetting.patchedSchemaJS
    });
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps)
    this.patchSchema();
  }

  render() {


    let { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")

    let isOAS3 = specSelectors.isOAS3()

    // OneOf Addition
    const { schemaParseConfig, fn } = this.props;
    const { manualMode, oneOfOptions, selectedOneOfOptions, patchedSchemaJS } = this.state;
    const hasOneOfOptions = oneOfOptions && oneOfOptions.length>0 && this.state.activeTab === "example";
    if (hasOneOfOptions) {
      const example = fn.memoizedSampleFromSchema(patchedSchemaJS, schemaParseConfig);
      const exampleComponent = this.getExampleComponent(example, undefined, HighlightCode);
      const orderedSchema = fromJS(patchedSchemaJS);
      const updatedProps = Object.assign({}, this.props, { example: exampleComponent, schema: orderedSchema });
    }

    return <div>
      

      <div className="model-example">

        <ul className="tab">
          <li className={ "tabitem" + ( this.state.activeTab === "example" ? " active" : "") }>
            <a className="tablinks" data-name="example" onClick={ this.activeTab }>{isExecute ? "Edit Value" : "Example Value"}</a>
          </li>
          { schema ? <li className={ "tabitem" + ( this.state.activeTab === "model" ? " active" : "") }>
            <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>
              {isOAS3 ? "Schema" : "Model" }
            </a>
          </li> : null }
        </ul>
        <div>
          {
            this.state.activeTab === "example" ? (
              example ? example : (
                <HighlightCode value="(no example available)" />
              )
            ) : null
          }
          {
            this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                      getComponent={ getComponent }
                                                      getConfigs={ getConfigs }
                                                      specSelectors={ specSelectors }
                                                      expandDepth={ defaultModelExpandDepth }
                                                      specPath={specPath} />


          }
        </div>
      </div>

      {
        // OneOf Addition
        hasOneOfOptions ? (
          !isExecute ? (
            <OneOfSelector
              manualMode={manualMode}
              oneOfOptions={manualMode ? oneOfOptions : undefined}
              selectedOneOfOptions={manualMode ? selectedOneOfOptions : {}}
              onSelectedOneOfOptionChanged={this.patchSchema}
            />
          ) : null
        ) : null
      }

    </div>

  }

}
