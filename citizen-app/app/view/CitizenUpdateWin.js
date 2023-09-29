Ext.define('CitizensApp.view.CitizenUpdateWin', {

    extend: 'Ext.window.Window',
    alias: 'widget.CitizenUpdateWin',
    xtype: 'citizen-update-win',

    title:'Введите данные гражданина',
    layout: {
        type: 'vbox',
        align: 'center'
    },

    modal: true,
    resizable: true,
    draggable: true,
    autoShow: true,
    closeAction: 'destroy',
    minWidth:200,
    minHeight:200,


    items:[{
            xtype: 'textfield',
            fieldLabel: 'Фамилия',
            name: 'fam',
            labelAlign: 'top',

        }, {
            xtype: 'textfield',
            fieldLabel: 'Имя',
            name: 'imya',
            labelAlign: 'top',
        }, {
            xtype: 'textfield',
            fieldLabel: 'Отчество',
            name:'otchest',
            labelAlign: 'top',
        }, {
            xtype: 'datefield',
            fieldLabel: 'Дата рождения',
            name:'dat_rozhd',
            labelAlign: 'top',

        }

    ],

    constructor: function(config){
        
        this.callParent([config]);
        if (config.citizenToUpdate) {
            this.items.each(function (item) {
                if (item.name && config.citizenToUpdate[item.name] !== undefined) {
                    item.setValue(config.citizenToUpdate[item.name]);
                }
            });
        }
    }
});

