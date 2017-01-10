/*


Instructions:
=====================================================
Step 1: Move the flags near his home but not "too much near".
Step 2: Set "bCanbuild" at true.
Step 3: wait until all ramp are created and then move to flags near hit.
Step 4: Change iMode to 1. Archer are created and moved to sPreWaypoint. Ramp move to target flag.
Step 5: Move te flag manualy to the wall, then change iMode to 2. Battle ramp move on the wall. If no vision, move to target flag
Step 6: Wall fall : change iMode to 3. Archer move to target flag and attack nearest hostile creep. If not creep: spawer. Ramp go for the spawn.

Note: If creep not in same room as the "target" flag: they will just move to hit.
else they attack.



 */

var zattack = {
    
    bCanbuild: false, // Build lock
    
    iMode: 0, 
    
    sPreWaypoint : 'cc', // Waypoint to regroup while buidling up
    
    sTargetFlag: 'ct',  // Priority. Also use to move to if objet not visible.
    
    sTargetedWall: '58650a65444a3a397b8f6313', // Targeted Wall
    sTargetedSpawn: '5862f372c04c074e4f1726d5', // Targeted Spawn
    
    sRampRole: 'zr',
    sArcherRole: 'za',
    
    iBR: 0,
    iMaxBR: 4,
    
    iAR: 0,
    iMaxAR: 8,
    
    arrAllies: [
            'DirtyLittleCodeMonkey',
            'Dfett'
        ],
    
    run : function() {
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == zattack.sRampRole) {
                this.iBR++;
                if(zattack.iMode == 0) {
                    creep.moveTo(Game.flags[zattack.sPreWaypoint]);
                } else if(zattack.iMode == 1) {
                    creep.moveTo(Game.flags[zattack.sTargetFlag]);
                } else if(zattack.iMode == 2) {
                    try {
                        var oTargetWall = Game.getObjectById(zattack.sTargetedWall);
                        if(creep.dismantle(oTargetWall) == ERR_NOT_IN_RANGE) {
                           creep.moveTo(oTargetWall); 
                        }
                    } catch(e) {
                        creep.moveTo(zattack.sTargetFlag); 
                        
                    }
                } else if(zattack.iMode == 3) {
                    try {
                        var oTargetSpawn = Game.getObjectById(zattack.sTargetedSpawn);
                        if(creep.dismantle(oTargetSpawn) == ERR_NOT_IN_RANGE) {
                           creep.moveTo(oTargetSpawn); 
                        }
                    } catch(e) {
                        creep.moveTo(zattack.sTargetFlag); 
                    }
                }
            }
            if(creep.memory.role == zattack.sArcherRole) {
                this.iAR++;
                if(zattack.iMode == 1) {
                    creep.moveTo(Game.flags[zattack.sPreWaypoint]);
                } else if(zattack.iMode == 3) {
                    
                    if(Game.flags[zattack.sTargetFlag].pos.roomName == creep.pos.roomName) {
                        
                        var oIndividualHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                             filter: (hostile) => {
                                return (zattack.arrAllies.indexOf(hostile.owner.username) == -1);
                             }
                        });
                        
                        if(oIndividualHostile) {
                                if(creep.rangedAttack(oIndividualHostile) == ERR_NOT_IN_RANGE) {
                                    creep.say("¯\_(ツ)_/¯");
                                    creep.moveTo(oIndividualHostile);
                                }
                        } else {
                            creep.moveTo(Game.flags[zattack.sTargetFlag]);
                        }
                    } else {
                        creep.moveTo(Game.flags[zattack.sTargetFlag]);
                    }
                    
                    
                }
            }
        }
        
        if(this.iMode == 0 && this.bCanbuild) {
            if(this.iBR < this.iMaxBR) {
                if(Game.spawns['01'].createCreep(['work','work','work','work','work','work','move','move','move'],null,{
                    role:zattack.sRampRole
                }) == OK) {
                    console.log('Ramp created');
                }
            }
        } else if(this.iMode == 0 && this.bCanbuild) {
            if(this.iAR < this.iMaxAR) {
                if(Game.spawns['01'].createCreep(['ranged_attack','ranged_attack','ranged_attack','ranged_attack','move','move','move'],null,{
                    role:zattack.sArcherRole
                }) == OK) {
                    console.log('Archer created');
                }
            }
        }
    }
    
    
};

module.exports = zattack;
