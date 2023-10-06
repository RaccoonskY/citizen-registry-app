Ext.define('CitizensApp.store.Citizens', {

    extend: 'Ext.data.Store',
    xtype:'citizen-store',
    storeId:'citizenStore',
    model: "CitizensApp.model.Citizen",
    
});

