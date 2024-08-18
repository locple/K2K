/**
 * K2K (Key Combinations II) - A Vietnamese input method by Le Phuoc Loc
 * K2K Input Editor v1.1 - K2K Implementation for TextBox/TextArea elements in browsers
 * Created on Aug-16-2024 by Le Phuoc Loc: https://github.com/locple/VietK2K
 */

function VietK2K() {		// Class VietK2K
    this.mode = true;		// mode: 1=K2K (default), 0=off
    this.k2k = {			// K2K keys: unordered list of keys used in K2K combinations
        65: false,  83: false,  87: false,  69: false,			// A,S,W,E combinations for a, â, ă, e, ê vowels
        89: false,  85: false,  73: false,  79: false, 80: false,	// Y,U,I,O,P combinations for u, ư, o, ơ, ô vowels
        68: false,  70: false,						// D,F, combinations for đ consonant
        67: false,  88: false,  71: false,  72: false, 66: false,	// C,X, G,H, F,G, G,B combinations for ch,gh,gi,gì consonants
        75: false,  76: false,  78: false,  77: false, 74: false,	// K,L, N,M, N,J combinations for kh,ng,nh consonants
        188: false, 190: false, 219: false,				// M,'.',',', P,[ combinations for ngh,ph consonants
        81: false,  84: false,  82: false,				// Q,W, T,R,H combinations for qu,tr,th consonants
        32: false,							// with Space for dot tone
        90: false,  86: false,						// with one key of Z,X,C,V,B,N,M for grave tone
        								// with one key of D,F,G,H,J,K,L for acute tone
        								// with one key of Q,R,T for question tone
        48: false,  49: false,  50: false,  51: false, 52: false,	// with one key of 0,1,2,3,4,
        53: false,  54: false,  55: false,  56: false, 57: false	// 5,6,7,8,9 for tilde tone
      };
    this.maxInterval = 70;	// (milisecond) maximum interval time between keys pressed down at once 
    this.readReady = true;	// readReady=false -> wait until any key pressed (readReady=true)
}

VietK2K.Vowels = [	// All Vietnamese vowel letters to replace the K2K combinations
        [["a", "A"],  ["á", "Á"],  ["à", "À"],  ["ạ", "Ạ"],  ["ả", "Ả"],  ["ã", "Ã"]],
        [["â", "Â"],  ["ấ", "Ấ"],  ["ầ", "Ầ"],  ["ậ", "Ậ"],  ["ẩ", "Ẩ"],  ["ẫ", "Ẫ"]],
        [["ă", "Ă"],  ["ắ", "Ắ"],  ["ằ", "Ằ"],  ["ặ", "Ặ"],  ["ẳ", "Ẳ"],  ["ẵ", "Ẵ"]],
        [["e", "E"],  ["é", "É"],  ["è", "È"],  ["ẹ", "Ẹ"],  ["ẻ", "Ẻ"],  ["ẽ", "Ẽ"]],
        [["ê", "Ê"],  ["ế", "Ế"],  ["ề", "Ề"],  ["ệ", "Ệ"],  ["ể", "Ể"],  ["ễ", "Ễ"]],
        [["u", "U"],  ["ú", "Ú"],  ["ù", "Ù"],  ["ụ", "Ụ"],  ["ủ", "Ủ"],  ["ũ", "Ũ"]],
        [["i", "I"],  ["í", "Í"],  ["ì", "Ì"],  ["ị", "Ị"],  ["ỉ", "Ỉ"],  ["ĩ", "Ĩ"]],
        [["ư", "Ư"],  ["ứ", "Ứ"],  ["ừ", "Ừ"],  ["ự", "Ự"],  ["ử", "Ử"],  ["ữ", "Ữ"]],
        [["ơ", "Ơ"],  ["ớ", "Ớ"],  ["ờ", "Ờ"],  ["ợ", "Ợ"],  ["ở", "Ở"],  ["ỡ", "Ỡ"]],
        [["ươ","ƯƠ"], ["ướ","ƯỚ"], ["ườ","ƯỜ"], ["ượ","ƯỢ"], ["ưở","ƯỞ"], ["ưỡ","ƯỠ"]],	// Note: "Ươ" should be typed seperately
        [["uô","UÔ"], ["uố","UỐ"], ["uồ","UỒ"], ["uộ","UỘ"], ["uổ","UỔ"], ["uỗ","UỖ"]],	// Note: "Uô" should be typed seperately
        [["o", "O"],  ["ó", "Ó"],  ["ò", "Ò"],  ["ọ", "Ọ"],  ["ỏ", "Ỏ"],  ["õ", "Õ"]],
        [["ô", "Ô"],  ["ố", "Ố"],  ["ồ", "Ồ"],  ["ộ", "Ộ"],  ["ổ", "Ổ"],  ["ỗ", "Ỗ"]],
        [["y", "Y"],  ["ý", "Ý"],  ["ỳ", "Ỳ"],  ["ỵ", "Ỵ"],  ["ỷ", "Ỷ"],  ["ỹ", "Ỹ"]]
      ];

VietK2K.Consonants = [	// All Vietnamese consonant/double consonant letters to replace the K2K combinations
        ["đ", "Đ", "Đ"],
        ["ch", "Ch", "CH"],
        ["gh", "Gh", "GH"],
        ["kh", "Kh", "KH"],
        ["ng", "Ng", "NG"],
        ["nh", "Nh", "NH"],
        ["ngh", "Ngh", "NGH"],
        ["ph", "Ph", "PH"],
        ["qu", "Qu", "QU"],
        ["tr", "Tr", "TR"],
        ["th", "Th", "TH"],
        ["gi", "Gi", "GI"],
        ["gì", "Gì", "GÌ"]
      ];

VietK2K.prototype.setMode = function(mode) {		// Enable or disable K2K method
    this.mode = (mode == 1) ? true : false;
    this.clear();
    this.readReady = true;
};

VietK2K.prototype.attach = function(el, mode) {	// Register an element (el), default mode=1
    if (!el) return;
    else this.typer = el;
    var self = this;
    this.mode = (mode == undefined || mode == null || mode == 1) ? true : false;
    this.previousPressTime = 0;

    el.addEventListener("keydown", function(e) {// Mark all KK keys pressed down
        if (!self.mode) return true;
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
        if (!self.mode) return true;
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

                let letterIdx = self.getVowelIndex();
                if (letterIdx < 0) {
                    letterIdx = self.getConsonantIndex();
                    if (letterIdx < 0) {
                        self.printASCIIs(caseIdx);
                    } else {
                    self.printConsonant(letterIdx, caseIdx);
                    }
                } else {
                    self.printVowel(letterIdx, caseIdx);
                }

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
        if (!self.mode) return true;
        e = e || event;	// Lagecy IE compatibility

        var shiftJustUp = (e.keyCode == 16);		// Exception in case shift key just up
        if (shiftJustUp || (self.k2k.hasOwnProperty(e.keyCode) && self.k2k[e.keyCode])) {
            if (self.readReady) {	// Print key ASAP the first key released
                let caseIdx = self.getCaseIndex(e, shiftJustUp);

                let letterIdx = self.getVowelIndex();
                if (letterIdx < 0) {
                    letterIdx = self.getConsonantIndex();
                    if (letterIdx < 0) {
                        self.printASCIIs(caseIdx);
                    } else {
                        self.readReady = false;
                        self.printConsonant(letterIdx, caseIdx);
                    }
                } else {
                    self.readReady = false;
                    self.printVowel(letterIdx, caseIdx);
                }
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
        keyCode = key - 32;		// -> A ... Z
    else if (key == 44)			// ,
        keyCode = 188;
    else if (key == 46)			// .
        keyCode = 190;
    else if (key == 91)			// [
        keyCode = 219;
    else
        keyCode = key;

    return keyCode;
}

VietK2K.prototype.codeToKey = function(keyCode, caseIdx) {
    var key;

    if (keyCode > 64 && keyCode < 91)	// A ... Z
        key = keyCode + (caseIdx > 0 ? 0 : 32);
    else if (keyCode == 188)		// ,
        key = (caseIdx == 1 ? 60 : 44);
    else if (keyCode == 190)		// .
        key = (caseIdx == 1 ? 62 : 46);
    else if (keyCode == 219)		// [
        key = (caseIdx == 1 ? 123 : 91);
    else
        key = keyCode;

    return String.fromCharCode(key);
}

VietK2K.prototype.getCaseIndex = function(e, shiftJustUp = false) {
    if (e.getModifierState && e.getModifierState("CapsLock"))
        if (e.shiftKey || shiftJustUp) return 0;	// Both CapsLock, Shift
        else return 2;				// CapsLock only
    else
        if (e.shiftKey || shiftJustUp) return 1;	// Shift only
        else return 0;				// Neither CapsLock, Shift
}

VietK2K.prototype.printASCIIs = function(caseIdx) {	// Print keys in KK array in ASCII (with all case/non-case)
    for (var code in this.k2k)
        if (this.k2k.hasOwnProperty(code) && this.k2k[code]) {
            let curPos = this.typer.selectionStart;
            this.typer.value = this.typer.value.substring(0, this.typer.selectionStart) +
                               this.codeToKey(Number(code), caseIdx) +
                               this.typer.value.substring(this.typer.selectionEnd);
            this.typer.selectionStart = this.typer.selectionEnd = curPos + 1;
        }
    this.clear();
};

VietK2K.prototype.printVowel = function(letterIdx, caseIdx) {		// Print vowel from keys in KK array
    let letter = VietK2K.Vowels[letterIdx][this.getToneIndex()][caseIdx > 0 ? 1 : 0];
    let curPos = this.typer.selectionStart;
    this.typer.value = this.typer.value.substring(0, curPos) + letter
                     + this.typer.value.substring(this.typer.selectionEnd);
    this.typer.selectionStart = this.typer.selectionEnd = curPos + letter.length;
    this.clear();
}

VietK2K.prototype.printConsonant = function(letterIdx, caseIdx) {		// Print consonant from keys in KK array
    let letter = VietK2K.Consonants[letterIdx][caseIdx];
    let curPos = this.typer.selectionStart;
    this.typer.value = this.typer.value.substring(0, curPos) + letter
                     + this.typer.value.substring(this.typer.selectionEnd);
    this.typer.selectionStart = this.typer.selectionEnd = curPos + letter.length;
    this.clear();
}

VietK2K.prototype.getVowelIndex = function() {
    if (this.k2k[65]  && !this.k2k[83] && !this.k2k[87])			return 0;	// a
    if (this.k2k[65]  &&  this.k2k[83] && !this.k2k[87])			return 1;	// â	<= as | sa
    if (this.k2k[65]  && !this.k2k[83] &&  this.k2k[87])			return 2;	// ă	<= aw | wa
    if (this.k2k[69]  && !this.k2k[87])						return 3;	// e
    if (this.k2k[69]  &&  this.k2k[87])						return 4;	// ê	<= ew | we
    if (this.k2k[85]  && !this.k2k[73])						return 5;	// u
    if (!this.k2k[85] &&  this.k2k[73] && !this.k2k[79])			return 6;	// i
    if (this.k2k[85]  &&  this.k2k[73] && !this.k2k[79])			return 7;	// ư	<= ui | iu
    if (!this.k2k[85] &&  this.k2k[73] &&  this.k2k[79] && !this.k2k[80])	return 8;	// ơ	<= io | oi
    if (this.k2k[85]  &&  this.k2k[73] &&  this.k2k[79] && !this.k2k[80])	return 9;	// ươ	<= uio | *
    if (!this.k2k[85] &&  this.k2k[73] &&  this.k2k[79] &&  this.k2k[80])	return 10;	// uô	<= iop | *
    if (!this.k2k[73] &&  this.k2k[79] && !this.k2k[80])			return 11;	// o
    if (!this.k2k[73] &&  this.k2k[79] &&  this.k2k[80])			return 12;	// ô	<= op | po
    if (this.k2k[89])								return 13;	// y
 
    return -1;	// no vowel detected
};

VietK2K.prototype.getConsonantIndex = function() {
    if (this.k2k[68]  &&  this.k2k[70])						return 0;	// đ	<= df | fd
    if (this.k2k[67]  &&  this.k2k[88])						return 1;	// ch	<= cx | xc
    if (this.k2k[71]  &&  this.k2k[72])						return 2;	// gh	<= gh | hg
    if (this.k2k[75]  &&  this.k2k[76])						return 3;	// kh	<= kl | lk
    if (this.k2k[78]  &&  this.k2k[77])						return 4;	// ng	<= nm | mn
    if (this.k2k[78]  &&  this.k2k[74])						return 5;	// nh	<= nj | jn
    if (this.k2k[77]  &&  this.k2k[188]  &&  this.k2k[190])			return 6;	// ngh	<= m,. | *
    if (this.k2k[80]  &&  this.k2k[219])					return 7;	// ph	<= p[ | [p
    if (this.k2k[81]  &&  this.k2k[87])						return 8;	// qu	<= qw | wq
    if (this.k2k[84]  &&  this.k2k[82])						return 9;	// tr	<= tr | rt
    if (this.k2k[84]  &&  this.k2k[72])						return 10;	// th	<= th | ht
    if (this.k2k[71]  &&  this.k2k[70])						return 11;	// gi	<= gf | fg
    if (this.k2k[71]  &&  this.k2k[66])						return 12;	// gì	<= gb | bg

    return -1;	// no consonant detected
}

VietK2K.prototype.getToneIndex = function() {
    if (this.k2k[68] || this.k2k[70] || this.k2k[71] || this.k2k[72] ||
        this.k2k[74] || this.k2k[75] || this.k2k[76])	return 1;	// acute (sắc) <= D | F | G | H | J | K | L
    if (this.k2k[90] || this.k2k[88] || this.k2k[67] || this.k2k[86] ||
        this.k2k[66] || this.k2k[78] || this.k2k[77])	return 2;	// grave (huyền) <= Z | X | C | V | B | N | M
    if (this.k2k[32])
							return 3;	// dot (nặng) <= Space bar
    if (this.k2k[81] || this.k2k[82] || this.k2k[84])
							return 4;	// question (hỏi) <= Q | R | T
    for (let i = 48; i < 58; i++)
        if (this.k2k[i])				return 5;	// tilde (ngã) <= 0 | ... | 9

    return 0;	// no tone detected
};
