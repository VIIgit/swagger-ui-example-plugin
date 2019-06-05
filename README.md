# swagger-ui-example-plugin

Load util functions
```
<script src="./swaggerPluginUtils-core.js"> </script>
<script src="./swaggerPluginUtils-main.js"> </script>
<script src="./swaggerPluginUtils-init.js"> </script>
```
Load swagger bundles
```

<script src="./swagger-ui-bundle.js"> </script>
<script src="./swagger-ui-standalone-preset.js"> </script>
```

``` 
<script>
const filter = window.swaggerPluginUtils.filter;
const getExampleComponent = window.swaggerPluginUtils.customComponent.getExampleComponent;
const renderOriginal = window.swaggerPluginUtils.customComponent.renderOriginal;
const fromJS = window.swaggerPluginUtils.immutable.fromJS;

const cleanupSchemaExample = function (obj, system) {
  filter(obj, function (value, prop, obj, path) {
    if (prop === 'example'){
        delete obj['example'];
    } else if (prop === '$$ref'){
      delete obj['$$ref'];
    }
    return true;
  });
};

const extractOneOfOrAnyOfAsExample = function (obj, system, parseResult) {
  
  filter(obj, function (value, prop, obj, path) {
    if ((prop === 'oneOf' || prop === 'anyOf' ) && !obj['example']) {
      var examples = [];
      value.map(obj => {
          const res = system.fn.memoizedSampleFromSchema(obj, {
            includeReadOnly: true
          });
          examples.push(res);
        }
      );
      if (prop === 'oneOf' ){
        obj['example'] = { '// Consider only one of the following': examples};
      } else {
        obj['example'] = { '// Consider any of the following': examples};
      }
      parseResult.hasOneOrAnyOfExample = true;
    }
    return true;
  });
};

const updateExample = function (system, props, example) {
  let HighlightCode = system.getComponent("highlightCode");
  let exampleComponent =  getExampleComponent(example, undefined, HighlightCode);
  return  Object.assign({}, props, {example: exampleComponent});
};
const updateSchema = function ( props, schema) {
  return  Object.assign({}, props, {schema: schema});
};

const WrapModelExampleComponentPlugin = function(system) {
  const regexApplicationHalSchema = /(application\/)hal-[a-z-+]*(json)/;
  
  return {
    wrapComponents: {
      
      modelExample: (Original, system) => (props) => {

        let { schema, specPath } = props;
        let contentType = specPath.get(1,'');

        if(contentType.match( regexApplicationHalSchema ) && schema ) {

          var schemaExample = schema.get('x-schemaExample');

          if (schemaExample){

            var schemaExampleJS = schemaExample.toJS();

            filter(schemaExampleJS, function (value, prop, obj, path) {
              if (prop === 'x-schema'){
                Object.assign(obj, value);
                delete obj[prop];
                return true;
              }
              return true;
            });

            var orderedSchema = fromJS(schemaExampleJS);

            cleanupSchemaExample(schemaExampleJS, system);

            props = updateExample(system, props, schemaExampleJS);
            props = updateSchema( props, orderedSchema);

            return renderOriginal(Original, props, 'Example Value contains resolved schema as JSON Schema (beta)');
          }
        }

        var schemaJS = schema.toJS();
        var parseResult = {};
        extractOneOfOrAnyOfAsExample(schemaJS, system, parseResult);

        const example = system.fn.memoizedSampleFromSchema(schemaJS, {
          includeReadOnly: true
        });

        var title = parseResult.hasOneOrAnyOfExample ? 'Example Value contains every \'oneOf\' objects (beta example preview). Consider only one object!' : undefined;

        props = updateExample(system, props, example);

        return renderOriginal(Original, props, title);
      }
    }
  }
}
</script>
```
    
Add `WrapModelExampleComponentPlugin` as presets

```
    <script>

    window.onload = function() {
       
        // Build a system
        const editor = SwaggerEditorBundle({
        dom_id: '#swagger-editor',
        showExtensions: true,
        //url: './pet-simple.yaml',
            
        layout: 'StandaloneLayout',
        presets: [
            SwaggerEditorStandalonePreset,
            WrapModelExampleComponentPlugin
        ]
        });
    
        window.editor = editor
   }

  </script>
```