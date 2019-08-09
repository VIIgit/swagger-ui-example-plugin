import { stringify } from '../swagger-ui/utils';
import filter from '../../objectModifier';

function optionIndex(oneOfExtractModelSetting, id, maxIndex) {
  var defaultIndex;
  if (oneOfExtractModelSetting.manualMode) {
    defaultIndex = oneOfExtractModelSetting.selectedOneOfOptions[id];
    if (!defaultIndex) {
      defaultIndex = 0;
    }
    if (defaultIndex >= maxIndex) {
      defaultIndex = -1;
    }
  } else {
    defaultIndex = 0;
  }
  return defaultIndex;
}

function extractOneOfOrAnyOfAsExample(schemaJS, oneOfExtractModelSetting, memoizedSampleFromSchema, schemaParseConfig) {
  var parseResult = { options: [] };

  filter(schemaJS, function (value, prop, obj, path, objPath, parent, parentKey) {

    if ((prop === 'oneOf' || prop === 'anyOf') && !obj.example && parentKey !== 'items') {

      var options = {};

      var index = 0;
      var defaultIndex = optionIndex(oneOfExtractModelSetting, objPath, value.length);

      //let objExample = undefined; 
      let objExample = obj.type && obj.type === 'object' ? memoizedSampleFromSchema(obj, schemaParseConfig) : undefined;

      value.map(valueObj => {
        const res = memoizedSampleFromSchema(valueObj, schemaParseConfig);
        var optionTitle;
        if (valueObj.title) {
          optionTitle = valueObj.title;
        } else {
          optionTitle = stringify(res);
          if (optionTitle.length > 24) {
            optionTitle = optionTitle.substr(0, 25) + '...';
          }
        }
        if (index === defaultIndex) {

          if (objExample) {
            obj.example = Object.assign(objExample, res);
          } else {
            obj.example = res;
          }

          //obj.example=function(){ return {d: 'xxx'}; };
        }
        options['#' + index++] = '#' + index + ': ' + optionTitle;
        return true;
      }
      );

      parseResult.options.push({ key: objPath, options: options, defaultIndex: defaultIndex });
    }
    return true;
  });

  return parseResult;
}

export function extractModel(props, oneOfExtractModelSetting, memoizedSampleFromSchema) {
  const { schema, schemaParseConfig } = props;

  oneOfExtractModelSetting.patchedSchemaJS = schema.toJS();
  var parseResult = extractOneOfOrAnyOfAsExample(oneOfExtractModelSetting.patchedSchemaJS, oneOfExtractModelSetting, memoizedSampleFromSchema, schemaParseConfig);
  oneOfExtractModelSetting.oneOfOptions = parseResult.options;

  return oneOfExtractModelSetting;
}