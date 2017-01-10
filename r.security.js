/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('r.security');
 * mod.thing == 'a thing'; // true
 */

var security = {
    
    arrAllies: [
            'DirtyLittleCodeMonkey',
            'Dfett'
        ],
    
    sHomeRoom: 'E78S14',
    
    sDefenceGroup: 'a',
    sOverLook: 'overLook',
    
    arrRoomsSecurity: [
           'E78S14',   // home world
           'E79S14',   // Right
           'E77S14',   // Left
           'E78S13'    // top
        ],
    
    oHostileArray: [], // rooms with creep
    
    run : function() { // BASE RUNTIME for defense
       
       
       
       
        var sWarRoom = this.rRoomWithHostile();
        if(sWarRoom) {
            console.log('War!');
            console.log('Enemy detected in '+sWarRoom,30)
            Game.notify('War ! Room: '+ sWarRoom);
            
            var hostiles = Game.rooms[sWarRoom].find(FIND_HOSTILE_CREEPS, {
                             filter: (hostile) => {
                                return (security.arrAllies.indexOf(hostile.owner.username) == -1);
                             }
                        });
            
            var towers = Game.rooms[sWarRoom].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            if(hostiles.length > 0) {
                towers.forEach(tower => tower.attack(hostiles[0]));
            }
            
            
            
            // war status
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if(creep.memory.role == security.sDefenceGroup || creep.memory.role == security.sOverLook) {
                    if(creep.room.name !== sWarRoom) {
                        creep.moveTo(sWarRoom);
                    } else {
                        var oIndividualHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                             filter: (hostile) => {
                                return (security.arrAllies.indexOf(hostile.owner.username) == -1);
                             }
                        });
                        if(oIndividualHostile) {
                            if(creep.rangedAttack(oIndividualHostile) == ERR_NOT_IN_RANGE) {
                                creep.say('Sparta!');
                                creep.moveTo(oIndividualHostile);
                            }
                            if(creep.attack(oIndividualHostile) == ERR_NOT_IN_RANGE) {
                                creep.say('Sparta!');
                               // creep.moveTo(oIndividualHostile);
                            }
                            
                        }
                    }
                }
            }
        } else {
            // peace
            console.log('peace');
            var towers = Game.rooms[this.sHomeRoom].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}
            );
            towers.forEach(tower => tower.repair(tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < (10000 > structure.hitsMax ? structure.hitsMax : 10000 )
            }))); 
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if(creep.memory.role == security.sDefenceGroup) {
                    creep.moveTo(Game.flags['r1']);
                }
            }
        }
        
    },
    
    rRoomWithHostile : function() {
       
        var sRoom = false;
       
        security.arrRoomsSecurity.forEach(function(sSelectedRoom) {
            if(sSelectedRoom !== 'undefined') {
              
                var hostiles = Game.rooms[sSelectedRoom].find(FIND_HOSTILE_CREEPS,{filter: (hostile) => {
                                return (security.arrAllies.indexOf(hostile.owner.username) == -1);
                }});
                       
                if(hostiles.length > 0) {
                    
                    sRoom = sSelectedRoom;
                } 
            }
        });
        
        return sRoom;
       
    }
};

module.exports = security;
