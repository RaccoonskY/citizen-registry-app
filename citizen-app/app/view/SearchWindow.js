Ext.define('CitizensApp.view.SearchWindow',{
    extend: 'Ext.window.Window',
    requires:[
        'CitizensApp.view.SearchForm',
    ],

    alias: 'widget.SearchWindow',
    xtype: 'citizen-search-win',

    title: 'Поиск Граждан',
    modal: true,
    resizable: true,
    draggable: true,
    autoShow: true,
    closable: false,
    closeAction: 'hide',

    width:500,
    height:350,
    layout: 'fit',

    items:[
        {
            xtype: 'citizen-search-form'
        }
    ],

    buttons:[{
        text:'Выход',
        handler: function() {
            this.up('window').close();
        }
    }]
})