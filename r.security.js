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
            // war status
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if(creep.memory.role == 'a') {
                    if(creep.room.name !== sWarRoom) {
                        creep.moveTo(sWarRoom);
                    } else {
                        var oIndividualHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                             filter: (hostile) => {
                                 return (this.isAlly(hostile.owner.name)?false:true);
                             }
                        });
                        if(oIndividualHostile) {
                            if(creep.rangedAttack(oIndividualHostile) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(oIndividualHostile);
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
                        filter: (structure) => structure.hits < (5000 > structure.hitsMax ? structure.hitsMax : 5000 )
            })));
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if(creep.memory.role == 'a') {
                    creep.moveTo(Game.flags['r1']);
                }
            }
        }
    },
    
    rRoomWithHostile : function() {
       
        var bHostile = false;
       
        this.arrRoomsSecurity.forEach(function(entry) {
           var hostiles = Game.rooms[entry].find(FIND_HOSTILE_CREEPS);
           hostiles.forEach(function(entry) {
               if(!this.isAlly(entry.owner.username)) {
                   // then it's hostile. Acticate defence protocols
                   bHostile = entry;
               }
           });
        });
       
        return bHostile;
       
    },
    
    isAlly : function(sOwnerName) {
      
        var bAlly = false;
        if(Memory.IsAllyOneOkay == true) {
            this.arrAllies.forEach(function(entry) {
               if(entry == sOwnerName) {
                   bAlly = true;
               }
            });
        }
        return bAlly;
    }
};

module.exports = security;
