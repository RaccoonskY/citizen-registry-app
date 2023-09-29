Ext.define('CitizensApp.view.SearchForm', {

    requires:[
        'CitizensApp.view.SearchResultsWin'
    ],
    extend: 'Ext.form.Panel',
    alias: 'widget.SearchForm',
    xtype: 'citizen-search-form',

    title:'Данные граждан',
    layout: {
        type: 'vbox',
        align: 'center'
    },


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
            fieldLabel: 'Возраст с',
            name:'rozhd_ot',
            labelAlign: 'top',

        },{
            xtype: 'datefield',
            fieldLabel: 'Возраст по',
            name:'rozhd_po',
            labelAlign: 'top',
        },
        {
            xtype:'button',
            text: 'Поиск',
            align: 'center',
            handler: ()=>{
                Ext.widget('SearchResultsWin').show();
            }
        }

    ],

   


});

