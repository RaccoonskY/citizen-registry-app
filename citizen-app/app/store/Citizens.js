Ext.define('CitizensApp.store.Citizens', {

    extend: 'Ext.data.Store',
    xtype:'citizen-store',
    storeId:'citizenStore',
    model: "CitizensApp.model.Citizen",
    sorters:[
        {
            property:'fam',
            direction:'ASC'
        },
        {
            property:'imya',
            direction:'ASC'
        },
        {
            property:'otchest',
            direction:'ASC'
        },
    ]

    
});

