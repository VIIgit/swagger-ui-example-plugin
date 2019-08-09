import React from 'react';

import { stringify } from '../components/swagger-ui/utils';
import { fromJS } from 'immutable';
import filter from '../objectModifier';
//import ModelExample from '../components/model-example';
import ModelExample from '../components/model-example';

import Response from '../components/response';
import RequestBody from  '../components/swagger-ui/request-body';

export function getExampleComponent(sampleResponse, examples, HighlightCode) {

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

const updateExample = function (system, props, example) {
  let HighlightCode = system.getComponent("highlightCode");
  let exampleComponent = getExampleComponent(example, undefined, HighlightCode);
  return Object.assign({}, props, { example: exampleComponent });
};
const updateSchema = function (props, schema) {
  return Object.assign({}, props, { schema: schema });
};

const cleanupSchemaExampleDefaultFn = function (value, prop, obj, path) {
  if (prop === 'example') {
    delete obj['example'];
  } else if (prop === '$$ref') {
    delete obj['$$ref'];
  }
  return true;
};

const getRequestContentType = function (specPath) {
  if (specPath.size === 6 && specPath.get(3, '') === 'requestBody') {
    return specPath.get(5, '');
  }
  return undefined;
}

const getResponseContentType = function (specPath) {
  if (specPath.size > 0) {
    return specPath.get(1, '');
  }
  return undefined;
}

export function WrapModelExamplePlugin(regexApplicationJson = /(application\/json)/, plugin, cleanupSchemaExample) {
  return function () {
    const argumentsCopy = [...arguments, regexApplicationJson, cleanupSchemaExample]
    return plugin.apply(this, argumentsCopy);
  };
}
export function OneOfExampleComponentPlugin(regexContentType = /(application\/json)/) {
  return {
    fn: {
      oneOfPlugin: { 
        matchContentType: function(contentType){
          return contentType.match(regexContentType.source)  
        }}
    },
    components: {
      response: Response,
      modelExample: ModelExample,
      //requestBody: RequestBody
    },
    wrapComponents: {
      parameterRow: (Original, system) => (props) => {

        return <div> 
          parameterRowparameterRowparameterRowparameterRow
          <Original {...props}></Original>
        </div>
      },
      requestBody: (Original, system) => (props) => {

        return <div> 
          requestBodyrequestBodyrequestBodyrequestBody
          <Original {...props}></Original>
        </div>
      },
      modelExampleX: (Original, system) => (props) => {

        let { specPath, isExecute, response, getConfigs } = props;
        
        if (false && system.specSelectors.isOAS3() && !isExecute) {

          let schemaParseConfig;
          let contentType = getRequestContentType(specPath);
          if (contentType) {
            schemaParseConfig = {
              includeReadOnly: false,
              includeWriteOnly: true
            };
          } else {
            contentType = getResponseContentType(specPath);
            schemaParseConfig = {
              includeReadOnly: true,
              includeWriteOnly: false
            };
          }
          //var examples=response.get("examples");
          if (contentType.match(regexContentType)) {
            return <ModelExample
              Original={Original}
              schemaParseConfig={schemaParseConfig}
              memoizedSampleFromSchema={system.fn.memoizedSampleFromSchema}
              highlightCode={system.getComponent("highlightCode")}
              {...props}
            />
          }
        }
        return <Original regexContentType = {regexContentType} { ...props} />;
      }
    }
  }
}

function renderOriginal(Original, props, title) {
  if (title) {
    return <div>
      <h4>{title}</h4>
      <Original {...props} />
    </div>
  }
  return <Original {...props} />
}

export function SchemaAsExampleComponentPlugin(system, regexApplicationHalSchema = /(application\/)hal-[a-z-+]*(json)/, cleanupSchemaExampleFn) {
  const cleanupSchemaExample = cleanupSchemaExampleFn ? cleanupSchemaExampleFn : cleanupSchemaExampleDefaultFn;
  return {
    wrapComponents: {

      modelExample: (Original, system, isExecute) => (props) => {
        var title, oneOfOptions;
        if (system.specSelectors.isOAS3() && !isExecute) {

          let { schema, specPath } = props;
          let contentType = getRequestContentType(specPath);
          contentType = contentType ? contentType : getResponseContentType(specPath);

          if (contentType.match(regexApplicationHalSchema) && schema) {

            var schemaExample = schema.get('x-schemaExample');

            if (schemaExample) {

              var schemaExampleJS = schemaExample.toJS();

              filter(schemaExampleJS, function (value, prop, obj, path) {
                if (prop === 'x-schema') {
                  Object.assign(obj, value);
                  delete obj[prop];
                  return true;
                }
                return true;
              });

              var orderedSchema = fromJS(schemaExampleJS);

              filter(schemaExampleJS, cleanupSchemaExample);

              props = updateExample(system, props, schemaExampleJS);
              props = updateSchema(props, orderedSchema);

              title = 'Example Value contains resolved schema as JSON Schema (beta)';
            }
          }
        }
        return renderOriginal(Original, props, title, oneOfOptions);
      }
    }
  }
}
