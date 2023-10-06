Ext.define('CitizensApp.view.CyrillicTextField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.cyrillictextfield',
    xtype: 'cyrillicfield',


    initComponent: function () {  
        this.callParent(arguments);

    },


    afterRender: function () {
        this.callParent(arguments);
        
        this.inputEl.on('keypress', this.cyrillicInputFilter, this);
    },


    cyrillicInputFilter: function (e) {
        var charCode = e.getCharCode();

        // Convert lowercase Cyrillic characters to uppercase
        if (charCode >= 1072 && charCode <= 1103) { // Cyrillic lowercase character range
            e.stopEvent(); // Prevent input of lowercase Cyrillic characters
            charCode -= 32; // Convert to uppercase by subtracting 32
            this.setRawValue(this.getRawValue() + String.fromCharCode(charCode));
        }
        else if (charCode !== 32 && charCode !== 45 && (charCode < 1040 || charCode > 1103)) { // Disallow Latin and non-Cyrillic characters
            e.stopEvent(); // Prevent input of non-allowed characters
            alert("В поля данных возможно водить только заглавные символы кириллицы, тире и пробел!\nПопробуйте сменить язык!")
        }
        else if (charCode === 32 || charCode === 45){
            const curString = this.getRawValue();
            const lastChar = curString.slice(-1);

            
            if (curString.length == 0 || curString.includes(" ")){
                e.stopEvent();
                alert("Пробелы и тире разрешается ставить только в середине.\n Возможен только 1 пробел.");
            }
            else if(lastChar == ' ' || lastChar == '-')
            {
                e.stopEvent();
            }
            else{
                e.stopEvent();
                var newString = (this.getRawValue() + String.fromCharCode(charCode));
                this.setRawValue(newString);
            }

        }
    },

    
   

});
