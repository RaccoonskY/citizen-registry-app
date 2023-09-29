Ext.define('CitizensApp.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Fit',
        'CitizensApp.view.Main'
    ],

    layout: {
        type: 'border'
    },

    items: [{
        xtype: 'app-main',
        region:'center'
    }]
});
