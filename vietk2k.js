/**
 * K2K (Key Combinations II) - A Vietnamese input method by Le Phuoc Loc
 * K2K Input Editor v2.0 - K2K Implementation for TextBox/TextArea elements in browsers
 * Created on Aug-16-2024 by Le Phuoc Loc: https://github.com/locple/VietK2K
 * Updated on Nov-07-2024
 */

function VietK2K(mode) {	// Class VietK2K
    // mode: 1=K2K (default), 0=off
    this.active = !(mode == undefined || mode == null || mode == 0);
    this.k2k = {			// Current status of all K2K keys
        65: false,	67: false,	68: false,	69: false,
        70: false,	71: false,	72: false,	73: false,	74: false,	75: false,	76: false,	77: false,	78: false,	79: false,
        80: false,	81: false,	82: false,	83: false,	84: false,	85: false,	86: false,	87: false,	89: false,
        186: false,	219: false
      };
    this.maxInterval = 70;	// (milisecond) maximum interval time between keys pressed down at once 
    this.readReady = true;	// readReady=false -> wait until any key pressed (readReady=true)
    this.typers = [];		// Array of attached typers (TextAreas, TextBoxes)
}

VietK2K.Vowels = [	// Array of Vietnamese vowels, column index locate the vowel with corresponding tone.
        [["a", "A"],  ["á", "Á"],  ["à", "À"],  ["ạ", "Ạ"],  ["ả", "Ả"],  ["ã", "Ã"]],
        [["e", "E"],  ["é", "É"],  ["è", "È"],  ["ẹ", "Ẹ"],  ["ẻ", "Ẻ"],  ["ẽ", "Ẽ"]],
        [["i", "I"],  ["í", "Í"],  ["ì", "Ì"],  ["ị", "Ị"],  ["ỉ", "Ỉ"],  ["ĩ", "Ĩ"]],
        [["o", "O"],  ["ó", "Ó"],  ["ò", "Ò"],  ["ọ", "Ọ"],  ["ỏ", "Ỏ"],  ["õ", "Õ"]],
        [["u", "U"],  ["ú", "Ú"],  ["ù", "Ù"],  ["ụ", "Ụ"],  ["ủ", "Ủ"],  ["ũ", "Ũ"]],
        [["y", "Y"],  ["ý", "Ý"],  ["ỳ", "Ỳ"],  ["ỵ", "Ỵ"],  ["ỷ", "Ỷ"],  ["ỹ", "Ỹ"]],
        [["â", "Â"],  ["ấ", "Ấ"],  ["ầ", "Ầ"],  ["ậ", "Ậ"],  ["ẩ", "Ẩ"],  ["ẫ", "Ẫ"]],
        [["ă", "Ă"],  ["ắ", "Ắ"],  ["ằ", "Ằ"],  ["ặ", "Ặ"],  ["ẳ", "Ẳ"],  ["ẵ", "Ẵ"]],
        [["ê", "Ê"],  ["ế", "Ế"],  ["ề", "Ề"],  ["ệ", "Ệ"],  ["ể", "Ể"],  ["ễ", "Ễ"]],
        [["ươ","ƯƠ"], ["ướ","ƯỚ"], ["ườ","ƯỜ"], ["ượ","ƯỢ"], ["ưở","ƯỞ"], ["ưỡ","ƯỠ"]],	// Note: "Ươ" should be typed seperately
        [["ư", "Ư"],  ["ứ", "Ứ"],  ["ừ", "Ừ"],  ["ự", "Ự"],  ["ử", "Ử"],  ["ữ", "Ữ"]],
        [["ơ", "Ơ"],  ["ớ", "Ớ"],  ["ờ", "Ờ"],  ["ợ", "Ợ"],  ["ở", "Ở"],  ["ỡ", "Ỡ"]],
        [["ô", "Ô"],  ["ố", "Ố"],  ["ồ", "Ồ"],  ["ộ", "Ộ"],  ["ổ", "Ổ"],  ["ỗ", "Ỗ"]]
      ];

VietK2K.VowelKeys = [	// Key codes to type the corresponding letters in the Vowels array. Tones typed separately after the base letter.
        [[],			[81, 83],	[81, 87],	[65, 83]],		// (A   -> a),  (QS, QW, AS -> 6 tones)
        [[],			[69, 70],	[69, 82],	[68, 70]],		// (E   -> e),  (EF, ER, DF -> 6 tones)
        [[],			[75, 79],	[73, 79],	[75, 76]],		// (I   -> i),  (KO, IO, KL -> 6 tones)
        [[],			[76, 80],	[79, 80],	[76, 186]],		// (O   -> o),  (LP, OP, L; -> 6 tones)
        [[],			[74, 73],	[85, 73],	[74, 75]],		// (U   -> u),  (JI, UI, JK -> 6 tones)
        [[],			[72, 85],	[85, 89],	[72, 74]],		// (Y   -> y),  (HU, YU, HJ -> 6 tones)
        [[65, 83],		[81, 83],	[81, 87],	[65, 83]],		// (AS  -> â),  (QS, QW, AS -> 6 tones)
        [[65, 87],		[81, 83],	[81, 87],	[65, 83]],		// (AW  -> ă),  (QS, QW, AS -> 6 tones)
        [[69, 82],		[69, 70],	[69, 82],	[68, 70]],		// (ER  -> ê),  (EF, ER, DF -> 6 tones)
        [[73, 79, 80],	[],			[],			[]],			// (IOP -> ươ), tones given after ơ vowel
        [[85, 73],		[74, 73],	[85, 73],	[74, 75]],		// (UI  -> ư),  (JI, UI, JK -> 6 tones)
        [[73, 79],		[75, 79],	[73, 79],	[75, 76]],		// (IO  -> ơ),  (KO, IO, KL -> 6 tones)
        [[79, 80],		[76, 80],	[79, 80],	[76, 186]]		// (OP  -> ô),  (LP, OP, L; -> 6 tones)
      ];

VietK2K.Consonants = [	// Array of Vietnamese consonant/double consonants, column index locate the lowercase/uppercase consonant.
        ["đ", "Đ", "Đ"],
        ["ch", "Ch", "CH"],
        ["gh", "Gh", "GH"],
        ["kh", "Kh", "KH"],
        ["ng", "Ng", "NG"],
        ["nh", "Nh", "NH"],
        ["ph", "Ph", "PH"],
        ["qu", "Qu", "QU"],
        ["tr", "Tr", "TR"],
        ["th", "Th", "TH"],
        ["gi", "Gi", "GI"]
      ];

VietK2K.ConsonantKeys = [	// Key codes to type the corresponding letters in the Consonants array
        [68, 70],		// DF -> đ
        [67, 86],		// CV -> ch
        [71, 72],		// GH -> gh
        [75, 76],		// KL -> kh
        [78, 77],		// NM -> ng
        [78, 74],		// NJ -> nh
        [80, 219],		// P[ -> ph
        [81, 87],		// QW -> qu
        [84, 82],		// TR -> tr
        [84, 72],		// TH -> th
        [70, 71]		// FG -> gi
      ];

VietK2K.prototype.setMode = function(mode) {		// Enable or disable K2K method
    this.active = (mode > 0);
    this.clear();
    this.readReady = true;
};

////VietK2K.prototype.deattach() not supported yet

VietK2K.prototype.attach = function(el) {	// Register an element (el)
    if (!el) return;
    else this.typers.push(el);					// Add the new typer to array typers

    var self = this;
    this.previousPressTime = 0;

    el.addEventListener("keydown", function(e) {// Mark all KK keys pressed down
        if (!self.active) return true;
        e = e || event;	// Lagecy IE compatibility

        if (e.ctrlKey || e.altKey || e.metaKey)	// KK keys can't go with Ctrl, Alt, Win
            self.clear();
        else {
            self.readReady = true;
            if (self.k2k.hasOwnProperty(e.keyCode)) {
                self.k2k[e.keyCode] = true;
            }
        }
    });

    el.addEventListener("keypress", function(e) {// Suspend KK keys for printing later
        if (!self.active) return true;
        e = e || event;	// Lagecy IE compatibility

        // Print keys in case quick typing (new keypress before expected keyup)
        if (!e.ctrlKey && !e.altKey && !e.metaKey	// KK keys can't go with Ctrl, Alt, Win
            && self.hasAnyKKey()) {
            let currentPressTime = Date.now();
            if (self.previousPressTime != 0 &&
			    currentPressTime - self.previousPressTime > self.maxInterval) {	// Quick typing case
                let caseIdx = self.getCaseIndex(e);
                let keyCode = self.keyToCode(e.which);
                if (self.k2k.hasOwnProperty(keyCode))
                   self.k2k[keyCode] = false;	// Temporary hide the new KK key

                // Process to print the letter from K2K combination
                self.printLetter(e.target, caseIdx);

                if (self.k2k.hasOwnProperty(keyCode)) {
                    self.k2k[keyCode] = true;	// Re-mark the new KK key
                } else {
                    self.previousPressTime = currentPressTime;
                    return true;				// Let keypress print the new non-KK key
                }
            }

            // Keep the KK new KK key for printing later
            e.preventDefault && e.preventDefault();
            self.previousPressTime = currentPressTime;
            return false;
        }
    });

    el.addEventListener("keyup", function(e) {	// Print the letter by KK keys in keyup event
        if (!self.active) return true;
        e = e || event;	// Lagecy IE compatibility

        var shiftJustUp = (e.keyCode == 16);	// Exception in case shift key just up
        if (shiftJustUp || (self.k2k.hasOwnProperty(e.keyCode) && self.k2k[e.keyCode])) {
            if (self.readReady) {				// Print key ASAP the first key released
                let caseIdx = self.getCaseIndex(e, shiftJustUp);
                self.readReady = false;			// Will ignore the other keys in the combination
                self.printLetter(e.target, caseIdx);	// Process to print the letter from K2K combination
            }
        }
    });
};

VietK2K.prototype.clear = function() {		// Clear KK keys status
    for (var code in this.k2k)
        if (this.k2k.hasOwnProperty(code)) this.k2k[code] = false;
    this.previousPressTime = 0;
};

VietK2K.prototype.hasAnyKKey = function() {	// Is there any KK key pressed?
    for (var code in this.k2k)
        if (this.k2k.hasOwnProperty(code) && this.k2k[code]) return true;
    return false;
};

VietK2K.prototype.keyToCode = function(key) {
    var keyCode;

    if (key > 96 && key < 123)		// a ... z
        keyCode = key - 32;			// -> A ... Z
    else if (key == 59)				// ;
        keyCode = 186;
    else if (key == 91)				// [
        keyCode = 219;
    else
        keyCode = key;

    return keyCode;
};

VietK2K.prototype.codeToKey = function(keyCode, caseIdx) {
    var key;

    if (keyCode > 64 && keyCode < 91)	// A ... Z
        key = keyCode + (caseIdx > 0 ? 0 : 32);
    else if (keyCode == 186)
        key = (caseIdx == 1 ? 58 : 59);
    else if (keyCode == 219)
        key = (caseIdx == 1 ? 123 : 91);
    else
        key = keyCode;

    return String.fromCharCode(key);
};

VietK2K.prototype.getCaseIndex = function(e, shiftJustUp = false) {
    if (e.getModifierState && e.getModifierState("CapsLock"))
        if (e.shiftKey || shiftJustUp) return 0;	// Both CapsLock, Shift
        else return 2;				// CapsLock only
    else
        if (e.shiftKey || shiftJustUp) return 1;	// Shift only
        else return 0;				// Neither CapsLock, Shift
};

VietK2K.prototype.printLetter = function(typer, caseIdx) {
    if (!this.modifyLetterTone(typer)) {
        let letter = this.readVowel(caseIdx);
        if (letter === 0) {
            letter = this.readConsonant(caseIdx);
            if (letter === 0) {
                this.printASCIILetters(typer, caseIdx);
                this.readReady = true;	// Always print all ASCII letters typed
            } else
                this.printDiacriticLetter(typer, letter);
        } else
            this.printDiacriticLetter(typer, letter);
    }
};

VietK2K.prototype.printASCIILetters = function(typer, caseIdx) {	// Print keys in K2K array in ASCII (with all case/non-case)
    for (var code in this.k2k)
        if (this.k2k.hasOwnProperty(code) && this.k2k[code]) {
            let curPos = typer.selectionStart;
            typer.value = typer.value.substring(0, typer.selectionStart) +
                               this.codeToKey(Number(code), caseIdx) +
                               typer.value.substring(typer.selectionEnd);
            typer.selectionStart = typer.selectionEnd = curPos + 1;
        }
    this.clear();
};

VietK2K.prototype.printDiacriticLetter = function(typer, letter) {	// Print letter(s) from keys in K2K array
    let curPos = typer.selectionStart;
    typer.value = typer.value.substring(0, curPos) + letter
                     + typer.value.substring(typer.selectionEnd);
    typer.selectionStart = typer.selectionEnd = curPos + letter.length;
    this.clear();
};

VietK2K.prototype.readVowel = function(caseIdx) {					// Return row index in Vowels array
    for (let i = 0; i < VietK2K.VowelKeys.length; i++) {
        if (VietK2K.VowelKeys[i][0][0]) {
            let result = this.k2k[VietK2K.VowelKeys[i][0][0]] && this.k2k[VietK2K.VowelKeys[i][0][1]];
            if (VietK2K.VowelKeys[i][0][2]) result &&= this.k2k[VietK2K.VowelKeys[i][0][2]];

            if (result) return VietK2K.Vowels[i][0][caseIdx > 0 ? 1 : 0];
        }
    }

    return 0;	// no vowel detected
};

VietK2K.prototype.readConsonant = function(caseIdx) {				// Return row index in Consonants array
    for (let i = 0; i < VietK2K.ConsonantKeys.length; i++) {
        if (this.k2k[VietK2K.ConsonantKeys[i][0]] &&
            this.k2k[VietK2K.ConsonantKeys[i][1]])
            return VietK2K.Consonants[i][caseIdx];
    }

    return 0;	// no consonant detected
};

VietK2K.prototype.modifyLetterTone = function(typer) {
    var curPos = typer.selectionStart; 
    if (curPos == 0) return false;

    var preLetter = typer.value.charAt(curPos - 1);
    for (let i = 0; i < VietK2K.Vowels.length; i++)
        for (let j = 0; j < 6; j++)
            for (let caseId = 0; caseId < 2; caseId++)
                if (preLetter === VietK2K.Vowels[i][j][caseId]) {
                    let jj = this.getToneIndex(i);
                    switch (jj) {
                        case 1:			// Press one more: acute <--> tilde
                            if (j == 1) jj = 4;
                            else if (j == 4) jj = 1;
                            break;
					    case 2:			// Press one more: grave <--> question
                            if (j == 2) jj = 5;
                            else if (j == 5) jj = 2;
                            break;
                        case 3:			//  Press one more: dot <--> level tone (remove tone)
                            if (j == 3) jj = 0;
                            else if (j == 0) jj = 3;
                            break;
                        default:		// no tone key pressed
                            return false;
                    }

                    let letter = VietK2K.Vowels[i][jj][caseId];
                    typer.value = typer.value.substring(0, curPos - 1) + letter
                         + typer.value.substring(typer.selectionEnd);
                    typer.selectionStart = typer.selectionEnd = curPos;

                    this.clear();
                    return true;
            }

    return false;		// no tone keys pressed after any vowel
};

VietK2K.prototype.getToneIndex = function(i) {		// Return column index of row i in VowelKeys array (1..3)
    for (let j = 1; j < 4; j++) {
        if (this.k2k[VietK2K.VowelKeys[i][j][0]] && this.k2k[VietK2K.VowelKeys[i][j][1]])
            return j;	// 1 = acute / question, 2 = grave / tilde, 3 = dot / delete tone
    }

    return 0;			// no tone key pressed
};