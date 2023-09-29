Ext.define('CitizensApp.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'CitizensApp.view.SearchWindow',
    ],

    xtype: 'app-main',


    items: [
        {
            xtype: 'citizen-search-win'
        },
        {
            xtype: 'button',
            text: 'Поиск гражданина',
            handler: function(){
               const searchWindow = this.up('app-main').down('citizen-search-win');
               searchWindow.show();
            }
        }
    ]
    
});

