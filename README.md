# swagger-ui-plugins

## OneOfPlugin

Analysis example view of OAS3 Schemas in non executing mode only for OneOf or AnyOf schemas as they're not displayed at all.

![ScreenCast](./OneOfExample.gif "Choose OneOf or AnyOf your schema")


### Issues

- JSON Example is provided by Swagger-Ui method, which can return non up-to-date cached data.

### Example Configuration

``` javascript
// load standalone java script
<script src="./swagger-ui-plugins.min.js"></script>

<script>
    const OneOfPlugin = window.swaggerUI.plugins.OneOfExamplePlugin;

    window.onload = function() {
        // Build a system
        const editor = SwaggerEditorBundle({
        dom_id: '#swagger-editor',
        showExtensions: true,
        url: './one-of-delivery-addresses.yaml',
        presets: [
            OneOfPlugin
        ]
        });
        window.editor = editor
   }
</script>
```

## Schema Plugin

## Example Cleanup Plugin
