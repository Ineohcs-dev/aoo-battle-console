import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Download, Copy, Send, Plus, Trash2, ChevronDown, ChevronRight, RotateCcw, FileJson, Shield, Swords, Search, X, Play, Loader2, Upload, Database, RefreshCw, Trash } from "lucide-react";

/* ============================================================================
 * UMINE // BATTLE CONTROL CONSOLE
 * Reconstructed from action 20019 — umine_battle.json
 * Configure both players' armies, stats, equipment and rebuild the payload.
 * ==========================================================================*/

// ─── GID → English in-game name (extracted from lualocale_10 string_en_US.txt) ──
const GID_NAMES = {
  33619971: "Basic Infantry",
  33619972: "Skilled Infantry",
  33619976: "Intermediate Infantry",
  33619977: "Shielded Infantry",
  33619978: "Elite Infantry",
  33619981: "Titan Infantry",
  33619982: "Basic Gunner",
  33619983: "Skilled Gunner",
  33619984: "Intermediate Gunner",
  33619988: "Specialist Gunner",
  33619989: "Mad Gatling",
  33619990: "Death Gatling",
  33619991: "Basic Rocket Launcher",
  33619997: "Skilled Rocket Launcher",
  33619998: "Intermediate Rocket Launcher",
  33619999: "Blaster Rocket Launcher",
  33620000: "Pyromaster",
  33620001: "Basic Sniper",
  33620003: "Skilled Sniper",
  33620004: "Intermediate Sniper",
  33620005: "Sharpshooter Sniper",
  33620006: "Cobra Sniper",
  33620007: "Basic Tank",
  33620008: "Strong Tank",
  33620009: "Intermediate Tank",
  33620010: "Blaze Tank",
  33620011: "Death Tank",
  33620012: "Hell Tank",
  33620013: "Basic Cannon",
  33620014: "Strong Cannon",
  33620015: "Intermediate Cannon",
  33620016: "Flame Cannon",
  33620017: "Uranium Cannon",
  33620018: "Doomsday Cannon",
  33620019: "Basic Shredder",
  33620020: "Strong Shredder",
  33620021: "Intermediate Shredder",
  33620022: "War Shredder",
  33620023: "Wasteland King",
  33620024: "Basic War Biker",
  33620025: "Skilled War Biker",
  33620026: "Intermediate War Biker",
  33620027: "Swift Raider",
  33620028: "Storm Raider",
  33620029: "Armored Soldier",
  33620030: "Heavy Armored Soldier",
  33620031: "Ultimate Armored Soldier",
  33620032: "Ultima Armored Soldier",
  33620033: "EMP Cannon 1",
  33620034: "Enhanced EMP Cannon",
  33620035: "Supreme EMP Cannon",
  33620036: "Ultima EMP Cannon",
  33620037: "Storm Trooper",
  33620038: "Superior Storm Trooper",
  33620039: "Havoc Storm Trooper",
  33620040: "Havoc Dominator",
  33620041: "Shielder",
  33620042: "Advanced Shielder",
  33620043: "Supreme Shielder",
  33620044: "Light Energy Shielder",
  33620045: "Zombie",
  33620046: "Giant Crawler",
  33620047: "Giant Crawler",
  33620048: "Giant Crawler",
  33620049: "Giant Crawler",
  33620050: "Giant Crawler",
  33620051: "Undead Butcher",
  33620052: "Undead Butcher",
  33620053: "Undead Butcher",
  33620054: "Undead Butcher",
  33620055: "Undead Butcher",
  33620056: "Mutant Bear",
  33620057: "Mutant Bear",
  33620058: "Mutant Bear",
  33620059: "Mutant Bear",
  33620060: "Mutant Bear",
  33620061: "Gobbler",
  33620062: "Gobbler",
  33620063: "Gobbler",
  33620064: "Gobbler",
  33620065: "Gobbler",
  33620066: "Bladed Behemoth",
  33620067: "Bladed Behemoth",
  33620068: "Bladed Behemoth",
  33620069: "Bladed Behemoth",
  33620070: "Bladed Behemoth",
  33620071: "Mother of Doom",
  33620072: "Mother of Doom",
  33620073: "Mother of Doom",
  33620074: "Mother of Doom",
  33620075: "Mother of Doom",
  33620076: "Zombie Hound",
  33620077: "Zombie Hound",
  33620078: "Zombie Hound",
  33620079: "Zombie Hound",
  33620080: "Zombie Hound",
  33620081: "Zombie Hound",
  33620082: "Zombie Hound",
  33620083: "Zombie Hound",
  33620084: "Zombie Hound",
  33620085: "Zombie Hound",
  33620086: "Normal Zombie",
  33620087: "Normal Zombie",
  33620088: "Normal Zombie",
  33620089: "Normal Zombie",
  33620090: "Normal Zombie",
  33620091: "Normal Zombie",
  33620092: "Normal Zombie",
  33620093: "Normal Zombie",
  33620094: "Normal Zombie",
  33620095: "Normal Zombie",
  33620096: "Normal Zombie",
  33620097: "Normal Zombie",
  33620098: "Mutant Zombie",
  33620099: "Mutant Zombie",
  33620100: "Mutant Zombie",
  33620101: "Mutant Zombie",
  33620102: "Mutant Zombie",
  33620103: "Mutant Zombie",
  33620104: "Mutant Zombie",
  33620105: "Mutant Zombie",
  33620106: "Mutant Zombie",
  33620107: "Mutant Zombie",
  33620108: "Mutant Zombie",
  33620109: "Mutant Zombie",
  33620110: "Mutant Zombie",
  33620111: "Mutant Zombie",
  33620112: "Mutant Zombie",
  33620113: "Mutant Zombie",
  33620114: "Mutant Zombie",
  33620115: "Mutant Zombie",
  33620116: "Mutant Zombie",
  33620117: "Mutant Zombie",
  33620118: "Mutant Zombie",
  33620119: "Mutant Zombie",
  33620259: "Blood Wyrm",
  33620260: "Blood Wyrm",
  33620261: "Blood Wyrm",
  33620262: "Giant Wyrm",
  33620263: "Giant Wyrm",
  33620264: "Giant Wyrm",
  33620265: "Giant Wyrm",
  33620266: "Giant Wyrm",
  33620267: "Giant Wyrm",
  33620268: "Giant Wyrm",
  33620269: "Mutant Tyrannosaurus",
  33620270: "Mutant Tyrannosaurus",
  33620271: "Mutant Tyrannosaurus",
  33620272: "Mutant Tyrannosaurus",
  33620273: "Mutant Tyrannosaurus",
  33620274: "Mutant Tyrannosaurus",
  33620275: "Mutant Tyrannosaurus",
  33620276: "Giant Wyrm",
  33620277: "Giant Wyrm",
  33620278: "Giant Wyrm",
  33620279: "Giant Wyrm",
  33620280: "Giant Wyrm",
  33620281: "Giant Wyrm",
  33620282: "Giant Wyrm",
  33620283: "Giant Wyrm",
  33620284: "Giant Wyrm",
  33620285: "Giant Wyrm",
  33620286: "Giant Wyrm",
  33620287: "Ravenous Tyrant",
  33620288: "Ravenous Tyrant",
  33620289: "Ravenous Tyrant",
  33620290: "Ravenous Tyrant",
  33620291: "Ravenous Tyrant",
  33620292: "Ravenous Tyrant",
  33620293: "Ravenous Tyrant",
  33620294: "Ravenous Tyrant",
  33620295: "Ravenous Tyrant",
  33620296: "Ravenous Tyrant",
  33620297: "Ravenous Tyrant",
  33620298: "Rabid Zombie Tide",
  33620299: "Rabid Zombie Tide",
  33620300: "Rabid Zombie Tide",
  33620301: "Rabid Zombie Tide",
  33620302: "Rabid Zombie Tide",
  33620303: "Rabid Zombie Tide",
  33620304: "Rabid Zombie Tide",
  33620305: "Rabid Zombie Tide",
  33620306: "Rabid Zombie Tide",
  33620307: "Rabid Zombie Tide",
  33620308: "Rabid Zombie Tide",
  33620309: "Grouchy Gobbler",
  33620310: "Grouchy Gobbler",
  33620311: "Grouchy Gobbler",
  33620312: "Grouchy Gobbler",
  33620313: "Grouchy Gobbler",
  33620314: "Grouchy Gobbler",
  33620315: "Grouchy Gobbler",
  33620316: "Grouchy Gobbler",
  33620317: "Grouchy Gobbler",
  33620318: "Grouchy Gobbler",
  33620319: "Grouchy Gobbler",
  33620320: "Giant Wyrm",
  33620321: "Giant Wyrm",
  33620322: "Giant Wyrm",
  33620323: "Giant Wyrm",
  33620324: "Giant Wyrm",
  33620325: "Giant Wyrm",
  33620326: "Giant Wyrm",
  33620327: "Giant Wyrm",
  33620328: "Giant Wyrm",
  33620329: "Giant Wyrm",
  33620330: "Giant Wyrm",
  33620331: "Giant Wyrm",
  33620332: "Crusher",
  33620333: "Elite Butcher",
  33620334: "Elite Mutant Bear",
  33620335: "Elite Gobbler",
  33620336: "Elite Behemoth",
  33620337: "Elite Butcher",
  33620338: "Elite Mutant Bear",
  33620339: "Elite Gobbler",
  33620340: "Elite Behemoth",
  33620341: "Elite Butcher",
  33620342: "Elite Mutant Bear",
  33620343: "Elite Gobbler",
  33620344: "Elite Behemoth",
  33620345: "Elite Butcher",
  33620346: "Elite Mutant Bear",
  33620347: "Elite Gobbler",
  33620348: "Elite Behemoth",
  33620349: "Elite Butcher",
  33620350: "Elite Mutant Bear",
  33620351: "Elite Gobbler",
  33620352: "Elite Behemoth",
  33620353: "Elite Butcher",
  33620354: "Elite Mutant Bear",
  33620355: "Elite Gobbler",
  33620356: "Elite Behemoth",
  33620357: "Mutant Tyrannosaurus",
  33620358: "Mutant Tyrannosaurus",
  33620359: "Mutant Tyrannosaurus",
  33620360: "Crusher",
  33620361: "Crusher",
  33620362: "Crusher",
  33620363: "Crusher",
  33620364: "Crusher",
  33620365: "Biochemical Zombie",
  33620366: "Normal Zombie",
  33620367: "Mutant Zombie",
  33620368: "Biochemical Zombie",
  33620369: "Biochemical Zombie",
  33620370: "Biochemical Zombie",
  33620371: "Biochemical Zombie",
  33620372: "Biochemical Zombie",
  33620373: "Biochemical Zombie",
  33620374: "Ravenous Tyrant",
  33620375: "Ravenous Tyrant",
  33620376: "Ravenous Tyrant",
  33620377: "Ravenous Tyrant",
  33620378: "Mutant Tyrannosaurus",
  33620379: "Mutant Tyrannosaurus",
  33620380: "Mutant Tyrannosaurus",
  33620447: "Elite Gobbler",
  33620448: "Ravenous Tyrant",
  33620449: "Biochemical Zombie",
  33620450: "Empress",
  33620451: "Empress",
  33620452: "Empress",
  33620453: "Empress",
  33620454: "Empress",
  33620455: "Empress",
  33620456: "Empress",
  33620457: "Empress",
  33620458: "Empress",
  33620459: "Empress",
  33620460: "Empress",
  33620461: "Empress",
  33620462: "Empress",
  33620463: "Empress",
  33620464: "Empress",
  33620465: "Empress",
  33620466: "Empress",
  33620467: "Empress",
  33620468: "Empress",
  33620469: "Empress",
  33620470: "Empress",
  33620471: "Empress",
  33620472: "Empress",
  33620473: "Empress",
  33620474: "Empress",
  33620475: "Empress",
  33620476: "Empress",
  33620477: "Empress",
  33620478: "Empress",
  33620479: "Empress",
  33620480: "Source Spirit",
  33620481: "Source Spirit",
  33620482: "Source Spirit",
  33620483: "Source Spirit",
  33620484: "Source Spirit",
  33620485: "Source Spirit",
  33620486: "Source Spirit",
  33620487: "Source Spirit",
  33620488: "Source Spirit",
  33620489: "Source Spirit",
  33620490: "Source Spirit",
  33620491: "Source Spirit",
  33620492: "Source Spirit",
  33620493: "Source Spirit",
  33620494: "Source Spirit",
  33620495: "Source Spirit",
  33620496: "Source Spirit",
  33620497: "Source Spirit",
  33620498: "Source Spirit",
  33620499: "Source Spirit",
  33620500: "Source Spirit",
  33620501: "Source Spirit",
  33620502: "Source Spirit",
  33620503: "Source Spirit",
  33620504: "Source Spirit",
  33620505: "Source Spirit",
  33620506: "Source Spirit",
  33620507: "Source Spirit",
  33620508: "Source Spirit",
  33620509: "Source Spirit",
  33620510: "Mutant Ghoul",
  33620511: "Empress",
  33620512: "Empress",
  33620513: "Empress",
  33620514: "Empress",
  33620515: "Empress",
  33620516: "Empress",
  33620517: "Empress",
  33620518: "Empress",
  33620519: "Empress",
  33620520: "Empress",
  33620521: "Source Spirit",
  33620522: "Source Spirit",
  33620523: "Source Spirit",
  33620524: "Source Spirit",
  33620525: "Source Spirit",
  33620526: "Source Spirit",
  33620527: "Source Spirit",
  33620528: "Source Spirit",
  33620529: "Source Spirit",
  33620530: "Source Spirit",
  33620536: "Racing Car",
  33620537: "Racing Car Zombie 1",
  33620538: "Racing Car Zombie 2",
  33620539: "Racing Car Zombie 3",
  33620540: "Racing Car Elite Zombie",
  33620541: "Racing Car Boss Zombie",
  33620542: "Racing Car Speed Up Pad",
  33620543: "Racing Car Obstacle 1",
  33620544: "Racing Car Obstacle 2",
  33620545: "Matter Box",
  33620546: "Fanatic Terminator",
  33620547: "Eagle Eye Shot",
  33620548: "Hell King",
  33620549: "Demon Raider",
  33620550: "Apocalypse Infantry",
  33620551: "Hades Gatling",
  33620552: "Destruction Tank",
  33620553: "Havoc Breaker",
  33620554: "Immortal Shielder",
  33620555: "Death Cannon",
  33620556: "Biochemical Zombie",
  33620557: "Biochemical Zombie",
  33620559: "Empress",
  33620560: "Empress",
  33620561: "Empress",
  33620562: "Empress",
  33620563: "Empress",
  33620564: "Source Spirit",
  33620565: "Source Spirit",
  33620566: "Source Spirit",
  33620567: "Source Spirit",
  33620568: "Source Spirit",
  33620569: "Warplane",
  33620570: "Warplane",
  33620571: "Warplane",
  33620572: "Warplane",
  33620573: "Warplane",
  33620574: "Warplane",
  33620575: "Warplane",
  33620576: "Warplane",
  33620577: "Warplane",
  33620578: "Warplane",
  33620579: "Warplane",
  33620580: "Warplane",
  33620581: "Warplane",
  33620582: "Warplane",
  33620583: "Warplane",
  33620584: "Warplane",
  33620585: "Warplane",
  33620586: "Warplane",
  33620587: "Warplane",
  33620588: "Warplane",
  33620589: "Warplane",
  33620590: "Warplane",
  33620591: "Warplane",
  33620592: "Warplane",
  33620593: "Warplane",
  33620594: "Warplane",
  33620595: "Warplane",
  33620596: "Warplane",
  33620597: "Warplane",
  33620598: "Warplane",
  33620599: "Warplane",
  33620600: "Warplane",
  33620601: "Warplane",
  33620602: "Warplane",
  33620603: "Warplane",
  33620604: "Warplane",
  33620605: "Warplane",
  33620606: "Warplane",
  33620607: "Warplane",
  33620608: "Warplane",
  33620609: "Warplane",
  33620610: "Warplane",
  33620611: "Warplane",
  33620612: "Warplane",
  33620613: "Warplane",
  33620614: "Warplane",
  33620615: "Warplane",
  33620616: "Warplane",
  33620617: "Warplane",
  33620618: "Warplane",
  33620619: "Warplane",
  33620620: "Warplane",
  33620621: "Warplane",
  33620622: "Warplane",
  33620623: "Warplane",
  33620624: "Warplane",
  33620625: "Warplane",
  33620626: "Warplane",
  33620627: "Warplane",
  33620628: "Warplane",
  33620629: "Mechanical Golem",
  33620630: "Chainsaw Tyrant",
  33620631: "Chainsaw Tyrant",
  33620632: "Chainsaw Tyrant",
  33620688: "Superman",
  33620689: "Superman",
  33620690: "Superman",
  33620691: "Superman",
  33620692: "Superman",
  33620693: "Superman",
  33620694: "Superman",
  33620695: "Superman",
  33620696: "Superman",
  33620697: "Superman",
  33620698: "Superman",
  33620699: "Superman",
  33620700: "Superman",
  33620701: "Superman",
  33620702: "Superman",
  33620703: "Superman",
  33620704: "Superman",
  33620705: "Superman",
  33620706: "Superman",
  33620707: "Superman",
  33620708: "Superman",
  33620709: "Superman",
  33620710: "Superman",
  33620711: "Superman",
  33620712: "Superman",
  33620713: "Superman",
  33620714: "Superman",
  33620715: "Superman",
  33620716: "Superman",
  33620717: "Superman",
  33620718: "Superman",
  33620719: "Superman",
  33620720: "Superman",
  33620721: "Superman",
  33620722: "Superman",
  33620723: "Superman",
  33620724: "Superman",
  33620725: "Superman",
  33620726: "Superman",
  33620727: "Superman",
  33620728: "Superman",
  33620729: "Superman",
  33620730: "Superman",
  33620731: "Superman",
  33620732: "Superman",
  33620733: "Superman",
  33620734: "Superman",
  33620735: "Superman",
  33620736: "Superman",
  33620737: "Superman",
  33620738: "Superman",
  33620739: "Superman",
  33620740: "Superman",
  33620741: "Superman",
  33620742: "Superman",
  33620743: "Dread Lord",
  33620744: "Dread Lord",
  33620745: "Dread Lord",
  33620746: "Dread Lord",
  33620747: "Dread Lord",
  50397187: "Reinforce Speed Up",
  50397189: "Transport Speed Up",
  50397191: "Upkeep Reduction",
  50397193: "Recruitment Cost Reduction",
  50397195: "Oil Boost",
  50397197: "Steel Boost",
  50397199: "Mineral Production",
  50397201: "Food Boost",
  50397203: "Building Speed Bonus",
  50397205: "Recruitment Speed Up",
  50397207: "Healing Speed",
  50397209: "Technology Research",
  50397211: "Healing Cost Reduction",
  50397212: "Load Boost",
  50397213: "Melee Attack",
  50397214: "Melee HP",
  50397215: "Mid-Range Attack",
  50397216: "Mid-Range HP",
  50397217: "Long-Range Attack",
  50397218: "Long-Range HP",
  50397221: "Fleet Speed",
  50397226: "Transport Tax",
  50397237: "Market Tax",
  50397244: "Gather Speed Boost",
  50397245: "Increases Damage to Long-Range Troops",
  50397246: "Increases Damage to Mid-Range Troops",
  50397247: "Increases Damage to Melee Troops",
  50397248: "Troop Damage Bonus",
  50397254: "Attack Boost",
  50397255: "HP Boost",
  50397262: "City Troops HP",
  50397264: "Reduce Equipment Development Time",
  50397265: "Percent of Troops returned after withdrawing from battle",
  50397267: "City Troops Attack",
  50397268: "Mobility Recovery",
  50397269: "Wounded Ratio",
  50397270: "Food Gather Bonus",
  50397271: "Oil Gather Bonus",
  50397272: "Steel Gather Bonus",
  50397273: "Mineral Gather Bonus",
  50397274: "Gold Gather Bonus",
  50397275: "Melee Defense",
  50397276: "Mid-Range Defense",
  50397277: "Long-Range Defense",
  50397279: "Defense Boost",
  50397282: "Depot Capacity",
  50397283: "Monster Attack Speed",
  50397284: "Resource Output Boost",
  50397285: "Increase Max Wounded Units",
  50397286: "Fleet Size Boost",
  50397295: "Search and Rescue",
  50397298: "Damage All",
  50397301: "Monster XP Bonus",
  50397302: "Recruitment Time Reduction",
  50397303: "Building Speed Additional Bonus",
  50397304: "Damage Reduction",
  50397305: "Stun",
  50397306: "Dodge",
  50397307: "Crit Strike",
  50397308: "Slowdown",
  50397310: "Projectile",
  50397311: "Split Attack",
  50397312: "Slaughter",
  50397313: "Siege Troops Defense",
  50397314: "Increase Damage to shields",
  50397315: "Human Killer",
  50397316: "Machine Killer",
  50397317: "Fortify Rocket",
  50397318: "Rocket Cooldown",
  50397319: "Fortify Missile",
  50397320: "Missile Cooldown",
  50397321: "Fortify Lightning Orbs",
  50397322: "Lightning Orb Cooldown",
  50397323: "Fortify Machine Gun",
  50397324: "Machine Gun Cooldown",
  50397325: "City Troops Defense",
  50397326: "Defense Tower Cooldown",
  50397327: "Defense Tower Damage",
  50397328: "Basic Gather Speed ratio on the World Map",
  50397329: "Reinforcement Fleet",
  50397330: "Max City Defenses",
  50397331: "Scout Speed Up",
  50397332: "Siege Troops Attack",
  50397333: "Siege Troops HP",
  50397334: "Attack Bonus",
  50397335: "Reduces Damage taken from Long-Range Troops",
  50397336: "Reduces Damage taken from Mid-Range Troops",
  50397337: "Reduces Damage taken from Melee Troops",
  50397338: "Eliminate Wounded",
  50397339: "Reduce the Damage of Troops attacking your City",
  50397340: "Max Rally Boost",
  50397341: "Doom Arena/Elite Wars All Stats Boost",
  50397342: "Battle Aid",
  50397343: "City Troops Damage Reduction",
  50397344: "City Troops Damage Taken Boost",
  50397345: "Killed to Wounded",
  50397346: "Wounded to Killed",
  50397347: "Power Strike",
  50397348: "Magnetic Shield",
  50397350: "Biochemical Hospital Wounded Ratio",
  50397351: "Biochemical Zombies Recruit Speed Boost",
  50397352: "Biochemical Materials Collection Rate Boost",
  50397353: "Biochemical Zombies Attack Boost",
  50397354: "Biochemical Zombies HP Boost",
  50397355: "Biochemical Zombies Defense Boost",
  50397356: "Biochemical Zombies Fleet Speed Boost",
  50397357: "Global Conquest Damage Boost",
  50397358: "Global Conquest Damage Taken Reduction",
  50397359: "Medici Attack Tonic",
  50397360: "Medici HP Tonic",
  50397362: "Biochemical Zombies Damage Taken Reduction",
  50397363: "Abundant Energy",
  50397364: "Blaster Cannon",
  50397368: "Adrenaline Reagent",
  50397369: "Cross-Nation Battle Melee Attack",
  50397370: "Cross-Nation Battle Melee Defense",
  50397371: "Cross-Nation Battle Melee HP",
  50397372: "Cross-Nation Battle Mid-Range Attack",
  50397373: "Cross-Nation Battle Mid-Range Defense",
  50397374: "Cross-Nation Battle Mid-Range HP",
  50397375: "Cross-Nation Battle Long-Range Attack",
  50397376: "Cross-Nation Battle Long-Range Defense",
  50397377: "Cross-Nation Battle Long-Range HP",
  50397378: "Titan Attack Boost",
  50397379: "Titan Defense Boost",
  50397380: "Titan HP Boost",
  50397381: "Cross-Nation Battle Biochemical Zombies Attack",
  50397382: "Cross-Nation Battle Biochemical Zombies Defense",
  50397383: "Cross-Nation Battle Biochemical Zombies HP",
  50397384: "Melee Troops Damage Taken Reduction from Melee, Mid-Range, and Long-Range Troops",
  50397385: "Titan Attack Reduction",
  50397386: "Titan Defense Reduction",
  50397387: "Titan HP Reduction",
  50397388: "Source Spirit Attack Boost",
  50397389: "Source Spirit Defense Boost",
  50397390: "Source Spirit HP Boost",
  50397391: "Empress Attack Boost",
  50397392: "Empress Defense Boost",
  50397393: "Empress HP Boost",
  50397394: "Melee Dodge",
  50397395: "Mid-Range Dodge",
  50397396: "Long-Range Dodge",
  50397397: "Biochemical Zombies Dodge",
  50397398: "Melee Crit Strike",
  50397399: "Mid-Range Crit Strike",
  50397400: "Long-Range Crit Strike",
  50397401: "Biochemical Zombies Crit Strike",
  50397402: "Melee Hit",
  50397403: "Mid-Range Hit",
  50397404: "Long-Range Hit",
  50397405: "Biochemical Zombies Hit",
  50397406: "Cross-Nation Battle All Stats Boost",
  50397407: "Damage Taken Reduction from Troops",
  50397408: "Damage Dealt to Troops Boost",
  50397409: "Shredder Attack",
  50397410: "Shredder HP",
  50397411: "Tank Attack",
  50397412: "Tank HP",
  50397413: "Armored Soldier HP",
  50397414: "Damage Taken Reduction from Troops",
  50397415: "Damage Taken Reduction from Troops",
  50397416: "Storm Trooper Dodge",
  50397417: "EMP Cannon Dodge",
  50397418: "Steel Rampart",
  50397421: "Movement Superiority",
  50397422: "Attack Against Melee Boost",
  50397423: "Attack Against Mid-Range Boost",
  50397424: "Attack Against Long-Range Boost",
  50397425: "Attack Against Biochemical Zombies Boost",
  50397426: "Enemy Melee Attack Reduction",
  50397427: "Enemy Mid-Range Attack Reduction",
  50397428: "Enemy Long-Range Attack Reduction",
  50397429: "Enemy Biochemical Zombie Attack Reduction",
  50397430: "Enemy Attack Reduction",
  50397431: "Rapid Strike",
  50397432: "Defense Against Melee Boost",
  50397433: "Defense Against Mid-Range Boost",
  50397434: "Defense Against Long-Range Boost",
  50397435: "Defense Against Biochemical Zombies Boost",
  50397436: "Enemy Melee Defense Reduction",
  50397437: "Enemy Mid-Range Defense Reduction",
  50397438: "Enemy Long-Range Defense Reduction",
  50397439: "Enemy Biochemical Zombie Defense Reduction",
  50397440: "Weak to Strong",
  50397441: "Source Spirit Damage to Mid-Range Boost",
  50397442: "Empress Damage to Long-Range Boost",
  50397443: "Enemy Melee HP Reduction",
  50397444: "Enemy Mid-Range HP Reduction",
  50397445: "Enemy Long-Range HP Reduction",
  50397446: "Enemy Damage Reduction",
  50397447: "Corrupted Poison Fog",
  50397448: "Pierce Armor",
  50397449: "Tactical Block",
  50397450: "Start Battle Attack Boost",
  50397451: "Guard",
  50397452: "Electrocution-Target Takes Continuous Damage",
  50397453: "Electrocution-Reduces Target\\'s Damage",
  50397454: "Electrocution-Target\\'s Damage Taken Boost",
  50397455: "Electrocution-Trigger Rate Boost",
  50397456: "Guard\\'s Honor",
  50397457: "Shield Breaker",
  50397458: "Weakness Blitz",
  50397459: "Damage Against Titans Boost",
  50397460: "Titan Damage Taken Reduction",
  50397461: "Magnetic",
  50397462: "Warplane Attack Boost",
  50397463: "Warplane HP Boost",
  50397464: "Warplane Defense Boost",
  50397465: "Warplane Dodge when taking Damage from Mid-Range Troops",
  50397466: "Warplane Dodge when taking Damage from Long-Range Troops",
  50397467: "Warplane Dodge when taking Damage from Melee Troops",
  50397468: "Energy Shield",
  50397469: "Airstrike",
  50397470: "Attack",
  50397471: "Crit Strike",
  50397472: "Crit Strike Damage",
  50397473: "Damage to Zombies Boost",
  50397474: "Reduces Damage taken from Zombies",
  50397475: "Damage Boost",
  50397476: "Movement Speed",
  50397477: "XP Collection",
  50397478: "XP Range",
  50397479: "Item Drops",
  50397480: "Dodge",
  50397483: "HP Recovery",
  50397484: "Revived HP",
  50397485: "Upgrade Recovery",
  50397486: "Slow Recovery",
  50397487: "Damage to Boss Boost",
  50397488: "Reduces Damage taken from Boss",
  50397489: "Reduces Damage taken by Squad",
  50397490: "XP Drop Rate Boost",
  50397491: "HP Drop Rate Boost",
  50397492: "Magnet Drop Rate Boost",
  50397493: "Battle Start Enemy HP and Defense Reduction",
  50397494: "Advanced Ammo",
  50397495: "Fortify Air Support",
  50397496: "Shield - Unlimited Time",
  50397497: "Final Damage Boost",
  50397498: "Fortify Magnetic Fluid Shield",
  50397499: "Attack Boost",
  50397500: "HP Boost",
  50397501: "Defense Boost",
  50397502: "Fortify Tactical Block",
  50397503: "Fortify Rapid Strike",
  50397504: "Fortify Weakness Blitz",
  50397506: "Energy Shield",
  50397507: "All Troops Block",
  50397508: "Increases the initial number of Troops",
  50397509: "Quick Heal",
  50397510: "Reduces Damage taken from Warplanes",
  50397512: "巨型兵器（不翻译）",
  50397513: "Enemy Defense Reduction",
  50397514: "全兵种生命和防御（不翻译）",
  50397515: "近程生命和防御（不翻译）",
  50397516: "中程生命和防御（不翻译）",
  50397517: "远程生命和防御（不翻译）",
  50397518: "生化丧尸生命和防御提升（不翻译）",
  50397525: "Fortify Rescue",
  50397526: "（不翻译）灾厄指令",
  50397527: "（不翻译）灾厄光环",
  50462723: "Oil Output",
  50462725: "Steel Output",
  50462727: "Mineral Output",
  50462729: "Food Output",
  50462731: "Unlock Land",
  50462733: "Wounded Units Limit",
  50462735: "Max Recruitment",
  50462737: "Oil Protection",
  50462739: "Steel Protection",
  50462741: "Mineral Protection",
  50462743: "Food Protection",
  50462747: "Oil Capacity",
  50462749: "Steel Capacity",
  50462751: "Mineral Capacity",
  50462753: "Food Capacity",
  50462755: "City Defense Limit",
  50462759: "City Defense Boost",
  50462760: "Free Speed Up Time",
  50462761: "Help Times",
  50462762: "Help Time",
  50462763: "Vehicle Queue",
  50462765: "Alliance Member Limit",
  50462767: "Contribution Cooldown",
  50462768: "Flag Durability",
  50462770: "Increases max number of Alliance Flags",
  50462771: "Fire Extinguisher",
  50462772: "Move Building",
  50462774: "Protective Shield",
  50462775: "Scout Shield",
  50462776: "Army Recall",
  50462777: "Speed Up",
  50462778: "Building Speed Up",
  50462779: "Healing Speed Up",
  50462780: "Recruitment Speed Up",
  50462781: "Research Speed Up",
  50462782: "Activate VIP",
  50462783: "More VIP Points",
  50462785: "Resets Commander Skill Points",
  50462786: "Random Teleport",
  50462787: "Precise Teleport",
  50462788: "Change Name",
  50462790: "Change Avatar",
  50462791: "Change Alliance Name",
  50462799: "Activates an additional construction queue.",
  50462800: "Claim",
  50462801: "Add Commander Skill Points",
  50462802: "Fleet Troops Units Limit",
  50462803: "Get Mobility",
  50462805: "Max Rally Units",
  50462806: "Rally Commanders Limit",
  50462807: "Ally Defense Max",
  50462812: "Territory Teleport",
  50462813: "Uranium Output",
  50462814: "Uranium Capacity",
  50462818: "Emergency Room",
  50462819: "Mine Reset",
  50462820: "Turret Parts",
  50462823: "Lucky Gift Gold Limit",
  50462824: "Cannon",
  50462825: "Shield All",
  50462826: "Officer XP",
  50462827: "Can Appoint Director",
  50462829: "Can Appoint Strategist",
  50462830: "Can Appoint Warfare",
  50462831: "Refugee Limit Boost",
  50462832: "Attack Speed Up",
  50462833: "Reduce all Damage taken",
  50462834: "Shield - Limited Time",
  50462836: "Max Officer Limit",
  50462837: "Officer Skill XP",
  50462838: "Reduces Food costs for Building",
  50462839: "Reduce Oil costs for Building",
  50462840: "Reduces Steel costs for Building",
  50462841: "Reduces Minerals costs for Building",
  50462842: "Airstrike",
  50462843: "Rocket",
  50462844: "EMP Bomb",
  50462845: "Rehabilitation",
  50462846: "Intimacy Points",
  50462847: "Exploration Times Boost",
  50462848: "Biochemical Materials Collection Boost",
  50462849: "Biochemical Hospital Capacity Boost",
  50462850: "Biochemical Zombies Recruit Limit Boost",
  50462851: "Biochemical Zombie Army Limit Boost",
  50462852: "Biochemical Zombies Limit Boost",
  50462853: "Nutrients Limit",
  50462854: "Nutrients Efficiency",
  50462855: "Lucky Gift",
  50462856: "President Lucky Gift",
  50462859: "Hormonal Hyperplasia",
  50462861: "Creator",
  50462862: "Titan XP",
  50462863: "Titan Vitality",
  50462864: "Source Spirit HP Boost",
  50462865: "Source Spirit Attack Boost",
  50462866: "Source Spirit Defense Boost",
  50462867: "Empress HP Boost",
  50462868: "Empress Attack Boost",
  50462869: "Empress Defense Boost",
  50462870: "Fleet Troops Units Bonus Limit",
  50462871: "Cross-Nation Battle Troops Expansion",
  50462873: "Wounded Units Bonus Limit",
  50462874: "War Mobilization",
  50462875: "Infantry Attack",
  50462876: "Infantry Defense",
  50462877: "Infantry HP",
  50462878: "Shredder Attack",
  50462879: "Shredder Defense",
  50462880: "Shredder HP",
  50462881: "Tank Attack",
  50462882: "Tank Defense",
  50462883: "Tank HP",
  50462884: "Armored Soldier Attack",
  50462885: "Armored Soldier Defense",
  50462886: "Armored Soldier HP",
  50462887: "Gunner Attack",
  50462888: "Gunner Defense",
  50462889: "Gunner HP",
  50462890: "Rocket Launcher Attack",
  50462891: "Rocket Launcher Defense",
  50462892: "Rocket Launcher HP",
  50462893: "Motorcycle Attack",
  50462894: "Motorcycle Defense",
  50462895: "Motorcycle HP",
  50462896: "Storm Trooper Attack",
  50462897: "Storm Trooper Defense",
  50462898: "Storm Trooper HP",
  50462899: "Sniper Attack",
  50462900: "Sniper Defense",
  50462901: "Sniper HP",
  50462902: "Cannon Attack",
  50462903: "Cannon Defense",
  50462904: "Cannon HP",
  50462905: "Shielder Attack",
  50462906: "Shielder Defense",
  50462907: "Shielder HP",
  50462908: "EMP Cannon Attack",
  50462909: "EMP Cannon Defense",
  50462910: "EMP Cannon HP",
  50462911: "Biochemical Zombies Attack",
  50462912: "Biochemical Zombies Defense",
  50462913: "Biochemical Zombies HP",
  50462915: "Can Appoint Drillmaster-type Officers.",
  50462916: "Troops Attack Bonus Boost",
  50462917: "Warplane Attack",
  50462918: "Warplane HP",
  50462919: "Warplane Defense",
  50462920: "Troops HP Bonus Boost",
  50462921: "Warplane XP",
  50462922: "HP",
  50462923: "Adequate Preparation",
  50462924: "Skill Reselection Times",
  50462925: "Revive",
  50462926: "Invincible",
  50462927: "Paradrop Supplies",
  50462928: "Advanced Paradrop Supplies",
  50462929: "Energy Prison",
  50462930: "All Troops Block",
  50462931: "Melee Block",
  50462932: "Mid-Range Block",
  50462933: "Long-Range Block",
  50462934: "Biochemical Zombies Block",
  50462935: "Titan Block",
  50462936: "Warplane Block",
  50462937: "All Troops Disruptor Resistance",
  50462938: "Titan Disruptor Resistance",
  50462939: "Warplane Disruptor Resistance",
  50462940: "All Troops Misfire Resistance",
  50462941: "Titan Misfire Resistance",
  50462942: "Warplane Misfire Resistance",
  50462943: "Attack",
  50462944: "HP",
  50462945: "Defense",
  50462947: "Mobility Limit Boost",
  50462948: "Energy Blade",
  50462949: "Tracking Missile",
  50462950: "Rocket Turret",
  50462951: "Nano Swarm",
  50462954: "Rock Halo",
  50462955: "Ultimate Soundwave",
  50462956: "Battlefield Forte",
  68222978: "Valkyrie",
  68222979: "Reload Mecha",
  68222980: "9 Tails",
  68222981: "Crimson Blade S",
  68222982: "Ghost Sword S",
  68222983: "Wings of Judgement",
  68222984: "Guardian Wings",
  68419586: "Group Buying Star Alliance Reward",
  68419587: "Group Buying Star Nation Reward",
  68419588: "Group Buying Star Alliance Reward",
  68419589: "Group Buying Star Nation Reward",
  68419590: "Group Buying Star Alliance Reward",
  68419591: "Group Buying Star Nation Reward",
  68419592: "Flag Effect (Green)",
  68419593: "Flag Effect (Blue)",
  68419594: "Flag Effect (Purple)",
  68419595: "Flag Effect (Orange)",
  68419596: "Nation with 3 Wins Statue",
  68419597: "Nation with 2 Wins Statue",
  68485122: "Red Dragonfly",
  68485123: "Elite Rocket",
  68485124: "Mechanical Manta",
  68485125: "Polar Star",
  68485126: "Cute Star Bunny",
  68485127: "Land and Sea Wonders",
  68485128: "Phantom Whale",
  68550658: "Blackwing Phantom",
  68550659: "Red Feather Invincibility",
  68550660: "Dancing Sweetheart",
  68550661: "Ghost Gunman",
  68550662: "Desert Queen",
  68550663: "Cyber Dancer",
  68550664: "Cherry Dancer",
  68550665: "Charming Cat Woman",
  68616194: "Warplane Skin",
  68616195: "Colorful Shuttle",
  68616196: "Neon Craze",
  68616197: "异星碟(不翻译）",
  68681730: "Micro Submachine Gun",
  68681731: "Tactical Bag",
  68681732: "Tactical Crossbow",
  68681733: "Combat Armor",
  68681734: "Light Machine Gun",
  68681735: "Thunder Shoulder Armor",
  68681736: "Laser Katana",
  68681737: "Ghost Face Ninja",
  68681738: "Rocket Launcher",
  68681739: "Tiger Amulet",
  68681740: "Special Ops Submachine Gun",
  68681741: "Blade Bracelet",
  68681742: "Sharpshooter Rifle",
  68681743: "Mechanical Hold",
  68681744: "Carbine",
  68681745: "Guard Rabbit",
  68681746: "Energy Rifle",
  68681747: "Guard Gun",
  68681748: "Bounty Hunter Rifle",
  68681749: "Glorious Twin Blades",
  68681750: "Modified Guitar",
  68681751: "EMP Pulse Cannon",
  68681752: "Mantis Knife",
  68681753: "Shadow Rifle",
  68681754: "Dome Breaking Blade",
  68681755: "Small Robot",
  68681756: "Elite Pacemaker",
  68681757: "Mechanical Tentacle",
  68681758: "Handgun",
  68681759: "Monocular",
  68681760: "Gold Flames",
  68681761: "Brilliant Timepiece",
  68681762: "P92F Sheriff",
  68681763: "Battle Badge",
  68681764: "P1911 Patriot",
  68681765: "Commander Cloak",
  68681766: "Double Gun",
  68681767: "Shadow Skin",
  68681768: "Fan",
  68681769: "Red Flame Dual Blades",
  68747266: "Victory Dance",
  68812802: "Sky Silhouette",
  68812803: "Star Master",
  68812804: "Inferno\\'s Verdict",
  68878338: "Wind of Gold",
  68943874: "Gold: Tank",
  68943875: "Gold: Shredder",
  68943876: "Gold: Cannon",
  68943877: "Gold: Raider",
  68943878: "Gold: Infantry",
  68943879: "Gold: Rocket",
  68943880: "Gold: Sniper",
  68943881: "Gold: Gunner",
  68943882: "Gold: Armored Soldier",
  68943883: "Gold: EMP Cannon",
  68943884: "Gold: Storm Trooper",
  68943885: "Gold: Shielder",
  68943886: "Gold: Biochemical Troop",
  100925442: "Bone Spurs",
  100925443: "Queen\\'s Inspiration",
  100925444: "Bloodfeast",
  100925445: "Symbiotic Tail",
  100925446: "Source Energy Strike",
  100925447: "Destroy Ray",
  100925448: "Source Energy Guard",
  100925449: "Energy Overload",
  100990978: "Potent Inspiration",
  100990979: "Blood Activation",
  100990980: "Fire Path",
  100990981: "Fortify Time",
  100990982: "Deadly Strike",
  101056514: "Zombie Queen Halo",
  101056515: "Devout Halo",
  101056516: "Weak Halo",
  101056517: "Rampart Halo",
  101056518: "Deadly Halo",
  101122050: "Toxic Outbreak",
  101122051: "Earth Spike",
  101122052: "Bloodthirsty Nature",
  101122053: "Steel Body",
  101122056: "Poison Fog Outbreak",
  101122057: "Poison Fog Outbreak",
  101122058: "Poison Fog Outbreak",
  101187586: "Fortify Attack",
  101187587: "Fortify Defense",
  101187588: "Fortify HP",
  101187589: "Melee HP",
  101187590: "Melee Damage Reduction",
  101187591: "Home Guard",
  101187592: "Fortify Attack",
  101187593: "Fortify Defense",
  101187594: "Fortify HP",
  101187595: "Melee Defense",
  101187596: "Attack-Defense",
  101187597: "Defensive Stance",
  101187598: "Fortify Attack",
  101187599: "Fortify Defense",
  101187600: "Fortify HP",
  101187601: "Melee Attack",
  101187602: "Attack-Defense",
  101187603: "Bomb Attack",
  101187604: "Fortify Attack",
  101187605: "Fortify Defense",
  101187606: "Fortify HP",
  101187607: "Load Boost",
  101187608: "Elite Armor",
  101187609: "Rock Steady",
  101187610: "Fortify Attack",
  101187611: "Fortify Defense",
  101187612: "Fortify HP",
  101187613: "Troops Attack",
  101187614: "Fire Suppression",
  101187615: "Fire Assist",
  101187616: "Fortify Attack",
  101187617: "Fortify Defense",
  101187618: "Fortify HP",
  101187619: "Troops Defense",
  101187620: "Damage Reduction Expert",
  101187621: "Overshoot",
  101187622: "Fortify Attack",
  101187623: "Fortify Defense",
  101187624: "Fortify HP",
  101187625: "Fleet Speed Up",
  101187626: "Troops Defense",
  101187627: "Battle Inspiration",
  101187628: "Fortify Attack",
  101187629: "Fortify Defense",
  101187630: "Fortify HP",
  101187631: "Troops HP",
  101187632: "Dodge",
  101187633: "Electromagnetic Conduction",
  101187634: "Fortify Attack",
  101187635: "Fortify Defense",
  101187636: "Fortify HP",
  101187637: "Recruitment",
  101187638: "Troops Attack",
  101187639: "Sniper Hit",
  101187640: "Fortify Attack",
  101187641: "Fortify Defense",
  101187642: "Fortify HP",
  101187643: "Troops Defense",
  101187644: "Fortify Armor",
  101187645: "High Explosive Ammo",
  101187646: "Fortify Attack",
  101187647: "Fortify Defense",
  101187648: "Fortify HP",
  101187649: "Heal Wounded",
  101187650: "Troops HP",
  101187651: "Shield",
  101187652: "Fortify Attack",
  101187653: "Fortify Defense",
  101187654: "Fortify HP",
  101187655: "Troops HP",
  101187656: "Dodge",
  101187657: "Laser",
  101187658: "Fortify Attack",
  101187659: "Fortify Defense",
  101187660: "Fortify HP",
  101187661: "Arms Boost",
  101187662: "Blaster Cannon",
  101187663: "Viral Infection",
  101253122: "Weapon",
  101253123: "Shoulder Armor",
  101253124: "Core",
  101253125: "Crown",
  101253126: "Leg Armor",
  101253127: "Tail",
  101384194: "Destructive Lightning",
  101384195: "Thor",
  101384196: "Weaken Energy",
  101384197: "Empress Escort",
  101384198: "Steel Barrier",
  101384199: "Toxic Tail",
  101449730: "Laser Cannon",
  101449731: "Tactical Missile",
  101449732: "Mechanical Golem",
  101449734: "Fortify Laser Energy",
  101449735: "Fortify Disruptor",
  101449736: "EMP Disruptor Ammo",
  101449737: "Magnetic Disruptor",
  101449738: "Ultrapulse Laser",
  101449739: "High-Speed Charge",
  101449740: "Laser Disruptor",
  101449741: "Superior Force Field",
  101515266: "Advanced Kill",
  101515267: "Advanced Endurance",
  101515268: "Melee Killer",
  101515269: "Mid-Range Killer",
  101515270: "Long-Range Killer",
  101515271: "Long-Range Resistance",
  101515272: "Mid-Range Resistance",
  101515273: "Protection Force Field",
  101515274: "Titan Resistance",
  101515275: "Defensive Rampart",
  101515276: "Impale",
  101515277: "Melee Blessing",
  101515278: "Titan Killer",
  101515279: "Medic Expert",
  101515280: "Anti-Disruptor Mastery",
  101515281: "Anti-Misfire Mastery",
  101515282: "Commander Expert",
  101515283: "Cross-Nation Commander Expert",
  101580802: "Wingplane I",
  101580803: "Wingplane II",
  101580804: "Machine Head",
  101580805: "Body",
  101580806: "Wing",
  101580807: "Machine Gun",
  101646338: "Kinetic Machine Gun",
  101646339: "Thermal Energy Machine Gun",
  101646340: "Mechanical Golem Fortification",
  101646341: "Storm Bomb",
  101646342: "Storm Disruptor",
  101646343: "Restructuring Ray",
  218103810: "Doc Gray",
  218103811: "F. Medici",
  218103812: "I. Medici",
  218103813: "Ginger",
  218103814: "Hacker K",
  218103815: "Jesse",
  218103816: "Greene",
  218103817: "Edward",
  218103818: "Red Grace",
  218103819: "Bravestar",
  218103820: "Major Morgan",
  218103821: "Loreline",
  218103822: "Sergeant Barney",
  218103823: "Godfather",
  218103824: "Rockbell",
  218103825: "Victoria",
  218103826: "Miss Suzy",
  218103827: "Steven",
  218103828: "Tifa",
  218103829: "Storm Bow",
  218103830: "Kingsley",
  218103831: "Bull",
  218103832: "Big Dog",
  218103833: "Butterfly",
  218103834: "Rooker",
  218103835: "Ninja Oko",
  218103836: "Rattlesnake",
  218103837: "Aeon",
  218103838: "Panda Jack",
  218103839: "Arthur",
  218103840: "Zeus",
  218103841: "Alexandria",
  218103842: "Saki",
  218103843: "Cattie",
  218103844: "Jimmy",
  218103846: "Simon",
  218103847: "Layla",
  218103848: "Maria",
  218103849: "Eric",
  218103850: "Selina",
  218103851: "Freya",
  218103852: "Emily",
  218103853: "Kay",
  218103854: "Erica",
  570425346: "Diamond Phone",
  570425347: "Ark Map",
  570425348: "Black Gold Member\\'s Card",
  570425349: "Toxic Bone Spur",
  570425350: "Red Coral",
  570425351: "Totem Wood Sculpture",
  570425352: "Brass Compass",
  570425353: "Viking Helmet",
  570425354: "Treasured Violin",
  570425355: "Data Hard Drive",
  570425356: "Golden Rabbit Doll",
  570425357: "Olympic Laurel",
  570425358: "Fine Porcelain",
  570425359: "Crystal Skull",
  570425360: "Autographed Football",
  570425361: "Hound Statue",
  570425362: "Venus Statue",
  570425363: "Dinosaur Egg Fossil",
  570425364: "Goddess Torch",
  570425365: "Ocean Teardrop",
  570425366: "Hope Emblem",
  570425367: "Crown",
  570425368: "Basalt Tablet",
  570425369: "Gem Egg",
  570425370: "Scarab Amulet",
  570425371: "Gold Mask",
  570425372: "Zombie Heart",
  570425373: "Bronze Vase",
  570425374: "Imperial Seal",
  570425375: "Gold Candleholder",
  570425376: "Warning Bell",
  570425377: "Mystery Grail",
  570425378: "Heavy Sword",
  570425379: "Bone Axe",
  570425380: "Scarlet Mantis Knife",
  570425381: "Titan Energy Cannon",
  570425382: "Empress Exoskeleton",
  570425383: "Warp Drive",
  570425384: "Gold: Tank",
  570425385: "Gold: Shredder",
  570425386: "Gold: Cannon",
  570425387: "Gold: Raider",
  570425388: "Gold: Infantry",
  570425389: "Gold: Rocket",
  570425390: "Gold: Sniper",
  570425391: "Gold: Gunner",
  570425392: "Gold: Armored Soldier",
  570425393: "Gold: EMP Cannon",
  570425394: "Gold: Storm Trooper",
  570425395: "Gold: Shielder",
  570425396: "Gold: Biochemical Troop",
  570425397: "Magnetic Pulse Core",
  570425398: "Doomsday Reverberation",
};

// Unified name lookup — works for any GID from warriors, ba_tech, titan equip, WP equip
const nameOf = (gid) => GID_NAMES[gid] || null;

// Heuristic fallback only when the GID is not in the locale dictionary
const warriorFallback = (gid, count) => {
  if (count === 1) return "Titan / Warplane";
  return "Unknown Unit";
};

// ─── Option lists per picker context ──────────────────────────────────────
// Built once from GID_NAMES. Each option: { gid: number, name: string, group: string }
const _buildOptions = (filterFn, groupFn) =>
  Object.keys(GID_NAMES)
    .map((k) => ({ gid: Number(k), name: GID_NAMES[k] }))
    .filter((o) => filterFn(o.gid))
    .map((o) => ({ ...o, group: groupFn(o.gid) }))
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));

// ARMY_OPTIONS — sourced from AoO_GID_EnglishNames.xlsx 'Tabelle1' sheet.
// Uses the tier-suffixed in-game name (column R) like 'Titan Infantry T11'.
const ARMY_OPTIONS = [
  { gid: 33620029, name: "Armored Soldier T6", group: "01. Front — Drone", pop: 2 },
  { gid: 33620030, name: "Heavy Armored Soldier T8", group: "01. Front — Drone", pop: 2 },
  { gid: 33620031, name: "Ultimate Armored Soldier T10", group: "01. Front — Drone", pop: 2 },
  { gid: 33620032, name: "Ultima Armored Soldier T12", group: "01. Front — Drone", pop: 2 },
  { gid: 33619971, name: "Basic Infantry T1", group: "01. Front — FootMan", pop: 1 },
  { gid: 33619972, name: "Skilled Infantry T3", group: "01. Front — FootMan", pop: 1 },
  { gid: 33619976, name: "Intermediate Infantry T5", group: "01. Front — FootMan", pop: 1 },
  { gid: 33619977, name: "Shielded Infantry T7", group: "01. Front — FootMan", pop: 1 },
  { gid: 33619978, name: "Elite Infantry T9", group: "01. Front — FootMan", pop: 1 },
  { gid: 33619981, name: "Titan Infantry T11", group: "01. Front — FootMan", pop: 1 },
  { gid: 33620550, name: "Apocalypse Infantry T13", group: "01. Front — FootMan", pop: 1 },
  { gid: 33620007, name: "Basic Tank T1", group: "01. Front — ShieldCar", pop: 5 },
  { gid: 33620008, name: "Strong Tank T3", group: "01. Front — ShieldCar", pop: 5 },
  { gid: 33620009, name: "Intermediate Tank T5", group: "01. Front — ShieldCar", pop: 5 },
  { gid: 33620010, name: "Blaze Tank T7", group: "01. Front — ShieldCar", pop: 5 },
  { gid: 33620011, name: "Death Tank T9", group: "01. Front — ShieldCar", pop: 5 },
  { gid: 33620012, name: "Hell Tank T11", group: "01. Front — ShieldCar", pop: 5 },
  { gid: 33620552, name: "Destruction Tank T13", group: "01. Front — ShieldCar", pop: 5 },
  { gid: 33620019, name: "Basic Shredder T2", group: "01. Front — TeslaMan/LaserGun", pop: 10 },
  { gid: 33620020, name: "Strong Shredder T4", group: "01. Front — TeslaMan/LaserGun", pop: 10 },
  { gid: 33620021, name: "Intermediate Shredder T6", group: "01. Front — TeslaMan/LaserGun", pop: 10 },
  { gid: 33620022, name: "War Shredder T8", group: "01. Front — TeslaMan/LaserGun", pop: 10 },
  { gid: 33620023, name: "Wasteland King T10", group: "01. Front — TeslaMan/LaserGun", pop: 10 },
  { gid: 33620548, name: "Hell King T12", group: "01. Front — TeslaMan/LaserGun", pop: 10 },
  { gid: 33620629, name: "Mechanical Golem Lv1", group: "01. Front — WarPlane_Bot", pop: 1 },
  { gid: 33620024, name: "Basic War Biker T2", group: "02. Middle — BioTech", pop: 5 },
  { gid: 33620025, name: "Skilled War Biker T4", group: "02. Middle — BioTech", pop: 5 },
  { gid: 33620026, name: "Intermediate War Biker T6", group: "02. Middle — BioTech", pop: 5 },
  { gid: 33620027, name: "Swift Raider T8", group: "02. Middle — BioTech", pop: 5 },
  { gid: 33620028, name: "Storm Raider T10", group: "02. Middle — BioTech", pop: 5 },
  { gid: 33620549, name: "Demon Raider T12", group: "02. Middle — BioTech", pop: 5 },
  { gid: 33619982, name: "Basic Gunner T1", group: "02. Middle — GunMan", pop: 1 },
  { gid: 33619983, name: "Skilled Gunner T3", group: "02. Middle — GunMan", pop: 1 },
  { gid: 33619984, name: "Intermediate Gunner T5", group: "02. Middle — GunMan", pop: 1 },
  { gid: 33619988, name: "Specialist Gunner T7", group: "02. Middle — GunMan", pop: 1 },
  { gid: 33619989, name: "Mad Gatling T9", group: "02. Middle — GunMan", pop: 1 },
  { gid: 33619990, name: "Death Gatling T11", group: "02. Middle — GunMan", pop: 1 },
  { gid: 33620551, name: "Hades Gatling T13", group: "02. Middle — GunMan", pop: 1 },
  { gid: 33620037, name: "Storm Trooper T5", group: "02. Middle — LightGun", pop: 1 },
  { gid: 33620038, name: "Superior Storm Trooper T7", group: "02. Middle — LightGun", pop: 1 },
  { gid: 33620039, name: "Havoc Storm Trooper T9", group: "02. Middle — LightGun", pop: 1 },
  { gid: 33620040, name: "Havoc Dominator T11", group: "02. Middle — LightGun", pop: 1 },
  { gid: 33620553, name: "Havoc Breaker T13", group: "02. Middle — LightGun", pop: 1 },
  { gid: 33619991, name: "Basic Rocket Launcher T2", group: "02. Middle — Moto", pop: 1 },
  { gid: 33619997, name: "Skilled Rocket Launcher T4", group: "02. Middle — Moto", pop: 1 },
  { gid: 33619998, name: "Intermediate Rocket Launcher T6", group: "02. Middle — Moto", pop: 1 },
  { gid: 33619999, name: "Blaster Rocket Launcher T8", group: "02. Middle — Moto", pop: 1 },
  { gid: 33620000, name: "Pyromaster T10", group: "02. Middle — Moto", pop: 1 },
  { gid: 33620546, name: "Fanatic Terminator T12", group: "02. Middle — Moto", pop: 1 },
  { gid: 33620449, name: "Biochemical Zombie T4", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620365, name: "Biochemical Zombie T5", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620368, name: "Biochemical Zombie T6", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620369, name: "Biochemical Zombie T7", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620370, name: "Biochemical Zombie T8", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620371, name: "Biochemical Zombie T9", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620372, name: "Biochemical Zombie T10", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620373, name: "Biochemical Zombie T11", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620556, name: "Biochemical Zombie T12", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620557, name: "Biochemical Zombie T13", group: "02. Middle — WPSkin_Warrior", pop: 1 },
  { gid: 33620013, name: "Basic Cannon T1", group: "03. Back — FightCar", pop: 5 },
  { gid: 33620014, name: "Strong Cannon T3", group: "03. Back — FightCar", pop: 5 },
  { gid: 33620015, name: "Intermediate Cannon T5", group: "03. Back — FightCar", pop: 5 },
  { gid: 33620016, name: "Flame Cannon T7", group: "03. Back — FightCar", pop: 5 },
  { gid: 33620017, name: "Uranium Cannon T9", group: "03. Back — FightCar", pop: 5 },
  { gid: 33620018, name: "Doomsday Cannon T11", group: "03. Back — FightCar", pop: 5 },
  { gid: 33620555, name: "Death Cannon T13", group: "03. Back — FightCar", pop: 5 },
  { gid: 33620001, name: "Basic Sniper T2", group: "03. Back — FlameCar", pop: 1 },
  { gid: 33620003, name: "Skilled Sniper T4", group: "03. Back — FlameCar", pop: 1 },
  { gid: 33620004, name: "Intermediate Sniper T6", group: "03. Back — FlameCar", pop: 1 },
  { gid: 33620005, name: "Sharpshooter Sniper T8", group: "03. Back — FlameCar", pop: 1 },
  { gid: 33620006, name: "Cobra Sniper T10", group: "03. Back — FlameCar", pop: 1 },
  { gid: 33620547, name: "Eagle Eye Shot T12", group: "03. Back — FlameCar", pop: 1 },
  { gid: 33620033, name: "EMP Cannon 1 T6", group: "03. Back — HeavyCar", pop: 10 },
  { gid: 33620034, name: "Enhanced EMP Cannon T8", group: "03. Back — HeavyCar", pop: 10 },
  { gid: 33620035, name: "Supreme EMP Cannon T10", group: "03. Back — HeavyCar", pop: 10 },
  { gid: 33620036, name: "Ultima EMP Cannon T12", group: "03. Back — HeavyCar", pop: 10 },
  { gid: 33620041, name: "Shielder T5", group: "03. Back — HeavyFlameCar", pop: 5 },
  { gid: 33620042, name: "Advanced Shielder T7", group: "03. Back — HeavyFlameCar", pop: 5 },
  { gid: 33620043, name: "Supreme Shielder T9", group: "03. Back — HeavyFlameCar", pop: 5 },
  { gid: 33620044, name: "Light Energy Shielder T11", group: "03. Back — HeavyFlameCar", pop: 5 },
  { gid: 33620554, name: "Immortal Shielder T13", group: "03. Back — HeavyFlameCar", pop: 5 },
  { gid: 33620480, name: "Source Spirit Lv1", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620481, name: "Source Spirit Lv2", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620482, name: "Source Spirit Lv3", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620483, name: "Source Spirit Lv4", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620484, name: "Source Spirit Lv5", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620485, name: "Source Spirit Lv6", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620486, name: "Source Spirit Lv7", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620487, name: "Source Spirit Lv8", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620488, name: "Source Spirit Lv9", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620489, name: "Source Spirit Lv10", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620490, name: "Source Spirit Lv11", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620491, name: "Source Spirit Lv12", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620492, name: "Source Spirit Lv13", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620493, name: "Source Spirit Lv14", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620494, name: "Source Spirit Lv15", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620495, name: "Source Spirit Lv16", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620496, name: "Source Spirit Lv17", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620497, name: "Source Spirit Lv18", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620498, name: "Source Spirit Lv19", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620499, name: "Source Spirit Lv20", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620500, name: "Source Spirit Lv21", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620501, name: "Source Spirit Lv22", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620502, name: "Source Spirit Lv23", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620503, name: "Source Spirit Lv24", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620504, name: "Source Spirit Lv25", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620505, name: "Source Spirit Lv26", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620506, name: "Source Spirit Lv27", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620507, name: "Source Spirit Lv28", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620508, name: "Source Spirit Lv29", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620509, name: "Source Spirit Lv30", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620521, name: "Source Spirit Lv31", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620522, name: "Source Spirit Lv32", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620523, name: "Source Spirit Lv33", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620524, name: "Source Spirit Lv34", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620525, name: "Source Spirit Lv35", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620526, name: "Source Spirit Lv36", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620527, name: "Source Spirit Lv37", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620528, name: "Source Spirit Lv38", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620529, name: "Source Spirit Lv39", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620530, name: "Source Spirit Lv40", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620564, name: "Source Spirit Lv41", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620565, name: "Source Spirit Lv42", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620566, name: "Source Spirit Lv43", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620567, name: "Source Spirit Lv44", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620568, name: "Source Spirit Lv45", group: "04. Titans — Bison / Source Spirit", pop: 1 },
  { gid: 33620450, name: "Empress Lv1", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620451, name: "Empress Lv2", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620452, name: "Empress Lv3", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620453, name: "Empress Lv4", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620454, name: "Empress Lv5", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620455, name: "Empress Lv6", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620456, name: "Empress Lv7", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620457, name: "Empress Lv8", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620458, name: "Empress Lv9", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620459, name: "Empress Lv10", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620460, name: "Empress Lv11", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620461, name: "Empress Lv12", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620462, name: "Empress Lv13", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620463, name: "Empress Lv14", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620464, name: "Empress Lv15", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620465, name: "Empress Lv16", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620466, name: "Empress Lv17", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620467, name: "Empress Lv18", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620468, name: "Empress Lv19", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620469, name: "Empress Lv20", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620470, name: "Empress Lv21", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620471, name: "Empress Lv22", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620472, name: "Empress Lv23", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620473, name: "Empress Lv24", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620474, name: "Empress Lv25", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620475, name: "Empress Lv26", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620476, name: "Empress Lv27", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620477, name: "Empress Lv28", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620478, name: "Empress Lv29", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620479, name: "Empress Lv30", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620511, name: "Empress Lv31", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620512, name: "Empress Lv32", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620513, name: "Empress Lv33", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620514, name: "Empress Lv34", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620515, name: "Empress Lv35", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620516, name: "Empress Lv36", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620517, name: "Empress Lv37", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620518, name: "Empress Lv38", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620519, name: "Empress Lv39", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620520, name: "Empress Lv40", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620559, name: "Empress Lv41", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620560, name: "Empress Lv42", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620561, name: "Empress Lv43", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620562, name: "Empress Lv44", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620563, name: "Empress Lv45", group: "04. Titans — Empress", pop: 1 },
  { gid: 33620569, name: "Warplane Lv1", group: "05. Warplanes", pop: 1 },
  { gid: 33620570, name: "Warplane Lv2", group: "05. Warplanes", pop: 1 },
  { gid: 33620571, name: "Warplane Lv3", group: "05. Warplanes", pop: 1 },
  { gid: 33620572, name: "Warplane Lv4", group: "05. Warplanes", pop: 1 },
  { gid: 33620573, name: "Warplane Lv5", group: "05. Warplanes", pop: 1 },
  { gid: 33620574, name: "Warplane Lv6", group: "05. Warplanes", pop: 1 },
  { gid: 33620575, name: "Warplane Lv7", group: "05. Warplanes", pop: 1 },
  { gid: 33620576, name: "Warplane Lv8", group: "05. Warplanes", pop: 1 },
  { gid: 33620577, name: "Warplane Lv9", group: "05. Warplanes", pop: 1 },
  { gid: 33620578, name: "Warplane Lv10", group: "05. Warplanes", pop: 1 },
  { gid: 33620579, name: "Warplane Lv11", group: "05. Warplanes", pop: 1 },
  { gid: 33620580, name: "Warplane Lv12", group: "05. Warplanes", pop: 1 },
  { gid: 33620581, name: "Warplane Lv13", group: "05. Warplanes", pop: 1 },
  { gid: 33620582, name: "Warplane Lv14", group: "05. Warplanes", pop: 1 },
  { gid: 33620583, name: "Warplane Lv15", group: "05. Warplanes", pop: 1 },
  { gid: 33620584, name: "Warplane Lv16", group: "05. Warplanes", pop: 1 },
  { gid: 33620585, name: "Warplane Lv17", group: "05. Warplanes", pop: 1 },
  { gid: 33620586, name: "Warplane Lv18", group: "05. Warplanes", pop: 1 },
  { gid: 33620587, name: "Warplane Lv19", group: "05. Warplanes", pop: 1 },
  { gid: 33620588, name: "Warplane Lv20", group: "05. Warplanes", pop: 1 },
  { gid: 33620589, name: "Warplane Lv21", group: "05. Warplanes", pop: 1 },
  { gid: 33620590, name: "Warplane Lv22", group: "05. Warplanes", pop: 1 },
  { gid: 33620591, name: "Warplane Lv23", group: "05. Warplanes", pop: 1 },
  { gid: 33620592, name: "Warplane Lv24", group: "05. Warplanes", pop: 1 },
  { gid: 33620593, name: "Warplane Lv25", group: "05. Warplanes", pop: 1 },
  { gid: 33620594, name: "Warplane Lv26", group: "05. Warplanes", pop: 1 },
  { gid: 33620595, name: "Warplane Lv27", group: "05. Warplanes", pop: 1 },
  { gid: 33620596, name: "Warplane Lv28", group: "05. Warplanes", pop: 1 },
  { gid: 33620597, name: "Warplane Lv29", group: "05. Warplanes", pop: 1 },
  { gid: 33620598, name: "Warplane Lv30", group: "05. Warplanes", pop: 1 },
  { gid: 33620599, name: "Warplane Lv31", group: "05. Warplanes", pop: 1 },
  { gid: 33620600, name: "Warplane Lv32", group: "05. Warplanes", pop: 1 },
  { gid: 33620601, name: "Warplane Lv33", group: "05. Warplanes", pop: 1 },
  { gid: 33620602, name: "Warplane Lv34", group: "05. Warplanes", pop: 1 },
  { gid: 33620603, name: "Warplane Lv35", group: "05. Warplanes", pop: 1 },
  { gid: 33620604, name: "Warplane Lv36", group: "05. Warplanes", pop: 1 },
  { gid: 33620605, name: "Warplane Lv37", group: "05. Warplanes", pop: 1 },
  { gid: 33620606, name: "Warplane Lv38", group: "05. Warplanes", pop: 1 },
  { gid: 33620607, name: "Warplane Lv39", group: "05. Warplanes", pop: 1 },
  { gid: 33620608, name: "Warplane Lv40", group: "05. Warplanes", pop: 1 },
  { gid: 33620609, name: "Warplane Lv41", group: "05. Warplanes", pop: 1 },
  { gid: 33620610, name: "Warplane Lv42", group: "05. Warplanes", pop: 1 },
  { gid: 33620611, name: "Warplane Lv43", group: "05. Warplanes", pop: 1 },
  { gid: 33620612, name: "Warplane Lv44", group: "05. Warplanes", pop: 1 },
  { gid: 33620613, name: "Warplane Lv45", group: "05. Warplanes", pop: 1 },
  { gid: 33620614, name: "Warplane Lv46", group: "05. Warplanes", pop: 1 },
  { gid: 33620615, name: "Warplane Lv47", group: "05. Warplanes", pop: 1 },
  { gid: 33620616, name: "Warplane Lv48", group: "05. Warplanes", pop: 1 },
  { gid: 33620617, name: "Warplane Lv49", group: "05. Warplanes", pop: 1 },
  { gid: 33620618, name: "Warplane Lv50", group: "05. Warplanes", pop: 1 },
  { gid: 33620619, name: "Warplane Lv51", group: "05. Warplanes", pop: 1 },
  { gid: 33620620, name: "Warplane Lv52", group: "05. Warplanes", pop: 1 },
  { gid: 33620621, name: "Warplane Lv53", group: "05. Warplanes", pop: 1 },
  { gid: 33620622, name: "Warplane Lv54", group: "05. Warplanes", pop: 1 },
  { gid: 33620623, name: "Warplane Lv55", group: "05. Warplanes", pop: 1 },
];

// Hero ac_skill effect GIDs that land in ba_tech payloads — these are the
// battle-active Officer Breakthrough Skills (Power Strike, Tactical Block, etc.)
// Each maps to a hero's ac_skill (see skill registry in aoo-lua-SKILL.md §10a).
const OFFICER_BREAKTHROUGH_GIDS = new Set([
  50397347, // Power Strike (Doc Gray ac_skill 100859975)
  50397431, // Rapid Strike (Cattie ac_skill 100859990)
  50397449, // Tactical Block (Simon ac_skill 100860000)
  50397458, // Weakness Blitz (Maria ac_skill 100860004)
  50397494, // Advanced Ammo (Eric ac_skill 100860006)
  50397506, // Energy Shield (Emily ac_skill 100860013)
  50462842, // Airstrike / Air Support (Tifa ac_skill 100859982)
  50462843, // Rocket (Zeus ac_skill 100859986)
  50462844, // EMP Bomb (I. Medici ac_skill 100859984)
  50462929, // Energy Prison (Selina ac_skill 100860007)
  50462948, // Energy Blade (Freya ac_skill 100860010)
  50462949, // Tracking Missile (Kay ac_skill 100860014)
  50462956, // Battlefield Forte (Erica ac_skill 100860016)
]);

// Per-row block GIDs — hidden from ba_tech display (folded into combined All Troops Block)
const PER_ROW_BLOCK_GIDS = new Set([
  50462931, // Near Troop Block (Melee)
  50462932, // Mid Troop Block (Mid-Range)
  50462933, // Far Troop Block (Long-Range)
  50462934, // Bio Zombie Block (Biochemical Zombies)
]);

// Block GIDs that combine into a single "All Troops Block" display row
const BLOCK_FLAT_GID = 50462930; // All Troops Block (flat, Add_Block from hero skins)
const BLOCK_RATE_GID = 50397507; // All Troops Block (rate/1000, Add_BlockRate from machinist officers)

// GIDs displayed as raw numbers instead of percentage (value/10 + "%")
const RAW_NUMBER_GIDS = new Set([
  50462920, // Troops HP Bonus Boost
  50462916, // Troops Attack Bonus Boost
  50462937, // All Troops Disruptor Resistance
  50462940, // All Troops Misfire Resistance
  // Titan flat stat boosts (large absolute values, not %)
  50462864, // Source Spirit HP Boost (flat)
  50462865, // Source Spirit Attack Boost (flat)
  50462867, // Empress HP Boost (flat)
  50462868, // Empress Attack Boost (flat)
  // Warplane flat stat boosts
  50462917, // Warplane Attack (flat)
  50462918, // Warplane HP (flat)
]);

// ba_tech GIDs that belong visually under Titan Equipment / Empress
const EMPRESS_TECH_GIDS = new Set([
  50397391, 50397392, 50397393,  // Empress Attack / Defense / HP Boost (%)
  50462867, 50462868, 50462869,  // Empress HP / Attack / Defense Boost (flat)
]);

// ba_tech GIDs that belong visually under Titan Equipment / Source Spirit
const BISON_TECH_GIDS = new Set([
  50397388, 50397389, 50397390,  // Source Spirit Attack / Defense / HP Boost (%)
  50462864, 50462865, 50462866,  // Source Spirit HP / Attack / Defense Boost (flat)
]);

// ba_tech GIDs that belong visually under Warplane Equipment
const WARPLANE_TECH_GIDS = new Set([
  50397462, 50397463, 50397464,  // Warplane Attack / HP / Defense Boost (%)
  50397465, 50397466, 50397467,  // Warplane Dodge vs Mid / Long / Melee (%)
  50462917, 50462918, 50462919,  // Warplane Attack / HP / Defense (flat)
]);

// GIDs that directly consume RNG during battle — highlighted yellow in the UI.
//  • Block GIDs              — RateRandom() called per hit
//  • Check spells            — spell_random() called per attack trigger
//  • Random-target hero spells — random_int() called at spell fire
const RNG_GIDS = new Set([
  // Block (RateRandom per hit)
  50462930, 50397507,                      // All Troops Block (flat + rate/1000)
  50462931, 50462932, 50462933, 50462934,  // Per-row block (Near/Mid/Far/Bio)
  // Check spells (spell_random on each attack)
  50397452, 50397455,                      // Electrocution proc + rate booster
  50397456, 50397457,                      // Shield conditional checks
  50397494,                                // Advanced Ammo (top-2 attack proc)
  // Attack-check spells (fired during warrior attack)
  50397431, 50397503,                      // Rapid Strike (DoubleAttack + plus-GID)
  50397449, 50397502,                      // Tactical Block (4SubDamage + plus-GID)
  50397458, 50397504,                      // Weakness Blitz (Execute + plus-GID)
  // Hero spells with random_int target selection
  50462844,                                // EMP Bomb (3 random consecutive targets)
  50462929,                                // Energy Prison (random target)
  50462948,                                // Energy Blade (4 random targets)
]);

// Troop GIDs whose intrinsic special skill (warrior.spe[]) is ByChance (c_t=1) and therefore
// calls battle_random.random() on every hit received. Only wty=5 and wty=9 qualify.
// All other troop skills are ByCount (deterministic counter, no RNG).
//   • "01. Front — ShieldCar" (wty=5, Tanks)          — attackee skill, 31% chance to
//     block 50% of incoming damage (SkillEffectType.Block, castChance=0.31).
//   • "01. Front — Drone"     (wty=9, Armored Soldiers) — attackee skill, 35% chance to
//     reflect 20% of incoming damage back (SkillEffectType.RefDamage, castChance=0.35).
const RNG_ARMY_GID_SET = new Set(
  ARMY_OPTIONS
    .filter(o =>
      o.group === "01. Front — ShieldCar" ||   // wty=5, 31% ByChance Block attackee skill
      o.group === "01. Front — Drone"          // wty=9, 35% ByChance RefDamage attackee skill
    )
    .map(o => o.gid)
);

// Display sort order for Army Composition (view-only; warrs payload order preserved).
// Priority: Front (Melee) → Mid (Mid-range) → Zombies → Back (Long-range) →
//           Source Spirit → Empress → Warplanes
const ARMY_GID_SORT_KEY = (() => {
  const m = {};
  for (const o of ARMY_OPTIONS) {
    if (o.gid in m) continue;
    let p;
    if      (o.group.startsWith("01. Front"))                p = 0;  // Melee row
    else if (o.group === "02. Middle — WPSkin_Warrior")      p = 2;  // Zombies (separate from Mid)
    else if (o.group.startsWith("02. Middle"))               p = 1;  // Mid-range row
    else if (o.group.startsWith("03. Back"))                 p = 3;  // Long-range row
    else if (o.group.startsWith("04. Titans — Bison"))       p = 4;  // Source Spirit
    else if (o.group.startsWith("04. Titans — Empress"))     p = 5;  // Empress
    else if (o.group.startsWith("05."))                      p = 6;  // Warplanes
    else                                                     p = 7;
    m[o.gid] = p;
  }
  return m;
})();

// Biochemical Zombies: fleet size is capped by the player's hospital/zombie limit.
// Formation tester must never exceed the original report count.
const ZOMBIE_GID_SET = new Set(
  ARMY_OPTIONS.filter(o => o.group === "02. Middle — WPSkin_Warrior").map(o => o.gid)
);

// GIDs that are never varied in formation testing: titans, warplanes, robot bots
const FORMATION_FIXED_GID_SET = new Set(
  ARMY_OPTIONS
    .filter(o =>
      o.group.startsWith("04. Titans") ||
      o.group.startsWith("05.")        ||
      o.group === "01. Front — WarPlane_Bot"
    )
    .map(o => o.gid)
);

// These three must always be deployed — never variable, always shown explicitly in the UI.
const FORMATION_ALWAYS_DEPLOY_GROUPS = [
  "04. Titans — Bison / Source Spirit",
  "04. Titans — Empress",
  "05. Warplanes",
];
const FORMATION_ALWAYS_DEPLOY_GID_SET = new Set(
  ARMY_OPTIONS.filter(o => FORMATION_ALWAYS_DEPLOY_GROUPS.includes(o.group)).map(o => o.gid)
);

const BA_TECH_OPTIONS = _buildOptions(
  (g) => (g >= 50397000 && g <= 50463000) && !OFFICER_BREAKTHROUGH_GIDS.has(g),
  (g) => {
    if (g >= 50397213 && g <= 50397220) return "Row Attack / HP";
    if (g >= 50397245 && g <= 50397250) return "Damage To Rows";
    if (g >= 50397270 && g <= 50397278) return "Row Defence / Gather";
    if (g >= 50397335 && g <= 50397340) return "Damage Reduction";
    if (g >= 50397353 && g <= 50397365) return "Biochem Zombies";
    if (g >= 50397378 && g <= 50397410) return "Titan Buffs";
    if (g >= 50397422 && g <= 50397432) return "Atk vs Row";
    if (g >= 50397436 && g <= 50397470) return "Combat Modifiers";
    if (g >= 50397446 && g <= 50397500) return "Battle Spells";
    if (g >= 50397500 && g <= 50397513) return "Advanced Effects";
    if (g >= 50462840 && g <= 50462870) return "Hero Spells / Titan Flat";
    if (g >= 50462911 && g <= 50462940) return "Biochem / Block / Resist";
    if (g >= 50462945 && g <= 50462960) return "WarPlane / Hero";
    return "Other Battle Effects";
  }
).sort((a, b) => a.gid - b.gid);

const TITAN_OPTIONS = _buildOptions(
  (g) => g >= 100925000 && g <= 101500000,
  (g) => {
    if (g >= 100925442 && g <= 100925445) return "Bison — Star slots";
    if (g >= 100925446 && g <= 100925449) return "Empress — Star slots";
    if (g >= 100990970 && g <= 100990979) return "Bison — Equip parts";
    if (g >= 100990980 && g <= 100990989) return "Empress — Equip parts";
    if (g >= 101056514 && g <= 101056516) return "Bison — Halos";
    if (g >= 101056517 && g <= 101056519) return "Empress — Halos";
    if (g >= 101384197 && g <= 101384199) return "Bison — Equip skills";
    if (g >= 101384194 && g <= 101384196) return "Empress — Equip skills";
    return "Other Titan";
  }
);

const FIGHTER_OPTIONS = _buildOptions(
  (g) => g >= 101449000 && g <= 101700000,
  (g) => {
    if (g >= 101449730 && g <= 101449740) return "Warplane — Core equip";
    if (g >= 101646338 && g <= 101646345) return "Warplane — Fortifications";
    return "Other Warplane";
  }
);

// Set of all titan-slot GIDs — these belong under Titan Equipment, never in ba_tech list
const TITAN_SLOT_GID_SET = new Set(TITAN_OPTIONS.map(o => o.gid));

// byte 20 = Empress display (bison variable) → "Bison —" group GIDs
// byte 21 = Bison display (empress variable) → "Empress —" group GIDs
const TITAN_EMPRESS_OPTS = TITAN_OPTIONS.filter(o => o.group.startsWith("Bison —"));
const TITAN_BISON_OPTS   = TITAN_OPTIONS.filter(o => o.group.startsWith("Empress —"));

// Officer Breakthrough Skills picker options — built from the dedicated GID set.
// Each entry carries the same shape as other *_OPTIONS arrays for reuse in GidPicker.
const OFFICER_OPTIONS = Array.from(OFFICER_BREAKTHROUGH_GIDS)
  .map((gid) => ({
    gid,
    name: GID_NAMES[gid] || `GID ${gid}`,
    group: "Officer Breakthrough Skills",
  }))
  .sort((a, b) => a.gid - b.gid);

// ─── Embedded battle data (extracted from 308219 umine5.json) ─────────────
const INITIAL_DATA = {
  meta: {
    battle_id: 21692800,
    att_id: 21692800,
    def_id: 17858350,
    a_aid: 228997,
    d_aid: 177242,
    p_r: 200,
    nos_t: false,
    bt: 1,
    max_w: 0,
    dis_t: false,
    skipFrame: 0,
    ar_f: 0,
    ar_t: 0,
    leftBossHp: 0.0,
    leftAttackBossHp: 0.0,
  },
  attacker: {
    id: 21692800, nick: "༒Ineohcs༒", asn: "HIM", asid: 228997,
    ct_lvl: 40, server_id: 255, f_id: 3046, cus_icon: 9369736,
    fighter_a_l: 5, fighter_a_n: 0, lvl: 0, icon: 0,
    nn_eff: 0, fighter_s_s: 0, fighter_s_g: 0, i_b: 0,
    titan_s_i: [20, 68222981, 21, 68222984],
    titan_b_i: [20, 100925442, 14, 100925443, 15, 100925444, 13, 100925445, 11, 101056514, 15, 100990978, 15, 100990979, 13, 101384197, 10, 101384198, 6, -100, 21, 100925446, 15, 100925447, 15, 100925448, 15, 100925449, 10, 101056517, 15, 100990980, 15, 101056518, 8, 101384194, 9, 101384195, 6, 101384196, 2],
    fighter_eq: [
      { gid: 101449730, level: 2 }, { gid: 101449731, level: 6 }, { gid: 101449732, level: 13 },
      { gid: 101449734, level: 0 }, { gid: 101449736, level: 4 }, { gid: 101449735, level: 13 },
      { gid: 101449740, level: 8 }, { gid: 101646338, level: 4 }, { gid: 101646340, level: 12 },
      { gid: 101646339, level: 4 },
    ],
    ba_tech: [
      [100925444, 156], [100925447, 180], [50397447, 150], [100925443, 180], [50397449, 470],
      [50397451, 52], [50397450, 550], [100925448, 395], [50397452, 50], [50462866, 194],
      [50397457, 84], [50462867, 49080026], [50397456, 37], [50462864, 55428975], [50397459, 122],
      [50462865, 5195113], [50397458, 1500], [50397460, 243], [50462868, 3280834], [50397335, 936],
      [50462869, 169], [50397337, 705], [50397465, 200], [50397336, 779], [50397467, 1000],
      [50397466, 200], [50397213, 10161], [50397468, 15], [50397215, 16917], [50397214, 15731],
      [50397217, 9379], [50397216, 10072], [50397347, 310], [50397218, 8038], [50397353, 14305],
      [50397355, 10778], [50397354, 11479], [50397363, 1500], [50397362, 150], [50397493, 550],
      [50397364, 800], [50397494, 40], [50397245, 735], [50397247, 826], [50397246, 688],
      [50397507, 98308], [50397506, 90], [50462918, 30323986], [50462919, 136], [50462916, 123],
      [50462917, 2592756], [50462920, 311], [50397390, 120], [50397393, 120], [50462930, 112],
      [50462931, 112], [50462929, 20], [50462934, 112], [50462932, 112], [50462933, 112],
      [50397275, 10216], [50462937, 273], [50397277, 6951], [50397276, 7271], [50462940, 252],
      [50462948, 10], [50397423, 2613], [50397422, 3215], [50397425, 12], [50397424, 2947],
      [50397427, 3358], [50397426, 1329], [50397429, 800], [50397428, 3989], [50397431, 500],
      [50462842, 36], [50462843, 140], [50397437, 264], [50397436, 431], [50462844, 68],
      [50397439, 258], [50397438, 160],
    ].map(([gid, value]) => ({ gid, value })),
    warrs: [
      { gid: 33620599, count: 1.0 }, { gid: 33620511, count: 1.0 }, { gid: 33620521, count: 1.0 },
      { gid: 33620044, count: 7538.0 }, { gid: 33620036, count: 2696.0 }, { gid: 33620555, count: 5480.0 },
      { gid: 33620553, count: 198062.0 }, { gid: 33620549, count: 500.0 }, { gid: 33620556, count: 39940.0 },
      { gid: 33620546, count: 2000.0 }, { gid: 33619990, count: 2000.0 }, { gid: 33620548, count: 100.0 },
      { gid: 33620552, count: 35000.0 },
    ],
  },
  defender: {
    id: 17858350, nick: "若方舟lee", asn: "SvS", asid: 177242,
    ct_lvl: 40, server_id: 278, f_id: 9649, cus_icon: 6208049,
    fighter_a_l: 5, fighter_a_n: 0, lvl: 0, icon: 18,
    nn_eff: 0, fighter_s_s: 0, fighter_s_g: 0, i_b: 0,
    titan_s_i: [20, 68222981, 21, 68222984],
    titan_b_i: [20, 100925442, 14, 100925443, 13, 100925444, 11, 100925445, 7, 101056514, 14, 100990978, 14, 100990979, 14, 101056515, 12, 101384197, 11, 101384198, 10, 101384199, 7, -100, 21, 100925446, 14, 100925447, 13, 100925448, 11, 100925449, 8, 101056517, 14, 100990980, 14, 101056518, 13, 101384194, 10, 101384195, 9, 101384196, 7],
    fighter_eq: [
      { gid: 101449730, level: 11 }, { gid: 101449731, level: 11 }, { gid: 101449732, level: 11 },
      { gid: 101449734, level: 9 }, { gid: 101449736, level: 11 }, { gid: 101449735, level: 14 },
      { gid: 101449740, level: 7 },
    ],
    ba_tech: [
      [100925444, 395], [100925447, 180], [50397447, 150], [100925443, 180], [50397449, 440],
      [50397448, 40], [50397451, 30], [50397450, 550], [100925448, 395], [50397452, 50],
      [50397454, 15], [50462866, 207], [50397457, 30], [50462867, 59346569], [50397456, 20],
      [50462864, 58551307], [50397459, 128], [50462865, 5597480], [50397458, 1620], [50397460, 100],
      [50462868, 4537900], [50397335, 567], [50462869, 212], [50397337, 608], [50397465, 200],
      [50397336, 555], [50397467, 1000], [50397466, 200], [50397213, 8511], [50397469, 50],
      [50397468, 76], [50397215, 7831], [50397214, 11971], [50397217, 15532], [50397216, 6686],
      [50397347, 310], [50397218, 8430], [50397353, 12539], [50397355, 9737], [50397354, 10612],
      [50397363, 1500], [50397362, 150], [50397493, 490], [50397364, 800], [50397495, 2000],
      [50397494, 135], [50397498, 20], [50397245, 731], [50397247, 605], [50397246, 680],
      [50397507, 19140], [50462918, 27435770], [50462919, 103], [50462916, 106], [50462917, 2792156],
      [50462920, 260], [50397388, 80], [50397391, 80], [50397390, 120], [50397393, 120],
      [50462930, 152], [50462931, 152], [50462929, 44], [50462934, 152], [50462932, 152],
      [50462933, 152], [50397275, 7246], [50462937, 204], [50397277, 5691], [50397276, 5647],
      [50462940, 60], [50397423, 1861], [50397422, 1968], [50397425, 189], [50397424, 2292],
      [50397427, 2335], [50397426, 1137], [50397429, 900], [50397428, 2612], [50397431, 500],
      [50462842, 36], [50462843, 170], [50397435, 79], [50397437, 240], [50397436, 215],
      [50462844, 68], [50397439, 339], [50397438, 160],
    ].map(([gid, value]) => ({ gid, value })),
    warrs: [
      { gid: 33620599, count: 1.0 }, { gid: 33620479, count: 1.0 }, { gid: 33620509, count: 1.0 },
      { gid: 33620044, count: 1.0 }, { gid: 33620036, count: 1000.0 }, { gid: 33620555, count: 49742.0 },
      { gid: 33620547, count: 18002.0 }, { gid: 33620040, count: 1.0 }, { gid: 33620549, count: 1.0 },
      { gid: 33620557, count: 40890.0 }, { gid: 33620546, count: 1.0 }, { gid: 33619990, count: 1.0 },
      { gid: 33620032, count: 1.0 }, { gid: 33620548, count: 1000.0 }, { gid: 33620552, count: 34000.0 },
      { gid: 33619981, count: 1.0 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const clone = (o) => JSON.parse(JSON.stringify(o));
const fmt = (n) => n.toLocaleString("en-US");

// Pre-built lookup: gid → population cost per unit (from Tabelle1 POP column)
const ARMY_POP_BY_GID = Object.fromEntries(ARMY_OPTIONS.map(o => [o.gid, o.pop || 0]));
const popOf = (gid) => ARMY_POP_BY_GID[gid] || 0;

// Rebuild titan_b_i flat array from structured list
function flattenTitanBi(bison, empress) {
  const out = [20];
  bison.forEach(({ gid, level }) => { out.push(gid, level); });
  out.push(-100, 21);
  empress.forEach(({ gid, level }) => { out.push(gid, level); });
  return out;
}

function parseTitanBi(arr) {
  const bison = [], empress = [];
  let bucket = null;
  let i = 0;
  while (i < arr.length) {
    const v = arr[i];
    if (v === 20) { bucket = bison; i++; continue; }
    if (v === 21) { bucket = empress; i++; continue; }
    if (v === -100) { i++; continue; }
    bucket.push({ gid: arr[i], level: arr[i + 1] });
    i += 2;
  }
  return { bison, empress };
}

// Build player u_v object ready for the payload
function buildUV(p) {
  return {
    asid: p.asid, cus_icon: p.cus_icon, lvl: p.lvl, fighter_s_s: p.fighter_s_s,
    coll_skin: [], icon: p.icon, titan_b_i: p.titan_b_i,
    nn_eff: p.nn_eff, fighter_b_i: p.fighter_eq.flatMap(e => [e.gid, e.level]),
    ct_lvl: p.ct_lvl, server_id: p.server_id, fighter_a_l: p.fighter_a_l, i_b: p.i_b,
    fighter_a_n: p.fighter_a_n, ba_tech: p.ba_tech.flatMap(t => [t.gid, t.value]),
    nick: p.nick, x: 0, fighter_s_g: p.fighter_s_g, y: 0, id: p.id,
    titan_s_i: p.titan_s_i, f_id: p.f_id, asn: p.asn,
  };
}

// Build full report payload (as would be seen in action 20019)
function buildReport(state) {
  const { meta, attacker, defender } = state;
  const att_uv = buildUV(attacker);
  const def_uv = buildUV(defender);
  const marchingTroops = [
    {
      asid: attacker.asid, uid: attacker.id, is_att: true,
      warrs: attacker.warrs.map(w => ({ so: { [w.gid]: w.count }, sid: attacker.id })),
      ar_f: meta.ar_f, ar_t: meta.ar_t, u_v: att_uv, aid: -1, tid: attacker.id,
    },
    {
      asid: defender.asid, uid: defender.id, is_att: false,
      warrs: defender.warrs.map(w => ({ so: { [w.gid]: w.count }, sid: defender.id })),
      ar_f: meta.ar_f, ar_t: meta.ar_t, u_v: def_uv, aid: -1, tid: defender.id,
    },
  ];
  return {
    action: 20019,
    succ: true, err: 0,
    report: {
      att: meta.att_id, def: meta.def_id, p_r: meta.p_r,
      a_aid: meta.a_aid, d_aid: meta.d_aid,
      leftBossHp: meta.leftBossHp, leftAttackBossHp: meta.leftAttackBossHp,
      nos_t: meta.nos_t, bt: meta.bt, max_w: meta.max_w, dis_t: meta.dis_t,
      skipFrame: meta.skipFrame, id: meta.battle_id,
      users: { [attacker.id]: att_uv, [defender.id]: def_uv },
      marchingTroops,
      retreatedUserSoldiers: {}, enteringTroops: [], joinedTroopDataList: [],
      retreatingUsers: [], specialArmyDamageSource: {}, scores: {},
    },
  };
}

// ─── Atomic UI bits ───────────────────────────────────────────────────────
const Chip = ({ children, color = "amber" }) => (
  <span className={`inline-block px-1.5 py-0.5 border text-[9px] tracking-[0.12em] uppercase font-mono
    ${color === "amber" ? "border-amber-800/60 text-amber-500 bg-amber-950/40" :
      color === "red" ? "border-red-800/60 text-red-400 bg-red-950/40" :
      color === "teal" ? "border-teal-800/60 text-teal-400 bg-teal-950/40" :
      color === "slate" ? "border-neutral-700 text-neutral-400 bg-neutral-800/50" :
      "border-emerald-800/60 text-emerald-400 bg-emerald-950/40"}`}>
    {children}
  </span>
);

const Section = ({ title, count, children, defaultOpen = true, accent = "amber" }) => {
  const [open, setOpen] = useState(defaultOpen);
  const dotColor = accent === "red" ? "bg-red-500" : accent === "teal" ? "bg-teal-500" : "bg-amber-500";
  return (
    <div className="mb-3 border border-neutral-800/80 bg-[#0e0e0e]">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 ${dotColor}`} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-300">{title}</span>
          {count !== undefined && <span className="font-mono text-[10px] text-neutral-600">[{count}]</span>}
        </div>
        {open ? <ChevronDown size={14} className="text-neutral-600" /> : <ChevronRight size={14} className="text-neutral-600" />}
      </button>
      {open && <div className="p-3">{children}</div>}
    </div>
  );
};

const NumInput = ({ value, onChange, className = "", step = 1 }) => (
  <input type="number" value={value} step={step}
    onChange={(e) => onChange(Number(e.target.value))}
    className={`bg-[#0a0a0a] border border-neutral-700 focus:border-amber-600 outline-none
      font-mono text-xs text-neutral-200 px-2 py-1 w-full ${className}`} />
);

const TextInput = ({ value, onChange, className = "" }) => (
  <input type="text" value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`bg-[#0a0a0a] border border-neutral-700 focus:border-amber-600 outline-none
      font-mono text-xs text-neutral-200 px-2 py-1 w-full ${className}`} />
);

// ─── GidPicker — searchable dropdown with grouped options ─────────────────
const ACCENT = {
  amber: { border: "border-amber-700/60", hoverBorder: "hover:border-amber-600", text: "text-amber-500", bg: "bg-amber-950/50", hoverBg: "hover:bg-amber-950/30", dashed: "border-amber-700/50 hover:border-amber-600 text-amber-500 hover:text-amber-400" },
  red:   { border: "border-red-800/60",   hoverBorder: "hover:border-red-600",   text: "text-red-400",  bg: "bg-red-950/50",   hoverBg: "hover:bg-red-950/30",    dashed: "border-red-800/50 hover:border-red-600 text-red-400 hover:text-red-300" },
  teal:  { border: "border-teal-800/60",  hoverBorder: "hover:border-teal-600",  text: "text-teal-400", bg: "bg-teal-950/50",  hoverBg: "hover:bg-teal-950/30",   dashed: "border-teal-800/50 hover:border-teal-600 text-teal-400 hover:text-teal-300" },
};

function GidPicker({ value, onChange, options, accent = "amber", placeholder = "Select…", variant = "inline", addLabel, highlight = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const A = ACCENT[accent];

  const current = useMemo(
    () => (value != null ? options.find((o) => o.gid === value) : null),
    [value, options]
  );

  // Group options and filter by query
  const grouped = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = !q
      ? options
      : options.filter(
          (o) =>
            o.name.toLowerCase().includes(q) ||
            String(o.gid).includes(q) ||
            o.group.toLowerCase().includes(q)
        );
    const map = new Map();
    for (const o of filtered) {
      if (!map.has(o.group)) map.set(o.group, []);
      map.get(o.group).push(o);
    }
    return Array.from(map.entries());
  }, [query, options]);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    // Focus search input after mount
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const pick = (gid) => { onChange(gid); setOpen(false); setQuery(""); };

  const trigger =
    variant === "add" ? (
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full py-1.5 border border-dashed ${A.dashed} font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5`}
      >
        <Plus size={12} /> {addLabel || "Add"}
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`group w-full text-left font-mono text-[10px] px-2 py-1 border border-neutral-700 ${A.hoverBorder} bg-[#0a0a0a] ${highlight ? "text-yellow-400" : "text-neutral-300"} flex items-center justify-between gap-1 overflow-hidden`}
        title={current?.name || placeholder}
      >
        <span className="truncate min-w-0 flex-1">
          {current ? current.name : <span className="text-neutral-600">{placeholder}</span>}
        </span>
        <ChevronDown size={10} className="text-neutral-600 shrink-0" />
      </button>
    );

  return (
    <div ref={rootRef} className="relative min-w-0">
      {trigger}
      {open && (
        <div className={`absolute z-[60] top-full left-0 mt-1 w-[340px] max-w-[90vw] border ${A.border} bg-[#111] shadow-2xl shadow-black/60`}>
          <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-neutral-800 bg-[#0e0e0e]">
            <Search size={12} className="text-neutral-500 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or GID…"
              className="flex-1 bg-transparent font-mono text-[11px] text-neutral-200 outline-none placeholder:text-neutral-600"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-neutral-500 hover:text-neutral-300">
                <X size={12} />
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {grouped.length === 0 && (
              <div className="px-3 py-4 font-mono text-[10px] text-neutral-600 text-center">no matches</div>
            )}
            {grouped.map(([group, items]) => (
              <div key={group}>
                <div className="sticky top-0 bg-[#1a1a1a]/95 backdrop-blur font-mono text-[9px] tracking-[0.15em] uppercase text-neutral-500 px-2 py-1 border-b border-neutral-800">
                  {group.replace(/^\d+\.\s*/, "")}
                </div>
                {items.map((o) => {
                  const active = o.gid === value;
                  return (
                    <button
                      key={o.gid}
                      type="button"
                      onClick={() => pick(o.gid)}
                      className={`block w-full text-left font-mono text-[10px] px-2 py-1.5 border-b border-neutral-800/50 ${active ? `${A.bg} ${A.text}` : "text-neutral-300 hover:bg-neutral-800/50"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{o.name}</span>
                        <span className="text-neutral-600 shrink-0 text-[9px]">{o.gid}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Formation Tester ─────────────────────────────────────────────────────
function FormationTester({ attData, baseReport, simServer, onApply }) {
  const initPool = () =>
    attData.warrs
      .filter(w => !FORMATION_FIXED_GID_SET.has(w.gid))
      .map(w => w.gid);

  const [poolGids,       setPoolGids]       = useState(initPool);
  const [nTrials,        setNTrials]        = useState(100);
  const [goal,           setGoal]           = useState("survivors");
  const [multiSeed,      setMultiSeed]      = useState(false);
  const [running,        setRunning]        = useState(false);
  const [results,        setResults]        = useState(null);
  const [error,          setError]          = useState(null);
  const [elapsed,        setElapsed]        = useState(0);
  const [budgetOverride, setBudgetOverride] = useState(null); // null = use auto

  // Auto budget = total population of variable warrs in the current ATK army
  const autoBudget = useMemo(
    () => attData.warrs
      .filter(w => !FORMATION_FIXED_GID_SET.has(w.gid))
      .reduce((s, w) => s + w.count * popOf(w.gid), 0),
    [attData.warrs]
  );
  const budget = budgetOverride ?? autoBudget;

  // Hard caps: Biochemical Zombies cannot exceed the original report count.
  const maxCounts = useMemo(() => {
    const caps = {};
    for (const w of attData.warrs) {
      if (ZOMBIE_GID_SET.has(w.gid)) caps[w.gid] = w.count;
    }
    return caps;
  }, [attData.warrs]);

  const handleRun = async () => {
    if (!poolGids.length || budget <= 0) return;
    setRunning(true);
    setError(null);
    setResults(null);
    const t0 = Date.now();
    try {
      const res = await fetch(`${simServer}/formation-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report:        baseReport,
          variable_gids: poolGids,
          budget,
          n_trials:      nTrials,
          goal,
          seed:          5000,
          extra_seeds:   multiSeed ? [12345, 99999] : [],
          max_counts:    maxCounts,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Formation test failed");
      setElapsed(Date.now() - t0);
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  const handleApply = (r) => {
    const fixedWarrs = attData.warrs.filter(w => FORMATION_FIXED_GID_SET.has(w.gid));
    const varWarrs   = Object.entries(r.composition)
      .map(([gid, count]) => ({ gid: Number(gid), count }));
    onApply([...varWarrs, ...fixedWarrs]);
  };

  const TRIAL_OPTS = [50, 100, 200, 500, 1000, 2000];
  const GOAL_OPTS  = [
    { key: "survivors",  label: "Max Survivors" },
    { key: "kill_ratio", label: "Max Kills"     },
    { key: "frames",     label: "Fastest Win"   },
  ];

  const poolOptions = useMemo(
    () => ARMY_OPTIONS.filter(o => !FORMATION_FIXED_GID_SET.has(o.gid) && !poolGids.includes(o.gid)),
    [poolGids]
  );

  return (
    <div className="space-y-3">
      {/* Budget */}
      <div className="font-mono text-[10px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-neutral-500 uppercase tracking-wider">Variable Budget</span>
          <div className="flex items-center gap-1.5">
            {budgetOverride !== null && (
              <span className="text-neutral-700 text-[9px]">auto: {fmt(Math.round(autoBudget))}</span>
            )}
            <button
              onClick={() => { setPoolGids(initPool()); setBudgetOverride(null); }}
              title="Reset pool and budget to current army"
              className="text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              <RotateCcw size={10} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            step={10000}
            value={Math.round(budget)}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              setBudgetOverride(isNaN(v) || v <= 0 ? null : v);
            }}
            className={`flex-1 h-7 px-2 bg-neutral-900 border font-mono text-[10px] text-right focus:outline-none ${
              budgetOverride !== null
                ? "border-amber-700/60 text-amber-400"
                : "border-neutral-700 text-red-400"
            }`}
          />
          <span className="text-neutral-600 shrink-0">pop</span>
        </div>
      </div>

      {/* Always Deploy — Bison, Empress, Warplane */}
      {(() => {
        const always = attData.warrs.filter(w => FORMATION_ALWAYS_DEPLOY_GID_SET.has(w.gid) && w.count > 0);
        if (!always.length) return null;
        return (
          <div>
            <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider mb-1.5 px-1">
              Always Deployed
            </div>
            <div className="flex flex-wrap gap-1">
              {always.map(w => {
                const opt = ARMY_OPTIONS.find(o => o.gid === w.gid);
                return (
                  <div key={w.gid}
                    className="px-2 py-0.5 border border-amber-800/50 bg-amber-950/20 font-mono text-[9px] text-amber-500"
                    title="Always deployed — never variable">
                    {opt?.name ?? w.gid}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Troop pool */}
      <div>
        <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider mb-1.5 px-1">
          Troop Pool [{poolGids.length} types]
        </div>
        <div className="space-y-1">
          {poolGids.map(gid => {
            const opt = ARMY_OPTIONS.find(o => o.gid === gid);
            const cap = maxCounts[gid];
            return (
              <div key={gid} className="flex items-center gap-1.5">
                <div className="flex-1 font-mono text-[10px] px-2 py-1 border border-neutral-700 bg-[#0a0a0a] text-neutral-300 truncate">
                  {opt?.name ?? gid}
                  <span className="text-neutral-600 ml-1">×{opt?.pop ?? 1}</span>
                  {cap != null && (
                    <span className="ml-1.5 text-amber-600" title="Fleet size cap — cannot exceed original report count">
                      max {fmt(Math.round(cap))}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setPoolGids(p => p.filter(g => g !== gid))}
                  className="h-7 w-7 shrink-0 flex items-center justify-center border border-neutral-700 hover:border-red-600 hover:text-red-400 text-neutral-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
          <GidPicker
            value={null}
            options={poolOptions}
            accent="red"
            variant="add"
            addLabel="Add Troop Type"
            onChange={gid => setPoolGids(p => [...p, gid])}
          />
        </div>
      </div>

      {/* Trial count */}
      <div>
        <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider mb-1.5 px-1">
          Trials
        </div>
        <div className="flex gap-1">
          {TRIAL_OPTS.map(n => (
            <button key={n} onClick={() => setNTrials(n)}
              className={`flex-1 py-1 font-mono text-[10px] border transition-colors
                ${nTrials === n
                  ? "border-red-700 text-red-400 bg-red-950/30"
                  : "border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider mb-1.5 px-1">
          Optimize For
        </div>
        <div className="flex gap-1">
          {GOAL_OPTS.map(g => (
            <button key={g.key} onClick={() => setGoal(g.key)}
              className={`flex-1 py-1 font-mono text-[10px] border transition-colors
                ${goal === g.key
                  ? "border-red-700 text-red-400 bg-red-950/30"
                  : "border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-seed validation toggle */}
      <div className="flex items-center justify-between font-mono text-[10px]">
        <span className="text-neutral-500 uppercase tracking-wider text-[9px]">Multi-Seed Validation</span>
        <button
          onClick={() => setMultiSeed(v => !v)}
          className={`px-2 py-0.5 border transition-colors text-[9px] uppercase tracking-wider ${
            multiSeed
              ? "border-amber-700/60 text-amber-400 bg-amber-950/20"
              : "border-neutral-700 text-neutral-600 hover:border-neutral-500 hover:text-neutral-400"
          }`}
        >
          {multiSeed ? "ON — seeds 12345, 99999" : "OFF"}
        </button>
      </div>

      {/* Run button */}
      <button onClick={handleRun}
        disabled={running || poolGids.length === 0 || budget <= 0}
        className="w-full h-8 flex items-center justify-center gap-2 border border-red-800/60 hover:border-red-600 bg-red-950/30 hover:bg-red-950/50 font-mono text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {running
          ? <><Loader2 size={12} className="animate-spin" /> Testing {nTrials} formations…</>
          : <><Play size={12} /> Run Formation Test</>}
      </button>

      {error && (
        <div className="font-mono text-[10px] text-red-400 px-2 py-1.5 border border-red-900/50 bg-red-950/20">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div>
          <div className="flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase tracking-wider mb-1.5 px-1">
            <span>
              {results.wins}/{results.n_trials} wins · top {results.results.length}
              {results.extra_seeds?.length > 0 && (
                <span className="ml-1.5 text-amber-600">· avg of {results.extra_seeds.length + 1} seeds</span>
              )}
            </span>
            <span>{(elapsed / 1000).toFixed(1)}s</span>
          </div>

          {/* Convergence chart */}
          {results.convergence?.length > 1 && (() => {
            const pts  = results.convergence;
            const maxT = pts[pts.length - 1].trial;
            const maxB = Math.max(...pts.map(p => p.best), 0.0001);
            const W = 320, H = 48, pad = { l: 4, r: 4, t: 4, b: 4 };
            const iW = W - pad.l - pad.r;
            const iH = H - pad.t - pad.b;
            const tx = t => pad.l + (t / maxT) * iW;
            const ty = b => pad.t + iH - (b / maxB) * iH;
            const phase1x = tx(Math.round(results.n_trials * 0.60));
            const polyline = pts.map(p => `${tx(p.trial).toFixed(1)},${ty(p.best).toFixed(1)}`).join(" ");
            return (
              <div className="mb-2">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12 block" style={{ fontFamily: "monospace" }}>
                  {/* Phase boundary */}
                  <line x1={phase1x} y1={pad.t} x2={phase1x} y2={H - pad.b}
                    stroke="#6b2f2f" strokeWidth="1" strokeDasharray="3,2" />
                  <text x={phase1x + 2} y={pad.t + 7} fill="#7a3333" fontSize="6">evolve</text>
                  {/* Score line */}
                  <polyline points={polyline} fill="none" stroke="#16a34a" strokeWidth="1.2" />
                  {/* Labels */}
                  <text x={pad.l + 1} y={H - pad.b - 2} fill="#555" fontSize="6">trial 0</text>
                  <text x={W - pad.r - 1} y={H - pad.b - 2} fill="#555" fontSize="6" textAnchor="end">
                    {maxT}
                  </text>
                  <text x={W - pad.r - 1} y={pad.t + 7} fill="#4ade80" fontSize="6" textAnchor="end">
                    {(maxB * 100).toFixed(1)}%
                  </text>
                </svg>
              </div>
            );
          })()}

          <div className="space-y-1 max-h-[32rem] overflow-y-auto pr-0.5">
            {results.results.map((r, idx) => {
              const isWin     = r.winner === "attacker";
              const showAvg   = results.extra_seeds?.length > 0 && r.avg_score != null;
              const scoreDisp = results.goal === "frames"
                ? `${r.frames}f`
                : `${(r.score * 100).toFixed(1)}%`;
              return (
                <div key={idx}
                  className={`border p-2 font-mono text-[10px] ${isWin ? "border-emerald-900/60 bg-emerald-950/10" : "border-neutral-800 bg-[#0a0a0a]"}`}>
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600">#{idx + 1}</span>
                      <span className={isWin ? "text-emerald-400" : "text-red-500"}>
                        {isWin ? "WIN" : "LOSS"}
                      </span>
                      <span className="text-neutral-400">{scoreDisp}</span>
                      {showAvg && (
                        <span className="text-amber-500" title="Average score across all seeds">
                          avg {(r.avg_score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-600">{r.frames}f</span>
                      {isWin && (
                        <button onClick={() => handleApply(r)}
                          className="px-2 py-0.5 border border-red-800 text-red-400 hover:bg-red-950/40 transition-colors text-[9px] tracking-wider uppercase">
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Composition chips */}
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(r.composition).map(([gid, count]) => {
                      const opt  = ARMY_OPTIONS.find(o => o.gid === Number(gid));
                      const pop  = Math.round(count * (opt?.pop ?? 1));
                      return (
                        <span key={gid}
                          className="inline-block px-1.5 py-0.5 border border-neutral-700 bg-neutral-800/50 text-neutral-400">
                          {opt?.name ?? gid}{" "}
                          <span className="text-neutral-500">{fmt(count)}</span>
                          <span className="text-neutral-600 ml-0.5">({fmt(pop)}p)</span>
                        </span>
                      );
                    })}
                  </div>
                  {/* ATK survivors (winning runs only) */}
                  {isWin && r.atk_survivors.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.atk_survivors.map(s => {
                        const opt = ARMY_OPTIONS.find(o => o.gid === s.gid);
                        return (
                          <span key={s.gid}
                            className="inline-block px-1.5 py-0.5 border border-emerald-900/50 bg-emerald-950/20 text-emerald-400">
                            {opt?.name ?? s.gid} {fmt(Math.round(s.count))}
                            <span className="text-emerald-600 ml-0.5">({fmt(s.pop)}p)</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Player Panel ─────────────────────────────────────────────────────────
function PlayerPanel({ role, data, onChange, lvVals = {}, ftProps = null }) {
  const isAtt = role === "attacker";
  const accent = isAtt ? "red" : "teal";
  const Icon = isAtt ? Swords : Shield;
  const tclr = isAtt ? "text-red-400" : "text-teal-400";
  const bclr = isAtt ? "border-red-900/60" : "border-teal-900/60";

  const update = (patch) => onChange({ ...data, ...patch });
  const { bison, empress } = useMemo(() => parseTitanBi(data.titan_b_i), [data.titan_b_i]);
  // Display-only sort of ba_tech by GID ascending; state order preserved for payload fidelity.
  // Filters out titan-slot GIDs (→ Titan Equipment), officer breakthrough GIDs (→ own section),
  // per-row block GIDs, the two combined-block GIDs (→ "All Troops Block" row),
  // and titan/warplane stat GIDs that are now shown in their equipment panels.
  const sortedBaTech = useMemo(
    () => data.ba_tech
      .map((t, origIdx) => ({ ...t, origIdx }))
      .filter((t) => !TITAN_SLOT_GID_SET.has(t.gid) && !OFFICER_BREAKTHROUGH_GIDS.has(t.gid)
        && !PER_ROW_BLOCK_GIDS.has(t.gid) && t.gid !== BLOCK_FLAT_GID && t.gid !== BLOCK_RATE_GID
        && !EMPRESS_TECH_GIDS.has(t.gid) && !BISON_TECH_GIDS.has(t.gid) && !WARPLANE_TECH_GIDS.has(t.gid))
      .sort((a, b) => a.gid - b.gid),
    [data.ba_tech]
  );

  // Combined All Troops Block = flat (50462930) + rate÷1000 (50397507)
  const combinedBlock = useMemo(() => {
    const flat = data.ba_tech.find(t => t.gid === BLOCK_FLAT_GID);
    const rate = data.ba_tech.find(t => t.gid === BLOCK_RATE_GID);
    return (flat ? flat.value : 0) + (rate ? rate.value / 1000 : 0);
  }, [data.ba_tech]);

  // Display-only sort of warrs by row/type; warrs array order preserved for payload fidelity.
  const sortedWarrs = useMemo(
    () => data.warrs
      .map((w, origIdx) => ({ ...w, origIdx }))
      .sort((a, b) => (ARMY_GID_SORT_KEY[a.gid] ?? 7) - (ARMY_GID_SORT_KEY[b.gid] ?? 7)),
    [data.warrs]
  );

  // Read/write ba_tech value by GID (used by Titan Equipment rows for their Value column).
  const getBaTechValue = (gid) => {
    const entry = data.ba_tech.find(t => t.gid === gid);
    return entry ? entry.value : 0;
  };

  // Config-based level→value lookup (from replay meta lv_vals).
  // Returns att_eff[0] at the given 0-based level, or falls back to getBaTechValue.
  const getLevelValue = (gid, level) => {
    const table = lvVals[String(gid)];
    if (table && level >= 0 && level < table.length) return table[level];
    return getBaTechValue(gid);
  };
  const setBaTechValue = (gid, value) => {
    const idx = data.ba_tech.findIndex(t => t.gid === gid);
    if (idx >= 0) {
      const next = [...data.ba_tech];
      next[idx] = { ...next[idx], value };
      update({ ba_tech: next });
    } else {
      update({ ba_tech: [...data.ba_tech, { gid, value }] });
    }
  };

  return (
    <div className={`border ${bclr} bg-[#0e0e0e]`}>
      {/* Identity header */}
      <div className={`relative overflow-hidden ${isAtt ? "bg-gradient-to-br from-red-950/40 to-[#0e0e0e]" : "bg-gradient-to-br from-teal-950/40 to-[#0e0e0e]"} p-4 border-b ${bclr}`}>
        <div className={`absolute top-0 right-0 text-[180px] leading-none font-black opacity-[0.06] select-none pointer-events-none font-serif ${isAtt ? "text-red-500" : "text-teal-500"}`}>
          {isAtt ? "A" : "D"}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} className={tclr} />
          <span className={`font-mono text-[9px] tracking-[0.3em] uppercase ${isAtt ? "text-red-500/70" : "text-teal-500/70"}`}>
            {isAtt ? "ATK · WEST" : "DEF · EAST"}
          </span>
        </div>
        <div className={`font-mono text-lg tracking-wide ${isAtt ? "text-red-400" : "text-teal-400"} mb-3`}>
          {data.nick || (isAtt ? "Attacker" : "Defender")}
        </div>
        <div className="flex items-center gap-3 mb-3 font-mono text-[10px]">
          <span className="text-neutral-500">{data.asn}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-500">CT{data.ct_lvl + 1}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-500">S{data.server_id}</span>
        </div>

      </div>

      {/* Army */}
      <div className="p-3">
        <Section title="Army Composition" count={data.warrs.length} accent={accent}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-wider px-1">
              <div className="flex-1 min-w-0">Troop</div>
              <div className="w-20 shrink-0">Count</div>
              <div className="w-20 shrink-0 text-right">Population</div>
              <div className="w-7 shrink-0"></div>
            </div>
            {sortedWarrs.map((w) => {
              const i = w.origIdx;
              const unitPop = popOf(w.gid);
              const rowPop = Math.round(w.count * unitPop);
              return (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex-1 min-w-0">
                  <GidPicker
                    value={w.gid}
                    options={ARMY_OPTIONS}
                    accent={accent}
                    highlight={RNG_ARMY_GID_SET.has(w.gid)}
                    onChange={(v) => {
                      const next = [...data.warrs]; next[i] = { ...w, gid: v }; update({ warrs: next });
                    }}
                  />
                </div>
                <div className="w-20 shrink-0">
                  <NumInput value={w.count} step={w.count === 1 ? 0.1 : 100} onChange={v => {
                    const next = [...data.warrs]; next[i] = { ...w, count: v }; update({ warrs: next });
                  }} />
                </div>
                <div className="w-20 shrink-0 font-mono text-[10px] text-neutral-400 text-right px-2 py-1 border border-neutral-700 bg-neutral-900"
                  title={`count ${fmt(w.count)} × pop ${unitPop}`}>
                  {fmt(rowPop)}
                </div>
                <button onClick={() => update({ warrs: data.warrs.filter((_, j) => j !== i) })}
                  className="h-7 w-7 shrink-0 flex items-center justify-center border border-neutral-700 hover:border-red-600 hover:text-red-400 text-neutral-600 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
              );
            })}
            <div className="pt-1">
              <GidPicker
                value={null}
                options={ARMY_OPTIONS}
                accent={accent}
                variant="add"
                addLabel="Add Troop Type"
                onChange={(gid) => update({ warrs: [...data.warrs, { gid, count: 1000 }] })}
              />
            </div>
            <div className="pt-2 mt-2 border-t border-neutral-800 flex items-center justify-between font-mono text-[10px]">
              <span className="text-neutral-600 uppercase tracking-wider">Total Population</span>
              <span className={tclr}>{fmt(Math.round(data.warrs.reduce((s, w) => s + w.count * popOf(w.gid), 0)))}</span>
            </div>
          </div>
        </Section>

        {/* Battle Stats */}
        <Section title="Battle Stats" count={sortedBaTech.length + (combinedBlock > 0 ? 1 : 0)} defaultOpen={false} accent={accent}>
          <div className="max-h-96 overflow-y-auto space-y-1 pr-1">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-wider px-1 sticky top-0 bg-[#0e0e0e] py-1 z-10">
              <div className="flex-1 min-w-0">Stat</div>
              <div className="w-28 shrink-0">Value</div>
            </div>
            {sortedBaTech.map((t) => {
              const i = t.origIdx;
              const isRaw = RAW_NUMBER_GIDS.has(t.gid);
              return (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex-1 min-w-0">
                  <GidPicker
                    value={t.gid}
                    options={BA_TECH_OPTIONS}
                    accent={accent}
                    highlight={RNG_GIDS.has(t.gid)}
                    onChange={(v) => {
                      const next = [...data.ba_tech]; next[i] = { ...data.ba_tech[i], gid: v }; update({ ba_tech: next });
                    }}
                  />
                </div>
                <div className="w-28 shrink-0">
                  {isRaw ? (
                    <NumInput value={t.value} onChange={v => {
                      const next = [...data.ba_tech]; next[i] = { ...data.ba_tech[i], value: v }; update({ ba_tech: next });
                    }} />
                  ) : (
                    <div className="flex items-center gap-0.5">
                      <NumInput value={+(t.value / 10).toFixed(1)} onChange={v => {
                        const next = [...data.ba_tech]; next[i] = { ...data.ba_tech[i], value: Math.round(v * 10) }; update({ ba_tech: next });
                      }} />
                      <span className="text-neutral-600 text-[9px] font-mono shrink-0">%</span>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
            {/* Combined All Troops Block (50462930 flat + 50397507 rate÷1000) */}
            {combinedBlock > 0 && (
              <div className="flex items-center gap-1.5 pt-1.5 mt-1 border-t border-neutral-800/60">
                <div className="flex-1 min-w-0 font-mono text-[10px] text-amber-400/80 px-1">All Troops Block</div>
                <div className="w-28 shrink-0 font-mono text-[11px] text-neutral-300 px-2">{+combinedBlock.toFixed(3)}</div>
              </div>
            )}
          </div>
        </Section>

        {/* Officer Breakthrough Skills */}
        <Section title="Officer Breakthrough Skills" count={OFFICER_OPTIONS.length} defaultOpen={false} accent={accent}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-wider px-1">
              <div className="flex-1 min-w-0">Skill</div>
              <div className="w-14 shrink-0">Lv</div>
              <div className="w-24 shrink-0">Value</div>
            </div>
            {OFFICER_OPTIONS.map((opt) => {
              const entry = data.ba_tech.find(t => t.gid === opt.gid);
              const isPresent = !!entry;
              const currentLevel = entry?.level ?? 0;
              // 0 = not unlocked; 1-based when present
              const displayLevel = isPresent ? currentLevel + 1 : 0;
              return (
                <div key={opt.gid} className="flex items-center gap-1.5">
                  <div className={`flex-1 min-w-0 font-mono text-[10px] px-2 py-1 border border-neutral-700 bg-[#0a0a0a] truncate ${!isPresent ? "text-neutral-600" : RNG_GIDS.has(opt.gid) ? "text-yellow-400" : "text-neutral-300"}`}
                    title={opt.name}>
                    {opt.name}
                  </div>
                  <div className="w-14 shrink-0">
                    <NumInput
                      value={displayLevel}
                      min={0}
                      onChange={v => {
                        if (v <= 0) {
                          // Remove from ba_tech (unlocking at 0 = not active)
                          update({ ba_tech: data.ba_tech.filter(t => t.gid !== opt.gid) });
                        } else {
                          const newLevel = v - 1;
                          const newValue = getLevelValue(opt.gid, newLevel);
                          const idx = data.ba_tech.findIndex(t => t.gid === opt.gid);
                          if (idx >= 0) {
                            const next = [...data.ba_tech];
                            next[idx] = { ...next[idx], level: newLevel, value: newValue };
                            update({ ba_tech: next });
                          } else {
                            update({ ba_tech: [...data.ba_tech, { gid: opt.gid, value: newValue, level: newLevel }] });
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="w-24 shrink-0 font-mono text-[11px] text-neutral-400 px-2">
                    {isPresent ? getLevelValue(opt.gid, currentLevel) : 0}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Titan Equipment */}
        <Section title="Titan Equipment" count={TITAN_EMPRESS_OPTS.length + TITAN_BISON_OPTS.length} defaultOpen={false} accent={accent}>
          <div className="space-y-3">
            {/* NOTE: bison (byte 20) displays as Empress; empress (byte 21) displays as Bison — swapped. */}
            {[
              { label: "Empress", opts: TITAN_EMPRESS_OPTS, arr: bison,   setArr: (next) => update({ titan_b_i: flattenTitanBi(next, empress) }), clr: "text-amber-500", bar: "bg-amber-600", statGids: EMPRESS_TECH_GIDS },
              { label: "Bison",   opts: TITAN_BISON_OPTS,   arr: empress, setArr: (next) => update({ titan_b_i: flattenTitanBi(bison, next) }),   clr: "text-red-400",   bar: "bg-red-500",   statGids: BISON_TECH_GIDS   },
            ].map(({ label, opts, arr, setArr, clr, bar, statGids }) => (
              <div key={label}>
                <div className={`font-mono text-[10px] ${clr} uppercase tracking-widest mb-1.5 flex items-center gap-2`}>
                  <span className={`w-4 h-[1px] ${bar}`} /> {label}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-wider px-1">
                    <div className="flex-1 min-w-0">Equipment</div>
                    <div className="w-14 shrink-0">Lv</div>
                    <div className="w-24 shrink-0">Value</div>
                  </div>
                  {opts.map((opt) => {
                    const entry = arr.find(e => e.gid === opt.gid);
                    const isPresent = !!entry;
                    const currentLevel = entry?.level ?? 0;
                    const displayLevel = isPresent ? currentLevel + 1 : 0;
                    return (
                      <div key={opt.gid} className="flex items-center gap-1.5">
                        <div className={`flex-1 min-w-0 font-mono text-[10px] px-2 py-1 border border-neutral-700 bg-[#0a0a0a] truncate ${isPresent ? "text-neutral-300" : "text-neutral-600"}`}
                          title={opt.name}>
                          {opt.name}
                        </div>
                        <div className="w-14 shrink-0">
                          <NumInput value={displayLevel} min={0} onChange={v => {
                            if (v <= 0) {
                              setArr(arr.filter(e => e.gid !== opt.gid));
                            } else {
                              const newLevel = v - 1;
                              const next = isPresent
                                ? arr.map(e => e.gid === opt.gid ? { ...e, level: newLevel } : e)
                                : [...arr, { gid: opt.gid, level: newLevel }];
                              setArr(next);
                            }
                          }} />
                        </div>
                        <div className="w-24 shrink-0 font-mono text-[11px] text-neutral-400 px-2">
                          {isPresent ? getLevelValue(opt.gid, currentLevel) : 0}
                        </div>
                      </div>
                    );
                  })}
                  {/* Titan stat boosts from ba_tech */}
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-wider px-1 pt-1 mt-1 border-t border-neutral-800">
                    <div className="flex-1 min-w-0">Stat</div>
                    <div className="w-14 shrink-0" />
                    <div className="w-24 shrink-0">Value</div>
                  </div>
                  {[...statGids].map((gid) => {
                    const isRaw = RAW_NUMBER_GIDS.has(gid);
                    const raw = getBaTechValue(gid);
                    const display = isRaw ? raw : raw / 10;
                    const name = GID_NAMES[gid] || `GID ${gid}`;
                    return (
                      <div key={gid} className="flex items-center gap-1.5">
                        <div className="flex-1 min-w-0 font-mono text-[10px] px-2 py-1 border border-neutral-700 bg-[#0a0a0a] truncate text-neutral-300" title={name}>
                          {name}
                        </div>
                        <div className="w-14 shrink-0" />
                        <div className="w-24 shrink-0">
                          {isRaw ? (
                            <NumInput
                              value={display}
                              step={1}
                              onChange={v => setBaTechValue(gid, Math.round(v))}
                            />
                          ) : (
                            <div className="flex items-center gap-0.5">
                              <NumInput
                                value={display}
                                step={0.1}
                                onChange={v => setBaTechValue(gid, Math.round(v * 10))}
                              />
                              <span className="text-neutral-600 text-[9px] font-mono shrink-0">%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Warplane Equipment */}
        <Section title="Warplane Equipment" count={FIGHTER_OPTIONS.length} defaultOpen={false} accent={accent}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-wider px-1">
              <div className="flex-1 min-w-0">Equipment</div>
              <div className="w-14 shrink-0">Lv</div>
              <div className="w-24 shrink-0">Value</div>
            </div>
            {FIGHTER_OPTIONS.map((opt) => {
              const entry = data.fighter_eq.find(e => e.gid === opt.gid);
              const isPresent = !!entry;
              const currentLevel = entry?.level ?? 0;
              const displayLevel = isPresent ? currentLevel + 1 : 0;
              return (
                <div key={opt.gid} className="flex items-center gap-1.5">
                  <div className={`flex-1 min-w-0 font-mono text-[10px] px-2 py-1 border border-neutral-700 bg-[#0a0a0a] truncate ${isPresent ? "text-neutral-300" : "text-neutral-600"}`}
                    title={opt.name}>
                    {opt.name}
                  </div>
                  <div className="w-14 shrink-0">
                    <NumInput value={displayLevel} min={0} onChange={v => {
                      if (v <= 0) {
                        update({ fighter_eq: data.fighter_eq.filter(e => e.gid !== opt.gid) });
                      } else {
                        const newLevel = v - 1;
                        const next = isPresent
                          ? data.fighter_eq.map(e => e.gid === opt.gid ? { ...e, level: newLevel } : e)
                          : [...data.fighter_eq, { gid: opt.gid, level: newLevel }];
                        update({ fighter_eq: next });
                      }
                    }} />
                  </div>
                  <div className="w-24 shrink-0 font-mono text-[11px] text-neutral-400 px-2">
                    {isPresent ? getLevelValue(opt.gid, currentLevel) : 0}
                  </div>
                </div>
              );
            })}
            {/* Warplane stat boosts from ba_tech */}
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-wider px-1 pt-1 mt-1 border-t border-neutral-800">
              <div className="flex-1 min-w-0">Stat</div>
              <div className="w-14 shrink-0" />
              <div className="w-24 shrink-0">Value</div>
            </div>
            {[...WARPLANE_TECH_GIDS].map((gid) => {
              const isRaw = RAW_NUMBER_GIDS.has(gid);
              const raw = getBaTechValue(gid);
              const display = isRaw ? raw : raw / 10;
              const name = GID_NAMES[gid] || `GID ${gid}`;
              return (
                <div key={gid} className="flex items-center gap-1.5">
                  <div className="flex-1 min-w-0 font-mono text-[10px] px-2 py-1 border border-neutral-700 bg-[#0a0a0a] truncate text-neutral-300" title={name}>
                    {name}
                  </div>
                  <div className="w-14 shrink-0" />
                  <div className="w-24 shrink-0">
                    {isRaw ? (
                      <NumInput
                        value={display}
                        step={1}
                        onChange={v => setBaTechValue(gid, Math.round(v))}
                      />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        <NumInput
                          value={display}
                          step={0.1}
                          onChange={v => setBaTechValue(gid, Math.round(v * 10))}
                        />
                        <span className="text-neutral-600 text-[9px] font-mono shrink-0">%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Formation Tester — ATK only */}
        {isAtt && ftProps && (
          <Section title="Formation Tester" defaultOpen={false} accent={accent}>
            <FormationTester
              attData={data}
              baseReport={ftProps.baseReport}
              simServer={ftProps.simServer}
              onApply={(newWarrs) => update({ warrs: newWarrs })}
            />
          </Section>
        )}
      </div>
    </div>
  );
}

// ─── Battle Replay Visualization ──────────────────────────────────────────

// Warrior type → color for rendering
const WTYPE_COLORS = {
  // Front row — warm
  1: "#b45309", 5: "#c2410c", 7: "#a16207", 9: "#92400e",
  // Mid row — cool
  2: "#0369a1", 3: "#1d4ed8", 8: "#4338ca", 11: "#6d28d9", 70: "#7e22ce",
  // Back row — green/teal
  4: "#15803d", 6: "#047857", 10: "#0f766e", 12: "#115e59",
  // Special
  20: "#dc2626", 21: "#dc2626", 66: "#e11d48", 67: "#78716c",
};

// GID → English in-game troop name (highest tier per wtype used for label)
const GID_TROOP_NAMES = {
  // wty=1 FootMan
  33619971: "Infantry", 33619972: "Infantry", 33619976: "Infantry",
  33619977: "Infantry", 33619978: "Infantry", 33619981: "Titan Inf.",
  33620550: "Apocalypse Inf.",
  // wty=2 GunMan
  33619982: "Gunner", 33619983: "Gunner", 33619984: "Gunner",
  33619988: "Gunner", 33619989: "Mad Gatling", 33619990: "Death Gatling",
  33620551: "Hades Gatling",
  // wty=3 RocketMan
  33619991: "Rocket", 33619997: "Rocket", 33619998: "Rocket",
  33619999: "Rocket", 33620000: "Pyromaster", 33620546: "Fanatic Term.",
  // wty=4 Sniper
  33620001: "Sniper", 33620003: "Sniper", 33620004: "Sniper",
  33620005: "Sniper", 33620006: "Cobra Sniper", 33620547: "Eagle Eye",
  // wty=5 FlameCar
  33620007: "Tank", 33620008: "Tank", 33620009: "Tank",
  33620010: "Blaze Tank", 33620011: "Death Tank", 33620012: "Hell Tank",
  33620552: "Destruct. Tank",
  // wty=6 Cannon
  33620013: "Cannon", 33620014: "Cannon", 33620015: "Cannon",
  33620016: "Flame Cannon", 33620017: "Uranium Cannon", 33620018: "Doomsday C.",
  33620555: "Death Cannon",
  // wty=7 FightCar
  33620019: "Shredder", 33620020: "Shredder", 33620021: "Shredder",
  33620022: "War Shredder", 33620023: "Wasteland K.", 33620548: "Hell King",
  // wty=8 Moto
  33620024: "Biker", 33620025: "Biker", 33620026: "Biker",
  33620027: "Swift Raider", 33620028: "Storm Raider", 33620549: "Demon Raider",
  // wty=9 ArmorMan
  33620029: "Armored Sol.", 33620030: "Heavy Armor",
  33620031: "Ult. Armored", 33620032: "Ultima Armor",
  // wty=10 LaserGun
  33620033: "EMP Cannon", 33620034: "Enh. EMP",
  33620035: "Supreme EMP", 33620036: "Ultima EMP",
  // wty=11 TeslaMan
  33620037: "Storm Trp.", 33620038: "Sup. Storm Trp.",
  33620039: "Havoc Storm", 33620040: "Havoc Domin.",
  33620553: "Havoc Breaker",
  // wty=12 ShieldCar
  33620041: "Shielder", 33620042: "Adv. Shielder",
  33620043: "Supreme Shield", 33620044: "Light E. Shield",
  33620554: "Immortal Shield",
  // wty=70 BioTech
  33620449: "Bio Zombie", 33620365: "Bio Zombie", 33620368: "Bio Zombie",
  33620369: "Bio Zombie", 33620370: "Bio Zombie", 33620371: "Bio Zombie",
  33620372: "Bio Zombie", 33620373: "Bio Zombie", 33620556: "Bio Zombie",
  33620557: "Bio Zombie",
  // Special — no GIDs, resolved by wtype fallback
};

// wtype fallback when GID is missing or not in table
const WTYPE_DISPLAY_NAMES = {
  1: "Infantry", 2: "Gunner", 3: "Rocket", 4: "Sniper",
  5: "Tank", 6: "Cannon", 7: "Shredder", 8: "Raider",
  9: "Armored", 10: "EMP Cannon", 11: "Storm Trp.", 12: "Shielder",
  20: "Empress", 21: "Source Spirit", 66: "Warplane", 67: "Robot Bot", 70: "Bio Zombie",
};

// Attack range per warrior type (engine coordinate units, from ServerConfig `atr`)
const WTYPE_ATTACK_RANGE = {
  1: 0.25,   // Infantry — melee
  2: 2.25,   // Gunner
  3: 2.50,   // Rocket
  4: 3.75,   // Sniper
  5: 1.00,   // Tank
  6: 4.00,   // Cannon
  7: 0.50,   // Shredder — melee
  8: 2.00,   // Raider
  9: 0.50,   // Armored — melee
  10: 3.50,  // EMP Cannon
  11: 2.25,  // Storm Trooper
  12: 3.75,  // Shielder
  20: 6.00,  // Empress (Titan)
  21: 6.00,  // Bison (Titan)
  66: 7.50,  // Warplane
  67: 1.00,  // Robot Bot
  70: 2.50,  // Bio Zombie
};

/** Resolve a warrior snapshot to its English display name. */
function getWarriorDisplayName(w) {
  if (w.gid && GID_TROOP_NAMES[w.gid]) return GID_TROOP_NAMES[w.gid];
  return WTYPE_DISPLAY_NAMES[w.wtype] || w.name || `wt${w.wtype}`;
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 2, 4, 10];
const ZOOM_OPTIONS = [1, 1.5, 2, 3];

// ── Kill attribution display ───────────────────────────────────────────────
// Mirror of kill_tracker.py SOURCE_TAG_DISPLAY (official English in-game names)
const SOURCE_TAG_DISPLAY = {
  troop_normal:          'Normal Attacks',
  troop_skill:           'Troop Skills',
  titan_normal:          'Titan (normal)',
  titan_blood:           'Bloodfeast',
  titan_tail:            'Symbiotic Tail',
  titan_laser:           'Destroy Ray',
  titan_ruin:            'Destructive Lightning',
  // Compound titan keys: titan_<wtype>_<tag>
  titan_20_titan_normal: 'Normal',
  titan_20_titan_blood:  'Bloodfeast',
  titan_20_titan_tail:   'Symbiotic Tail',
  titan_21_titan_normal: 'Normal',
  titan_21_titan_laser:  'Destroy Ray',
  titan_21_titan_ruin:   'Destructive Lightning',
  warplane_normal:       'Normal',
  warplane_attack2more:  'High-Speed Charge',
  warplane_locklaser:    'Ultrapulse Laser',
  warplane_msbomb:       'Tactical Missile',
  warplane_kineticcannon:'Kinetic Machine Gun',
  warplane_heatcannon:   'Thermal Energy Machine Gun',
  warplane_stormbomb:    'Storm Bomb',
  hero_airstrike:        'Air Support',
  hero_empbomb:          'EMP Bomb',
  hero_doubleattack:     'Rapid Strike',
  hero_4subdamage:       'Tactical Block',
  hero_execute:          'Weakness Blitz',
  hero_singletarget:     'Rocket',
  hero_energyprison:     'Energy Prison',
  hero_aoeblast:         'Energy Blade',
  hero_focusedstrikes:   'Tracking Missile',
  hero_periodic_single:  'Rocket Turret',
  hero_multihit:         'Nano Swarm',
  hero_twotarget_midback:'Battlefield Forte',
  biotech_powerattack:   'Biochemical Zombie',
  dot:                   'DoT (burn/poison)',
  tower:                 'Defense Tower',
  gamemode:              'Game Mode Spells',
  update_spell:          'Troop Skills',
  armor_skill:           'Armor Skills',
  reflect:               'Reflect Damage',
  unknown:               'Unknown',
};

// Ordered groups for display
// troops group has no static tags — rows are built dynamically from wty_* keys
const KILL_GROUPS = [
  { key: 'troops',  label: 'Troops',      tags: [] },
  { key: 'hero',    label: 'Officer Breakthrough Skills', tags: ['hero_airstrike', 'hero_empbomb', 'hero_doubleattack',
      'hero_4subdamage', 'hero_execute', 'hero_singletarget', 'hero_energyprison',
      'hero_aoeblast', 'hero_focusedstrikes', 'hero_periodic_single',
      'hero_multihit', 'hero_twotarget_midback'] },
  { key: 'empress', label: 'Empress',     tags: ['titan_20_titan_normal', 'titan_20_titan_blood', 'titan_20_titan_tail'], alwaysSplit: true },
  { key: 'bison',   label: 'Source Spirit', tags: ['titan_21_titan_normal', 'titan_21_titan_laser', 'titan_21_titan_ruin'], alwaysSplit: true },
  { key: 'wp',      label: 'Warplane',    tags: ['warplane_normal', 'warplane_attack2more', 'warplane_locklaser',
      'warplane_msbomb', 'warplane_kineticcannon', 'warplane_heatcannon', 'warplane_stormbomb'] },
  { key: 'other',   label: 'Other',       tags: ['dot', 'tower', 'gamemode', 'update_spell', 'armor_skill', 'reflect', 'unknown', 'hero_unknown'] },
];

function BattleReplay({ externalReplay, onReplayLoad }) {
  // ── State ──
  const [replay, setReplay] = useState(null);       // parsed replay JSON
  const [frame, setFrame] = useState(0);             // current frame index into replay.frames[]
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);  // warrior id under cursor
  const [selectedId, setSelectedId] = useState(null); // clicked warrior
  const [zoom, setZoom] = useState(1);               // camera zoom level
  const [autoFit, setAutoFit] = useState(true);       // auto-fit to warrior bounding box

  const canvasRef = useRef(null);
  const animRef = useRef(null);        // requestAnimationFrame id
  const lastTickRef = useRef(0);       // timestamp of last frame advance
  const frameRef = useRef(0);          // mirror of `frame` for rAF closure

  // Keep frameRef synced
  useEffect(() => { frameRef.current = frame; }, [frame]);

  // ── Kill attribution — aggregate all damage events across the full replay ──
  const killsByTag = useMemo(() => {
    if (!replay) return { atk: {}, def: {} };
    const byTag = { atk: {}, def: {} };  // side → key → pop killed
    for (let i = 0; i <= frame; i++) {
      const fr = replay.frames[i];
      if (!fr?.events) continue;
      for (const ev of fr.events) {
        if (ev.type !== 'damage' || !(ev.kills_pop ?? ev.kills) || (ev.kills_pop ?? ev.kills) <= 0) continue;
        // Exclude kills ON Robot Bots (wtype=67) — mid-battle Warplane spawns that
        // are not part of either side's initial army population.
        if (ev.target_wtype === 67) continue;
        const pop  = ev.kills_pop ?? ev.kills;
        // Use explicit source_side when available (set by frame_recorder for all
        // damage paths including sourceless hero spells like Airstrike/EMPBomb).
        // Fall back to source_id prefix for older replays without source_side.
        const side = ev.source_side ?? (ev.source_id?.startsWith('atk') ? 'atk' : 'def');
        const tag  = ev.source_tag || (ev.damage_type === 'hero_spell' ? 'hero_unknown' : 'troop_normal');
        // Troop normal + skill + biotech: aggregate by wtype so each troop type is its own row
        const isTroop  = tag === 'troop_normal' || tag === 'troop_skill' || tag === 'biotech_powerattack';
        // Titan spells: compound key to separate Empress (20) from Bison (21)
        const isTitan  = tag.startsWith('titan_');
        const key = isTroop  ? `wty_${ev.source_wtype ?? 0}`
                  : isTitan  ? `titan_${ev.source_wtype ?? 0}_${tag}`
                  : tag;
        byTag[side][key] = (byTag[side][key] || 0) + pop;
      }
    }
    return byTag;
  }, [replay, frame]);

  // ── Load from external sim result (live Run Sim) ──
  useEffect(() => {
    if (!externalReplay?.version || !externalReplay?.frames?.length) return;
    setReplay(externalReplay);
    setFrame(0);
    setPlaying(false);
    setSelectedId(null);
    setHoveredId(null);
    onReplayLoad?.(externalReplay);
  }, [externalReplay]);

  // ── Auto-load bundled replay on mount ──
  useEffect(() => {
    fetch("/masahide_umine_replay.json", { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.version && data?.frames?.length) {
          setReplay(data);
          setFrame(0);
          onReplayLoad?.(data);
        }
      })
      .catch(() => {});
  }, []);

  // ── Playback loop ──
  useEffect(() => {
    if (!playing || !replay) return;
    const msPerFrame = 1000 / (50 * speed);  // 50 FPS base
    lastTickRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - lastTickRef.current;
      if (elapsed >= msPerFrame) {
        const advance = Math.floor(elapsed / msPerFrame);
        const next = Math.min(frameRef.current + advance, replay.frames.length - 1);
        setFrame(next);
        lastTickRef.current += advance * msPerFrame;
        if (next >= replay.frames.length - 1) {
          setPlaying(false);
          return;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [playing, speed, replay]);

  // ── Canvas rendering ──
  const currentFrame = replay?.frames?.[frame];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentFrame || !replay) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const grid = replay.meta.grid;  // { cols: 18, rows: 32 }

    // Coordinate mapping: engine (0–cols, 0–rows) → canvas pixels
    const padX = 30, padY = 20;
    const warriors = currentFrame.warriors;

    // Determine visible region in engine coords
    let viewMinX = 0, viewMaxX = grid.cols, viewMinY = 0, viewMaxY = grid.rows;

    if (autoFit && warriors.length > 0) {
      // Auto-fit: bounding box of all warriors + padding
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const w of warriors) {
        if (w.x < minX) minX = w.x;
        if (w.x > maxX) maxX = w.x;
        if (w.y < minY) minY = w.y;
        if (w.y > maxY) maxY = w.y;
      }
      const padEngX = 2.5, padEngY = 2.5;
      viewMinX = Math.max(0, minX - padEngX);
      viewMaxX = Math.min(grid.cols, maxX + padEngX);
      viewMinY = Math.max(0, minY - padEngY);
      viewMaxY = Math.min(grid.rows, maxY + padEngY);
      // Enforce minimum visible range so it doesn't zoom insanely tight
      const minSpan = 6;
      if (viewMaxX - viewMinX < minSpan) { const cx = (viewMinX + viewMaxX) / 2; viewMinX = cx - minSpan / 2; viewMaxX = cx + minSpan / 2; }
      if (viewMaxY - viewMinY < minSpan) { const cy = (viewMinY + viewMaxY) / 2; viewMinY = cy - minSpan / 2; viewMaxY = cy + minSpan / 2; }
    } else if (zoom > 1 && warriors.length > 0) {
      // Manual zoom: center on warrior centroid
      const centX = warriors.reduce((s, w) => s + w.x, 0) / warriors.length;
      const centY = warriors.reduce((s, w) => s + w.y, 0) / warriors.length;
      const visW = grid.cols / zoom;
      const visH = grid.rows / zoom;
      viewMinX = Math.max(0, Math.min(centX - visW / 2, grid.cols - visW));
      viewMaxX = viewMinX + visW;
      viewMinY = Math.max(0, Math.min(centY - visH / 2, grid.rows - visH));
      viewMaxY = viewMinY + visH;
    }

    const visW = viewMaxX - viewMinX;
    const visH = viewMaxY - viewMinY;
    // Uniform scale — same px/unit on both axes so the grid is never squished.
    // Use the smaller of the two available scales (the "tight" dimension drives it).
    const s = Math.min((W - padX * 2) / visW, (H - padY * 2) / visH);
    // Center the rendered grid within the canvas
    const offX = (W - visW * s) / 2;
    const offY = (H - visH * s) / 2;
    const toX = (ex) => offX + (ex - viewMinX) * s;
    // Flip Y so ATK is at bottom, DEF at top
    const toY = (ey) => offY + (viewMaxY - ey) * s;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Background — dark tactical
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 0.5;
    for (let gx = Math.ceil(viewMinX); gx <= Math.floor(viewMaxX); gx++) {
      const px = toX(gx);
      ctx.beginPath(); ctx.moveTo(px, padY); ctx.lineTo(px, H - padY); ctx.stroke();
    }
    for (let gy = Math.ceil(viewMinY); gy <= Math.floor(viewMaxY); gy++) {
      const py = toY(gy);
      ctx.beginPath(); ctx.moveTo(padX, py); ctx.lineTo(W - padX, py); ctx.stroke();
    }

    // Midfield line
    const midY = toY(grid.rows / 2);
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(padX, midY);
    ctx.lineTo(W - padX, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Row zone labels
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#14b8a6";
    ctx.fillText("DEF", padX, 14);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("ATK", padX, H - 6);

    // ── Attack lines (draw before warriors so they appear behind) ──
    for (const w of currentFrame.warriors) {
      if (w.state === "attack" && w.target_id) {
        const target = currentFrame.warriors.find(t => t.id === w.target_id);
        if (target) {
          ctx.strokeStyle = w.side === "atk" ? "rgba(239,68,68,0.4)" : "rgba(20,184,166,0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(toX(w.x), toY(w.y));
          ctx.lineTo(toX(target.x), toY(target.y));
          ctx.stroke();
        }
      }
    }

    // Build target lookup for highlight
    const targetLookup = {};
    for (const w of currentFrame.warriors) {
      if (w.target_id) {
        if (!targetLookup[w.target_id]) targetLookup[w.target_id] = [];
        targetLookup[w.target_id].push(w.id);
      }
    }

    // ── Warriors ──
    for (const w of currentFrame.warriors) {
      const cx = toX(w.x);
      const cy = toY(w.y);

      // Fixed radius — same size for all units
      const r = 14;

      // Base color
      const baseColor = WTYPE_COLORS[w.wtype] || (w.side === "atk" ? "#b45309" : "#991b1b");

      // Highlight on hover/select
      const isHovered = hoveredId === w.id;
      const isSelected = selectedId === w.id;
      const isTargetOfSelected = selectedId && targetLookup[w.id]?.includes(selectedId);
      const isMyTarget = selectedId === w.target_id;

      // Draw circle — dark fill, colored ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = w.side === "atk" ? "#1c0808" : "#081c1a";
      ctx.fill();

      // Colored ring border
      if (isSelected) {
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 3;
        // Glow effect for selected
        ctx.shadowColor = "#eab308";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (isHovered) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else if (isTargetOfSelected || isMyTarget) {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Side indicator — outer glow ring
      if (w.side === "def") {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(20,184,166,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(239,68,68,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Shield indicator (blue arc)
      if (w.shield > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 1, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 0.5);
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label: in-game troop name above circle
      const displayName = getWarriorDisplayName(w);
      ctx.fillStyle = "#a3a3a3";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(displayName, cx, cy - r - 5);

      // Inside circle: HP% for heroes (Empress/Bison/Warplane), troop count for rest
      const isHero = [20, 21, 66].includes(w.wtype);
      let innerTxt;
      if (isHero) {
        innerTxt = Math.round(w.hp_pct * 100) + "%";
      } else {
        const cnt = Math.round(w.count);
        innerTxt = cnt >= 1000 ? Math.round(cnt / 1000) + "k" : String(cnt);
      }
      ctx.fillStyle = "#e5e5e5";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(innerTxt, cx, cy);
      ctx.textBaseline = "alphabetic";

      // HP bar below circle
      const barW = r * 2;
      const barH = 3;
      const barX = cx - r;
      const barY = cy + r + 2;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(barX, barY, barW, barH);
      if (w.hp_pct > 0) {
        ctx.fillStyle = w.hp_pct > 0.5 ? "#22c55e" : w.hp_pct > 0.25 ? "#eab308" : "#ef4444";
        ctx.fillRect(barX, barY, barW * w.hp_pct, barH);
      }

      // Faint/stun indicator
      if (w.state === "faint") {
        ctx.fillStyle = "rgba(234,179,8,0.8)";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("✦", cx + r, cy - r);
      }
    }

    // ── Attack range box for selected unit ──
    // Engine uses a per-axis Chebyshev check on EDGE-to-edge distance:
    //   dx = |target.x - self.x| - self.half_size - target.half_size  ≤  atr
    // All warriors have half_size = 0.5, so the effective center-to-center reach
    // on each axis is:  atr + 0.5 + 0.5 = atr + 1.0 engine units.
    // This produces an axis-aligned SQUARE, not a circle.
    if (selectedId) {
      const sel = currentFrame.warriors.find(w => w.id === selectedId);
      if (sel) {
        const atr = WTYPE_ATTACK_RANGE[sel.wtype];
        if (atr != null) {
          const sx = toX(sel.x);
          const sy = toY(sel.y);
          const halfSide = (atr + 1.0) * s;  // px — includes both warriors' half_size=0.5
          const sideColor = sel.side === "atk" ? "239,68,68" : "20,184,166";

          // Filled area
          ctx.fillStyle = `rgba(${sideColor},0.06)`;
          ctx.fillRect(sx - halfSide, sy - halfSide, halfSide * 2, halfSide * 2);

          // Dashed border
          ctx.setLineDash([6, 4]);
          ctx.strokeStyle = `rgba(${sideColor},0.45)`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(sx - halfSide, sy - halfSide, halfSide * 2, halfSide * 2);
          ctx.setLineDash([]);
        }
      }
    }

    // Event flash: death notices only
    if (currentFrame.events) {
      let evY = 30;
      for (const ev of currentFrame.events.slice(0, 5)) {
        if (ev.type === "death") {
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "right";
          ctx.fillText(`☠ ${ev.warrior_id}`, W - 8, evY);
          evY += 11;
        }
      }
    }
  }, [currentFrame, replay, hoveredId, selectedId, zoom, autoFit]);

  // ── Mouse interaction ──
  const handleCanvasMove = useCallback((e) => {
    if (!canvasRef.current || !currentFrame || !replay) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    const grid = replay.meta.grid;
    const W = canvas.width, H = canvas.height;
    const padX = 30, padY = 20;
    const warriors = currentFrame.warriors;

    // Replicate the same view region logic as the renderer
    let viewMinX = 0, viewMaxX = grid.cols, viewMinY = 0, viewMaxY = grid.rows;
    if (autoFit && warriors.length > 0) {
      let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
      for (const w of warriors) { if (w.x < mnX) mnX = w.x; if (w.x > mxX) mxX = w.x; if (w.y < mnY) mnY = w.y; if (w.y > mxY) mxY = w.y; }
      const pe = 2.5;
      viewMinX = Math.max(0, mnX - pe); viewMaxX = Math.min(grid.cols, mxX + pe);
      viewMinY = Math.max(0, mnY - pe); viewMaxY = Math.min(grid.rows, mxY + pe);
      const minSpan = 6;
      if (viewMaxX - viewMinX < minSpan) { const c = (viewMinX + viewMaxX) / 2; viewMinX = c - minSpan / 2; viewMaxX = c + minSpan / 2; }
      if (viewMaxY - viewMinY < minSpan) { const c = (viewMinY + viewMaxY) / 2; viewMinY = c - minSpan / 2; viewMaxY = c + minSpan / 2; }
    } else if (zoom > 1 && warriors.length > 0) {
      const centX = warriors.reduce((s, w) => s + w.x, 0) / warriors.length;
      const centY = warriors.reduce((s, w) => s + w.y, 0) / warriors.length;
      const vw = grid.cols / zoom, vh = grid.rows / zoom;
      viewMinX = Math.max(0, Math.min(centX - vw / 2, grid.cols - vw)); viewMaxX = viewMinX + vw;
      viewMinY = Math.max(0, Math.min(centY - vh / 2, grid.rows - vh)); viewMaxY = viewMinY + vh;
    }
    const visW = viewMaxX - viewMinX, visH = viewMaxY - viewMinY;
    const s = Math.min((W - padX * 2) / visW, (H - padY * 2) / visH);
    const offX = (W - visW * s) / 2;
    const offY = (H - visH * s) / 2;
    const toX = (ex) => offX + (ex - viewMinX) * s;
    const toY = (ey) => offY + (viewMaxY - ey) * s;

    let found = null;
    for (const w of warriors) {
      const dx = mx - toX(w.x);
      const dy = my - toY(w.y);
      if (dx * dx + dy * dy < 400) { found = w.id; break; }
    }
    setHoveredId(found);
  }, [currentFrame, replay, autoFit, zoom]);

  const handleCanvasClick = useCallback(() => {
    setSelectedId(hoveredId);
  }, [hoveredId]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    if (!replay) return;
    const onKey = (e) => {
      if (e.key === " " || e.key === "k") { e.preventDefault(); setPlaying(p => !p); }
      if (e.key === "ArrowRight") { e.preventDefault(); setFrame(f => Math.min(f + 1, replay.frames.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setFrame(f => Math.max(f - 1, 0)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setFrame(f => Math.min(f + 50, replay.frames.length - 1)); }
      if (e.key === "ArrowDown") { e.preventDefault(); setFrame(f => Math.max(f - 50, 0)); }
      if (e.key === "Home") { e.preventDefault(); setFrame(0); }
      if (e.key === "End") { e.preventDefault(); setFrame(replay.frames.length - 1); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [replay]);

  // ── Tooltip data ──
  const hoveredWarrior = currentFrame?.warriors?.find(w => w.id === hoveredId);
  const selectedWarrior = currentFrame?.warriors?.find(w => w.id === selectedId);


  // ── Render ──

  // No replay loaded — show file input
  if (!replay) {
    return (
      <div className="flex-1 min-w-0 border border-neutral-800 bg-[#0a0a0a] sticky top-20 self-start" style={{ minHeight: "70vh" }}>
        <div className="flex flex-col items-center justify-center h-full" style={{ minHeight: "70vh" }}>
          <Swords size={32} className="text-neutral-700 mb-3" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
            Battle Replay
          </span>
          <span className="font-mono text-[9px] text-neutral-600">
            Use the Load button in the toolbar to load a replay JSON
          </span>
        </div>
      </div>
    );
  }

  const totalFrames = replay.frames.length;
  const cf = currentFrame;

  return (
    <div className="flex-1 min-w-0 border border-neutral-800 bg-[#0a0a0a] sticky top-20 self-start flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-[#0d0d0d]">
        <div className="flex items-center gap-3">
          <Swords size={12} className="text-amber-600" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
            Battle Replay
          </span>
          <span className={`font-mono text-[10px] font-bold ${replay.meta.winner === "attacker" ? "text-red-400" : "text-teal-400"}`}>
            {(replay.meta.winner === "attacker" ? "ATK" : replay.meta.winner === "defender" ? "DEF" : replay.meta.winner?.toUpperCase())} WINS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-neutral-500">
            F<span className="text-neutral-300">{cf?.frame || 0}</span> / {replay.meta.total_frames}
          </span>
          <span className="font-mono text-[9px] text-neutral-500">
            <span className="text-neutral-300">{(cf?.time_s || 0).toFixed(1)}s</span> / {replay.meta.duration_s.toFixed(1)}s
          </span>
          {replay.meta.rng_final != null && (
            <span className="font-mono text-[8px] text-neutral-600" title="RNG final state">
              RNG:{replay.meta.rng_final}
            </span>
          )}
        </div>
      </div>

      {/* Canvas — portrait 18:32 grid, no axis squish */}
      <div className="relative flex-1 flex justify-center items-start">
        <canvas
          ref={canvasRef}
          width={400}
          height={660}
          className="max-h-[80vh] w-auto block"
          style={{ imageRendering: "auto" }}
          onMouseMove={handleCanvasMove}
          onClick={handleCanvasClick}
        />

        {/* Tooltip */}
        {hoveredWarrior && (
          <div className="absolute top-2 left-2 border border-neutral-700 bg-[#111]/95 backdrop-blur-sm px-3 py-2 font-mono text-[9px] z-10 pointer-events-none min-w-[160px]">
            <div className="flex items-center justify-between gap-3 mb-1 pb-1 border-b border-neutral-800">
              <span className="font-bold text-neutral-200">{getWarriorDisplayName(hoveredWarrior)}</span>
              <span className={`text-[8px] px-1 py-0.5 ${hoveredWarrior.side === "atk" ? "text-red-400 bg-red-950/50 border border-red-900/50" : "text-teal-400 bg-teal-950/50 border border-teal-900/50"}`}>
                {hoveredWarrior.side.toUpperCase()}
              </span>
            </div>
            <div className="text-neutral-500 space-y-0.5">
              <div>wtype: <span className="text-neutral-300">{hoveredWarrior.wtype}</span> · row: <span className="text-neutral-300">{hoveredWarrior.row}</span></div>
              <div>count: <span className="text-neutral-300">{fmt(Math.round(hoveredWarrior.count))}</span> / {fmt(Math.round(hoveredWarrior.initial_count))}</div>
              <div>hp: <span className={hoveredWarrior.hp_pct > 0.5 ? "text-green-400" : hoveredWarrior.hp_pct > 0.25 ? "text-yellow-400" : "text-red-400"}>{(hoveredWarrior.hp_pct * 100).toFixed(1)}%</span>
                {hoveredWarrior.shield > 0 && <span> · shield: <span className="text-blue-400">{fmt(Math.round(hoveredWarrior.shield))}</span></span>}
              </div>
              <div>state: <span className="text-neutral-300">{hoveredWarrior.state}</span>
                {hoveredWarrior.target_id && <span className="text-amber-500"> → {hoveredWarrior.target_id}</span>}
              </div>
              <div className="text-neutral-600">pos: ({hoveredWarrior.x}, {hoveredWarrior.y})</div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-neutral-800 bg-[#0d0d0d] px-3 py-2">
        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={frame}
          onChange={(e) => setFrame(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
        {/* Buttons */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <button onClick={() => setFrame(0)}
              className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-500 hover:text-neutral-200 font-mono text-[9px] transition-colors"
              title="First frame (Home)">⏮</button>
            <button onClick={() => setFrame(f => Math.max(f - 50, 0))}
              className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-500 hover:text-neutral-200 font-mono text-[9px] transition-colors"
              title="Back 50 frames (↓)">◀◀</button>
            <button onClick={() => setFrame(f => Math.max(f - 1, 0))}
              className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-500 hover:text-neutral-200 font-mono text-[9px] transition-colors"
              title="Back 1 frame (←)">◀</button>
            <button onClick={() => setPlaying(p => !p)}
              className="h-7 px-4 flex items-center justify-center border border-amber-700/60 hover:border-amber-600 bg-amber-950/40 hover:bg-amber-950/60 text-amber-500 font-mono text-[10px] font-bold transition-colors"
              title="Play/Pause (Space)">
              {playing ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
            <button onClick={() => setFrame(f => Math.min(f + 1, totalFrames - 1))}
              className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-500 hover:text-neutral-200 font-mono text-[9px] transition-colors"
              title="Forward 1 frame (→)">▶</button>
            <button onClick={() => setFrame(f => Math.min(f + 50, totalFrames - 1))}
              className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-500 hover:text-neutral-200 font-mono text-[9px] transition-colors"
              title="Forward 50 frames (↑)">▶▶</button>
            <button onClick={() => setFrame(totalFrames - 1)}
              className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-500 hover:text-neutral-200 font-mono text-[9px] transition-colors"
              title="Last frame (End)">⏭</button>
          </div>

          {/* Zoom selector */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-neutral-600 uppercase mr-1">Zoom</span>
            <button onClick={() => { setAutoFit(true); setZoom(1); }}
              className={`h-5 px-1.5 font-mono text-[8px] border transition-colors ${
                autoFit
                  ? "border-amber-700/60 bg-amber-950/50 text-amber-500"
                  : "border-neutral-700 text-neutral-600 hover:border-neutral-500 hover:text-neutral-300"
              }`}>
              Auto
            </button>
            {ZOOM_OPTIONS.map(z => (
              <button key={z} onClick={() => { setAutoFit(false); setZoom(z); }}
                className={`h-5 px-1.5 font-mono text-[8px] border transition-colors ${
                  !autoFit && zoom === z
                    ? "border-amber-700/60 bg-amber-950/50 text-amber-500"
                    : "border-neutral-700 text-neutral-600 hover:border-neutral-500 hover:text-neutral-300"
                }`}>
                {z}x
              </button>
            ))}
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-neutral-600 uppercase mr-1">Speed</span>
            {SPEED_OPTIONS.map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`h-5 px-1.5 font-mono text-[8px] border transition-colors ${
                  speed === s
                    ? "border-amber-700/60 bg-amber-950/50 text-amber-500"
                    : "border-neutral-700 text-neutral-600 hover:border-neutral-500 hover:text-neutral-300"
                }`}>
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected warrior detail bar */}
      {selectedWarrior && (
        <div className="border-t border-neutral-800 bg-[#111] px-3 py-2 flex items-center gap-4 font-mono text-[9px]">
          <span className={`font-bold text-[10px] ${selectedWarrior.side === "atk" ? "text-red-400" : "text-teal-400"}`}>
            {getWarriorDisplayName(selectedWarrior)}
          </span>
          <span className="text-neutral-400">
            <span className="text-neutral-200">{fmt(Math.round(selectedWarrior.count))}</span> / {fmt(Math.round(selectedWarrior.initial_count))} troops
          </span>
          <span className={selectedWarrior.hp_pct > 0.5 ? "text-green-400" : selectedWarrior.hp_pct > 0.25 ? "text-yellow-400" : "text-red-400"}>
            HP {(selectedWarrior.hp_pct * 100).toFixed(1)}%
          </span>
          <span className="text-neutral-500 uppercase">
            {selectedWarrior.state}
          </span>
          {selectedWarrior.target_id && (
            <span className="text-amber-500/70">
              → {currentFrame.warriors.find(w => w.id === selectedWarrior.target_id)?.name || selectedWarrior.target_id}
            </span>
          )}
          <button onClick={() => setSelectedId(null)}
            className="ml-auto text-neutral-600 hover:text-neutral-300 transition-colors">
            <X size={10} />
          </button>
        </div>
      )}

      {/* ── Kill Attribution ── */}
      {replay && (
        <div className="border-t border-neutral-800 bg-[#0a0a0a] px-3 py-3 space-y-4">

          {/* ── By source (spell / skill category) ── */}
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-300 mb-2">Kills by Source</div>
            <div className="grid grid-cols-2 gap-4">
              {['atk', 'def'].map(side => {
                const tags    = killsByTag[side];
                const total   = Object.values(tags).reduce((s, v) => s + v, 0);
                const accent  = side === 'atk' ? 'bg-red-600/60' : 'bg-teal-600/60';
                // Stable troop list from meta, sorted by initial_pop desc so order never changes
                const metaGroups = (replay.meta[side === 'atk' ? 'attacker' : 'defender']?.groups ?? [])
                  .filter(g => g.wtype !== 67)
                  .sort((a, b) => b.initial_pop - a.initial_pop);
                return (
                  <div key={side}>
                    <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${side === 'atk' ? 'text-red-400' : 'text-teal-400'}`}>
                      {side === 'atk' ? '⚔ ATK' : '🛡 DEF'}
                      <span className="text-neutral-500 ml-2 normal-case tracking-normal">{fmt(Math.round(total))}</span>
                    </div>
                    <div className="space-y-0.5">
                      {KILL_GROUPS.map(grp => {
                        // Troops group: stable list from meta, values from live tags
                        if (grp.key === 'troops') {
                          const grpTotal = metaGroups.reduce((s, g) => s + (tags[`wty_${g.wtype}`] || 0), 0);
                          const pct = total > 0 ? Math.min(100, (grpTotal / total) * 100) : 0;
                          return (
                            <div key={grp.key}>
                              <div className="flex items-center gap-1.5 py-0.5">
                                <div className="flex-1 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{grp.label}</div>
                                <div className="font-mono text-[10px] text-neutral-200 tabular-nums w-16 text-right">{fmt(Math.round(grpTotal))}</div>
                                <div className="w-16 bg-neutral-800 h-1.5 rounded-sm overflow-hidden shrink-0">
                                  <div className={`h-full rounded-sm ${accent}`} style={{ width: `${pct.toFixed(1)}%` }} />
                                </div>
                              </div>
                              {metaGroups.map(g => {
                                const val  = tags[`wty_${g.wtype}`] || 0;
                                const name = WTYPE_DISPLAY_NAMES[g.wtype] || `wt${g.wtype}`;
                                return (
                                  <div key={g.wtype} className="flex items-center gap-1 pl-3 py-px">
                                    <div className="flex-1 font-mono text-[10px] text-neutral-400 truncate">{name}</div>
                                    <div className="font-mono text-[10px] text-neutral-300 tabular-nums w-16 text-right">{fmt(Math.round(val))}</div>
                                    <div className="w-16 bg-neutral-800 h-1 rounded-sm overflow-hidden shrink-0">
                                      <div className={`h-full rounded-sm ${accent} opacity-60`}
                                        style={{ width: `${grpTotal > 0 ? Math.min(100, (val / grpTotal) * 100).toFixed(1) : 0}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        // All other groups: static tag list — always rendered with all sub-rows
                        const grpTotal = grp.tags.reduce((s, t) => s + (tags[t] || 0), 0);
                        const pct      = total > 0 ? Math.min(100, (grpTotal / total) * 100) : 0;
                        return (
                          <div key={grp.key}>
                            {/* Group header — always visible */}
                            <div className="flex items-center gap-1.5 py-0.5">
                              <div className="flex-1 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{grp.label}</div>
                              <div className="font-mono text-[10px] text-neutral-200 tabular-nums w-16 text-right">{fmt(Math.round(grpTotal))}</div>
                              <div className="w-16 bg-neutral-800 h-1.5 rounded-sm overflow-hidden shrink-0">
                                <div className={`h-full rounded-sm ${accent}`} style={{ width: `${pct.toFixed(1)}%` }} />
                              </div>
                            </div>
                            {/* Sub-rows: only show tags with actual kills */}
                            {grp.tags.map(t => {
                              const val = tags[t] || 0;
                              if (val === 0) return null;
                              return (
                              <div key={t} className="flex items-center gap-1 pl-3 py-px">
                                <div className="flex-1 font-mono text-[10px] text-neutral-400 truncate">{SOURCE_TAG_DISPLAY[t] || t}</div>
                                <div className="font-mono text-[10px] text-neutral-300 tabular-nums w-16 text-right">{fmt(Math.round(val))}</div>
                                <div className="w-16 bg-neutral-800 h-1 rounded-sm overflow-hidden shrink-0">
                                  <div className={`h-full rounded-sm ${accent} opacity-60`}
                                    style={{ width: `${grpTotal > 0 ? Math.min(100, (val / grpTotal) * 100).toFixed(1) : 0}%` }} />
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
// ─── Sim result sub-components ────────────────────────────────────────────────

function SurvivorTable({ title, warriors, accent }) {
  if (!warriors?.length) return (
    <div className="flex items-center justify-center h-16 font-mono text-[10px] text-neutral-700 tracking-[0.2em] uppercase">
      — wiped out —
    </div>
  );
  const total = warriors.reduce((s, w) => s + w.pop_count, 0);
  const textAccent = accent === "amber" ? "text-amber-600" : "text-teal-600";
  return (
    <div>
      <div className={`font-mono text-[9px] tracking-[0.25em] uppercase mb-1.5 ${textAccent}`}>
        {title} · <span className="text-neutral-300">{total.toLocaleString()}</span> pop
      </div>
      <table className="w-full font-mono text-[10px] border-collapse">
        <thead>
          <tr className="text-neutral-600 border-b border-neutral-800">
            <th className="text-left py-0.5 pr-3 font-normal">wtype</th>
            <th className="text-right py-0.5 pr-3 font-normal">count</th>
            <th className="text-right py-0.5 pr-3 font-normal">×pop</th>
            <th className="text-right py-0.5 font-normal">pop total</th>
          </tr>
        </thead>
        <tbody>
          {warriors.map((w, i) => (
            <tr key={i} className="border-b border-neutral-900/60 text-neutral-400 hover:bg-neutral-800/20">
              <td className="py-0.5 pr-3">wty={w.wtype}</td>
              <td className="text-right pr-3">{Math.round(w.count).toLocaleString()}</td>
              <td className="text-right pr-3 text-neutral-600">×{w.pop}</td>
              <td className="text-right text-neutral-200">{w.pop_count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function UmineBattleConsole() {
  const [state, setState] = useState(() => clone(INITIAL_DATA));
  const [showPayload, setShowPayload] = useState(false);
  const [toast, setToast] = useState(null);
  // Level→value lookup tables from replay meta: { atk: {gid: [...]}, def: {gid: [...]} }
  const [lvVals, setLvVals] = useState({ atk: {}, def: {} });

  const SIM_SERVER = import.meta.env.VITE_SIM_SERVER ?? "http://localhost:5000";
  const [simResult, setSimResult] = useState(null);
  const [simReplay, setSimReplay] = useState(null);
  const [simRunning, setSimRunning] = useState(false);
  const [simError, setSimError] = useState(null);

  // Server replay browser
  const [showServerBrowser, setShowServerBrowser] = useState(false);
  const [serverReplays, setServerReplays] = useState([]);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverSaving, setServerSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");

  const report = useMemo(() => buildReport(state), [state]);
  const reportJson = useMemo(() => JSON.stringify(report, null, 2), [report]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportJson);
      showToast("JSON copied to clipboard");
    } catch {
      showToast("Copy failed — use Download");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([reportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `umine_battle_${state.meta.battle_id}_modified.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Download started");
  };

  const handleReset = () => {
    setState(clone(INITIAL_DATA));
    showToast("Reset to captured values");
  };

  const [importingBattle, setImportingBattle] = useState(false);

  const handleHeaderLoad = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";          // reset so the same file can be reloaded
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.version && Array.isArray(data.frames)) {
          setSimReplay(data);
          handleReplayLoad(data);
          showToast(`Replay loaded — ${data.frames.length} frames`);
        } else {
          showToast("Not a valid replay file");
        }
      } catch { showToast("Failed to parse JSON"); }
    };
    reader.readAsText(file);
  };

  const handleImportBattle = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = async (ev) => {
      let source;
      try { source = JSON.parse(ev.target.result); }
      catch { showToast("Failed to parse JSON"); return; }
      setImportingBattle(true);
      try {
        const res = await fetch(`${SIM_SERVER}/generate-replay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(source),
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "generate-replay failed");
        setSimReplay(data.replay);
        handleReplayLoad(data.replay);
        showToast(`Saved as ${data.name} · ${data.winner.toUpperCase()} wins · ${data.frames}f`);
      } catch (err) {
        showToast(`Import failed: ${err.message}`);
      } finally {
        setImportingBattle(false);
      }
    };
    reader.readAsText(file);
  };

  // ── Sync army panels when a replay is loaded ──
  const handleReplayLoad = useCallback((data) => {
    const { attacker, defender } = data.meta ?? {};
    if (!attacker || !defender) return;
    const toWarrs = (groups) => (groups ?? []).map(g => ({ gid: g.gid, count: g.initial_count }));
    const syncSide = (prev, side) => ({
      ...prev,
      ...(side.nick      != null && { nick:       side.nick }),
      ...(side.alliance  != null && { asn:        side.alliance }),
      ...(side.server_id != null && { server_id:  side.server_id }),
      ...(side.ct_lvl    != null && { ct_lvl:     side.ct_lvl }),
      ...(side.ba_tech?.length   && { ba_tech:    side.ba_tech }),
      ...(side.titan_b_i?.length && { titan_b_i:  side.titan_b_i }),
      ...(side.fighter_eq?.length && { fighter_eq: side.fighter_eq }),
      warrs: toWarrs(side.groups),
    });
    setState(prev => ({
      ...prev,
      attacker: syncSide(prev.attacker, attacker),
      defender: syncSide(prev.defender, defender),
    }));
    setLvVals({
      atk: attacker.lv_vals ?? {},
      def: defender.lv_vals ?? {},
    });
  }, []);

  // ── Server replay storage ──────────────────────────────────────────────────
  const fetchServerReplays = async () => {
    setServerLoading(true);
    try {
      const res = await fetch(`${SIM_SERVER}/replays`);
      const data = await res.json();
      if (data.ok) setServerReplays(data.replays);
    } catch { showToast("Server unreachable"); }
    finally { setServerLoading(false); }
  };

  const loadServerReplay = async (name) => {
    try {
      const res = await fetch(`${SIM_SERVER}/replay/${encodeURIComponent(name)}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setSimReplay(data.replay);
      handleReplayLoad(data.replay);
      showToast(`Loaded: ${name}`);
      setShowServerBrowser(false);
    } catch (e) { showToast(`Load failed: ${e.message}`); }
  };

  const deleteServerReplay = async (name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`${SIM_SERVER}/replay/${encodeURIComponent(name)}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast(`Deleted: ${name}`);
      setServerReplays(prev => prev.filter(r => r.name !== name));
    } catch (e) { showToast(`Delete failed: ${e.message}`); }
  };

  const saveServerReplay = async () => {
    if (!simReplay) return;
    setServerSaving(true);
    const ts = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
    const winner = simReplay.meta?.winner ?? "unknown";
    const label = saveLabel.trim() || `${ts} ${winner}`;
    const safeName = label.replace(/[^a-zA-Z0-9\-_. ]/g, "_").slice(0, 80) + ".json";
    const payload = { ...simReplay, meta: { ...simReplay.meta, label } };
    try {
      const res = await fetch(`${SIM_SERVER}/replay/${encodeURIComponent(safeName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast(`Saved: ${safeName}`);
      setSaveLabel("");
      fetchServerReplays();
    } catch (e) { showToast(`Save failed: ${e.message}`); }
    finally { setServerSaving(false); }
  };

  useEffect(() => {
    if (showServerBrowser) fetchServerReplays();
  }, [showServerBrowser]);

  const handleRunSim = async () => {
    setSimRunning(true);
    setSimError(null);
    try {
      const res = await fetch(`${SIM_SERVER}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: reportJson,
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Sim failed");
      setSimResult(data);
      if (data.replay) setSimReplay(data.replay);
      showToast(`${data.winner.toUpperCase()} wins · ${data.frames} frames`);
    } catch (e) {
      setSimError(e.message);
      showToast("Sim error — is sim_server.py running?");
    } finally {
      setSimRunning(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#080808] text-neutral-200" style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
    }}>
      {/* Header */}
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/95 backdrop-blur sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 border border-amber-700/60 flex items-center justify-center bg-amber-950/30">
                <div className="w-2 h-2 bg-amber-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-amber-600">AOO · Battle Sim</div>
              <div className="font-mono text-sm tracking-[0.15em] uppercase text-neutral-200">Control Console</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={handleReset}
              className="h-8 px-3 border border-neutral-700 hover:border-neutral-500 font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-200 transition-colors flex items-center gap-1.5">
              <RotateCcw size={12} /> Reset
            </button>
            <label className={`h-8 px-3 border font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              importingBattle
                ? "border-violet-700/60 bg-violet-950/40 text-violet-400 cursor-wait"
                : "border-violet-800/60 hover:border-violet-600 bg-violet-950/20 hover:bg-violet-950/40 text-violet-500 hover:text-violet-300"
            }`} title="Import a raw Clay-decoded battle JSON — runs the sim and saves the replay automatically">
              {importingBattle ? <Loader2 size={12} className="animate-spin" /> : <FileJson size={12} />}
              {importingBattle ? "Importing…" : "Import Battle"}
              <input type="file" accept=".json" onChange={handleImportBattle} className="hidden" disabled={importingBattle} />
            </label>
            <label className="h-8 px-3 border border-neutral-700 hover:border-neutral-500 font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload size={12} /> Load from PC
              <input type="file" accept=".json" onChange={handleHeaderLoad} className="hidden" />
            </label>
            <button onClick={() => setShowServerBrowser(v => !v)}
              className={`h-8 px-3 border font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                showServerBrowser
                  ? "border-amber-700/60 bg-amber-950/40 text-amber-500"
                  : "border-neutral-700 hover:border-neutral-500 text-neutral-500 hover:text-neutral-200"
              }`}>
              <Database size={12} /> Load from Server
            </button>
            <button onClick={() => setShowPayload(!showPayload)}
              className="h-8 px-3 border border-neutral-700 hover:border-neutral-500 font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-200 transition-colors flex items-center gap-1.5">
              <FileJson size={12} /> {showPayload ? "Hide" : "Preview"}
            </button>
            <button onClick={handleCopy}
              className="h-8 px-3 border border-neutral-700 hover:border-neutral-500 font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-200 transition-colors flex items-center gap-1.5">
              <Copy size={12} /> Copy
            </button>
            <button onClick={handleDownload}
              className="h-8 px-3 border border-amber-700/60 hover:border-amber-600 bg-amber-950/40 hover:bg-amber-950/60 font-mono text-[10px] uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <Download size={12} /> Download
            </button>
<button onClick={handleRunSim} disabled={simRunning}
              className="h-8 px-3 border border-emerald-800/60 hover:border-emerald-600 bg-emerald-950/40 hover:bg-emerald-950/60 font-mono text-[10px] uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
              {simRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              {simRunning ? "Running…" : "Run Sim"}
            </button>
          </div>
        </div>

      </header>

      {/* Server Replay Browser */}
      {showServerBrowser && (
        <section className="border-b border-neutral-800 bg-[#0c0c0c] px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Database size={11} className="text-amber-600" /> Server Replays
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={fetchServerReplays} disabled={serverLoading}
                className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-600 hover:text-neutral-300 transition-colors disabled:opacity-40">
                <RefreshCw size={10} className={serverLoading ? "animate-spin" : ""} />
              </button>
              <button onClick={() => setShowServerBrowser(false)}
                className="h-6 w-6 flex items-center justify-center border border-neutral-700 hover:border-neutral-500 text-neutral-600 hover:text-neutral-300 transition-colors">
                <X size={10} />
              </button>
            </div>
          </div>

          {/* Save current replay */}
          {simReplay && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-neutral-600 uppercase shrink-0">Save current:</span>
              <input
                value={saveLabel}
                onChange={e => setSaveLabel(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveServerReplay()}
                placeholder={`${new Date().toISOString().slice(0,10)} ${simReplay.meta?.winner ?? "?"} · ${simReplay.meta?.frames ?? "?"} frames`}
                className="flex-1 h-6 px-2 bg-neutral-900 border border-neutral-700 focus:border-neutral-500 font-mono text-[10px] text-neutral-300 placeholder-neutral-700 focus:outline-none"
              />
              <button onClick={saveServerReplay} disabled={serverSaving}
                className="h-6 px-3 border border-emerald-800/60 bg-emerald-950/40 hover:bg-emerald-950/60 font-mono text-[9px] uppercase text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 shrink-0">
                {serverSaving ? "Saving…" : "Save"}
              </button>
            </div>
          )}

          {/* Replay list */}
          {serverLoading ? (
            <div className="font-mono text-[9px] text-neutral-600 flex items-center gap-2">
              <Loader2 size={10} className="animate-spin" /> Loading…
            </div>
          ) : serverReplays.length === 0 ? (
            <div className="font-mono text-[9px] text-neutral-600">No replays saved yet.</div>
          ) : (
            <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto pr-1">
              {serverReplays.map(r => (
                <div key={r.name} className="flex items-center gap-2 px-2 py-1 bg-neutral-900/40 hover:bg-neutral-800/40 border border-neutral-800/60 group">
                  <span className={`font-mono text-[9px] w-12 shrink-0 ${r.winner === "attacker" ? "text-emerald-500" : "text-red-400"}`}>
                    {r.winner === "attacker" ? "ATK" : "DEF"}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500 w-16 shrink-0">{(r.frames ?? 0).toLocaleString()}f</span>
                  <span className="font-mono text-[9px] text-neutral-400 flex-1 truncate" title={r.label || r.name}>{r.label || r.name}</span>
                  <span className="font-mono text-[9px] text-neutral-700 shrink-0">{r.saved_at?.slice(0, 10)}</span>
                  <button onClick={() => loadServerReplay(r.name)}
                    className="h-5 px-2 border border-neutral-700 hover:border-amber-600 font-mono text-[8px] text-neutral-500 hover:text-amber-400 transition-colors shrink-0">
                    Load
                  </button>
                  <button onClick={() => deleteServerReplay(r.name)}
                    className="h-5 w-5 flex items-center justify-center border border-neutral-800 hover:border-red-800 text-neutral-700 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                    <Trash size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Body */}
      <main className="p-4 flex gap-4 items-start">
        <div className="w-1/4 shrink-0">
          <PlayerPanel role="attacker" data={state.attacker} lvVals={lvVals.atk}
            onChange={(p) => setState(prev => ({ ...prev, attacker: p }))}
            ftProps={{ baseReport: report, simServer: SIM_SERVER }} />
        </div>

        {/* Battle Replay Visualization */}
        <BattleReplay externalReplay={simReplay} onReplayLoad={handleReplayLoad} />

        <div className="w-1/4 shrink-0">
          <PlayerPanel role="defender" data={state.defender} lvVals={lvVals.def}
            onChange={(p) => setState(prev => ({ ...prev, defender: p }))} />
        </div>
      </main>

      {/* Payload preview */}
      {showPayload && (
        <section className="px-4 pb-6">
          <div className="border border-neutral-800 bg-[#0e0e0e]">
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-800/30 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <FileJson size={14} className="text-emerald-500" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-300">Rebuilt Payload</span>
                <Chip color="emerald">{reportJson.length.toLocaleString()} chars</Chip>
              </div>
              <button onClick={() => setShowPayload(false)}
                className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:text-neutral-300 transition-colors">close</button>
            </div>
            <pre className="p-3 overflow-auto max-h-[60vh] text-[10px] leading-relaxed text-neutral-500 font-mono">
              {reportJson}
            </pre>
          </div>
        </section>
      )}

      {/* Sim Result */}
      {(simResult || simError || simRunning) && (
        <section className="px-4 pb-4">
          <div className="border border-neutral-800 bg-[#0e0e0e]">
            {/* Result header */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800/30 border-b border-neutral-800">
              {simRunning
                ? <Loader2 size={14} className="text-neutral-500 animate-spin" />
                : <Swords size={14} className={simResult?.winner === "attacker" ? "text-amber-500" : "text-teal-400"} />
              }
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-300">
                {simRunning ? "Simulating…" : "Sim Result"}
              </span>
              {simResult && !simRunning && (<>
                <Chip color={simResult.winner === "attacker" ? "amber" : "teal"}>
                  {simResult.winner.toUpperCase()} wins
                </Chip>
                <Chip color="slate">{simResult.frames.toLocaleString()} frames · {simResult.seconds}s</Chip>
                <Chip color="slate">RNG {simResult.rng_state.toLocaleString()}</Chip>
              </>)}
            </div>
            {/* Error */}
            {simError && (
              <div className="px-3 py-2 font-mono text-[11px] text-red-400 border-b border-neutral-800">
                ⚠ {simError}
              </div>
            )}
            {/* Survivor tables */}
            {simResult && !simRunning && (
              <div className="p-3 grid grid-cols-2 gap-6">
                <SurvivorTable
                  title="⚔ ATK survivors"
                  warriors={simResult.attacker_survivors}
                  accent="amber"
                />
                <SurvivorTable
                  title="🛡 DEF survivors"
                  warriors={simResult.defender_survivors}
                  accent="teal"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-4 py-3 border-t border-neutral-800 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-700 flex items-center justify-between">
        <span>Reconstructed from action 20019 · umine_battle.json</span>
        <span>protocol: xor+msgpack · endpoint 2.20.188.171:13255</span>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 border border-amber-700/60 bg-[#111]/95 backdrop-blur-sm px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-amber-500 z-50 animate-[fadeIn_0.2s]">
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
