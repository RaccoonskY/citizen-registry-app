Ext.define('CitizensApp.model.Citizen', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'imya', type: 'string' },
        { name: 'fam', type: 'string' },
        { name: 'otchest', type: 'string' },
        { name: 'dat_rozhd', type: 'date' }
    ]
});