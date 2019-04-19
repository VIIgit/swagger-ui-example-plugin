# swagger-ui-example-plugin


```

    <script src="./swagger-ui-bundle.js"> </script>
    <script src="./swagger-ui-standalone-preset.js"> </script>
    <script src="./bundle.js"> </script>
    
    <script>
        const filter = window.bundle.filter;
        const YAML = window.bundle.YAML;
        const jsonPointer = window.bundle.jsonPointer;

        const cleanupExampleSchema = function (obj) {
        filter(obj, function (value, prop, obj, path) {
            if (prop === 'example'){
                delete obj['example'];
            }
            return true;
        });
        };

        const MyUpdateSpecActionPlugin = function(system) {
        
            return {
                statePlugins: {
                    spec: {
                        wrapActions: {
                            updateSpec: (oriAction, system) => (openApiAsString) => {

                                let schema = YAML.parse(openApiAsString);
                                const s = schema;
                                const schemaPointer = jsonPointer(schema);
                                
                                filter(schema, function (value, prop, obj, path) {
                                console.log(path + arguments);
                                if (prop === 'x-schemaExample'){
                                        const ref = obj['x-schemaExample'].$ref;
                                        obj.example = Object.assign({}, schemaPointer.get(ref.substring(1)) );
                                        obj['x-schemaExample'] = ref;
                                        cleanupExampleSchema(obj.example);
                                        
                                        return false;
                                    }
                                    return true;
                                });

                                let xstr = YAML.stringify(schema);
                                return oriAction(xstr);
                            }
                        }
                    }
                }
            }
        }

    window.onload = function() {
      // Begin Swagger UI call region
      const ui = SwaggerUIBundle({
        url: "https://petstore.swagger.io/v2/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset,
          MyUpdateSpecActionPlugin
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      })

      window.ui = ui
    }
  </script>

```