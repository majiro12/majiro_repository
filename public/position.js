AFRAME.registerComponent('position_load', {
    init: function(){
        let el = this.el;
        let center = el.getAttribute('position');

        const mysql = require('../node_modules/mysql');

        //positionの取得
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root', 
            password: '1qazxsw2',
            database: 'position'
        });

        console.log("position DB接続");
        let position_x;
        let position_y;
        let position_z;

        connection.connect(function(err){
            if (err) throw err;
            const sql = 'SELECT * FROM position';
            connection.query(sql, function(err, results, fields){
                if (err || results[0]){
                    
                } else {
                    position_x = result[0].x;
                    position_y = result[0].y;
                    position_z = result[0].z;
                }
            })
        })

        let WorldPoint = {x: center.x + position_x, y: center.y + position_y, z: center.z + position_z};

        el.setAttribute('position', WorldPoint);
        console.log("position DBおわり")
    }
});