# swagger-ui-plugins

## OneOfPlugin


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

## Schema Plugin

## Example Cleanup Plugin
