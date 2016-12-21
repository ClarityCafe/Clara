'use strict';

/**
 * Enum for the mods - fresh off the wiki. Combine using bitwise combines, eg Mods.Hidden | Mods.Easy
 * @readonly
 * @enum {Number}
 */
const Mods = {
    None: 0,
    NoFail: 1,
    Easy: 2,
    // NoVideo: 4,
    Hidden: 8,
    HardRock: 16,
    SuddenDeath: 32,
    DoubleTime: 64,
    Relax: 128,
    HalfTime: 256,
    Nightcore: 512, // Only set along with DoubleTime. i.e: NC only gives 576
    Flashlight: 1024,
    Autoplay: 2048,
    SpunOut: 4096,
    Relax2: 8192,  // Autopilot?
    Perfect: 16384,
    Key4: 32768,
    Key5: 65536,
    Key6: 131072,
    Key7: 262144,
    Key8: 524288,
    // keyMod: Mods.Key4 | Mods.Key5 | Mods.Key6 | Mods.Key7 | Mods.Key8,
    FadeIn: 1048576,
    Random: 2097152,
    LastMod: 4194304,
    // FreeModAllowed: Mods.NoFail | Mods.Easy | Mods.Hidden | Mods.HardRock | Mods.SuddenDeath | Mods.Flashlight | Mods.FadeIn | Mods.Relax | Mods.Relax2 | Mods.SpunOut | Mods.keyMod,
    Key9: 16777216,
    Key10: 33554432,
    Key1: 67108864,
    Key3: 134217728,
    Key2: 268435456
};

Mods.keyMod = Mods.Key4 | Mods.Key5 | Mods.Key6 | Mods.Key7 | Mods.Key8;
Mods.FreeModAllowed = Mods.NoFail | Mods.Easy | Mods.Hidden | Mods.HardRock | Mods.SuddenDeath | Mods.Flashlight | Mods.FadeIn | Mods.Relax | Mods.Relax2 | Mods.SpunOut | Mods.keyMod;

module.exports = Mods;