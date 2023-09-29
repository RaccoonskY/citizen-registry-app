Ext.define('CitizensApp.store.Citizens', {

    extend: 'Ext.data.Store',
    xtype:'citizen-store',
    storeId:'citizenStore',
    model: "CitizensApp.model.Citizen",
    autoLoad: true,

    data:{'items':[
        { 'id':1,'imya': 'Lisa',  "fam":"Ivanova", "otchest":"Ivanovna",  "dat_rozhd":new Date('1999','11','22') },
        { 'id':2,'imya': 'Иван',  "fam":"Иванов", "otchest":"Михайлович",  "dat_rozhd":new Date('1999','11','30') },
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});

